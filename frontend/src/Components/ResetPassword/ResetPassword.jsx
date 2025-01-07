import React, { useState } from 'react';
import '../LoginSignup/LoginSignup.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import password_icon from '../Assets/password.png';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import NavigationBar from '../Navigation/NavigationBar';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const ResetPassword = (props) => {
  const navigate = useNavigate();
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [alertError, setAlertError] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleResetPassword = async () => {
    setProcessing(true);
    try {
      const response = await fetch('http://localhost:5000/reset-password', {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email: props.userEmail,
          reset_code: resetCode,
          new_password: newPassword,
        }),
      });

      const data = await response.json();
      setProcessing(false);
      if (response.status !== 200) {
        setAlertError(true);
        setAlertMessage(data['message']);
        return;
      } else {
        navigate('/loginSignUp');
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
              <strong>Reset Password Error.</strong>
            </AlertTitle>
            {alertMessage}
          </Alert>
        )}
        <div className="header">
          <div className="text">Reset Password</div>
          <div className="underline"></div>
        </div>
        {processing && (
          <Box sx={{ width: '100%' }}>
            <br /> <br />
            Resetting Password ... <br /> <br />
            <LinearProgress />
          </Box>
        )}
        <div className="inputs">
          <div className="input">
            <img src={password_icon} alt="" />
            <input
              type="password"
              placeholder="Reset Code sent from email"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
            />
          </div>
          <div className="input">
            <img src={password_icon} alt="" />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="submit-container">
          <div className="submit" onClick={() => navigate('/loginSignUp')}>
            Cancel
          </div>
          <div className="submit" onClick={handleResetPassword}>
            Reset Password
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
