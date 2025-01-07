/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home'; // Import Home icon for Material-UI
import { useNavigate } from 'react-router-dom';

function NavigationBar(props) {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/loginSignUp');
  };

  const handleLogout = () => {
    props.setToken('');
    props.setUserId('');
    props.setEmail('');
    props.setUserPassword('');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    navigate('/loginSignUp');
  };

  return (
    <AppBar position="static" style={{ background: '#3c009d', margin: 0 }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'left' }}>
          Career Path Navigator
        </Typography>
        {props.homeButton === true ? (
          <IconButton color="inherit" onClick={handleHomeClick}>
            <HomeIcon />
          </IconButton>
        ) : props.homeButton === false ? (
          <Button color="inherit" onClick={handleLogin}>
            Login
          </Button> // Update the navigation logic if needed
        ) : (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
