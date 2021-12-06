import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

function Profile({ userObject }) {
  return (
    <ProfileContainer>
      <ul>
        <li>{userObject && userObject.displayName}</li>
        <li>{userObject && userObject.email}</li>
        <Link to="/editProfile">프로필 수정</Link>
      </ul>
    </ProfileContainer>
  );
}

export default Profile;

const ProfileContainer = styled.div`
  width: 100vw;
`;
