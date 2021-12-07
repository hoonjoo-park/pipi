import React, { useState, useEffect } from 'react';
import AppRouter from './Router';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
  const [userObject, setUserObject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName) {
          setUserObject({
            displayName: user.displayName,
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: user.metadata.creationTime,
            provider: user.providerData[0].providerId,
            emailVerified: user.emailVerified,
          });
          setIsLoggedIn(true);
        } else {
          setUserObject({
            displayName: 'User',
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: user.metadata.creationTime,
            provider: user.providerData[0].providerId,
            emailVerified: user.emailVerified,
          });
        }
      } else {
        setUserObject(null);
        setIsLoggedIn(false);
      }
    });
    setIsLoading(false);
  }, []);
  const refreshUser = () => {
    const user = auth.currentUser;
    setUserObject({
      displayName: user.displayName,
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      meta: user.metadata.creationTime,
      provider: user.providerData[0].providerId,
      emailVerified: user.emailVerified,
    });
  };

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
            setIsLoggedIn={setIsLoggedIn}
          />
        </>
      )}
    </>
  );
}

export default App;
