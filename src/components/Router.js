import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Footer from './Footer';
import Header from './Header';
import Profile from '../routes/Profile';
import EditProfile from '../routes/EditProfile';

function AppRouter({ isLoggedIn, setIsLoggedIn, refreshUser, userObject }) {
  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} userObject={userObject} />
      <Routes>
        <>
          {userObject ? (
            <>
              <Route
                path={'/'}
                exact
                element={
                  <Home refreshUser={refreshUser} userObject={userObject} />
                }
              />
              <Route
                path={'/profile'}
                exact
                element={<Profile userObject={userObject} />}
              />
              <Route
                path={'/editProfile'}
                exact
                element={
                  <EditProfile
                    refreshUser={refreshUser}
                    userObject={userObject}
                  />
                }
              />
            </>
          ) : (
            <Route
              path={'/'}
              exact
              element={
                <Auth
                  refreshUser={refreshUser}
                  userObject={userObject}
                  setIsLoggedIn={setIsLoggedIn}
                />
              }
            />
          )}
        </>
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppRouter;
