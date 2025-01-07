import React, { useState } from 'react';
import './LoginSignup.css';
import { Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useNavigate } from 'react-router-dom';
import userIcon from '../Assets/person.png';
import emailIcon from '../Assets/email.png';
import passwordIcon from '../Assets/password.png';
import NavigationBar from '../Navigation/NavigationBar';

function LoginSignup(props) {
  const navigate = useNavigate();
  const [action, setAction] = useState('Login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpFirstName, setSignUpFirstName] = useState('');
  const [signUpLastName, setSignUpLastName] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [alertError, setAlertError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const alertErrorFn = () => {
    setAlertError(true);
  };

  const signUp = async () => {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      body: JSON.stringify({
        email: signUpEmail,
        firstName: signUpFirstName,
        lastName: signUpLastName,
        password: signUpPassword,
        confirmPassword: signUpConfirmPassword,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      setErrorMessage(data.Error);
      alertErrorFn();
    } else {
      props.setToken(data.token);
      props.setUserId(data.id);
      props.setUserPassword(signUpPassword);
      localStorage.setItem('token', data.token);
      localStorage.setItem('id', data.id);
      navigate('/');
    }
  };

  const logIn = async () => {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      setErrorMessage(data.Error);
      alertErrorFn();
    } else {
      props.setToken(data.token);
      props.setUserId(data.id);
      props.setUserPassword(loginPassword);
      localStorage.setItem('token', data.token);
      localStorage.setItem('id', data.id);
      navigate('/');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (action === 'Login') {
      logIn();
    } else if (action === 'SignUp') {
      signUp();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        height: '98vh',
        margin: '-10px',
      }}
    >
      <div
        style={{
          margin: '0px',
          height: '10%',
          padding: '0px',
          boxSizing: 'border-box',
        }}
      >
        <NavigationBar homeButton={true} />
      </div>
      <div className="container" style={{ height: '80%' }}>
        {alertError && (
          <Alert severity="error">
            <AlertTitle>
              <strong>
                {action === 'Login' ? 'Login Error' : 'Registration Error'}
              </strong>
            </AlertTitle>
            {errorMessage}
          </Alert>
        )}
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="inputs">
            {action === 'Login' ? (
              <>
                <div className="input">
                  <img src={emailIcon} alt="" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input">
                  <img src={passwordIcon} alt="" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="input">
                  <img src={emailIcon} alt="" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input">
                  <img src={userIcon} alt="" />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={signUpFirstName}
                    onChange={(e) => setSignUpFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="input">
                  <img src={userIcon} alt="" />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={signUpLastName}
                    onChange={(e) => setSignUpLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="input">
                  <img src={passwordIcon} alt="" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="input">
                  <img src={passwordIcon} alt="" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
          </div>
          {action === 'SignUp' ? null : (
            <div className="forgot-password">
              Lost Password?{' '}
              <span onClick={() => navigate('/verifyCode')}>Click Here!</span>
            </div>
          )}
          <div className="submit-container">
            <div
              className={action === 'Login' ? 'submit gray scale' : 'submit'}
              onClick={() => {
                setAction('SignUp');
                setAlertError(false);
              }}
            >
              Sign Up
            </div>
            <div
              className={action === 'SignUp' ? 'submit gray scale' : 'submit'}
              onClick={() => {
                setAction('Login');
                setAlertError(false);
              }}
            >
              Login
            </div>
          </div>
          <div
            className="scale"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              type="submit"
              variant="contained"
              className="submit gray scale"
              style={{
                background: '#3c009d',
                padding: '10px',
                width: '50%',
                scale: '1.2',
                borderRadius: '70px',
              }}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginSignup;
