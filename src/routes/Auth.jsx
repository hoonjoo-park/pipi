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
import { addDoc, collection } from 'firebase/firestore';

function Auth({ setIsLoggedIn, refreshUser, userObject }) {
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
          await addDoc(collection(db, 'Users'), {
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
          setIsLoggedIn(true);
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
        setIsLoggedIn(true);
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
            <button name="google" onClick={handleSocial}>
              구글로 로그인
              <FcGoogle />
            </button>
            <button name="github" onClick={handleSocial}>
              깃헙으로 로그인
              <FaGithub />
            </button>
          </>
        )}

        <AuthButton type="submit" value={isJoin ? '회원가입' : '로그인'} />
        <AuthSuggestion onClick={handleIsJoin}>
          {isJoin ? '로그인하기' : '아직 회원이 아니신가요?'}
        </AuthSuggestion>
      </AuthForm>
    </AuthContainer>
  );
}

export default Auth;

const AuthContainer = styled.div`
  width: 75vw;
  height: 100%;
`;

const AuthForm = styled.form`
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;

const AuthInputs = styled.input`
  width: 40%;
  border: none;
  margin-bottom: 1rem;
  outline: none;
`;
const AuthButton = styled.input`
  border: none;
  width: 10%;
  margin-bottom: 1rem;
  cursor: pointer;
`;
const AuthSuggestion = styled.span`
  cursor: pointer;
`;
