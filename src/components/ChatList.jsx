import React from 'react';
import styled from 'styled-components';

function ChatList({ chatRooms }) {
  console.log(chatRooms);
  return (
    <ListBox>
      <ListUl>
        <li>First Chat</li>
      </ListUl>
    </ListBox>
  );
}

export default ChatList;

const ListBox = styled.div`
  border-radius: 15px;
  padding: 2em;
  height: 85%;
  width: 25%;
  margin-right: 1rem;
  background-color: #1a374d;
`;
const ListUl = styled.ul`
  width: 100%;
  height: 100%;
  & > li {
    display: flex;
    align-items: center;
    padding: 0 1em;
    height: 3rem;
    background-color: #ffffff;
    border-radius: 3px;
  }
`;
