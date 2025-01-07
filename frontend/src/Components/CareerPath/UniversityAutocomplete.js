/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

// Example array of universities, ideally fetched from a database or API
const universities = [
  'University of Melbourne',
  'University of Sydney',
  'University of Queensland',
  'Monash University',
  'University of New South Wales',
  'Australian National University',
  'The University of Western Australia',
  'University of Adelaide',
  'University of Technology Sydney',
  'Macquarie University',
  'Curtin University',
  'University of Wollongong',
  'Queensland University of Technology',
  'Swinburne University of Technology',
  'RMIT University',
  'Deakin University',
  'Griffith University',
  'University of Newcastle',
  'University of Tasmania',
  'La Trobe University',
];

function UniversityAutocomplete() {
  const [value, setValue] = useState(null);

  const sortedUniversities = universities.sort();

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      options={sortedUniversities}
      renderInput={(params) => (
        <TextField {...params} label="Start Typing University Name" />
      )}
      fullWidth
    />
  );
}

export default UniversityAutocomplete;
