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
  const convertDate = (date) => {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    let hour = date.getHours().toString();
    let minute = date.getMinutes().toString();
    return `${year}.${month.padStart(2, '0')}.${day.padStart(
      2,
      '0'
    )}  ${hour.padStart(2, ' 0')}:${minute.padStart(2, '0')}`;
  };
  return (
    <>
      {
        <PipiItem id={pipi.id}>
          <Cover>
            <CoverBtnBox>
              <div>확인</div>
              <div>대화</div>
            </CoverBtnBox>
          </Cover>
          <ProfileBox to={`/profile/${owner.uid}`}>
            <PipiProfile src={owner.photoURL} alt="profile" />
            <span>{owner.displayName}</span>
          </ProfileBox>
          {isEdit ? (
            <>
              <EditForm onSubmit={handleUpdate}>
                <TextBox>
                  <EditInput
                    type="text"
                    value={newPipi}
                    onChange={handleChange}
                  />
                </TextBox>
                <EditSubmit type="submit" value="수정" />
              </EditForm>
              <EditCancelBtn onClick={toggleUpdate}>
                <MdOutlineCancel />
              </EditCancelBtn>
            </>
          ) : (
            <>
              <PipiTime>{convertDate(new Date(pipi.createdAt))}</PipiTime>
              <TextBox>
                <span>{pipi.text}</span>
              </TextBox>
            </>
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
      }
    </>
  );
}

export default Pipi;

const PipiItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 80%;
  height: 18rem;
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
  margin-top: 1rem;
  width: 100%;
`;
const PipiProfile = styled.img`
  height: 5rem;
  width: 5rem;
  border-radius: 15px;
  margin-bottom: 5%;
`;
const PipiTime = styled.span`
  position: absolute;
  width: 80%;
  bottom: 5%;
  left: 50%;
  text-align: center;
  transform: translateX(-50%);
  color: #9b9a9a;
`;
const TextBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  /* align-items: flex-start; */
  & > span {
    width: 100%;
    margin-top: 3rem;
    text-align: center;
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
  right: 8%;
  top: 3%;
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
const Cover = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #eaeaea;
  border-radius: 15px;
`;
const CoverBtnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 80%;
  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 2rem;
    border-radius: 10px;
    background-color: dodgerblue;
    color: #ffffff;
  }
`;
const CoverCheck = styled.div``;
const CoverChat = styled.div``;
