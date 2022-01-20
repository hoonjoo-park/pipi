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
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../firebase';
import { IoIosSend } from 'react-icons/io';
import { AiFillDelete } from 'react-icons/ai';
import { RiDeleteBackFill } from 'react-icons/ri';
import { connect } from 'react-redux';
import Chat from './Chat';

function ChatRoom({ user }) {
  const [friend, setFriend] = useState({});
  const [chatText, setChatText] = useState('');
  const [chat, setChat] = useState([]);
  const [chatRoomId, setChatRoomId] = useState('');
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const {
    state: { friendObj },
  } = location;
  const setChatroom = useCallback(async () => {
    await addDoc(collection(db, 'Chats'), {
      people: [user.uid, params.id],
      chats: [],
    });
  }, [params.id, user.uid]);
  const getChatroom = useCallback(async () => {
    const userRef = collection(db, 'Users');
    const chatRef = collection(db, 'Chats');
    const q = query(
      chatRef,
      where('people', 'array-contains-any', [user.uid, friendObj.uid])
    );
    const q2 = query(userRef, where('uid', '==', friendObj.uid));
    const result = await getDocs(q);
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
  }, [friendObj.uid, user.uid, setChatroom]);

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
  }, [getChatroom]);
  return (
    <ChatContainer>
      <Chat />
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
                <Balloon className={el.from === user.uid ? 'my' : 'other'}>
                  {el.text}
                  <ChatTime className="chatTime">
                    {convertDate(new Date(el.createdAt))}
                  </ChatTime>
                </Balloon>
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
  width: 83vw;
  margin-left: 17vw;
`;
const ChatBox = styled.div`
  position: relative;
  border-radius: 15px;
  /* padding: 1em 2em 3em; */
  margin-left: 25vw;
  height: 90%;
  width: 55%;
  background-color: #ffffff;
  box-shadow: 0px 2px 5px 1px rgb(0 0 0 / 31%);
`;
const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  height: 4.5rem;
  padding: 0 2em;
  border-radius: 15px 15px 0 0;
  box-shadow: 0px 8px 12px -2px rgba(0, 0, 0, 0.35);
  & > img {
    border-radius: 50%;
    margin-right: 1.5rem;
  }
  & > h3 {
    font-size: 1.2rem;
    font-weight: bold;
  }
`;
const ChatUl = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 80%;
  padding: 3em 3em 0 3em;
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
      max-width: 48%;
      padding: 1.3em;
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
const Balloon = styled.span`
  &.my {
    color: #ffffff;
    background-color: #6768ab;
  }
`;
const ChatTime = styled.span`
  color: #444444;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: auto;
  margin-right: 1%;
  width: 4rem;
  & > svg {
    cursor: pointer;
    font-size: 1.5rem;
    color: #444444;
  }
`;
