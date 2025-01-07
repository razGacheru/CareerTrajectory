/* eslint no-warning-comments: "error" */
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from './Components/Dashboard/DashboardPage';
import CareerPathsPage from './Components/CareerPath/CareerPaths';
import CareerPlan from './Components/CareerPlan/CareerPlan';
import LoginSignUp from './Components/LoginSignup/LoginSignup';
import VerifyCode from './Components/ResetPassword/VerifyCode';
import ResetPassword from './Components/ResetPassword/ResetPassword';

function PageList() {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  React.useEffect(() => {
    const checktoken = localStorage.getItem('token');
    const checkId = localStorage.getItem('id');
    if (checktoken) {
      setToken(checktoken);
    }
    if (checkId) {
      setUserId(checkId);
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <DashboardPage
              token={token}
              setToken={setToken}
              userId={userId}
              setUserId={setUserId}
              setUserPassword={setUserPassword}
            />
          }
        />
        <Route
          path="/CareerPaths"
          element={
            <CareerPathsPage
              token={token}
              setToken={setToken}
              userId={userId}
              setUserId={setUserId}
              userPassword={userPassword}
            />
          }
        />
        <Route
          path="/CareerPlan"
          element={
            <CareerPlan
              token={token}
              setToken={setToken}
              userId={userId}
              setUserId={setUserId}
              userPassword={userPassword}
            />
          }
        />
        <Route
          path="/loginSignUp"
          element={
            <LoginSignUp
              token={token}
              setToken={setToken}
              userId={userId}
              setUserId={setUserId}
              usePassword={userPassword}
              setUserPassword={setUserPassword}
            />
          }
        />
        <Route
          path="/verifyCode"
          element={
            <VerifyCode
              token={token}
              setToken={setToken}
              userId={userId}
              setUserId={setUserId}
              setUserEmail={setUserEmail}
            />
          }
        />
        <Route
          path="/resetPassword"
          element={
            <ResetPassword
              token={token}
              setToken={setToken}
              userId={userId}
              setUserId={setUserId}
              userEmail={userEmail}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default PageList;
