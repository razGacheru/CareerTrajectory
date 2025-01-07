import React from 'react';
import { Box, Typography } from '@mui/material';
import NavigationBar from '../Navigation/NavigationBar';
import CareerChart from './CareerChart'; // Assume this is your chart component
import JobDetails from './JobDetails'; // Assume this handles job details pop-ups
import SearchSection from './SearchSection';
import Footer from '../Footer/Footer';

function CareerPaths() {
  const data = {
    nodes: [
      { name: 'Total Graduates' },
      { name: 'Junior Developer' },
      { name: 'Junior Data Engineer' },
      { name: 'Junior AI Specialist' },
      { name: 'Junior Network Engineer' },
      { name: 'Software Engineer' },
      { name: 'Data Scientist' },
      { name: 'AI Research Scientist' },
      { name: 'System Administrator' },
      { name: 'Network Architect' },
      { name: 'Machine Learning Engineer' },
      { name: 'Computer Vision Engineer' },
      { name: 'Natural Language Processing Engineer' },
      { name: 'Robotics Engineer' },
      { name: 'Data Analyst' },
      { name: 'IT Support Specialist' },
      { name: 'Cybersecurity Analyst' },
      { name: 'Cloud Solutions Architect' },
    ],
    links: [
      { source: 0, target: 1, value: 20000 },
      { source: 0, target: 2, value: 15000 },
      { source: 0, target: 3, value: 25000 },
      { source: 0, target: 4, value: 25000 },
      { source: 1, target: 5, value: 8000 },
      { source: 2, target: 6, value: 7000 },
      { source: 3, target: 7, value: 5000 },
      { source: 3, target: 10, value: 6000 },
      { source: 3, target: 11, value: 4000 },
      { source: 3, target: 12, value: 3000 },
      { source: 3, target: 13, value: 2000 },
      { source: 4, target: 8, value: 5000 },
      { source: 4, target: 9, value: 4000 },
      { source: 4, target: 15, value: 5000 },
      { source: 4, target: 16, value: 3000 },
      { source: 4, target: 17, value: 3000 },
      { source: 1, target: 14, value: 4000 },
      { source: 2, target: 14, value: 3000 },
      { source: 3, target: 14, value: 2000 },
    ],
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        height: '98vh',
        margin: -10,
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
        <NavigationBar homeButton data-cy="navigation-bar" />
      </div>
      <Box sx={{ p: 2 }} style={{ height: '80%' }}>
        <Typography
          variant="h4"
          sx={{ mb: 2 }}
          style={{ padding: '10px 0 0 10px', margin: 0 }}
        >
          Explore Graduate Career Paths
        </Typography>
        <SearchSection data-cy="search-section" />
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <CareerChart data={data} data-cy="career-chart" />
        </div>
        <JobDetails data-cy="job-details" />
      </Box>
      <div
        style={{
          height: '10%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Footer data-cy="footer" />
      </div>
    </div>
  );
}

export default CareerPaths;
