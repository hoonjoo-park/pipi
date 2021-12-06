import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

function Header({ isLoggedIn, handleLogout, userObject }) {
  return (
    <div>
      <h3>삐삐</h3>
      {isLoggedIn && (
        <>
          <ProfileLink to="/profile">
            {userObject ? `${userObject.displayName}님의 프로필` : '프로필'}
          </ProfileLink>
          <button onClick={handleLogout}>로그아웃</button>
        </>
      )}
    </div>
  );
}

export default Header;

const ProfileLink = styled(Link)``;
