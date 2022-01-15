import React, { useEffect, useState } from 'react';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import styled from 'styled-components';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { FaCheckSquare } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import { BsFillChatSquareDotsFill } from 'react-icons/bs';
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
          <ProfileBox>
            <PipiProfile to={`/profile/${owner.uid}`} src={owner.photoURL} />
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
                {user.uid !== owner.uid && !isEdit && (
                  <ButtonBox>
                    <CoverCheck onClick={handleDelete}>
                      <FaCheckSquare />
                    </CoverCheck>
                    <CoverChat className="chatBtn" to={`/chat/${owner.uid}`}>
                      <BsFillChatSquareDotsFill />
                    </CoverChat>
                  </ButtonBox>
                )}
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
  width: 75%;
  height: 15rem;
  margin: 2rem auto;
  padding: 1em;
  box-shadow: 0px 2px 5px 1px rgb(0 0 0 / 31%);
  border-radius: 15px;
  &:hover #editBox {
    opacity: 1;
  }
`;

const ProfileBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 1rem;
`;
const PipiProfile = styled(Link)`
  background-image: url(${(props) => props.src});
  background-position: center;
  background-size: contain;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
`;

const ButtonBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  width: 40%;
`;

const CoverChat = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-left: 0.5rem;
  font-size: 1.3rem;
  color: #1fab89;
  border-radius: 10px;
  transform: translateY(3%);
  transition: 0.2s ease-in-out;
`;
const CoverCheck = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  & > * {
    font-size: 1.3rem;
    color: #6768ab;
  }
`;

const BottomBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 15%;
  & h3 {
    font-size: 1.1rem;
    margin-bottom: 0.3rem;
  }
`;
const BottomLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 1rem;
  & > span {
    font-size: 0.9rem;
  }
`;
const PipiTime = styled.span`
  color: #9b9a9a;
`;

const TextBox = styled.div`
  width: 100%;
  height: 60%;
  padding: 0.3em;
  display: flex;
  & > p {
    width: 100%;
    font-size: 1.2rem;
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
