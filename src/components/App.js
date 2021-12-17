import React, { useState, useEffect } from 'react';
import AppRouter from './Router';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Loading from './Loading';

function App() {
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
      meta: user.metadata.creationTime,
      provider: user.providerData[0].providerId,
      emailVerified: user.emailVerified,
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
