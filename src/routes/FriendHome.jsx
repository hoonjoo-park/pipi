import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../firebase';
import Pipi from '../components/Pipi';
import { connect } from 'react-redux';

function FriendHome({ user, friendObj }) {
  const [pipiText, setPipiText] = useState('');
  const [pipiArray, setPipiArray] = useState([]);
  const param = useParams();
  const pipiSnapshot = () => {
    const querySet = query(
      collection(db, 'Pipi'),
      where('to', 'array-contains', param.id)
    );
    onSnapshot(querySet, async (snapshot) => {
      const newPipiArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPipiArray(newPipiArray);
    });
  };
  useEffect(() => {
    pipiSnapshot();
  }, []);
  const handlePipiChange = (e) => {
    const {
      target: { value },
    } = e;
    setPipiText(value);
  };
  const handlePipiSubmit = (e) => {
    e.preventDefault();
    addDoc(collection(db, 'Pipi'), {
      owner: doc(db, 'Users', `${user.email}`),
      text: pipiText,
      to: [param.id],
      createdAt: Date.now(),
    });
    setPipiText('');
  };
  return (
    <FriendHomeContainer>
      <TopBox>
        <ProfileBox>
          <img
            src={friendObj.photoURL}
            style={{ borderRadius: '50%' }}
            alt="profile"
          />
          <h3>{friendObj.displayName}</h3>
        </ProfileBox>
        <FormContainer onSubmit={handlePipiSubmit}>
          <img src={user.photoURL} alt="profile" />
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
      </TopBox>
      <HR />

      <PipiContainer>
        <PipiBox>
          {pipiArray.length > 0 &&
            pipiArray.map((pipi) => <Pipi key={pipi.id} pipi={pipi} />)}
        </PipiBox>
      </PipiContainer>
    </FriendHomeContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(FriendHome);
const FriendHomeContainer = styled.div`
  min-height: 90vh;
  height: 100%;
  width: 70vw;
  margin: auto;
  padding: 1em;
`;
const TopBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 2rem;
  height: 14rem;
`;
const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 25%;
  height: 10rem;
  & > img {
    width: 5rem;
    margin-bottom: 1rem;
  }
  & > h3 {
    font-size: 1.2rem;
    font-weight: 700;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
`;
const HR = styled.hr`
  width: 100%;
  height: 2px;
  background-color: #eaeaea;
  border: none;
  border-radius: 10px;
`;
const FormContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 50%;
  height: 10rem;
  margin-left: auto;
  margin-right: 5rem;
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
  margin-top: 3rem;
`;
const PipiBox = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
`;
