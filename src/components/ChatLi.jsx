import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function ChatLi({ userObject, chatList }) {
  const [friendObj, setFriendObj] = useState({});
  const navigate = useNavigate();
  const getUser = async () => {
    const friendId = chatList.people.filter((el) => el !== userObject.uid);
    const docRef = collection(db, 'Users');
    const q = query(docRef, where('uid', '==', friendId[0]));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setFriendObj(doc.data());
    });
  };
  const toChatRoom = () => {
    navigate(`/chat/${friendObj.uid}`);
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <Li onClick={toChatRoom}>
      <ProfileImg src={friendObj.photoURL} alt="profile" />
      <MessageBox>
        <span>{friendObj.displayName}</span>
        <span>{chatList.chats[chatList.chats.length - 1].text}</span>
      </MessageBox>
    </Li>
  );
}

export default ChatLi;

const Li = styled.li`
  display: flex;
  align-items: center;
`;
const ProfileImg = styled.img`
  margin-right: 2rem;
  border-radius: 50%;
`;
const MessageBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 90%;
  height: 100%;
`;
