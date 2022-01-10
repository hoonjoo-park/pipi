import React, { useEffect, useState } from 'react';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import styled from 'styled-components';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { MdOutlineCancel } from 'react-icons/md';
import { connect } from 'react-redux';

function Pipi({ pipi, user }) {
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
    const ok = window.confirm('해당 삐삐가 삭제처리 됩니다. 삭제하시겠습니까?');
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
          {user.uid !== owner.uid && !isEdit && (
            <Cover>
              <CoverBtnBox>
                <CoverChat to={`/chat/${owner.uid}`}>대화</CoverChat>
              </CoverBtnBox>
            </Cover>
          )}
          <ProfileBox to={`/profile/${owner.uid}`}>
            <PipiProfile src={owner.photoURL} alt="profile" />
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
              <TextBox>
                <p>{pipi.text}</p>
              </TextBox>
              <BottomBox>
                <BottomLeft>
                  <h3>{owner.displayName}</h3>
                  <PipiTime>{convertDate(new Date(pipi.createdAt))}</PipiTime>
                </BottomLeft>
                <CoverCheck onClick={handleDelete}>확인</CoverCheck>
              </BottomBox>
            </>
          )}
          {user.uid === owner.uid && !isEdit && (
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

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Pipi);

const PipiItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
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
  &:hover > div:nth-child(1) {
    opacity: 1;
  }
`;

const ProfileBox = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 1rem;
`;
const PipiProfile = styled.img`
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
`;

const BottomBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 15%;
  & h3 {
    font-size: 1.2rem;
    margin-bottom: 0.3rem;
  }
`;
const BottomLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  & > span {
    font-size: 0.9rem;
  }
`;
const PipiTime = styled.span`
  color: #9b9a9a;
`;
const CoverCheck = styled.div`
  background-color: #6768ab;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 2rem;
  border-radius: 10px;
  color: #ffffff;
  cursor: pointer;
`;
const TextBox = styled.div`
  width: 100%;
  height: 60%;
  padding: 0.3em;
  display: flex;
  & > p {
    width: 100%;
    font-size: 1.5rem;
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
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #eaeaea;
  border-radius: 15px;
  transition: 0.2s ease-in-out;
`;
const CoverBtnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 80%;
  & > div,
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.5rem;
    height: 2.5rem;
    border-radius: 10px;
    color: #ffffff;
    cursor: pointer;
  }
`;
const CoverChat = styled(Link)`
  background-color: #1fab89;
`;
