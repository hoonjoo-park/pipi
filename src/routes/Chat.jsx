import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import ChatList from '../components/ChatList';
import { connect } from 'react-redux';

function Chat({ user }) {
  const [chatList, setChatList] = useState([]);
  const getChatList = useCallback(async () => {
    const chatRef = collection(db, 'Chats');
    const q = query(chatRef, where('people', 'array-contains-any', [user.uid]));
    onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatList(chats);
    });
  }, [user.uid]);
  useEffect(() => {
    getChatList();
  }, [getChatList]);
  return (
    <ListBox>
      <ListUl>
        <h3>채팅 목록</h3>
        {chatList.length !== 0 ? (
          chatList.map((list, i) => <ChatList key={i} chatList={list} />)
        ) : (
          <Empty>채팅방이 비어있습니다</Empty>
        )}
      </ListUl>
    </ListBox>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Chat);
const ListBox = styled.div`
  position: absolute;
  left: 17vw;
  padding: 2em 0;
  min-height: 100vh;
  width: 25%;
  background-color: #ffffff;
  box-shadow: 0px 3px 8px -3px rgba(0, 0, 0, 0.71);
`;
const ListUl = styled.ul`
  width: 100%;
  height: 100%;
  & > h3 {
    font-weight: 700;
    font-size: 1.5rem;
    margin: 1rem 0 3rem 0;
    padding: 0 1em;
  }
  & li {
    display: flex;
    align-items: center;
    padding: 1em 2em;
    height: 6rem;
    background-color: #ffffff;
    color: #444444;
    border-bottom: 1px solid #eaeaea;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    &:hover {
      background-color: #eaeaea;
    }
  }
  & li:nth-child(2) {
    border-top: 1px solid #eaeaea;
  }
`;

const Empty = styled.li`
  border: none;
  text-align: center;
  font-size: 1.4rem;
  margin-top: 5rem;
`;
