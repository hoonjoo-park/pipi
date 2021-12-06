import React, { useState, useEffect } from 'react';
import AppRouter from './Router';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
  const [userObject, setUserObject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObject({
          displayName: user.displayName,
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL,
          meta: user.metadata,
        });
      } else {
        setUserObject(null);
        setIsLoggedIn(false);
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
      meta: user.metadata,
    });
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserObject(null);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(userObject);
  console.log(auth.currentUser);
  return (
    <>
      {isLoading ? (
        'Loading...'
      ) : (
        <>
          <AppRouter
            isLoggedIn={isLoggedIn}
            refreshUser={refreshUser}
            userObject={userObject}
            handleLogout={handleLogout}
          />
        </>
      )}
    </>
  );
}

export default App;
