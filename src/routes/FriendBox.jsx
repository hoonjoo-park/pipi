import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import FriendLi from '../components/FriendLi';
function FriendBox({ user }) {
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    setFriends(user.friends);
  }, [user.friends]);
  return (
    <FriendListContainer>
      <FriendFrame>
        <h3>친구 목록</h3>
        <hr />
        <FriendUl>
          {friends.length !== 0 ? (
            friends.map((list, i) => <FriendLi key={i} friendId={list} />)
          ) : (
            <li>등록된 친구가 없습니다</li>
          )}
        </FriendUl>
      </FriendFrame>
    </FriendListContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(FriendBox);
const FriendListContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 83vw;
  min-height: 100vh;
  margin-left: 17vw;
`;
const FriendFrame = styled.div`
  width: 80%;
  height: 85vh;
  padding: 3em;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0px 3px 8px -3px rgba(0, 0, 0, 0.71);
  overflow: scroll;
  & > h3 {
    font-weight: 700;
    font-size: 1.5rem;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    margin-left: 2rem;
    margin-bottom: 1rem;
  }
  & > hr {
    height: 2px;
    border: none;
    background-color: #eaeaea;
    border-radius: 5px;
    margin-bottom: 2rem;
  }
`;
const FriendUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  height: 90%;
`;
