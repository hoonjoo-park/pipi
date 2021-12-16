import React, { useState, useEffect } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../firebase';
import styled from 'styled-components';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import Pipi from '../components/Pipi';

function Home({ userObject }) {
  const [isSent, setIsSent] = useState(false);
  const [pipiText, setPipiText] = useState('');
  const [pipiArray, setPipiArray] = useState([]);
  const handleVerify = () => {
    setIsSent(true);
    sendEmailVerification(auth.currentUser);
  };
  const handlePipiChange = (e) => {
    const {
      target: { value },
    } = e;
    setPipiText(value);
  };
  const handlePipiSubmit = (e) => {
    e.preventDefault();
    addDoc(collection(db, 'Pipi'), {
      owner: doc(db, 'Users', `${userObject.email}`),
      text: pipiText,
      createdAt: new Date(Date.now()),
    });
    setPipiText('');
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
          <FormContainer onSubmit={handlePipiSubmit}>
            <img src={userObject.photoURL} alt="profile" />
            <form>
              <FormText
                type="text"
                name="pipiContent"
                id="pipiContent"
                value={pipiText}
                onChange={handlePipiChange}
                placeholder="당신의 삐삐를 날려보세요!"
                autoComplete="off"
              />
              <SendBtn type="submit" value="송신" />
            </form>
          </FormContainer>
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
  width: 76vw;
  margin: auto;
  padding: 1em;
`;
const FormContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 50%;
  height: 10rem;
  margin: 5rem auto;
  border: 1px solid #eaeaea;
  border-radius: 20px;
  & > form {
    display: flex;
    align-items: center;
    flex-basis: 80%;
  }
  & > img {
    display: block;
    height: 5rem;
    width: 5rem;
    border-radius: 15px;
  }
`;
const FormText = styled.input`
  height: 100%;
  width: 80%;
  resize: none;
`;
const SendBtn = styled.input`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #ffffff;
  width: 5rem;
  background-color: #6768ab;
  border-radius: 10px;
  padding: 0.8em;
  cursor: pointer;
`;
const PipiContainer = styled.div`
  width: 100%;
`;
const PipiBox = styled.div`
  width: 100%;
`;
