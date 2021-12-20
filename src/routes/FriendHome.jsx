import { addDoc, collection, doc } from 'firebase/firestore';
import React, { useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
function FriendHome({ userObject }) {
  const [pipiText, setPipiText] = useState('');
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
      createdAt: Date.now(),
    });
    setPipiText('');
  };
  return (
    <div>
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
    </div>
  );
}

export default FriendHome;
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
