import React, { useState, useEffect } from 'react';
import AppRouter from './Router';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Loading from './Loading';
import { doc, onSnapshot } from 'firebase/firestore';
import { connect } from 'react-redux';
import { updateUser, clearUser } from '../redux/authentication/userUpdate';
import MainView from './MainView';

function App({ user, updateUser }) {
  const [isLoading, setIsLoading] = useState(true);
  const userSnapshot = async (user) => {
    const userRef = doc(db, 'Users', auth.currentUser.email);
    if (!user.displayName) {
      onSnapshot(userRef, async (snapshot) => {
        const newUserObject = {
          displayName: 'User',
          ...snapshot.data(),
        };
        await updateUser(newUserObject);
        return setIsLoading(false);
      });
    }
    onSnapshot(userRef, async (snapshot) => {
      await updateUser(snapshot.data());
      return setIsLoading(false);
    });
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoading(true);
        userSnapshot(user);
      } else {
        setIsLoading(true);
        setIsLoading(false);
      }
    });
  }, []);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <AppRouter isLoading={isLoading} />
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
    clearUser: () => dispatch(clearUser()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
