import React, { useState, useEffect } from 'react';
import AppRouter from './Router';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Loading from './Loading';
import { collection, getDocs, query, where } from 'firebase/firestore';

function App() {
  const [userObject, setUserObject] = useState(null);
  const [userCollection, setUserCollection] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const getUser = async () => {
    const docRef = collection(db, 'Users');
    const q = query(docRef, where('uid', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUserCollection(doc.data());
    });
  };
  useEffect(() => {
    getUser();
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
            friends: userCollection.friends,
            pendingFriends: userCollection.pendingFriends,
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
            friends: userCollection.friends,
            pendingFriends: userCollection.pendingFriends,
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
