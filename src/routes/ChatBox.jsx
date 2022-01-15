import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import ChatList from '../components/ChatList';
import { connect } from 'react-redux';

function ChatBox({ chatRooms, user }) {
  const [chatList, setChatList] = useState([]);
  const getChatList = async () => {
    const chatRef = collection(db, 'Chats');
    const q = query(chatRef, where('people', 'array-contains-any', [user.uid]));
    onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatList(chats);
    });
  };
  useEffect(() => {
    getChatList();
  }, []);
  console.log(chatList);
  return (
    <ListContainer>
      <ListBox>
        <ListUl>
          <h3>채팅 목록</h3>
          {chatList.length !== 0 ? (
            chatList.map((list, i) => <ChatList key={i} chatList={list} />)
          ) : (
            <li>채팅방이 비어있습니다</li>
          )}
        </ListUl>
      </ListBox>
    </ListContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(ChatBox);
const ListContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  min-height: 100vh;
`;
const ListBox = styled.div`
  border-radius: 15px;
  padding: 2em;
  min-height: 85vh;
  width: 35%;
  margin-left: 17vw;
  background-color: #ffffff;
  box-shadow: 0px 3px 8px -3px rgba(0, 0, 0, 0.71);
`;
const ListUl = styled.ul`
  width: 100%;
  height: 100%;
  & > h3 {
    font-weight: 700;
    font-size: 1.7rem;
    text-align: center;
    margin: 1rem 0 2rem 0;
  }
  & li {
    display: flex;
    align-items: center;
    padding: 0 1em;
    height: 4rem;
    color: #6768ab;
    box-shadow: 0px 3px 8px -3px rgba(0, 0, 0, 0.71);
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: #eaeaea;
    }
  }
`;
