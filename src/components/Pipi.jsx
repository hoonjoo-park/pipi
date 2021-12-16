import React, { useEffect, useState } from 'react';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import styled from 'styled-components';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { MdOutlineCancel } from 'react-icons/md';

function Pipi({ pipi, userObject }) {
  const [newPipi, setNewPipi] = useState(pipi.text);
  const [isEdit, setIsEdit] = useState(false);
  const [owner, setOwner] = useState({});
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
  useEffect(() => {
    const converter = async () => {
      let convert = await getDoc(pipi.owner);
      setOwner(convert.data());
    };
    converter();
  }, []);
  return (
    <PipiItem id={pipi.id}>
      <ProfileBox to={`/profile/${owner.uid}`}>
        <PipiProfile src={owner.photoURL} alt="profile" />
        <span>{owner.displayName}</span>
      </ProfileBox>
      {isEdit ? (
        <>
          <EditForm onSubmit={handleUpdate}>
            <TextBox>
              <EditInput type="text" value={newPipi} onChange={handleChange} />
            </TextBox>
            <EditSubmit type="submit" value="수정" />
          </EditForm>
          <EditCancelBtn onClick={toggleUpdate}>
            <MdOutlineCancel />
          </EditCancelBtn>
        </>
      ) : (
        <TextBox>
          <span>{pipi.text}</span>
        </TextBox>
      )}
      {userObject.uid === owner.uid && !isEdit && (
        <EditBox id="editBox">
          <span onClick={toggleUpdate}>
            <AiFillEdit />
          </span>
          <span onClick={handleDelete}>
            <AiFillDelete />
          </span>
        </EditBox>
      )}
    </PipiItem>
  );
}

export default Pipi;

const PipiItem = styled.div`
  display: flex;
  position: relative;
  width: 50%;
  height: 10rem;
  margin: 2rem auto;
  padding: 1em;
  box-shadow: 0px 2px 5px 1px rgb(0 0 0 / 31%);
  border-radius: 15px;
  &:hover #editBox {
    opacity: 1;
  }
`;

const ProfileBox = styled(Link)`
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
const EditForm = styled.form`
  display: flex;
  align-items: center;
  width: 90%;
`;
const EditInput = styled.input`
  width: 90%;
  color: #9b9a9a;
`;
const EditSubmit = styled.input`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #ffffff;
  height: 2.8rem;
  width: 5rem;
  background-color: #1fab89;
  border-radius: 10px;
  padding: 0.8em;
  cursor: pointer;
`;
const EditCancelBtn = styled.button`
  position: absolute;
  cursor: pointer;
  color: #d64f78;
  top: 8%;
  right: 2%;
  font-size: 1.2rem;
`;
const EditBox = styled.div`
  position: absolute;
  opacity: 0;
  display: flex;
  justify-content: space-evenly;
  width: 13%;
  right: 3%;
  top: 12%;
  font-size: 1.2rem;
  transition: all 0.2s ease-in;
  & > span {
    padding: 0.2em;
    cursor: pointer;
  }
  & > :first-child {
    color: #6768ab;
  }
  & > :last-child {
    color: #d64f78;
  }
`;
