import React from 'react';
import { Box } from '@mui/material';
import CareerChart from '../CareerPath/CareerChart';

function CareerPlanSankey({ props }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Box
        sx={{ p: 5 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <CareerChart data={props} />
      </Box>
    </div>
  );
}

export default CareerPlanSankey;
