import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Correctly import useNavigate

function MyPersonalizedCareerPlan() {
  const navigate = useNavigate(); // Correctly initialized useNavigate

  const handlePlanClick = () => {
    navigate('/CareerPlan'); // Use navigate() to change routes
  };

  return (
    <Button
      style={{
        backgroundColor: '#470da3',
        borderRadius: '15px',
        width: '100%',
        scale: '1.2',
        height: '50px',
      }}
      variant="contained"
      onClick={handlePlanClick}
    >
      Manage Career Plan
    </Button>
  );
}

export default MyPersonalizedCareerPlan;
