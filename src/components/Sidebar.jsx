import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { BsChatSquareFill } from 'react-icons/bs';
import { FaUserFriends, FaHome, FaSearch, FaUser } from 'react-icons/fa';
import styled from 'styled-components';
import { MainLogo } from '../Image';

function Sidebar({ user }) {
  return (
    <SidebarContainer>
      <Logo to="/">
        <img src={MainLogo} alt="logo" />
      </Logo>
      <ProfileBox>
        <img
          src={user.photoURL}
          style={{ borderRadius: '50%' }}
          alt="profile"
        />
        <h3>{user.displayName}</h3>
      </ProfileBox>
      <MenuList>
        <li>
          <FaHome />
          <Link to="/">삐삐 메인</Link>
        </li>
        <li>
          <FaUserFriends />
          <Link to="/friends">친구 목록</Link>
        </li>
        <li>
          <BsChatSquareFill />
          <Link to="/chat">채팅</Link>
        </li>
        <li>
          <FaSearch />
          <Link to="/search">검색</Link>
        </li>
        <li>
          <FaUser />
          <Link to={`/myProfile`}>프로필</Link>
        </li>
      </MenuList>
    </SidebarContainer>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps)(Sidebar);

const SidebarContainer = styled.div`
  position: fixed;
  z-index: 1;
  display: flex;
  flex-direction: column;
  max-width: 20rem;
  width: 17vw;
  height: 100vh;
  background-color: #6768ab;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  padding: 0.5em;
  margin: 2rem auto;
  & > img {
    width: 6rem;
  }
`;

const ProfileBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
  & > img {
    width: 5rem;
    margin-bottom: 1rem;
  }
  & > h3 {
    color: #ffffff;
    font-size: 1.2rem;
  }
`;

const MenuList = styled.ul`
  display: flex;
  flex-direction: column;
  & > li {
    position: relative;
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #ababab;
    width: 100%;
    height: 4rem;
    border-radius: 3px;
    transition: all 0.2s ease-in-out;
  }
  & li:hover {
    color: #ffffff;
  }
  & li::before {
    content: '';
    opacity: 0;
    position: absolute;
    left: 0;
    width: 5px;
    height: 0;
    background-color: #ffffff;
    border-radius: 5px;
    transition: all 0.2s ease-in-out;
  }
  & li:hover::before {
    content: '';
    opacity: 1;
    position: absolute;
    left: 0;
    width: 5px;
    height: 70%;
    background-color: #ffffff;
    border-radius: 5px;
  }
  & a {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  & svg {
    width: 4rem;
    margin: 0 2rem;
  }
`;
