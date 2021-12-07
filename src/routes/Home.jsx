import React, { useState } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import styled from 'styled-components';

function Home({ refreshUser, userObject }) {
  const [isSent, setIsSent] = useState(false);
  const handleVerify = () => {
    setIsSent(true);
    sendEmailVerification(auth.currentUser);
  };
  return (
    <HomeContainer>
      {userObject.emailVerify ? (
        <>
          <div>
            <h3>이메일 인증이 필요합니다</h3>
            <button onClick={handleVerify}>인증메일 발송</button>
          </div>
          {isSent && <h3>{userObject.email}으로 메일이 전송되었습니다</h3>}
        </>
      ) : (
        <div>Home</div>
      )}
    </HomeContainer>
  );
}

export default Home;

const HomeContainer = styled.div`
  width: 100vw;
`;
