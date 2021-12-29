import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FriendLi from '../components/FriendLi';
function FriendList({ userObject }) {
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    setFriends(userObject.friends);
  }, []);
  return (
    <FriendListContainer>
      <FriendUl>
        <h3>친구목록</h3>
        {friends.map((list, i) => (
          <FriendLi key={i} friendId={list} />
        ))}
      </FriendUl>
    </FriendListContainer>
  );
}

export default FriendList;
const FriendListContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  min-height: 90vh;
`;
const FriendUl = styled.ul`
  /* min-width: 30vw; */
  width: 20rem;
  height: 70vh;
  padding: 1em;
  border-radius: 15px;
  background-color: #eaeaea;
  box-shadow: 0px 3px 8px -3px rgba(0, 0, 0, 0.71);
  & > h3 {
    font-weight: 700;
    font-size: 1.3rem;
    text-align: center;
    margin: 1rem 0;
  }
`;
