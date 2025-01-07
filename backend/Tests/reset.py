import requests as r
# response = r.post('http://localhost:5000/register', json={
#     'email': 'roland.viray@yahoo.com',
#     'firstName': 's',
#     'lastName': 'd',
#     'password': 'Qwerty123',
#     'confirmPassword': 'Qwerty123'
#     })

# request reset
# response = r.post('http://localhost:5000/request-reset', json={'email': 'roland.viray@yahoo.com'})
# data = response.json()
# print(response.status_code)
# print(data['message'])

# reset password
response = r.post('http://localhost:5000/reset-password', json={
    'email': 'roland.viray@yahoo.com',
    'reset_code': 'EGzIWBol1yTXytwRYzgV',
    'new_password': 'Yoyoyo123'
    })
data = response.json()
print(response.status_code)
print(data['message'])
assert response.status_code == 200

# login
response = r.post('http://localhost:5000/login', json={
    'email': 'roland.viray@yahoo.com',
    'password': 'Yoyoyo123'
    })
data = response.json()
print(response.status_code)
print(data['message'])
assert response.status_code == 200