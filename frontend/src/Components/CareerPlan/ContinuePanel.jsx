import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';

import { PopupDialogContent } from './PopupDialogContent';

export const ContinuePanel = ({ selected, all, setSelected, title }) => {
  const [cachedKeyword, setCachedKeyword] = React.useState('');

  const [keyword, setKeyword] = React.useState('');

  const [cachedSelected, setCachedSelected] = React.useState(selected);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Box>
          <Typography variant="h6">{title}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <PopupDialogContent
          all={all}
          cachedKeyword={cachedKeyword}
          setCachedKeyword={setCachedKeyword}
          keyword={keyword}
          setKeyword={setKeyword}
          cachedSelected={cachedSelected}
          setCachedSelected={setCachedSelected}
        ></PopupDialogContent>
      </Grid>
      <Grid item xs={8} />
      <Grid item xs={2}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setCachedSelected(selected);
          }}
        >
          Cancel
        </Button>
      </Grid>
      <Grid item xs={2}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setSelected(cachedSelected);
          }}
        >
          submit
        </Button>
      </Grid>
    </Grid>
  );
};
