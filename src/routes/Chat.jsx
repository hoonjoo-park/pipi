import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../firebase';

function Chat({ userObject }) {
  const params = useParams();
  const [chatText, setChatText] = useState('');
  const [chat, setChat] = useState([]);
  const [chatRoomId, setChatRoomId] = useState('');
  const getChatroom = async () => {
    const chatRef = collection(db, 'Chats');
    const q = query(
      chatRef,
      where('people', 'in', [
        userObject.uid + params.id,
        params.id + userObject.uid,
      ])
    );
    const result = await getDocs(q);
    if (result.empty) {
      setChatroom();
    } else {
      onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(chats);
        setChatRoomId(chats[0].id);
        setChat(chats[0].chats);
      });
    }
  };
  const setChatroom = async () => {
    await addDoc(collection(db, 'Chats'), {
      people: userObject.uid + params.id,
      chats: [],
    });
  };
  const handleType = (e) => {
    const {
      target: { value },
    } = e;
    setChatText(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const chatRoomRef = doc(db, 'Chats', chatRoomId);
    await updateDoc(chatRoomRef, {
      chats: [...chat, { from: userObject.uid, text: chatText }],
    });
    setChatText('');
  };
  useEffect(() => {
    getChatroom();
  }, []);
  console.log(chat);
  return (
    <ChatContainer>
      <ChatBox>
        <ChatUl>
          {chat &&
            chat.map((el, i) => (
              <li
                key={i}
                className={el.from === userObject.uid ? 'my' : 'other'}
              >
                <span>{el.text}</span>
              </li>
            ))}
        </ChatUl>
        <ChatForm onSubmit={handleSubmit}>
          <ChatInput
            type="text"
            value={chatText}
            onChange={handleType}
            onKeyUp={handleType}
            placeholder="메시지를 입력하세요"
          />
          <ChatSubmit type="submit" value="전송" />
        </ChatForm>
      </ChatBox>
    </ChatContainer>
  );
}

export default Chat;

const ChatContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
  width: 100vw;
`;
const ChatBox = styled.div`
  position: relative;
  border-radius: 15px;
  padding: 2em;
  height: 85%;
  width: 35%;
  background-color: #6768ab;
`;
const ChatUl = styled.ul`
  height: 90%;
  overflow: scroll;
  & > li {
    display: flex;
    align-items: center;
    width: 100%;
    height: 10%;
    margin-bottom: 1rem;
    & > span {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ffffff;
      padding: 1em;
      height: 80%;
      border-radius: 5px;
    }
  }
  & > li.my {
    justify-content: flex-end;
  }
`;
const ChatForm = styled.form`
  position: absolute;
  display: flex;
  align-items: center;
  width: 85%;
  height: 3rem;
  padding-left: 2em;
  bottom: 3%;
  left: 50%;
  border-radius: 25px;
  background-color: #ffffff;
  transform: translateX(-50%);
`;
const ChatInput = styled.input`
  width: 100%;
  height: 90%;
`;
const ChatSubmit = styled.input`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15%;
  height: 90%;
  color: #ffffff;
  border-radius: 25px;
  background-color: #1fab89;
  margin-right: 0.5%;
`;
