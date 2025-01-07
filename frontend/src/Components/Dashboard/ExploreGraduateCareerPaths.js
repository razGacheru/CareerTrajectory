import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ExploreGraduateCareerPaths() {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/CareerPaths');
  };

  return (
    <Button
      style={{
        backgroundColor: '#470da3',
        borderRadius: '15px',
        scale: '1.2',
        width: '100%',
        height: '50px',
      }}
      variant="contained"
      onClick={handleButtonClick}
    >
      Explore Graduate Career Paths
    </Button>
  );
}

export default ExploreGraduateCareerPaths;
