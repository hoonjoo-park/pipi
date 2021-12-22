import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

function MyProfile({ userObject, requests }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      signOut(auth);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };
  const handleAccept = async (e) => {
    e.preventDefault();
    const reqIndex = Number.parseInt(e.target.parentNode.dataset.index);
    const reqUid = e.target.parentNode.dataset.uid;
    let newRequests = requests.filter((el, i) => i !== reqIndex);
    let newPendingFriends = userObject.pendingFriends.filter(
      (el, i) => i !== reqIndex
    );
    let newFriends = [...userObject.friends, reqUid];
    const toUpdate = doc(db, 'Users', userObject.email);
    await updateDoc(toUpdate, {
      friends: newFriends,
      pendingFriends: newPendingFriends,
    });
    const toDelete = doc(db, 'Requests', userObject.uid);
    await updateDoc(toDelete, {
      requests: newRequests,
    });
    window.alert('친구요청이 수락되었습니다');
    await setDoc(doc(db, 'Accepted', reqUid), {
      accepts: [userObject.uid],
    });
  };
  const handleReject = (e) => {
    e.preventDefault();
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
      <AlertContainer>
        <AlertBox>
          <h3>친구요청</h3>
          {requests.length > 0 ? (
            requests.map((req, i) => (
              <li key={i}>
                {req.email}
                <AcceptDenyBox>
                  <AiFillCheckCircle
                    data-index={i}
                    data-uid={req.uid}
                    onClick={handleAccept}
                    style={{ color: '#1fab89', fontSize: '1.4rem' }}
                  />
                  <AiFillCloseCircle
                    data-index={i}
                    data-uid={req.uid}
                    onClick={handleReject}
                    style={{ color: '#d64f78', fontSize: '1.4rem' }}
                  />
                </AcceptDenyBox>
              </li>
            ))
          ) : (
            <NoAlert>받은 요청이 없습니다</NoAlert>
          )}
        </AlertBox>
      </AlertContainer>
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
const AlertContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  margin-left: 5%;
`;
const AlertBox = styled.ul`
  display: flex;
  flex-direction: column;
  width: 22vw;
  min-height: 30vh;
  max-height: 40%;
  overflow: scroll;
  padding: 2em 1.5em;
  box-shadow: 0px 2px 5px 1px rgb(0 0 0 / 31%);
  border-radius: 15px;
  margin-top: 15.5%;
  margin-left: 10%;
  & > h3 {
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 1.5rem;
  }
  & li {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 2.5rem;
    padding: 1em;
    border-radius: 5px;
    margin-bottom: 0.5rem;
    background-color: #6768ab;
    color: #ffffff;
    cursor: default;
    &:hover > span {
      opacity: 1;
    }
  }
`;
const NoAlert = styled.h4`
  margin-top: 20%;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  color: #6768ab;
`;
const AcceptDenyBox = styled.span`
  position: absolute;
  display: flex;
  opacity: 0;
  justify-content: space-evenly;
  right: 1%;
  width: 25%;
  transform: translateY(-6%);
  transition: 0.15s ease-in-out;
  & > svg {
    cursor: pointer;
  }
`;
