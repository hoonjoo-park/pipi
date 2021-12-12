import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

function Header({ userObject }) {
  return (
    <Nav>
      <Logo to="/">삐삐</Logo>
      {userObject && (
        <MenuBox>
          <Link to="/">Home</Link>
          <Link to="/search">검색</Link>
          <ProfileLink to={`/profile/${userObject.uid}`}>
            {userObject ? `${userObject.displayName}` : '프로필'}
          </ProfileLink>
        </MenuBox>
      )}
    </Nav>
  );
}

export default Header;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  width: 100vw;
  height: 10vh;
`;
const ProfileLink = styled(Link)``;
const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  margin-left: 12vw;
  padding: 1em;
`;
const MenuBox = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 40%;
  height: 100%;
  gap: 1rem;
  margin-left: auto;
  margin-right: 12vw;
  & > * {
    text-align: center;
    padding: 1em;
    width: 15%;
    font-weight: 700;
    font-size: 1.1rem;
  }
`;
