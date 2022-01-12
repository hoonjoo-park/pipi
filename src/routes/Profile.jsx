import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import Loading from '../components/Loading';
import FriendHome from './FriendHome';
import { connect } from 'react-redux';

function Profile({ user }) {
  const [isLoading, setIsLoading] = useState(true);
  const [friendObj, setFriendObj] = useState({});
  const [isFriend, setIsFriend] = useState(false);
  const { id } = useParams();
  const getUser = async () => {
    const docRef = collection(db, 'Users');
    const q = query(docRef, where('uid', '==', id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      checkFriend(doc.data());
      setFriendObj(doc.data());
    });
  };
  const checkFriend = async (friend) => {
    if (user.friends.length > 0) {
      user.friends.includes(friend.uid) && setIsFriend(true);
    }
    setIsLoading(false);
  };
  const updatePending = () => {
    const toUpdate = doc(db, 'Users', `${user.email}`);
    updateDoc(toUpdate, {
      pendingFriends: [friendObj.uid],
    });
    window.alert('요청이 성공적으로 전송되었습니다 😎');
  };
  const createRequest = async () => {
    const docRef = doc(db, 'Requests', friendObj.uid);
    const result = await getDoc(docRef);
    if (result.data()) {
      const req = result.data();
      if (!req.requests.find((el) => el.uid === user.uid)) {
        const toPush = req.requests;
        toPush.push({ email: user.email, uid: user.uid });
        await updateDoc(docRef, {
          requests: toPush,
        });
      }
    } else {
      await setDoc(doc(db, 'Requests', friendObj.uid), {
        requests: [{ email: user.email, uid: user.uid }],
      });
    }
  };
  const handleRequest = (e) => {
    e.preventDefault();
    createRequest();
    if (user.pendingFriends) {
      if (!user.pendingFriends.includes(friendObj.uid)) {
        updatePending();
      } else {
        window.alert('이미 전송된 요청입니다 😓');
      }
    } else {
      updatePending();
    }
  };
  console.log(user, isFriend);
  useEffect(() => {
    getUser();
  }, []);
  return (
    <>
      {isLoading ? (
        <ProfileContainer>
          <Loading />
        </ProfileContainer>
      ) : (
        <>
          {isFriend ? (
            <FriendHome user={user} friendObj={friendObj} />
          ) : (
            <>
              <ProfileContainer>
                <ProfileBox>
                  <ProfileImage src={friendObj.photoURL} alt="profile" />
                  <ProfileLi>{friendObj.displayName}</ProfileLi>
                  <ProfileLi>{friendObj.email}</ProfileLi>
                  <FriendReq onClick={handleRequest}>친구요청</FriendReq>
                </ProfileBox>
              </ProfileContainer>
            </>
          )}
        </>
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Profile);

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
  transition: all 0.2s;
  &:hover {
    background-color: #1fab89;
    color: #ffffff;
  }
`;
