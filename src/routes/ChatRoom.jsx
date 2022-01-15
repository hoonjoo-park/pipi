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
import { connect } from 'react-redux';

function ChatRoom({ user }) {
  const [friend, setFriend] = useState({});
  const [chatText, setChatText] = useState('');
  const [chat, setChat] = useState([]);
  const [chatRoomId, setChatRoomId] = useState('');
  const navigate = useNavigate();
  const params = useParams();
  const getChatroom = async () => {
    const userRef = collection(db, 'Users');
    const chatRef = collection(db, 'Chats');
    const q = query(
      chatRef,
      where('people', 'array-contains-any', [user.uid, params.id])
    );
    const q2 = query(userRef, where('uid', '==', params.id));
    const result = await getDocs(q);
    const friendResult = await getDocs(q2);
    onSnapshot(q2, (snapshot) => {
      const friend = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setFriend(friend[0]);
    });
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
      people: [user.uid, params.id],
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
        { from: user.uid, text: chatText, createdAt: Date.now() },
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
  return (
    <ChatContainer>
      <ChatBox>
        <ChatHeader>
          <img src={friend.photoURL} alt="profile" />
          <h3>{friend.displayName}님과의 대화</h3>
          <ChatBtnBox>
            <RiDeleteBackFill />
            <AiFillDelete style={{ color: '#B83B5E' }} onClick={handleDelete} />
          </ChatBtnBox>
        </ChatHeader>
        <ChatUl>
          {chat &&
            chat.map((el, i) => (
              <li key={i} className={el.from === user.uid ? 'my' : 'other'}>
                {el.from !== user.uid && (
                  <FriendProfile>
                    <span>{friend.displayName}</span>
                    <img src={friend.photoURL} alt="profile" />
                  </FriendProfile>
                )}
                <span>
                  {el.text}
                  <span className="chatTime">
                    {convertDate(new Date(el.createdAt))}
                  </span>
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

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(ChatRoom);

const ChatContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;
const ChatBox = styled.div`
  position: relative;
  border-radius: 15px;
  padding: 1em 2em 3em;
  height: 85%;
  width: 35%;
  background-color: #ffffff;
  box-shadow: 0px 2px 5px 1px rgb(0 0 0 / 31%);
`;
const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  background-color: #eaeaea;
  border-radius: 15px;
  & > img {
    border-radius: 15px;
    margin-right: 1rem;
  }
  & > h3 {
    font-size: 1.2rem;
    font-weight: bold;
  }
`;
const ChatUl = styled.ul`
  height: 90%;
  padding-top: 7%;
  padding-bottom: 3%;
  overflow: scroll;
  & > li {
    display: flex;
    align-items: center;
    width: 100%;
    height: 10%;
    margin-bottom: 2.5rem;
    & > span {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #eaeaea;
      max-width: 45%;
      padding: 1em;
      height: 80%;
      border-radius: 5px;
      & > span.chatTime {
        position: absolute;
        right: 0%;
        bottom: -50%;
        width: max-content;
        height: fit-content;
        background-color: transparent;
      }
    }
  }
  & > li.my {
    justify-content: flex-end;
  }
`;
const FriendProfile = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  & > img {
    border-radius: 15px;
  }
  & > span {
    position: absolute;
    top: -40%;
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
  top: 3%;
  right: 7%;
  width: 8%;
  & > svg {
    cursor: pointer;
    color: #444444;
  }
`;
