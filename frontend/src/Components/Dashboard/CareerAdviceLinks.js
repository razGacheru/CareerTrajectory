import * as React from 'react';
import { Paper, Typography, Link, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ImageComponent from './ImageComponent';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function CareerAdviceLinks() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        style={{
          backgroundColor: '#470da3',
          borderRadius: '15px',
          scale: '1.2',
          width: '100%',
          height: '50px',
        }}
        variant="contained"
        onClick={handleClickOpen}
      >
        Career Trends and Advice
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Career Trends and Advice
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            Insert the headline of the article here.
            <Link
              href="https://www.forbes.com/sites/bernardmarr/2024/03/12/worried-an-ai-is-going-to-take-your-job-heres-how-to-stay-relevant-in-the-generative-ai-era/"
              target="_blank"
              style={{ display: 'block', marginBottom: '8px' }}
            >
              How To Stay Relevant In The GenAI Era
            </Link>
          </Typography>
          <br /> <br />
          <Typography gutterBottom>
            Insert the headline of the article here.
            <Link
              href="https://www.comptia.org/blog/top-it-skills-in-demand"
              target="_blank"
              style={{ display: 'block', marginBottom: '8px' }}
            >
              Top IT Skills in Demand in 2024
            </Link>
          </Typography>
          <br /> <br />
          <Typography gutterBottom>
            Insert the headline of the article here.
            <Link
              href="https://www.bloomberg.com/technology"
              target="_blank"
              style={{ display: 'block', marginBottom: '8px' }}
            >
              Other News Article/Blog Post
            </Link>
          </Typography>
          <br />
          <br />
          <Paper>
            <ImageComponent endpoint="top_jobs_aus" alt="Top 10 AUS Jobs" />
          </Paper>
          <br />
          <Paper>
            <ImageComponent endpoint="job_types" alt="Job Types" />
          </Paper>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
