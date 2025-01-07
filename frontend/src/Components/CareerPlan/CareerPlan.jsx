/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable dot-notation */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  List,
  Autocomplete,
  TextField,
  CircularProgress,
} from '@mui/material';
import NavigationBar from '../Navigation/NavigationBar';

import { InputListItem } from './InputListItem';
import { SquareList } from './SquareList';
import { PopupDialog } from './PopupDialog';
import CareerPlanSankey from './Sankey';
import { SkillsList } from '../Assets/skillsList';
// import Footer from '../Footer/Footer'

function CareerPlan(props) {
  // const roles = [
  //   "Software Engineer",
  //   "Data Scientist",
  //   "Product Manager",
  //   "UX Designer",
  //   "Cybersecurity Analyst",
  // ];
  const roles = [
    'Developer',
    'Data Engineer',
    'AI Specialist',
    'Network Engineer',
    'Software Engineer',
    'Data Analyst',
    'Data Scientist',
    'AI Research Scientist',
    'System Administrator',
    'Network Architect',
    'AI Specialist, Data Engineer',
    'Machine Learning Engineer',
    'Computer Vision Engineer',
    'Natural Language Processing Engineer',
    'Robotics Engineer',
    'Network Engineer, Developer',
    'IT Support Specialist',
    'Cybersecurity Analyst',
    'Cloud Solutions Architect',
  ];

  const [cachedRole, setCachedRole] = React.useState('');
  const [cachedYears, setCachedYears] = React.useState('');

  const [continued, setContinued] = React.useState(false);
  const [sankey, setSankey] = React.useState(false);
  const [experiences, setExperience] = React.useState([]);
  const [jsonData, setJsonData] = React.useState([]);

  const [languageDialogOpen, setLanguageDialogOpen] = React.useState(false);
  const [selectedLanguages, setSelectedLanguages] = React.useState([]);
  const [allLanguages] = React.useState(SkillsList);

  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    console.log(experiences);
  }, [experiences]);

  const handleUpdate = async () => {
    const exp = experiences.map((e) => `${e.as}-${e['for']}`).join(',');
    try {
      // for (let i = 0; i < experiences.length; i++) {
      //     const expRole = experiences[i].as;
      //     const expYears = experiences[i].for;
      //     const exp = `${expRole}-${expYears}`;
      //     experiences.push(exp);
      // }
      const headers = {
        'Content-type': 'application/json',
        Authorization: props.token,
        id: props.userId,
        password: props.userPassword,
      };

      const body = JSON.stringify({
        skills: selectedLanguages.join(','),
        experience: exp,
      });

      const response = await fetch('http://localhost:5000/Edit_detail', {
        method: 'PATCH',
        body,
        headers,
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(data.Error);
      } else {
        console.log('Skills successfully updated');
      }
    } catch (error) {
      console.error('Error fetching updating skills:', error);
    }
  };

  useEffect(() => {
    console.log(experiences);
  }, [experiences]);

  const handleShowSankey = async () => {
    try {
      const expRoles = experiences.map((x) => x['as']);
      const expYears = experiences.map((x) => x['for']);
      console.log(experiences);
      console.log(expRoles);
      console.log(expYears);

      const response = await fetch('http://localhost:5000/get_path_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_skills: selectedLanguages,
          experience_role: expRoles,
          experience_years: expYears,
        }),
      });
      console.log('===================');
      // console.log(JSON.stringify(request_data))
      console.log(response.status);
      if (response.ok) {
        const jsonResponse = await response.json();
        setJsonData(jsonResponse);
        console.log(jsonResponse);
      } else {
        console.error('Failed to post data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setContinued(false);
    setSankey(true);
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/userDetails', {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: props.token,
            id: props.userId,
          },
        });
        if (!response.ok) {
          console.log(`Error: Dashboard`);
        } else {
          const data = await response.json();
          if (data.skills.trim().length > 0) {
            const yo = data.skills.split(',');
            console.log(data.skills);
            console.log(yo);
            setSelectedLanguages(() => yo);
          }
          if (data.experience) {
            setExperience(() => {
              const exp = data.experience
                .split(',')
                .map((e) => ({ as: e.split('-')[0], for: e.split('-')[1] }));
              return exp;
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (props.token) {
      getUserDetails();
    } else {
      setLoading(false);
    }
  }, [props.token, props.userId]);

  useEffect(() => {
    console.log(selectedLanguages);
  }, [selectedLanguages]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <Typography sx={{ marginLeft: 2 }}>Loading plan ...</Typography>
          <CircularProgress />
        </Box>
      </div>
    ); // Optionally show a loading indicator
  }

  return (
    <div style={{ height: '98vh', boxSizing: 'border-box' }}>
      <div style={{ height: '10%', margin: '-8px' }}>
        <NavigationBar homeButton />
      </div>
      <div style={{ height: '80%' }}>
        <Box sx={{ p: 2 }}>
          <PopupDialog
            open={languageDialogOpen}
            setOpen={setLanguageDialogOpen}
            selected={selectedLanguages}
            all={allLanguages}
            title="Select Skills"
            setSelected={setSelectedLanguages}
          />

          <Box sx={{ mb: 2 }} />
          {sankey && (
            <CareerPlanSankey
              sankey={sankey}
              setSankey={setSankey}
              props={jsonData}
            />
          )}

          {!continued && !sankey && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    >
                      <Typography variant="h5" sx={{ mx: 3 }}>
                        My Experience
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ bgcolor: 'grey.100', p: 1 }}>
                      <List>
                        {experiences.map((value, index) => (
                          <InputListItem
                            options={experiences}
                            value={value}
                            key={value.as + value.for + index.toString()}
                            index={index}
                            removeValue={(index) => {
                              setExperience(
                                experiences.filter(
                                  // eslint-disable-next-line radix
                                  (v, i) => i !== parseInt(index),
                                ),
                              );
                            }}
                          />
                        ))}
                      </List>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Autocomplete
                      freeSolo
                      fullWidth
                      disableClearable
                      options={roles}
                      defaultValue=""
                      onInputChange={(event, newInputValue) => {
                        setCachedRole(newInputValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Role"
                          InputProps={{
                            ...params.InputProps,
                            type: 'search',
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <Autocomplete
                      freeSolo
                      fullWidth
                      disableClearable
                      options={['1', '2', '3', '4', '5']}
                      defaultValue=""
                      onInputChange={(event, newInputValue) => {
                        setCachedYears(newInputValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Years"
                          InputProps={{
                            ...params.InputProps,
                            type: 'search',
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      style={{ backgroundColor: '#3c009d' }}
                      variant="contained"
                      fullWidth
                      sx={{
                        height: '100%',
                      }}
                      onClick={() => {
                        setExperience(
                          experiences.concat([
                            { as: cachedRole, for: cachedYears },
                          ]),
                        );
                      }}
                    >
                      <Typography variant="button">Add</Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        my: 1,
                        height: '0.5px',
                        width: '100%',
                        bgcolor: 'grey.500',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{}}>
                      Skills
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <SquareList
                      values={selectedLanguages}
                      setOpen={setLanguageDialogOpen}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        my: 1,
                        height: '0.5px',
                        width: '100%',
                        bgcolor: 'grey.500',
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={8} />
              <Grid item xs={4}>
                <Button
                  style={{ backgroundColor: '#3c009d' }}
                  variant="contained"
                  fullWidth
                  sx={{
                    height: '100%',
                  }}
                  onClick={() => {
                    setContinued(true);
                    handleUpdate();
                    handleShowSankey();
                  }}
                >
                  <Typography variant="button">Continue</Typography>
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </div>
      {/* <div style={{height: '10%', display: 'flex'}}> */}
      {/*    <Footer/> */}
      {/* </div> */}
    </div>
  );
}

export default CareerPlan;
