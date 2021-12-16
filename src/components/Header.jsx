import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PhoneLogo } from '../Image';

function Header({ userObject }) {
  return (
    <Nav>
      <Logo to="/">
        <img src={PhoneLogo} alt="logo" />
        삐삐
      </Logo>
      {userObject && (
        <MenuBox>
          <Link to="/">Home</Link>
          <Link to="/search">검색</Link>
          <ProfileLink to={`/myProfile`}>
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
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-left: 12vw;
  padding: 1em;
  &:hover > img {
    transform: scale(1.1);
  }
  & > img {
    width: 1.7rem;
    margin-right: 1.2rem;
    transform: translateY(-12%) rotate(18deg);
    transition: all 0.2s ease-in-out;
  }
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
