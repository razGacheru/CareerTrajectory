import React, { useState } from 'react';
import { Paper, Typography, Button } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { SkillsList } from '../Assets/skillsList';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Modal from '@mui/material/Modal';

const Profile = (props) => {
  const [editSkillsInProgress, setEditSkillsInProgress] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [alertDetailsSuccess, setAlertDetailsSuccess] = useState(false);
  const [alertSkillsSuccess, setAlertSkillsSuccess] = useState(false);
  const [alertDetailsMessage, setAlertMessage] = useState('');
  const [alertSkillsMessage, setAlertSkillsMessage] = useState('');
  const skillsOptions = SkillsList.map((skill) => ({ title: skill }));
  const [isUpdating, setIsUpdating] = useState(false);
  const [editCompTitle, setEditCompTitle] = useState('');

  const validatePassword = (password) => {
    if (password.length < 8) {
      return false;
    }
    if (!/[a-z]/.test(password)) {
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      return false;
    }
    if (!/[0-9]/.test(password)) {
      return false;
    }
    return true;
  };

  const handleUpdate = async (component) => {
    try {
      setIsUpdating(true);
      const headers = {
        'Content-type': 'application/json',
        Authorization: props.token,
        id: props.userId,
        password: props.password,
      };
      if (newPassword.length > 0 && validatePassword(newPassword) === true) {
        headers.password = newPassword;
      } else if (
        newPassword.length > 0 &&
        validatePassword(newPassword) !== true
      ) {
        alert('New password error. Make sure to create a secure one.');
        return;
      }

      const body = JSON.stringify({
        firstName: props.firstName,
        lastName: props.lastName,
        skills: props.userSkills.map((skill) => skill.title).join(','),
      });

      const response = await fetch('http://localhost:5000/Edit_detail', {
        method: 'PATCH',
        body: body,
        headers: headers,
      });

      const data = await response.json();
      if (component === 'Profile') {
        setAlertMessage(component + ' ' + data.message);
        setAlertDetailsSuccess(true);
      } else if (component === 'Skills') {
        setAlertSkillsMessage(component + ' ' + data.message);
        setAlertSkillsSuccess(true);
      }
      if (!response.ok) {
        alert(data.response);
      } else {
        props.setUserPassword(newPassword);
        props.dashSetUserPassword(newPassword);
        setNewPassword(() => '');
      }
    } catch (error) {
      console.error('Error fetching updating skills:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const style = {
    py: 0,
    width: '100%',
    maxWidth: 360,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
  };

  const [openModalFirstName, setOpenModalFirstName] = useState(false);
  const handleOpenModalFirstName = () => setOpenModalFirstName(true);
  const handleCloseModalFirstName = () => setOpenModalFirstName(false);
  const handleModalSave = () => {
    // props.setFirstName(newFirstName);
    handleUpdate('Profile');
    handleCloseModalFirstName();
  };

  const value = (() => {
    if (editCompTitle === 'First Name') {
      return props.firstName;
    } else if (editCompTitle === 'Last Name') {
      return props.lastName;
    } else if (editCompTitle === 'New Password') {
      return newPassword;
    }
    return '';
  })();

  const handleChange = (e) => {
    if (editCompTitle === 'First Name') {
      props.setFirstName(e.target.value);
    } else if (editCompTitle === 'Last Name') {
      props.setLastName(e.target.value);
    } else {
      setNewPassword(e.target.value);
    }
  };

  return (
    <>
      {alertDetailsSuccess && (
        <Alert severity="success" onClose={() => setAlertDetailsSuccess(false)}>
          {alertDetailsMessage}
        </Alert>
      )}
      {alertSkillsSuccess && (
        <Alert severity="success" onClose={() => setAlertSkillsSuccess(false)}>
          {alertSkillsMessage}
        </Alert>
      )}
      <Paper
        style={{
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5" gutterBottom>
          My Profile
        </Typography>
        <List sx={style}>
          <ListItem>
            <ListItemText primary={props.firstName} secondary="First Name" />
            <Button
              style={{ color: '470da3' }}
              onClick={() => {
                handleOpenModalFirstName();
                setEditCompTitle('First Name');
              }}
            >
              Edit
            </Button>
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary={props.lastName} secondary={'Last Name'} />
            <Button
              style={{ color: '470da3' }}
              onClick={() => {
                handleOpenModalFirstName();
                setEditCompTitle('Last Name');
              }}
            >
              Edit
            </Button>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemText
              primary={'Hidden'}
              secondary={'Last Name'}
              style={{ color: 'grey' }}
            />
            <Button
              style={{ color: '470da3' }}
              onClick={() => {
                handleOpenModalFirstName();
                setEditCompTitle('New Password');
              }}
            >
              Edit
            </Button>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemText
              primary={props.email}
              secondary={'Email'}
              style={{ color: 'grey' }}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemText
              primary={props.userId}
              secondary="User ID"
              style={{ color: 'grey' }}
            />
          </ListItem>
          <Divider variant="middle" component="li" />
        </List>
        <br />
        <Modal
          open={openModalFirstName}
          onClose={handleCloseModalFirstName}
          closeAfterTransition
          border="2px solid red"
          style={{
            border: '2px solid',
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Box
            style={{
              background: 'white',
              width: '30%',
              borderRadius: '20px',
              padding: '40px',
            }}
          >
            <TextField
              fullWidth
              label={editCompTitle}
              variant="outlined"
              value={value}
              onChange={handleChange}
              type={editCompTitle === 'New Password' ? 'password' : 'text'}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCloseModalFirstName}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleModalSave}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Modal>

        <Typography variant="h6" gutterBottom>
          Skills
          <br />
        </Typography>
        <Typography variant="h7" gutterBottom>
          {props.userSkills.length > 0 ? (
            <div>
              {props.userSkills.map((skill, index) => (
                <Button
                  key={index}
                  variant="contained"
                  style={{
                    border: '1px solid #ACACAC',
                    background: '#F8F7F7',
                    borderRadius: '4px',
                    margin: '2px',
                    padding: '4px 8px',
                    display: 'inline-block',
                    color: 'black',
                  }}
                >
                  {skill.title}
                </Button>
              ))}
            </div>
          ) : (
            'No skills. Edit profile to add skills.'
          )}{' '}
          <br />
        </Typography>
        <Button
          variant="outlined"
          style={{ borderColor: '#470da3', color: '#470da3' }}
          onClick={(e) => setEditSkillsInProgress(() => !editSkillsInProgress)}
        >
          {!isUpdating &&
            (editSkillsInProgress ? (
              <div onClick={() => handleUpdate('Skills')}>Update Skills</div>
            ) : (
              'Edit Skills'
            ))}
          {isUpdating && <>Updating ..</>}
        </Button>
        <br />
        <br />
        {editSkillsInProgress && (
          <Autocomplete
            multiple
            options={skillsOptions}
            getOptionLabel={(option) => option.title}
            value={props.userSkills}
            onChange={(event, newValue) => {
              // props.setUserSkills(newValue); # this does not filter duplicates!
              const uniqueNewValue = newValue.filter(
                (v, i, a) => a.findIndex((t) => t.title === v.title) === i,
              );
              props.setUserSkills(uniqueNewValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Skills"
                placeholder="Select skills"
              />
            )}
          />
        )}
      </Paper>
    </>
  );
};

export default Profile;
