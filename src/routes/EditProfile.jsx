import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { auth, bucket, db } from '../firebase';
function EditProfile({ refreshUser, user }) {
  const [newName, setNewName] = useState(`${user.displayName}`);
  const [newAvatar, setNewAvatar] = useState(`${user.photoURL}`);
  let param = useParams();
  let navigate = useNavigate();
  const handleChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewName(value);
  };
  const handleFile = (e) => {
    const {
      target: { files },
    } = e;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const {
        currentTarget: { result },
      } = e;
      setNewAvatar(result);
    };
    reader.readAsDataURL(file);
  };
  const handleCancel = () => {
    setNewAvatar(user.photoURL);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newAvatar !== user.photoURL) {
      const bucketRef = await ref(bucket, `profileImage/${user.uid}`);
      const response = await uploadString(bucketRef, newAvatar, 'data_url');
      let newURL = await getDownloadURL(response.ref);
      setNewAvatar(newURL);
      await updateProfile(auth.currentUser, { photoURL: newURL });
      refreshUser();
      const toUpdate = doc(db, 'Users', `${user.photoURL}`);
      await updateDoc(toUpdate, {
        photoURL: newURL,
      });
    }
    if (newName !== user.displayName) {
      const toUpdate = doc(db, 'Users', `${user.email}`);
      await updateDoc(toUpdate, {
        displayName: newName,
      });
      await updateProfile(auth.currentUser, { displayName: newName });
      refreshUser();
    }
    navigate('/');
  };
  const changePW = async () => {
    if (
      window.confirm(
        `비밀번호를 재설정하시겠습니까?\n${user.email}으로 메일이 전송됩니다.`
      )
    ) {
      try {
        await sendPasswordResetEmail(auth, user.email);
      } catch (error) {
        console.log(error.code, error.message);
      }
    }
  };
  useEffect(() => {
    auth.currentUser.uid !== param.id && navigate('/');
  }, [param.id, navigate]);
  return (
    <EditProfileContainer>
      <EditForm onSubmit={handleSubmit}>
        <div>
          <ProfileImage src={newAvatar} alt="Profile" />
          {newAvatar !== user.photoURL && (
            <span onClick={handleCancel}>초기화</span>
          )}
        </div>
        <FileLabel htmlFor="editFile">파일 선택</FileLabel>
        <input
          type="file"
          accept="image/*"
          name="editFile"
          id="editFile"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
        <EditInput
          type="text"
          name="editUserName"
          id="editUserName"
          placeholder="유저명을 입력하세요"
          onChange={handleChange}
          value={newName}
        />
        <EditInput
          type="email"
          name="editEmail"
          id="editEmail"
          value={user.email}
          readOnly
        />
        {user.provider === 'password' && (
          <>
            <ChangePW onClick={changePW}>비밀번호 변경하기</ChangePW>
          </>
        )}
        <EditFinish type="submit" value="수정" />
      </EditForm>
    </EditProfileContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(EditProfile);
const EditProfileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 83vw;
  height: 100vh;
  margin-left: 17vw;
`;
const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30vw;
  height: 65%;
  margin: auto;
  padding: 2.5em;
  box-shadow: 0px 2px 5px 1px rgb(0 0 0 / 31%);
  border-radius: 15px;
`;
const ProfileImage = styled.img`
  width: 7rem;
  border-radius: 15px;
  margin-bottom: 1rem;
`;
const FileLabel = styled.label`
  width: 7rem;
  height: 1.8rem;
  text-align: center;
  line-height: 1.8rem;
  border-radius: 15px;
  border: 1px solid #eaeaea;
  margin-bottom: 3rem;
  cursor: pointer;
`;
const EditInput = styled.input`
  width: 50%;
  height: 2.2rem;
  border: none;
  border-bottom: 2px solid #eaeaea;
  margin-bottom: 2rem;
  padding: 1em;
  outline: none;
`;
const EditFinish = styled.input`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  border-radius: 15px;
  height: 2.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  background-color: #1fab89;
  color: #ffffff;
`;
const ChangePW = styled.button`
  width: 50%;
  height: 2.5rem;
  line-height: 2.5rem;
  border-radius: 15px;
  border: 1px solid #6768ab;
  color: #6768ab;
  margin-bottom: 1.5rem;
`;
