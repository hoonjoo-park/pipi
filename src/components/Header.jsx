import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

function Header({ isLoggedIn, handleLogout, userObject }) {
  return (
    <div>
      <Logo to="/">삐삐</Logo>
      {isLoggedIn && (
        <>
          <ProfileLink to="/profile">
            {userObject ? `${userObject.displayName}님의 프로필` : '프로필'}
          </ProfileLink>
        </>
      )}
    </div>
  );
}

export default Header;

const ProfileLink = styled(Link)``;
const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
`;
