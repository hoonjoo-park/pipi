import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PhoneLogo } from '../Image';

function Header({ userObject, requests }) {
  return (
    <Nav>
      <Logo to="/">
        <img src={PhoneLogo} alt="logo" />
        삐삐
      </Logo>
      {userObject && (
        <MenuBox>
          <Link to="/search">검색</Link>
          <Link to="/chat">채팅</Link>
          <Link to="/friends">친구</Link>
          <ProfileLink to={`/myProfile`}>
            {userObject ? (
              <span>
                {userObject.displayName}
                <Alert exist={Boolean(requests.length > 0)}>
                  {requests && requests.length}
                </Alert>
              </span>
            ) : (
              '프로필'
            )}
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
  box-shadow: 0px 3px 8px -3px rgba(0, 0, 0, 0.71);
`;
const ProfileLink = styled(Link)`
  & > span {
    position: relative;
  }
`;
const Alert = styled.span`
  position: absolute;
  display: ${(props) => (props.exist ? 'flex' : 'none')};
  top: -10px;
  right: -15px;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 100%;
  color: #ffffff;
  background-color: #d64f78;
`;
const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-left: 15vw;
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
  justify-content: space-around;
  align-items: center;
  width: 20%;
  height: 100%;
  gap: 1rem;
  margin-left: auto;
  margin-right: 15vw;
  & > * {
    text-align: center;
    padding: 1em;
    width: max-content;
    font-weight: 700;
    font-size: 1.1rem;
  }
`;
