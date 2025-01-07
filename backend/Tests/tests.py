"""
This module contains a suite of tests for the user authentication and account management
features of a web application. It includes tests for user registration, login, password
reset, and account editing functionalities.

Tests are conducted using the pytest framework and make HTTP requests to the web
application's API endpoints.
"""

import sqlite3
import requests
import pytest
import os

PORT = 5000
URL = f"http://localhost:{PORT}"
TIMEOUT = 10
DB_PATH = '../App/accounts.db'

class TestClass:
    """
    A class used to represent the test suite for user authentication and account management.
    """

    user_payload = {
        'email': 'user1234@gmail.com',
        'firstName': 'userFirst',
        'lastName': 'userLast',
        'password': 'Password123',
        'confirmPassword': 'Password123'
    }

    login_payload = {
        'email': 'user1234@gmail.com',
        'password': 'Password123'
    }

    reset_payload = {
        'email': 'user1234@gmail.com'
    }

    @classmethod
    def reset_database(cls):
        """Method to reset the database before running tests."""
        if os.path.exists(DB_PATH):
            os.remove(DB_PATH)
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('DROP TABLE IF EXISTS accounts')
        cursor.execute('''
            CREATE TABLE accounts (
                id TEXT PRIMARY KEY,
                email TEXT,
                firstName TEXT,
                lastName TEXT,
                password TEXT,
                skills TEXT,
                token TEXT,
                resetCode TEXT
            )
        ''')
        cursor.execute('''DROP TABLE IF EXISTS career_path''')
        cursor.execute('''
            CREATE TABLE career_path (
                job_title TEXT,
                job_level TEXT,
                skills TEXT,
                experience_years INTEGER,
                experience_role TEXT
            )
        ''')
        conn.commit()
        conn.close()
    def test_signup_success(self):
        """Test signup success"""
        self.reset_database()
        response = requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        assert response.status_code == 200
        data = response.json()
        assert 'id' in data
        assert 'token' in data

    def test_signup_fail_email_already_exists(self):
        """Test signup failure when email already exists."""
        self.reset_database()
        requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        response = requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        assert response.status_code == 409
        data = response.json()
        assert data["Error"] == "Email already exists"

    def test_signup_fail_password_dont_match(self):
        """Test signup failure when passwords don't match."""
        self.reset_database()
        wrong_password_payload = self.user_payload.copy()
        wrong_password_payload['confirmPassword'] = 'DifferentPassword'
        response = requests.post(f"{URL}/register", json=wrong_password_payload, timeout=TIMEOUT)
        assert response.status_code == 400
        data = response.json()
        assert data["Error"] == "Passwords don't match"

    def test_signup_fail_invalid_email(self):
        """Test signup failure when email is invalid."""
        self.reset_database()
        invalid_email_payload = self.user_payload.copy()
        invalid_email_payload['email'] = 'invalidEmail'
        response = requests.post(f"{URL}/register", json=invalid_email_payload, timeout=TIMEOUT)
        assert response.status_code == 400
        data = response.json()
        assert "An email address must have an @-sign." in data["Error"]

    def test_signup_fail_weak_password(self):
        """Test signup failure when password is weak."""
        self.reset_database()
        weak_password_payload = self.user_payload.copy()
        weak_password_payload['password'] = '12345678'
        weak_password_payload['confirmPassword'] = '12345678'
        response = requests.post(f"{URL}/register", json=weak_password_payload, timeout=TIMEOUT)
        assert response.status_code == 400
        data = response.json()
        assert "Password is not secure" in data["Error"]

    def test_logzin_success(self):
        """Test login success."""
        self.reset_database()
        response = requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        data = response.json()
        user_id = data['id']
        requests.post(f"{URL}/logout", json={"id": user_id}, timeout=TIMEOUT)
        assert response.status_code == 200
        data = response.json()
        assert 'id' in data
        assert 'token' in data

    def test_login_fail_login_twice(self):
        """Test login failure when user tries to login twice."""
        self.reset_database()
        requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        response = requests.post(f"{URL}/login", json=self.login_payload, timeout=TIMEOUT)
        assert response.status_code == 403
        data = response.json()
        assert "Already logged in." in data["Error"]

    def test_login_fail_wrong_password(self):
        """Test login failure when wrong password is provided."""
        self.reset_database()
        response = requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        data = response.json()
        user_id = data['id']
        response = requests.post(f"{URL}/logout", json={"id": user_id}, timeout=TIMEOUT)
        wrong_password_payload = self.login_payload.copy()
        wrong_password_payload['password'] = 'WrongPassword123'
        response = requests.post(f"{URL}/login", json=wrong_password_payload, timeout=TIMEOUT)
        assert response.status_code == 401
        data = response.json()
        assert "We didn't recognise the username or password you entered. Please try again." in data["Error"]

    def test_request_reset_success(self):
        """Test request reset success."""
        self.reset_database()
        requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        response = requests.post(f"{URL}/request-reset", json=self.reset_payload, timeout=TIMEOUT)
        assert response.status_code == 200
        data = response.json()
        assert 'message' in data
        assert data['message'] == 'Reset code sent to email'

    def test_request_reset_fail_invalid_email(self):
        """Test request reset failure when email is invalid."""
        self.reset_database()
        response = requests.post(f"{URL}/request-reset", json={'email': 'invalidEmail'}, timeout=TIMEOUT)
        assert response.status_code == 400
        data = response.json()
        assert 'message' in data
        assert data['message'] == 'Email not found'

    def test_reset_password_success(self):
        """Test reset password success."""
        self.reset_database()
        requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        requests.post(f"{URL}/request-reset", json=self.reset_payload, timeout=TIMEOUT)
        reset_code = self.get_reset_code(self.reset_payload['email'])
        new_password = 'NewPassword123'
        reset_password_payload = {
            'email': self.reset_payload['email'],
            'reset_code': reset_code,
            'new_password': new_password
        }
        response = requests.patch(f"{URL}/reset-password", json=reset_password_payload, timeout=TIMEOUT)
        assert response.status_code == 200
        data = response.json()
        assert 'message' in data
        assert data['message'] == 'Password reset successfully'

    def test_reset_password_fail_invalid_email(self):
        """Test reset password failure when email is invalid."""
        self.reset_database()
        requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        requests.post(f"{URL}/request-reset", json=self.reset_payload, timeout=TIMEOUT)
        reset_code = self.get_reset_code(self.reset_payload['email'])
        new_password = 'NewPassword123'
        response = requests.patch(f"{URL}/reset-password", json={
            'email': 'invalidEmail',
            'reset_code': reset_code,
            'new_password': new_password
        }, timeout=TIMEOUT)
        assert response.status_code == 400
        data = response.json()
        assert 'message' in data
        assert data['message'] == 'Invalid email. Make sure the email exists.'

    def test_reset_password_fail_invalid_reset_code(self):
        """Test reset password failure when reset code is invalid."""
        self.reset_database()
        requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        requests.post(f"{URL}/request-reset", json=self.reset_payload, timeout=TIMEOUT)
        new_password = 'NewPassword123'
        response = requests.patch(f"{URL}/reset-password", json={
            'email': self.reset_payload['email'],
            'reset_code': 'invalidCode',
            'new_password': new_password
        }, timeout=TIMEOUT)
        assert response.status_code == 400
        data = response.json()
        assert 'message' in data
        assert data['message'] == 'Invalid reset code'

    def test_reset_password_fail_weak_password(self):
        """Test reset password failure when new password is weak."""
        self.reset_database()
        requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        requests.post(f"{URL}/request-reset", json=self.reset_payload, timeout=TIMEOUT)
        reset_code = self.get_reset_code(self.reset_payload['email'])
        response = requests.patch(f"{URL}/reset-password", json={
            'email': self.reset_payload['email'],
            'reset_code': reset_code,
            'new_password': 'weak'
        }, timeout=TIMEOUT)
        assert response.status_code == 400
        data = response.json()
        assert 'message' in data
        assert data['message'] == 'New password is not secure.'

    def test_logout_success(self):
        """Test logout success."""
        self.reset_database()
        response = requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        data = response.json()
        user_id = data['id']
        requests.post(f"{URL}/logout", json={"id": user_id}, timeout=TIMEOUT)
        response = requests.post(f"{URL}/login", json=self.login_payload, timeout=TIMEOUT)
        response = requests.post(f"{URL}/logout", json={"id": user_id}, timeout=TIMEOUT)
        assert response.status_code == 200
        data = response.json()
        assert 'message' in data
        assert data['message'] == 'Logout successful'

    def test_logout_fail_invaild_user_id(self):
        """Test logout failure when user ID is Invaild."""
        self.reset_database()
        requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        response = requests.post(f"{URL}/logout", json={"id": 'invaildd'}, timeout=TIMEOUT)
        assert response.status_code == 400
        data = response.json()
        assert 'message' in data
        assert data['message'] == 'Invaild user id'

    def test_logout_fail_logout_twice(self):
        """Test logout failure when user tries to logout twice."""
        self.reset_database()
        response = requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        data = response.json()
        user_id = data['id']
        response = requests.post(f"{URL}/logout", json={"id": user_id}, timeout=TIMEOUT)
        response = requests.post(f"{URL}/logout", json={"id": user_id}, timeout=TIMEOUT)
        assert response.status_code == 400
        data = response.json()
        assert 'message' in data
        assert data['message'] == 'Already logged out'

    def test_edit_detail_success(self):
        """Test edit details success。"""
        self.reset_database()
        response = requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        data = response.json()
        token = data['token']
        user_id = data['id']

        edit_payload = {
            'id': user_id,
            'firstName': 'newFirst',
            'lastName': 'newLast',
            'skills': 'Python,Flask'
        }
        headers = {"id": user_id, "password": self.login_payload['password'], "Authorization": f"Bearer {token}"}
        response = requests.patch(f"{URL}/Edit_detail", json=edit_payload, headers=headers, timeout=TIMEOUT)
        assert response.status_code == 200
        data = response.json()
        assert 'message' in data
        assert data['message'] == 'successfully changed.'

    def test_edit_detail_success_no_new_updates_provided(self):
        """Test edit details success when no new updates are provided."""
        self.reset_database()
        response = requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        data = response.json()
        token = data['token']
        user_id = data['id']
        headers = {"id": user_id, "password": self.login_payload['password'], "Authorization": f"Bearer {token}"}
        empty_payload = {}
        response = requests.patch(f"{URL}/Edit_detail", json=empty_payload, headers=headers, timeout=TIMEOUT)
        assert response.status_code == 200
        data = response.json()
        assert 'message' in data
        assert data['message'] == 'successfully changed.'

    def test_edit_detail_fail_unauthorized(self):
        """Test edit details failure when unauthorized."""
        self.reset_database()
        response = requests.post(f"{URL}/register", json=self.user_payload, timeout=TIMEOUT)
        data = response.json()
        token = data['token']
        user_id = data['id']
        edit_payload = {
            'id': user_id,
            'firstName': 'newFirst',
            'lastName': 'newLast',
            'skills': 'Python,Flask'
        }
        unauthorized_headers = {"id": 'invalidId', "password": self.login_payload['password'], "Authorization": f"Bearer {token}"}
        response = requests.patch(f"{URL}/Edit_detail", json=edit_payload, headers=unauthorized_headers, timeout=TIMEOUT)
        assert response.status_code == 401
        data = response.json()
        assert 'Error' in data
        assert data['Error'] == 'Unauthorized'

    def get_reset_code(self, email):
        """Helper function to get reset code from the database."""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT resetCode FROM accounts WHERE email=?", (email,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return row[0]
        return None
