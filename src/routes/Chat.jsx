import React, { useState } from 'react';
import styled from 'styled-components';

function Chat() {
  const [chatText, setChatText] = useState('');
  return (
    <ChatContainer>
      <ChatBox>
        <ul>
          <li>first chat</li>
        </ul>
        <ChatForm>
          <ChatInput type="text" placeholder="메시지를 입력하세요" />
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
