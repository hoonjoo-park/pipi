import React, { useState, useEffect } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../firebase';
import styled from 'styled-components';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Pipi from '../components/Pipi';

function Home({ userObject }) {
  const [isSent, setIsSent] = useState(false);
  const [pipiArray, setPipiArray] = useState([]);
  const handleVerify = () => {
    setIsSent(true);
    sendEmailVerification(auth.currentUser);
  };
  useEffect(() => {
    const querySet = query(
      collection(db, 'Pipi'),
      orderBy('createdAt', 'desc')
    );
    onSnapshot(querySet, async (snapshot) => {
      const newPipiArray = await snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPipiArray(newPipiArray);
    });
  }, []);
  return (
    <HomeContainer>
      {userObject.emailVerify ? (
        <>
          <div>
            <h3>이메일 인증이 필요합니다</h3>
            <button onClick={handleVerify}>인증메일 발송</button>
          </div>
          {isSent && <h3>{userObject.email}으로 메일이 전송되었습니다</h3>}
        </>
      ) : (
        <>
          <ProfileBox>
            <img
              src={userObject.photoURL}
              style={{ borderRadius: '50%' }}
              alt="profile"
            />
            <h3>{userObject.displayName}</h3>
            <hr />
          </ProfileBox>
          <PipiContainer>
            <PipiBox>
              {pipiArray.length > 0 &&
                pipiArray.map((pipi) => (
                  <Pipi key={pipi.id} pipi={pipi} userObject={userObject} />
                ))}
            </PipiBox>
          </PipiContainer>
        </>
      )}
    </HomeContainer>
  );
}

export default Home;

const HomeContainer = styled.div`
  min-height: 90vh;
  height: 100%;
  width: 70vw;
  margin: auto;
  padding: 1em;
`;
const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 2rem;
  & > img {
    width: 5rem;
    margin-bottom: 1rem;
  }
  & > h3 {
    font-size: 1.2rem;
    font-weight: 700;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }
  & > hr {
    width: 100%;
    height: 2px;
    background-color: #eaeaea;
    border: none;
    border-radius: 10px;
  }
`;

const PipiContainer = styled.div`
  width: 100%;
`;
const PipiBox = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
`;
