import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';

function JobDetails({ open, onClose, jobData }) {
  // Ensure that jobData is defined before trying to access its properties
  if (!jobData) {
    return null; // Or some other placeholder if appropriate
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Job Details</DialogTitle>
      <DialogContent>
        {/* Check that jobData and its properties are defined before rendering them */}
        <Typography gutterBottom>Role: {jobData.role}</Typography>
        <Typography gutterBottom>Average Salary: {jobData.salary}</Typography>
        <Typography>
          Requirements: {jobData.requirements?.join(', ')}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default JobDetails;
