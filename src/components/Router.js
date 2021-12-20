import React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Footer from './Footer';
import Header from './Header';
import Profile from '../routes/Profile';
import EditProfile from '../routes/EditProfile';
import Search from '../routes/Search';
import MyProfile from '../routes/MyProfile';

function AppRouter({ refreshUser, userObject }) {
  return (
    <Router>
      <Header userObject={userObject} />
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
                path={'/myProfile'}
                exact
                element={<MyProfile userObject={userObject} />}
              />
              <Route
                path={'/profile/:id'}
                exact
                element={<Profile userObject={userObject} />}
              />
              <Route
                path={'/editProfile/:id'}
                exact
                element={
                  <EditProfile
                    refreshUser={refreshUser}
                    userObject={userObject}
                  />
                }
              />
              <Route path={'/search'} exact element={<Search />} />
            </>
          ) : (
            <Route
              path={'/'}
              exact
              element={
                <Auth refreshUser={refreshUser} userObject={userObject} />
              }
            />
          )}
        </>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppRouter;
