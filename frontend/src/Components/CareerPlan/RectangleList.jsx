import React from 'react';
import { Box, Typography, ImageList, ImageListItem } from '@mui/material';

export function RectangleList({ values, addToOther, keyword }) {
  const filteredValues = values.filter(
    (value) =>
      !keyword ||
      keyword === '' ||
      value.toLowerCase().includes(keyword.toLowerCase()),
  );

  console.log('keyword', keyword);

  return (
    <ImageList sx={{ width: '100%', height: '100%' }} cols={2}>
      {filteredValues.map((item) => (
        <ImageListItem key={item}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 40,
              bgcolor: 'grey.200',
              padding: 2,
            }}
            onClick={() => addToOther(item)}
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
