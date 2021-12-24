import React, { useState, useEffect } from 'react';
import AppRouter from './Router';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Loading from './Loading';
import { doc, onSnapshot } from 'firebase/firestore';

function App() {
  const [userObject, setUserObject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userSnapshot = (noName) => {
    const userRef = doc(db, 'Users', auth.currentUser.email);
    if (noName) {
      onSnapshot(userRef, async (snapshot) => {
        const updated = snapshot.data();
        const newUserObject = {
          displayName: 'User',
          ...updated,
          ...userObject,
        };
        setUserObject(newUserObject);
      });
    } else {
      onSnapshot(userRef, async (snapshot) => {
        const updated = snapshot.data();
        const newUserObject = { ...updated, ...userObject };
        setUserObject(newUserObject);
      });
    }
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName) {
          userSnapshot();
        } else {
          userSnapshot(true);
        }
      } else {
        setUserObject(null);
      }
      setIsLoading(false);
    });
  }, []);
  const refreshUser = () => {
    const user = auth.currentUser;
    setUserObject({
      displayName: user.displayName,
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      ...userObject,
    });
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <AppRouter refreshUser={refreshUser} userObject={userObject} />
        </>
      )}
    </>
  );
}

export default App;
