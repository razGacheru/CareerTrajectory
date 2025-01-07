import React, { useState } from 'react';
import '../LoginSignup/LoginSignup.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import email_icon from '../Assets/email.png';
import { PropaneSharp } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import NavigationBar from '../Navigation/NavigationBar';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const VerifyCode = (props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [alertError, setAlertError] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleResetRequest = async (email) => {
    setProcessing(true);
    try {
      console.log(email);
      const response = await fetch('http://localhost:5000/request-reset', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();
      setProcessing(false);
      if (response.status !== 200) {
        setAlertError(true);
        setAlertMessage(data['message']);
        return;
      } else {
        props.setUserEmail(email);
        navigate('/resetPassword');
      }
    } catch (error) {
      console.error('Error fetching updating skills:', error);
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
      <div className="container">
        {alertError && (
          <Alert severity="error">
            <AlertTitle>
              <strong>Request Invalid.</strong>
            </AlertTitle>
            {alertMessage}
          </Alert>
        )}
        <div className="header">
          <div className="text">Request password reset</div>
          <div className="underline"></div>
        </div>
        {processing && (
          <Box sx={{ width: '100%' }}>
            <br /> <br />
            Sending Reset Code to Email ... <br /> <br />
            <LinearProgress />
          </Box>
        )}
        <div className="inputs">
          <div className="input">
            <img src={email_icon} alt="" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="submit-container">
          <div className="submit" onClick={() => navigate('/loginSignUp')}>
            Cancel
          </div>
          <div className="submit" onClick={() => handleResetRequest(email)}>
            Submit Request
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
