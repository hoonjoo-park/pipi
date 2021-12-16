import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function MyProfile({ userObject }) {
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
      <ProfileBox>
        <ProfileImage
          src={userObject.photoURL && userObject.photoURL}
          alt="profile"
        />
        <ProfileLi>{userObject && userObject.displayName}</ProfileLi>
        <ProfileLi>{userObject && userObject.email}</ProfileLi>
        {userObject.uid === auth.currentUser.uid && (
          <>
            <Logout onClick={handleLogout}>로그아웃</Logout>
            <Edit to={`/editProfile/${userObject.uid}`}>프로필 수정</Edit>
          </>
        )}
      </ProfileBox>
    </ProfileContainer>
  );
}

export default MyProfile;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 75vh;
`;

const ProfileBox = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30vw;
  height: 85%;
  margin: auto;
  padding: 2.5em;
  box-shadow: 0px 2px 5px 1px rgb(0 0 0 / 31%);
  border-radius: 15px;
`;

const ProfileImage = styled.img`
  width: 7rem;
  border-radius: 15px;
  margin-bottom: 3em;
`;
const ProfileLi = styled.li`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;
const Logout = styled.button`
  width: 50%;
  border-radius: 15px;
  height: 2.5rem;
  line-height: 2.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  background-color: #364f6b;
  color: #ffffff;
  margin-bottom: 1.5rem;
`;
const Edit = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  border-radius: 15px;
  height: 2.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  background-color: #6768ab;
  color: #ffffff;
  margin-bottom: 1.5rem;
`;
