import React from 'react';
import styled from 'styled-components';
function EditProfile({ refreshUser, userObject }) {
  return (
    <EditProfileContainer>
      <form>
        <div></div>
        <label for="editFile">파일 선택</label>
        <input
          type="file"
          accept="image/*"
          name="editFile"
          id="editFile"
          style={{ display: 'none' }}
        />
        <input
          type="text"
          name="editUserName"
          id="editUserName"
          placeholder="유저명을 입력하세요"
          value={userObject.displayName}
        />
        <input
          type="email"
          name="editEmail"
          id="editEmail"
          value={userObject.email}
          readOnly
        />
        <input type="submit" value="수정" />
      </form>
    </EditProfileContainer>
  );
}

export default EditProfile;
const EditProfileContainer = styled.div`
  width: 100vw;
`;
