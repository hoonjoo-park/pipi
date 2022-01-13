import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

function Sidebar({ user }) {
  return (
    <SidebarContainer>
      <ProfileBox>
        <img
          src={user.photoURL}
          style={{ borderRadius: '50%' }}
          alt="profile"
        />
        <h3>{user.displayName}</h3>
      </ProfileBox>
      <MenuList>
        <li>삐삐 메인</li>
        <li>친구목록</li>
        <li>채팅</li>
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
  width: 18vw;
  height: 100vh;
  background-color: #6768ab;
  padding: 4em 1em;
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
  & > * {
    font-size: 1.5rem;
    padding: 1em;
    color: #ffffff;
    width: 100%;
  }
`;
