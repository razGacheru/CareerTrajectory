/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import NavigationBar from '../Navigation/NavigationBar';
import ExploreGraduateCareerPaths from './ExploreGraduateCareerPaths';
import MyPersonalizedCareerPlan from './MyPersonalizedCareerPlan';
import CareerAdviceLinks from './CareerAdviceLinks';
import Footer from '../Footer/Footer';
import Profile from '../Profile/Profile';

function DashboardPage(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userSkills, setUserSkills] = useState([]);
  const [password, setUserPassword] = useState('');
  const [userId, setUserId] = useState(false);

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
        if (response.ok) {
          const data = await response.json();
          if (data.firstName !== null) {
            setFirstName(data.firstName);
          }
          if (data.lastName !== null) {
            setLastName(data.lastName);
          }
          if (data.email !== null) {
            setEmail(data.email);
          }
          if (data.password !== null) {
            setUserPassword(data.password);
          }
          if (data.skills.trim().length > 0) {
            const parsedSkills = data.skills.split(',').map((skill) => ({
              title: skill.trim(),
            }));
            setUserSkills(() => parsedSkills);
            // console.log('user skills:', userSkills);
          }
        }

        // console.log(email && firstName && lastName);
      } catch (error) {
        // console.error('Error fetching user details:', error);
        // Handle error state or alert the user
      }
    };
    getUserDetails();
  }, [props.token, props.userId]);

  useEffect(() => {
    const checktoken = localStorage.getItem('token');
    const checkId = localStorage.getItem('id');
    if (checktoken && checkId) {
      setUserId(true);
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        height: '98vh',
        margin: '-10px',
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
        {props.userId ? (
          <NavigationBar
            homeButton="logout"
            setEmail={setEmail}
            setToken={props.setToken}
            setUserId={props.setUserId}
            setUserPassword={props.setUserPassword}
          />
        ) : (
          <NavigationBar homeButton={false} />
        )}
      </div>
      <div style={{ padding: '20px', height: '80%' }}>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={3}
          height="100%"
        >
          {email && firstName && lastName && (
            <Grid item xs={5}>
              <item>
                <Profile
                  password={password}
                  setUserPassword={setUserPassword}
                  firstName={firstName}
                  setFirstName={setFirstName}
                  lastName={lastName}
                  setLastName={setLastName}
                  email={email}
                  setEmail={setEmail}
                  userSkills={userSkills}
                  setUserSkills={setUserSkills}
                  userId={props.userId}
                />{' '}
              </item>
            </Grid>
          )}
          {!userId && !email && !firstName && !lastName && (
            <div style={{ flexDirection: 'row' }}>
              <Typography variant="h10">RECOMMENDER SYSTEM</Typography> <br />{' '}
              <br /> <br />
              <Typography variant="h3">CAREER PATHS</Typography> <br /> <br />{' '}
              <br />
              <Typography variant="h10">
                CREATED BY F18BGAGR
              </Typography> <br /> <br /> <br /> <br /> <br />
              <Button
                variant="outlined"
                style={{
                  borderColor: '#470da3',
                  color: '#470da3',
                  borderRadius: '100px',
                  width: '40%',
                }}
                onClick={() => navigate('/loginSignUp')}
              >
                Login
              </Button>
            </div>
          )}
          {userId && !email && !firstName && !lastName && (
            <div style={{ flexDirection: 'row' }}>
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ marginLeft: 2 }}>
                  Loading Profile...
                </Typography>
                <CircularProgress />
              </Box>
            </div>
          )}
          <Grid item xs={3.2}>
            <item>
              <ExploreGraduateCareerPaths />
            </item>
            <br /> <br /> <br />
            <br /> <br /> <br />
            <item>
              <MyPersonalizedCareerPlan />
            </item>
            <br /> <br /> <br />
            <br /> <br />
            <item>
              <CareerAdviceLinks />
            </item>
          </Grid>
        </Grid>
      </div>
      <div
        style={{
          height: '10%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Footer />
      </div>
    </div>
  );
}

export default DashboardPage;
