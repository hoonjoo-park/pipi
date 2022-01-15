import React, { useState, useEffect } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Profile from '../routes/Profile';
import EditProfile from '../routes/EditProfile';
import Search from '../routes/Search';
import MyProfile from '../routes/MyProfile';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import ChatRoom from '../routes/ChatRoom';
import ChatBox from '../routes/ChatBox';
import FriendBox from '../routes/FriendBox';
import { connect } from 'react-redux';
import Loading from './Loading';
import Sidebar from './Sidebar';

function AppRouter({ isLoading, user }) {
  const [requests, setRequests] = useState([]);
  const getRequests = () => {
    if (!user) {
      return;
    }
    const reqRef = doc(db, 'Requests', user.uid);
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
  console.log(user);
  return (
    <Router>
      {user && <Sidebar />}
      <Routes>
        <>
          {user && !isLoading ? (
            <Route path={'/'} exact element={<Home />} />
          ) : (
            <Route path={'/'} exact element={<Auth />} />
          )}
          <Route
            path={'/myProfile'}
            exact
            element={<MyProfile requests={requests} />}
          />
          <Route path={'/profile/:id'} exact element={<Profile />} />
          <Route path={'/editProfile/:id'} exact element={<EditProfile />} />
          <Route path={'/search'} exact element={<Search />} />
          <Route path={'/chat'} exact element={<ChatBox />} />
          <Route path={'/chat/:id'} exact element={<ChatRoom />} />
          <Route path={'/friends'} exact element={<FriendBox />} />
        </>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(AppRouter);
