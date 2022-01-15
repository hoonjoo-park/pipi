import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { connect } from 'react-redux';
import { clearUser } from '../redux/authentication/userUpdate';

function MyProfile({ user, clearUser, requests }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await clearUser();
      signOut(auth);
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const handleAccept = async (e) => {
    e.preventDefault();
    const reqIndex = Number.parseInt(e.target.parentNode.dataset.index);
    const reqUid = e.target.parentNode.dataset.uid;
    let newRequests = requests.filter((el, i) => i !== reqIndex);
    let newPendingFriends = user.pendingFriends.filter(
      (el, i) => i !== reqIndex
    );
    let newFriends = [...user.friends, reqUid];
    const toUpdate = doc(db, 'Users', user.email);
    await updateDoc(toUpdate, {
      friends: newFriends,
      pendingFriends: newPendingFriends,
    });
    const toDelete = doc(db, 'Requests', user.uid);
    await updateDoc(toDelete, {
      requests: newRequests,
    });
    window.alert('친구요청이 수락되었습니다');
    await setDoc(doc(db, 'Accepted', reqUid), {
      accepts: [user.uid],
    });
  };
  const handleReject = (e) => {
    e.preventDefault();
  };
  return (
    <ProfileContainer>
      <ProfileBox>
        <ProfileImage src={user.photoURL && user.photoURL} alt="profile" />
        <ProfileLi>{user && user.displayName}</ProfileLi>
        <ProfileLi>{user && user.email}</ProfileLi>
        {user.uid === auth.currentUser.uid && (
          <>
            <Logout onClick={handleLogout}>로그아웃</Logout>
            <Edit to={`/editProfile/${user.uid}`}>프로필 수정</Edit>
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

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    clearUser: () => dispatch(clearUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 83vw;
  height: 100vh;
  margin: auto;
  margin-left: 17vw;
`;

const ProfileBox = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  max-height: 500px;
  width: 30vw;
  height: 80%;
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
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2.5rem;
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
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-left: 5%;
`;
const AlertBox = styled.ul`
  display: flex;
  flex-direction: column;
  max-height: 500px;
  height: 80%;
  width: 20vw;
  overflow: scroll;
  padding: 2em 1.5em;
  box-shadow: 0px 2px 5px 1px rgb(0 0 0 / 31%);
  border-radius: 15px;
  & > h3 {
    font-size: 1.5rem;
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
  font-size: 1.3rem;
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
