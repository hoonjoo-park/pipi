import React, { useState, useEffect } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../firebase';
import styled from 'styled-components';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

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
      owner: userObject,
      text: pipiText,
      createdAt: Date.now(),
    });
    setPipiText('');
  };
  const handleDelete = async (e) => {
    const {
      target: {
        parentNode: { id },
      },
    } = e;
    const ok = window.confirm('삭제하시겠습니까?');
    if (ok) {
      const toDelete = doc(db, 'Pipi', `${id}`);
      await deleteDoc(toDelete);
    }
  };
  useEffect(() => {
    const querySet = query(
      collection(db, 'Pipi'),
      orderBy('createdAt', 'desc')
    );
    onSnapshot(querySet, (snapshot) => {
      const newPipiArray = snapshot.docs.map((doc) => ({
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
          <div onSubmit={handlePipiSubmit}>
            <img src={userObject.photoURL} alt="profile" />
            <form>
              <input
                type="text"
                name="pipiContent"
                id="pipiContent"
                value={pipiText}
                onChange={handlePipiChange}
                placeholder="당신의 삐삐를 날려보세요!"
              />
              <input type="submit" value="송신" />
            </form>
          </div>
          <div>
            <ul>
              {pipiArray &&
                pipiArray.map((pipi) => (
                  <li id={pipi.id} key={pipi.id}>
                    <div>
                      <img src={pipi.owner.photoURL} alt="profile" />
                      <span>{pipi.owner.displayName}</span>
                    </div>
                    <div>
                      <span>{pipi.text}</span>
                    </div>
                    {userObject.uid === pipi.owner.uid && (
                      <span onClick={handleDelete}>삭제</span>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}
    </HomeContainer>
  );
}

export default Home;

const HomeContainer = styled.div`
  width: 100vw;
`;
