import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

function ChatList({ user, chatList }) {
  const [friendObj, setFriendObj] = useState({});
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const getUser = async () => {
    const friendId = chatList.people.filter((el) => el !== user.uid);
    const docRef = collection(db, 'Users');
    const q = query(docRef, where('uid', '==', friendId[0]));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setFriendObj(doc.data());
    });
  };
  const toChatRoom = () => {
    setIsActive((og) => !og);
    navigate(`/chat/${chatList.id}`, { state: { friendObj: friendObj } });
  };
  const handleColor = () => {
    if (params.id === chatList.id) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };
  useEffect(() => {
    handleColor();
    getUser();
  }, []);
  return (
    <Li onClick={toChatRoom} className={isActive ? 'active' : ''}>
      <ProfileImg src={friendObj.photoURL} alt="profile" />
      <MessageBox>
        <span>{friendObj.displayName}</span>
        <p>{chatList.chats[chatList.chats.length - 1].text}</p>
      </MessageBox>
    </Li>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(ChatList);

const Li = styled.li`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
  &.active {
    background: linear-gradient(to right, #6869ab8f 0%, #6768ab 100%);
    color: #ffffff;
  }
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
  & > p {
    width: 95%;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
