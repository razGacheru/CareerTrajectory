import React from 'react';
import { Box, Typography, ImageList, ImageListItem } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export function SquareList({ values, setOpen }) {
  return (
    <ImageList sx={{ width: '100%', height: '100%' }} cols={5}>
      <ImageListItem>
        <Box
          data-cy="square-list"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            bgcolor: 'grey.200',
            padding: 2,
            borderRadius: 10,
          }}
          onClick={() => setOpen(true)}
        >
          <AddIcon />
        </Box>
      </ImageListItem>

      {values.map((item) => (
        <ImageListItem key={item}>
          <Box
            data-cy="square-list"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
              bgcolor: 'grey.200',
              padding: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {item}
            </Typography>
          </Box>
        </ImageListItem>
      ))}
    </ImageList>
  );
}
