import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import Loading from '../components/Loading';

function Profile() {
  const [friendObj, setFriendObj] = useState({});
  const { id } = useParams();
  const getUser = async () => {
    const docRef = collection(db, 'Users');
    const q = query(docRef, where('uid', '==', id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setFriendObj(doc.data());
    });
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <>
      {!friendObj ? (
        <Loading />
      ) : (
        <>
          <ProfileContainer>
            <ProfileBox>
              <ProfileImage src={friendObj.photoURL} alt="profile" />
              <ProfileLi>{friendObj.displayName}</ProfileLi>
              <ProfileLi>{friendObj.email}</ProfileLi>
              <FriendReq>친구요청</FriendReq>
            </ProfileBox>
          </ProfileContainer>
        </>
      )}
    </>
  );
}

export default Profile;

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
const FriendReq = styled.button`
  width: 50%;
  height: 2.5rem;
  line-height: 2.5rem;
  border-radius: 15px;
  border: 1px solid #1fab89;
  color: #1fab89;
`;
