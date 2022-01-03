import React, { useState, useEffect } from 'react';
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
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import ChatRoom from '../routes/ChatRoom';
import ChatBox from '../routes/ChatBox';
import FriendList from '../routes/FriendList';

function AppRouter({ refreshUser, userObject, isLoading }) {
  const [requests, setRequests] = useState([]);
  const getRequests = () => {
    if (!userObject) {
      return;
    }
    const reqRef = doc(db, 'Requests', userObject.uid);
    onSnapshot(reqRef, (snapshot) => {
      const reqs = snapshot.data();
      if (reqs) {
        setRequests(reqs.requests);
      }
    });
  };
  useEffect(() => {
    getRequests();
  }, []);
  return (
    <Router>
      <Header userObject={userObject} requests={requests} />
      <Routes>
        <>
          {userObject && !isLoading ? (
            <Route
              path={'/'}
              exact
              element={
                <Home refreshUser={refreshUser} userObject={userObject} />
              }
            />
          ) : (
            <Route
              path={'/'}
              exact
              element={
                <Auth refreshUser={refreshUser} userObject={userObject} />
              }
            />
          )}
          <Route
            path={'/myProfile'}
            exact
            element={<MyProfile userObject={userObject} requests={requests} />}
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
              <EditProfile refreshUser={refreshUser} userObject={userObject} />
            }
          />
          <Route path={'/search'} exact element={<Search />} />
          <Route
            path={'/chat'}
            exact
            element={<ChatBox userObject={userObject} />}
          />
          <Route
            path={'/chat/:id'}
            exact
            element={<ChatRoom userObject={userObject} />}
          />
          <Route
            path={'/friends'}
            exact
            element={<FriendList userObject={userObject} />}
          />
        </>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppRouter;
