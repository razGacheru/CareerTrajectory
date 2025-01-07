import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Autocomplete,
  TextField,
} from '@mui/material';

import { RectangleList } from './RectangleList';

export function PopupDialogContent({
  all,
  cachedKeyword,
  setCachedKeyword,
  keyword,
  setKeyword,
  cachedSelected,
  setCachedSelected,
}) {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        mt: 1,
      }}
    >
      <Grid item xs={6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box>
              <Typography variant="h6">Selected</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <RectangleList
                values={cachedSelected}
                addToOther={(value) =>
                  setCachedSelected(cachedSelected.filter((v) => v !== value))
                }
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <Box>
              <Autocomplete
                freeSolo
                fullWidth
                disableClearable
                options={all.map((option) => option)}
                defaultValue={cachedKeyword}
                onInputChange={(event, newInputValue) => {
                  setCachedKeyword(newInputValue);
                  if (newInputValue === '') {
                    setKeyword('');
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...params}
                    label="Keyword"
                    InputProps={{
                      ...params.InputProps,
                      type: 'search',
                    }}
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ height: '100%' }}>
              <Button
                variant="contained"
                fullWidth
                style={{ backgroundColor: '#3c009d' }}
                sx={{
                  height: '100%',
                }}
                onClick={() => setKeyword(cachedKeyword)}
              >
                <Typography variant="button">Search</Typography>
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <RectangleList
                values={all.filter((value) => !cachedSelected.includes(value))}
                keyword={keyword}
                addToOther={(value) =>
                  setCachedSelected([...cachedSelected, value])
                }
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
