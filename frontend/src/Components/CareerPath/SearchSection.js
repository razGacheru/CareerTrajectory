import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import UniversityAutocomplete from './UniversityAutocomplete'; // We will create this component for the autocomplete functionality

function SearchSection() {
  const handleAllGraduatesClick = () => {
    // console.log('All CSE Graduates data requested');
    // Here you might fetch or display data for all CSE graduates
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleAllGraduatesClick}
      >
        All CSE Graduates
      </Button>
      <Typography variant="body1">or</Typography>
      <UniversityAutocomplete />
    </Box>
  );
}

export default SearchSection;
