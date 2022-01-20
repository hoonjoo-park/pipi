import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../firebase';

function FriendLi({ friendId }) {
  const [userInfo, setUserInfo] = useState({});
  const getUserInfo = useCallback(async () => {
    const userRef = collection(db, 'Users');
    const q = query(userRef, where('uid', '==', friendId));
    onSnapshot(q, (snapshot) => {
      const result = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setUserInfo(result[0]);
    });
  }, [friendId]);
  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);
  return (
    <Li to={`/profile/${friendId}`}>
      <img src={userInfo.photoURL} alt="profile" />
      <span>{userInfo.displayName}</span>
    </Li>
  );
}

export default FriendLi;

const Li = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 10rem;
  height: 10rem;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 3px 8px -3px rgba(0, 0, 0, 0.71);
  transition: all 0.2s;
  &:hover {
    transform: scale(1.05);
  }
  & > img {
    height: 4rem;
    border-radius: 50%;
    margin: 1.5rem 0;
  }
  & > span {
    width: 80%;
    text-align: center;
    font-size: 1.2rem;
    font-weight: 700;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
`;
