import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useState } from 'react';
import styled from 'styled-components';
import { auth, bucket } from '../firebase';
function EditProfile({ refreshUser, userObject }) {
  const [newName, setNewName] = useState(`${userObject.displayName}`);
  const [newAvatar, setNewAvatar] = useState(`${userObject.photoURL}`);
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
    setNewAvatar(userObject.photoURL);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newAvatar !== userObject.photoURL) {
      const bucketRef = await ref(bucket, `profileImage/${userObject.uid}`);
      const response = await uploadString(bucketRef, newAvatar, 'data_url');
      let newURL = await getDownloadURL(response.ref);
      setNewAvatar(newURL);
      await updateProfile(auth.currentUser, { photoURL: newURL });
      refreshUser();
    }
    if (newName !== userObject.displayName) {
      await updateProfile(auth.currentUser, { displayName: newName });
      refreshUser();
    }
  };
  const changePW = async () => {
    if (
      window.confirm(
        `비밀번호를 재설정하시겠습니까?\n${userObject.email}으로 메일이 전송됩니다.`
      )
    ) {
      try {
        await sendPasswordResetEmail(auth, userObject.email);
      } catch (error) {
        console.log(error.code, error.message);
      }
    }
  };
  return (
    <EditProfileContainer>
      <form onSubmit={handleSubmit}>
        <div>
          <img
            src={newAvatar}
            style={{ width: 50, height: 50 }}
            alt="Profile"
          />
          {newAvatar !== userObject.photoURL && (
            <span onClick={handleCancel}>초기화</span>
          )}
        </div>
        <label htmlFor="editFile">파일 선택</label>
        <input
          type="file"
          accept="image/*"
          name="editFile"
          id="editFile"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
        <input
          type="text"
          name="editUserName"
          id="editUserName"
          placeholder="유저명을 입력하세요"
          onChange={handleChange}
          value={newName}
        />
        <input
          type="email"
          name="editEmail"
          id="editEmail"
          value={userObject.email}
          readOnly
        />
        {userObject.provider === 'password' && (
          <>
            <span onClick={changePW}>비밀번호 변경하기</span>
          </>
        )}
        <input type="submit" value="수정" />
      </form>
    </EditProfileContainer>
  );
}

export default EditProfile;
const EditProfileContainer = styled.div`
  width: 100vw;
`;
