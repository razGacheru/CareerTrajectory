import React from 'react';
import {
  Box,
  ListItem,
  IconButton,
  Autocomplete,
  TextField,
} from '@mui/material';

import { Close as DeleteIcon } from '@mui/icons-material';

export function InputListItem({ options, value, removeValue, index }) {
  return (
    <ListItem
      fullWidth
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => {
            removeValue(index);
          }}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <Autocomplete
        freeSolo
        fullWidth
        disableClearable
        disabled
        options={options.map((option) => option.as)}
        defaultValue={value.as}
        renderInput={(params) => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            label="As"
            fullWidth
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
      <Box sx={{ mx: 1 }} />
      <Autocomplete
        freeSolo
        fullWidth
        disableClearable
        disabled
        options={options.map((option) => option.for)}
        defaultValue={`${value.for}years`}
        renderInput={(params) => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            label="For"
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
    </ListItem>
  );
}
