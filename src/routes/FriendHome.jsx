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
      <FriendHomeBox>
        <TopBox>
          <ProfileBox>
            <img
              src={friendObj.photoURL}
              style={{ borderRadius: 15 }}
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
      </FriendHomeBox>
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
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 83vw;
  margin-left: 17vw;
  padding: 1em;
`;
const FriendHomeBox = styled.div`
  width: 90%;
  height: 90%;
  padding: 1em;
  border-radius: 10px;
  box-shadow: 0px 3px 14px -3px rgba(0, 0, 0, 0.71);
`;
const TopBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5rem;
`;
const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 10%;
  height: 5rem;
  & > img {
    width: 3rem;
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
  justify-content: space-between;
  width: 50%;
  height: 5rem;
  padding: 0 1em;
  /* margin-left: auto;
  margin-right: 5rem; */
  border: 1px solid #eaeaea;
  border-radius: 20px;
  & > form {
    display: flex;
    align-items: center;
    flex-basis: 85%;
  }
  & > img {
    display: block;
    height: 3rem;
    width: 3rem;
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
  height: 61%;
  overflow: scroll;
  margin-top: 1.5rem;
`;
const PipiBox = styled.ul`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  width: 100%;
  padding: 1em;
  & > div {
    width: 20%;
    margin: 0;
  }
`;
