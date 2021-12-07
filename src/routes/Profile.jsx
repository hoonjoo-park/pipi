import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Profile({ userObject }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      signOut(auth);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ProfileContainer>
      <ul>
        <img src={userObject.photoURL && userObject.photoURL} alt="profile" />
        <li>{userObject && userObject.displayName}</li>
        <li>{userObject && userObject.email}</li>
        <button onClick={handleLogout}>로그아웃</button>
        <Link to="/editProfile">프로필 수정</Link>
      </ul>
    </ProfileContainer>
  );
}

export default Profile;

const ProfileContainer = styled.div`
  width: 100vw;
`;
