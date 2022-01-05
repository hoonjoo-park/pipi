import React, { useState, useEffect } from 'react';
import AppRouter from './Router';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Loading from './Loading';
import { doc, onSnapshot } from 'firebase/firestore';
import { connect } from 'react-redux';
import { updateUser } from '../redux/authentication/userUpdate';

function App(props) {
  const [userObject, setUserObject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userSnapshot = async (user) => {
    const userRef = doc(db, 'Users', auth.currentUser.email);
    if (!user.displayName) {
      onSnapshot(userRef, async (snapshot) => {
        const newUserObject = {
          displayName: 'User',
          ...snapshot.data(),
        };
        setUserObject(newUserObject);
        props.updateUser(newUserObject);
        return setIsLoading(false);
      });
    }
    onSnapshot(userRef, async (snapshot) => {
      setUserObject(snapshot.data());
      props.updateUser(snapshot.data());
      return setIsLoading(false);
    });
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userSnapshot(user);
      } else {
        setUserObject(null);
        setIsLoading(false);
      }
    });
  }, []);
  const refreshUser = () => {
    userSnapshot(auth.currentUser);
  };
  console.log(props);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <AppRouter
            refreshUser={refreshUser}
            userObject={userObject}
            isLoading={isLoading}
          />
        </>
      )}
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (user) => dispatch(updateUser(user)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
