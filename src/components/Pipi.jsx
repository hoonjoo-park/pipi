import React, { useState } from 'react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import styled from 'styled-components';

function Pipi({ pipi, userObject }) {
  const [newPipi, setNewPipi] = useState(pipi.text);
  const [isEdit, setIsEdit] = useState(false);
  const handleChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewPipi(value);
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    const ok = window.confirm('삭제하시겠습니까?');
    if (ok) {
      const toDelete = doc(db, 'Pipi', `${pipi.id}`);
      await deleteDoc(toDelete);
    }
  };
  const toggleUpdate = () => {
    setIsEdit((prev) => !prev);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const toUpdate = doc(db, 'Pipi', `${pipi.id}`);
    await updateDoc(toUpdate, {
      text: newPipi,
    });
    setIsEdit((prev) => !prev);
  };
  return (
    <PipiItem id={pipi.id}>
      {isEdit ? (
        <>
          <form onSubmit={handleUpdate}>
            <ProfileBox>
              <PipiProfile src={pipi.owner.photoURL} alt="profile" />
              <span>{pipi.owner.displayName}</span>
            </ProfileBox>
            <TextBox>
              <input type="text" value={newPipi} onChange={handleChange} />
            </TextBox>
            <input type="submit" value="수정" />
          </form>
          <button onClick={toggleUpdate}>취소</button>
        </>
      ) : (
        <>
          <ProfileBox>
            <PipiProfile src={pipi.owner.photoURL} alt="profile" />
            <span>{pipi.owner.displayName}</span>
          </ProfileBox>
          <TextBox>
            <span>{pipi.text}</span>
          </TextBox>
          {userObject.uid === pipi.owner.uid && (
            <EditBox id="editBox">
              <span onClick={handleDelete}>삭제</span>
              <span onClick={toggleUpdate}>수정</span>
            </EditBox>
          )}
        </>
      )}
    </PipiItem>
  );
}

export default Pipi;

const PipiItem = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  &:hover #editBox {
    /* display: flex; */
    opacity: 1;
  }
`;

const ProfileBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 15%;
`;
const PipiProfile = styled.img`
  height: 5rem;
  width: 5rem;
  border-radius: 15px;
  margin-bottom: 10%;
`;
const TextBox = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 5%;
  & > span {
    width: 100%;
  }
`;
const EditBox = styled.div`
  position: absolute;
  opacity: 0;
  display: flex;
  justify-content: space-evenly;
  width: 12%;
  right: 3%;
  top: 10%;
  transition: all 0.2s ease-in;
`;
