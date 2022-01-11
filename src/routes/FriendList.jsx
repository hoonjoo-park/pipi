import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import FriendLi from '../components/FriendLi';
function FriendList({ user }) {
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    setFriends(user.friends);
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

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(FriendList);
const FriendListContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  min-height: 90vh;
`;
const FriendUl = styled.ul`
  /* min-width: 30vw; */
  width: 30rem;
  height: 70vh;
  padding: 3em;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0px 3px 8px -3px rgba(0, 0, 0, 0.71);
  overflow: scroll;
  & > h3 {
    font-weight: 700;
    font-size: 1.7rem;
    text-align: center;
    margin: 1rem 0 2rem 0;
  }
`;
