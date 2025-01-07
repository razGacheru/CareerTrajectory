from flask import Flask, request, send_file, jsonify
from flask_restx import Resource, Api, fields, inputs, reqparse
from job_analyze import analyze_jobs
import json, os
from pathlib import Path
import sqlite3
import uuid
import secrets
from flask_cors import CORS
from email_validator import validate_email, EmailNotValidError
import re
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
import base64
import matplotlib.pyplot as plt
import seaborn as sns

from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from random import choice
from string import ascii_letters, digits
import os, re, sqlite3
import pylint

from recommendjob_py import load_data, generate_all_career_paths_for_recommendations, recommend_jobs

app = Flask(__name__)
api = Api(app,
          default='recommendations',
          title='Job Recommendation API',
          description='API for job recommendations based on provided skills'
          )
CORS(app)

# Configuration for Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'projectbackend1531@gmail.com'
app.config['MAIL_PASSWORD'] = 'ostecvbxvvtehcle'
app.config['MAIL_DEFAULT_SENDER'] = 'projectbackend1531@gmail.com'

mail = Mail(app)

# INITIALIZATION
dbFile = "accounts.db"

def generate_reset_code():
    return ''.join(choice(ascii_letters + digits) for _ in range(20))

def updateDb(table, fields, values, condition_field, condition_value):
    """
    Update records in the specified table based on fields and values provided.
    
    :param table: The table to update.
    :param fields: A list of column names to be updated.
    :param values: A list of values to set for the corresponding columns.
    :param condition_field: The column used for the condition (e.g., 'email').
    :param condition_value: The value for the condition field (e.g., 'user@gmail.com').
    """
    if len(fields) != len(values):
        raise ValueError("The number of fields and values must be the same.")
    
    # Create the SQL statement
    set_clause = ', '.join([f"{field} = ?" for field in fields])
    sql = f"UPDATE {table} SET {set_clause} WHERE {condition_field} = ?"
    
    # Combine values and condition_value into a single list
    params = values + [condition_value]
    
    # Connect to the database
    conn = sqlite3.connect('accounts.db')
    c = conn.cursor()
    
    # Execute the update statement
    c.execute(sql, params)
    
    # Commit changes and close the connection
    conn.commit()
    conn.close()

@api.route('/request-reset')
class RequestReset(Resource):
    def post(self):
        print('here')
        data = request.json
        print(f'Data: {data}')
        userEmail = data['email']
        if userEmail:
            userEmail = str(userEmail.lower())
        userDetails = getUserDetails(id=None, email=userEmail)
        if userDetails:
            newResetCode = generate_reset_code()
            updateDb('accounts', ['resetCode'], [newResetCode], 'email', userEmail)
            send_reset_email(userEmail, newResetCode)
            return {'message': 'Reset code sent to email'}, 200
        else:
            return {'message': 'Email not found'}, 400

@api.route('/reset-password')
class ResetPassword(Resource):
    @api.expect(api.model('ResetPassword', {
        'email': fields.String(required=True, description='Email'),
        'reset_code': fields.String(required=True, description='Reset code'),
        'new_password': fields.String(required=True, description='New password')
    }))
    def patch(self):
        data = request.json
        userEmail = data['email']
        resetCode = data['reset_code']
        newPassword = data['new_password']
        if userEmail:
            userEmail = str(userEmail.lower())
        userDetails = getUserDetails(id=None, email=userEmail)
        print(userDetails)
        if not userDetails:
            return {'message': 'Invalid email. Make sure the email exists.'}, 400
        if resetCode != userDetails[7]:
            return {'message': 'Invalid reset code'}, 400
        if not validate_password(newPassword):
            return {'message': 'New password is not secure.'}, 400
        
        updateDb('accounts', ['password'], [newPassword], 'email', userEmail)
        return {'message': 'Password reset successfully'}, 200

def send_reset_email(email, reset_code):
    msg = Message('Password Reset Code', recipients=[email])
    msg.body = f'Your reset code is: {reset_code}'
    with app.app_context():
        mail.send(msg)

# DATABASE
def createDatabase(dbFile):
   if os.path.exists(dbFile):
      return
   try:
      conn = sqlite3.connect(dbFile)
      c = conn.cursor()
      c.execute('DROP TABLE IF EXISTS accounts')
      c.execute('''
                CREATE TABLE accounts
               (id TEXT PRIMARY KEY,
                email TEXT,
                firstName TEXT,
                lastName TEXT,
                password TEXT,
                skills TEXT,
                experience TEXT,
                token TEXT,
                resetCode TEXT)
                ''')
      c.execute('''DROP TABLE IF EXISTS career_path''')
      c.execute('''CREATE TABLE career_path
               (job_title TEXT,
                job_level TEXT,
                skills TEXT,
                experience_years INTEGER,
                experience_role TEXT)''')
      conn.commit()
   except sqlite3.Error as e:
      api.abort(503)
   finally:
      if conn:
         conn.close()


def getUserDetails(id, email):
    try:
        print('hererere')
        conn = sqlite3.connect(dbFile)
        c = conn.cursor()
        if id:
            c.execute("SELECT * FROM accounts WHERE id = ?", (id,))
        elif email:
            c.execute("SELECT * FROM accounts WHERE email = ?", (email,))
        userDetails = c.fetchone()  # Fetch single row
        
        if userDetails:
            print("User details found:", userDetails)
            return userDetails
        else:
            print("User details not found")
            return None  # or handle as needed
        
    except sqlite3.Error as e:
        print(f"Error fetching user details: {e}")
        raise  # Rethrow the exception to handle it at a higher level

    finally:
        if conn:
            conn.close()

def emailExists(email):
    try:
        conn = sqlite3.connect(dbFile)
        c = conn.cursor()
        c.execute("SELECT * FROM accounts WHERE email = ?", (email,))
        user = c.fetchone()
        return user is not None
    except sqlite3.Error as e:
        raise
    finally:
        if conn:
            conn.close()

def validate_password(password):  
    if len(password) < 8:  
        return False  
    if not re.search("[a-z]", password):  
        return False  
    if not re.search("[A-Z]", password):  
        return False  
    if not re.search("[0-9]", password):  
        return False  
    return True

# MODELS
registrationModel = api.model('Register', {
    "email": fields.String,
    "firstName": fields.String,
    "lastName": fields.String,
    "password": fields.String,
    "confirmPassword": fields.String,
})

login_model = api.model('Login', {
    "id": fields.String(required=True, description='Username'),
    "password": fields.String(required=True, description='Password')
})

logout_model = api.model('Logout',  {
    "id": fields.String(required=True, description='Username'),
})

edit_detail_model = api.model('Edit_detail',  {
    'id': fields.String(required=True, description='Username'),
    'firstName': fields.String(description='First Name'),
    'lastName': fields.String(description='Last Name'),
    'skills': fields.List(fields.String, description='List of skills'),
    'experience': fields.List(fields.String, description='String (role-year) e.g. "SWE-1,Data Analyst-3"')
})

@api.route('/register')
class Register(Resource):
    @api.expect(registrationModel)
    @api.response(200, 'OK')
    @api.response(400, 'BAD REQUEST')
    @api.response(403, 'INVALID INPUT')

    def post(self):
        try:
            data = request.json

            # Extract data
            email = data['email']
            firstName = data['firstName']
            lastName = data['lastName']
            password = data['password']
            confirmPassword = data['confirmPassword']

            # Validate email
            try:
                valid = validate_email(email)
                email = valid.email
            except EmailNotValidError as e:
                print('Invalid Email')
                return {"Error": str(e)}, 400
            
            email = str(email.lower())
            # Check if email already exists
            if emailExists(email):
                print('Email exists')
                return {"Error": "Email already exists"}, 409

            # Check if passwords match
            if password != confirmPassword:
                print('Password dont match')
                return {"Error": "Passwords don't match"}, 400

            # Check if password is secure
            if not validate_password(password):
                print('Password invalid')
                return {"Error": """
                        Password is not secure. 
                        For a secured password, you must have:\n
                        - at least 8 characters, \n
                        - at least 1 lowercase letter,\n
                        - at least 1 capital letter, and\n
                        - at least 1 number."""}, 400

            
            print('Data received==========')
            #unique user ID
            user_id = str(uuid.uuid4())
            token = secrets.token_hex(16)

            conn = sqlite3.connect(dbFile)
            c = conn.cursor()
            insertQuery = "INSERT INTO accounts (id, email, firstName, lastName, password, token) VALUES (?, ?, ?, ?, ?, ?)"
            insertValues = (user_id, email, firstName, lastName, password, token)
            c.execute(insertQuery, insertValues)
            conn.commit()
            conn.close()
            
            print(f'returning userId: {user_id}, token: {token}')
            return {"id": user_id,
                    "token": token,
                    }, 200
        except Exception as e:
            return {"Error": str(e)}, 400


@api.route('/login')
class Login(Resource):
    @api.expect(login_model)
    @api.response(200, 'Login successful')
    @api.response(401, 'Unauthorized')
    @api.response(403, 'Already logged in')
    
    def post(self):
        try:
            data = request.json
            email = data['email']
            password = data['password']
            if email:
                email = str(email.lower())
            
            userDetails = getUserDetails(None, email)
            id = userDetails[0]
            if userDetails and email == userDetails[1] and password == userDetails[4]:
                if userDetails[6] is not None: 
                    return {"Error": "Already logged in."}, 403
                
                new_token = secrets.token_hex(16)

                conn = sqlite3.connect(dbFile)
                c = conn.cursor()
                c.execute("UPDATE accounts SET token = ? WHERE id = ?", (new_token, id))
                conn.commit()
                conn.close()

                return {"id": id,
                        "token": new_token,
                        'message': 'Login successful.'}, 200
            else:
                return {"Error": "We didn't recognise the username or password you entered. Please try again."}, 401

        except Exception as e:
            return {"Error": "We didn't recognise the username or password you entered. Please try again.", "error": str(e)}, 500
        

@api.route('/userDetails')
class userDetails(Resource):
    # @api.expect(logout_model)
    @api.response(200, 'Get details successful')
    @api.response(401, 'Get details fail')
    def get(self):
        try:
            data = request.headers
            userId = data['id']
            userToken = data['Authorization']
            print(f'userId: {userId}')
            if userId:
                print(userId, type(userId))
                userDetails = getUserDetails(userId, None)
                if len(userDetails) > 0:
                    print(userDetails[5], 'skills')
                    return {
                               'id': userDetails[0],
                               'email': userDetails[1],
                               'firstName': userDetails[2],
                               'lastName': userDetails[3],
                               'password': userDetails[4],
                               'skills': userDetails[5],
                               'experience': userDetails[6]
                           }, 200
                else:
                    print("User Details not found")
            else:
                print('No user id provided: User id = ', userId)
        except Exception as e:
            return {"message": "An error occurred in getting user details", "error": str(e)}, 500

@api.route('/logout')
class Logout(Resource):
    # @api.expect(logout_model)
    @api.response(200, 'Logout successful')
    @api.response(401, 'Logout fail')
    def post(self):
        try:
            data = request.json
            print("***" * 5)
            print(data)
            user_id = data['id']
            userDetails = getUserDetails(user_id, None)
            if userDetails and user_id == userDetails[0]:
                if userDetails[6] is None:  # Check if token is None
                    return {"message": "Already logged out"}, 400
                
                conn = sqlite3.connect(dbFile)
                c = conn.cursor()
                c.execute("UPDATE accounts SET token = NULL WHERE id = ?", (user_id,))
                conn.commit()
                conn.close()

                return {"message": "Logout successful"}, 200
            else:
                return {"message": "Invaild user id"}, 400
        except Exception as e:
            return {"message": "An error occurred in logout", "error": str(e)}, 500

@api.route('/Edit_detail')
class Edit_detail(Resource):
    @api.expect(edit_detail_model)
    @api.response(200, 'Edit successful')
    @api.response(401, 'Edit failed')
    
    def patch(self):
        try:
            data = request.json
            headers = request.headers
            user_id = headers['id']
            print('===============')
            if 'password' in headers:
                new_password = headers['password']
            print('=====')
            new_firstName = data.get('firstName')
            new_lastName = data.get('lastName')
            new_skills = data.get('skills')
            new_experience = data.get('experience')

            userDetails = getUserDetails(user_id, None)
            print(f'EXPERIENCE: {new_experience}')

            if userDetails and user_id == userDetails[0]:
                update_fields = {}
                if new_firstName:
                    update_fields['firstName'] = new_firstName
                if new_lastName:
                    update_fields['lastName'] = new_lastName
                if new_skills is not None:
                    update_fields['skills'] = new_skills
                if new_password:
                    update_fields['password'] = new_password
                if new_experience:
                    update_fields['experience'] = new_experience

                print('PASS')
                if update_fields:
                    print('PASS2')
                    update_query = "UPDATE accounts SET " + ", ".join(f"{key} = ?" for key in update_fields.keys()) + " WHERE id = ?"
                    update_values = list(update_fields.values()) + [user_id]

                    conn = sqlite3.connect(dbFile)
                    c = conn.cursor()
                    c.execute(update_query, update_values)
                    conn.commit()
                    conn.close()

                    return {"message": "successfully changed."}, 200
                else:
                    return {"message": "No new updates provided."}, 200
            else:
                return {"Error": "Unauthorized"}, 401

        except Exception as e:
            return {"Error": "An error occurred during detail edit", "error": str(e)}, 500
        
        # Helper function to encode images to base64
def encode_binary_to_base64(binary):
    return "data:image/png;base64,"+base64.b64encode(binary).decode('utf-8')

@api.route('/top_jobs_us')
class TopJobs(Resource):
    @api.response(200, 'OK')
    def get(self):
        # return {"image": "data:image/png;base64," + open(os.path.join(os.path.dirname(__file__),'figs', 'top_10_us_jobs.png'), "rb").read().encode("base64")}
        return {"image": encode_binary_to_base64(open(os.path.join(os.path.dirname(__file__),'figs', 'top_10_us_jobs.png'), "rb").read())}
    
@api.route('/top_jobs_uk')
class TopJobsUK(Resource):
    @api.response(200, 'OK')
    def get(self):
        # return {"image": "data:image/png;base64," + open(os.path.join(os.path.dirname(__file__),'figs', 'top_10_uk_jobs.png'), "rb").read().encode("base64")}
        return {"image": encode_binary_to_base64(open(os.path.join(os.path.dirname(__file__),'figs', 'top_10_uk_jobs.png'), "rb").read())}
    
@api.route('/top_jobs_aus')
class TopJobsAUS(Resource):
    @api.response(200, 'OK')
    def get(self):
        # return {"image": "data:image/png;base64," + open(os.path.join(os.path.dirname(__file__),'figs', 'top_10_aus_jobs.png'), "rb").read().encode("base64")}
        return {"image": encode_binary_to_base64(open(os.path.join(os.path.dirname(__file__),'figs', 'top_10_aus_jobs.png'), "rb").read())}
    
@api.route('/process_duration')
class ProcessDuration(Resource):
    @api.response(200, 'OK')
    def get(self):
        # return {"image": "data:image/png;base64," + open(os.path.join(os.path.dirname(__file__),'figs', 'process_duration.png'), "rb").read().encode("base64")} 
        return {"image": encode_binary_to_base64(open(os.path.join(os.path.dirname(__file__),'figs', 'process_duration.png'), "rb").read())}
    
@api.route('/job_types')
class JobTypes(Resource):
    @api.response(200, 'OK')
    def get(self):
        # return {"image": "data:image/png;base64," + open(os.path.join(os.path.dirname(__file__),'figs', 'job_types.png'), "rb").read().encode("base64")}
        return {"image": encode_binary_to_base64(open(os.path.join(os.path.dirname(__file__),'figs', 'job_types.png'), "rb").read())}

def params_null(value):
    if value == '':
        return None
    return value


@api.route('/get_path_data')
class GetPathData(Resource):
    @api.response(200, 'Logout successful')
    @api.response(401, 'Logout fail')
    def post(self):
        try:
            # data = request.json
            print('called')
            data = request.get_json()
            user_skills = data['user_skills']
            experience_role = data['experience_role']
            experience_years = data['experience_years']
            if experience_years:
                experience_years = sum(int(x) for x in experience_years)
            
            # pre-fill
            if len(experience_role) <= 0 and len(experience_years) <= 0:
                experience_role = ['']
                experience_years = 0

            # print(experience_role)
            # print(experience_years)
            df = load_data()
            recommendations = recommend_jobs(user_skills, experience_role, experience_years)
            all_career_paths = generate_all_career_paths_for_recommendations(user_skills, recommendations, df)
            name_arr = []
            job_title_arr = []
            title_skills_arr = []
            print(all_career_paths)
            for path in all_career_paths:
                for index, value in enumerate(path):
                    # print("path", path)
                    union_title = value['job_level'] + ' ' + value['job_title']
                    if union_title not in name_arr:
                        name_arr.append(union_title)
                        title_skills_dict = {}
                        title_skills_dict['title'] = union_title
                        title_skills_dict['skillsTicked'] = value['skillsTicked']
                        title_skills_dict['skillsNotMet'] = value['skillsNotMet']
                        title_skills_dict['experienceYears'] = value['experience_years']
                        title_skills_arr.append(title_skills_dict)

            for index, job_title in enumerate(name_arr):
                job_obj = {}
                job_obj['name'] = job_title
                job_obj['node'] = index
                job_title_arr.append(job_obj)
            # print(job_title_arr)

            job_links_arr = []
            for path in all_career_paths:
                top_node = None
                node_list = []
                for index, value in enumerate(path):
                    node = None
                    links_obj = {}
                    top_title = value['job_level'] + ' ' + value['job_title']
                    for title in job_title_arr:
                        if title['name'] == top_title:
                            node = title['node']
                            node_list.append(node)
                    # if index == 0:
                    #     top_node = node
                    # else:
                    #     links_obj['source'] = top_node
                    #     links_obj['target'] = node
                    #     links_obj['value'] = 2000
                    #     job_links_arr.append(links_obj)
                    if index > 0:
                        links_obj['source'] = node_list[index - 1]
                        links_obj['target'] = node_list[index]
                        links_obj['value'] = 2000
                        job_links_arr.append(links_obj)
            # print(job_links_arr)
            all_obj = {}
            all_obj['nodes'] = job_title_arr
            all_obj['links'] = job_links_arr
            for j in job_title_arr:
                for s in title_skills_arr:
                    if j['name'] == s['title']:
                        j['skillsTicked'] = s['skillsTicked']
                        j['skillsNotMet'] = s['skillsNotMet']
                        j['experienceYears'] = s['experienceYears']
            print()
            print()
            print()
            print(all_obj)
            return jsonify(all_obj)

        except Exception as e:
            return {"message": "An error occurred in logout", "error": str(e)}, 500


if __name__ == '__main__':
    analyze_jobs()
    createDatabase(dbFile)
    app.run()