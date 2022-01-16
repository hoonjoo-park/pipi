import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';

function FriendLi({ friendId }) {
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    getUserInfo();
  }, []);
  const getUserInfo = async () => {
    const userRef = collection(db, 'Users');
    const q = query(userRef, where('uid', '==', friendId));
    onSnapshot(q, (snapshot) => {
      const result = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setUserInfo(result[0]);
    });
  };
  return (
    <Li>
      <img src={userInfo.photoURL} alt="profile" />
      <span>{userInfo.displayName}</span>
    </Li>
  );
}

export default FriendLi;

const Li = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 10rem;
  height: 10rem;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 3px 8px -3px rgba(0, 0, 0, 0.71);
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
