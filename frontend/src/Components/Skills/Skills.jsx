import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Profile = (props) => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    // navigate('/CareerPaths');
    alert('Edit in progress');
  };

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h5" gutterBottom>
        My Skills
      </Typography>
      <Typography variant="h7" gutterBottom>
        Java C C++ Python React SQL <br />
      </Typography>
      <br />
      <Button
        style={{ backgroundColor: '#470da3' }}
        variant="contained"
        onClick={handleButtonClick}
      >
        Edit Skills
      </Button>
    </Paper>
  );
};

export default Profile;
