import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../firebase';
import { IoIosSend } from 'react-icons/io';
import { AiFillDelete } from 'react-icons/ai';
import { RiDeleteBackFill } from 'react-icons/ri';

function Chat({ userObject }) {
  const [chatText, setChatText] = useState('');
  const [chat, setChat] = useState([]);
  const [chatRoomId, setChatRoomId] = useState('');
  const navigate = useNavigate();
  const params = useParams();
  const getChatroom = async () => {
    const chatRef = collection(db, 'Chats');
    const q = query(
      chatRef,
      where('people', 'array-contains-any', [userObject.uid, params.id])
    );
    const result = await getDocs(q);
    console.log(result);
    if (result.empty) {
      setChatroom();
    } else {
      onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChatRoomId(chats[0].id);
        setChat(chats[0].chats);
      });
    }
  };
  const setChatroom = async () => {
    await addDoc(collection(db, 'Chats'), {
      people: [userObject.uid, params.id],
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
    if (chatText === '') {
      return;
    }
    const chatRoomRef = doc(db, 'Chats', chatRoomId);
    await updateDoc(chatRoomRef, {
      chats: [
        ...chat,
        { from: userObject.uid, text: chatText, createdAt: Date.now() },
      ],
    });
    setChatText('');
  };
  const convertDate = (date) => {
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    let hour = date.getHours().toString();
    let minute = date.getMinutes().toString();
    return `${month.padStart(2, '0')}월 ${day.padStart(
      2,
      '0'
    )}일 ${hour.padStart(2, ' 0')}:${minute.padStart(2, '0')}`;
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    const ok = window.confirm('채팅방을 삭제하시겠습니까?');
    if (ok) {
      await deleteDoc(chatRoomId);
    }
    navigate('/');
  };
  useEffect(() => {
    getChatroom();
  }, []);
  console.log(chat);
  return (
    <ChatContainer>
      <ChatBox>
        <ChatBtnBox>
          <RiDeleteBackFill />
          <AiFillDelete style={{ color: '#B83B5E' }} onClick={handleDelete} />
        </ChatBtnBox>
        <ChatUl>
          {chat &&
            chat.map((el, i) => (
              <li
                key={i}
                className={el.from === userObject.uid ? 'my' : 'other'}
              >
                <span>{el.text}</span>
                <span className="chatTime">
                  {convertDate(new Date(el.createdAt))}
                </span>
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
          <ChatSubmit type="submit">
            <IoIosSend />
          </ChatSubmit>
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
  padding: 3em 2em;
  height: 85%;
  width: 35%;
  background-color: #ffffff;
  box-shadow: 0px 2px 5px 1px rgb(0 0 0 / 31%);
`;
const ChatUl = styled.ul`
  height: 90%;
  overflow: scroll;
  & > li {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 10%;
    margin-bottom: 1.5rem;
    & > span {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #eaeaea;
      max-width: 45%;
      padding: 1em;
      height: 80%;
      border-radius: 5px;
    }
    & > span.chatTime {
      position: absolute;
      bottom: -35%;
      padding: 0 0.5em;
      height: fit-content;
      background-color: transparent;
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
  border: 1.5px solid #6768ab;
  border-radius: 25px;
  background-color: #ffffff;
  transform: translateX(-50%);
`;
const ChatInput = styled.input`
  width: 100%;
  height: 90%;
`;
const ChatSubmit = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10%;
  height: 85%;
  color: #ffffff;
  border-radius: 25px;
  background-color: #1fab89;
  margin-right: 0.8%;
`;
const ChatBtnBox = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  top: 2.5%;
  right: 5%;
  width: 8%;
  & > svg {
    cursor: pointer;
    color: #444444;
  }
`;
