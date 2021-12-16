import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import styled from 'styled-components';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { doc, setDoc } from 'firebase/firestore';

function Auth({ refreshUser }) {
  const [isJoin, setIsJoin] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const handleChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'password2') {
      setPassword2(value);
    } else if (name === 'userName') {
      setUserName(value);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let userCredential;
    let user;
    if (isJoin) {
      if (password === password2) {
        try {
          userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          user = await userCredential.user;
          await updateProfile(user, {
            displayName: userName,
            photoURL: `https://avatars.dicebear.com/api/adventurer-neutral/${user.uid}.svg?size=50`,
          });
          refreshUser();
          await setDoc(doc(db, 'Users', auth.currentUser.email), {
            uid: auth.currentUser.uid,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL,
          });
          setEmail('');
          setPassword('');
          setPassword2('');
          setUserName('');
          setIsJoin(false);
        } catch (error) {
          console.log(error);
        }
      } else {
        alert('입력하신 비밀번호가 서로 일치하지 않습니다.');
      }
    } else if (!isJoin) {
      try {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        user = userCredential.user;
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleIsJoin = () => {
    setIsJoin((prev) => !prev);
  };
  const handleSocial = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    if (name === 'google') {
      provider = new GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(auth, provider);
    refreshUser();
  };
  return (
    <AuthContainer>
      <AuthForm onSubmit={handleSubmit}>
        {isJoin ? (
          <>
            <FormTitle>회원가입</FormTitle>
            <AuthInputs
              type="text"
              name="userName"
              value={userName}
              id="userNameInput"
              placeholder="이름을 입력하세요"
              required
              onChange={handleChange}
            />
            <AuthInputs
              type="email"
              name="email"
              value={email}
              id="emailInput"
              placeholder="이메일을 입력하세요"
              required
              onChange={handleChange}
            />
            <AuthInputs
              type="password"
              name="password"
              value={password}
              id="passwordInput"
              placeholder="비밀번호를 입력하세요"
              required
              onChange={handleChange}
            />
            <AuthInputs
              type="password"
              name="password2"
              value={password2}
              id="passwordInput2"
              placeholder="비밀번호를 다시 입력하세요"
              required
              onChange={handleChange}
            />
          </>
        ) : (
          <>
            <FormTitle>로그인</FormTitle>
            <AuthInputs
              type="email"
              name="email"
              value={email}
              id="emailInput"
              placeholder="이메일을 입력하세요"
              required
              onChange={handleChange}
            />
            <AuthInputs
              type="password"
              name="password"
              value={password}
              id="passwordInput"
              placeholder="비밀번호를 입력하세요"
              required
              onChange={handleChange}
            />
            <ButtonBox name="google" onClick={handleSocial}>
              <span>구글로 로그인</span>
              <FcGoogle style={{ fontSize: '1.3rem', width: '15%' }} />
            </ButtonBox>
            <ButtonBox name="github" onClick={handleSocial}>
              <span>깃헙으로 로그인</span>
              <FaGithub style={{ fontSize: '1.3rem', width: '15%' }} />
            </ButtonBox>
          </>
        )}

        <AuthButton type="submit" value={isJoin ? '회원가입' : '로그인'} />
        <AuthSuggestion onClick={handleIsJoin}>
          {isJoin ? '이미 회원이신가요?' : '아직 회원이 아니신가요?'}
        </AuthSuggestion>
      </AuthForm>
    </AuthContainer>
  );
}

export default Auth;

const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 75vh;
`;
const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30vw;
  height: 85%;
  margin: auto;
  padding: 1em;
  box-shadow: 0px 2px 5px 1px rgb(0 0 0 / 31%);
  border-radius: 15px;
`;
const FormTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  margin: 2em 0 2.5em 0;
`;
const AuthInputs = styled.input`
  width: 50%;
  height: 2.2rem;
  border: none;
  border-bottom: 2px solid #eaeaea;
  margin-bottom: 2rem;
  padding: 1em;
  outline: none;
`;

const ButtonBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 2.5em;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  cursor: pointer;
  margin-bottom: 1rem;
  & > span {
    font-weight: 500;
    transform: translateY(10%);
  }
`;

const AuthButton = styled.input`
  border: none;
  width: 50%;
  height: 2.5rem;
  line-height: 2.5rem;
  background-color: #1fab89;
  margin-bottom: 3.5rem;
  border-radius: 15px;
  color: #ffffff;
  cursor: pointer;
`;
const AuthSuggestion = styled.span`
  text-decoration: underline;
  color: #6768ab;
  cursor: pointer;
`;
