import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../firebase';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { RiEmotionSadLine } from 'react-icons/ri';
function Search() {
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState({});
  const [isFound, setIsFound] = useState();
  const navigate = useNavigate();
  const handleChange = (e) => {
    const {
      target: { value },
    } = e;
    setSearchText(value);
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    const docRef = doc(db, 'Users', searchText);
    const result = await getDoc(docRef);
    if (result.exists()) {
      setSearchResult(result.data());
      setIsFound(true);
    } else {
      setIsFound(false);
    }
    setSearchText('');
  };
  return (
    <SearchContainer>
      <FormContainer>
        <FormBox onSubmit={handleSearch}>
          <SearchInput
            type="text"
            name="search"
            id="search"
            onChange={handleChange}
            value={searchText}
            placeholder="상대방 이메일을 입력해주세요 :)"
          />
          <SearchBtn type="submit" value="검색" />
        </FormBox>
      </FormContainer>
      <ResultContainer>
        <ResultUl>
          {isFound ? (
            <ResultLi
              key={searchResult.uid}
              onClick={() =>
                navigate(`/profile/${searchResult.uid}`, {
                  state: { searchResult: searchResult },
                })
              }
            >
              <img src={searchResult.photoURL} alt="profile" />
              <div>
                <h3>{searchResult.displayName}</h3>
                <h3>{searchResult.email}</h3>
              </div>
            </ResultLi>
          ) : (
            <NothingFound>
              검색 결과가 없습니다
              <RiEmotionSadLine
                style={{
                  fontSize: '2rem',
                  width: '3rem',
                  paddingBottom: '0.2rem',
                }}
              />
            </NothingFound>
          )}
        </ResultUl>
      </ResultContainer>
    </SearchContainer>
  );
}

export default Search;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 83vw;
  margin: auto;
  margin-left: 17vw;
  padding: 1em;
`;
const FormContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 15%;
  margin-top: 5rem;
`;
const FormBox = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70%;
`;
const SearchInput = styled.input`
  display: block;
  width: 50%;
  height: 4rem;
  padding: 0.5em;
  margin-right: 2rem;
  font-size: 1.4rem;
  border-bottom: 2px solid #6768ab;
  font-family: 'NeoDunggeunmo';
`;
const SearchBtn = styled.input`
  width: 5.5rem;
  height: 3.5rem;
  border-radius: 15px;
  font-size: 1.2rem;
  font-weight: 700;
  background-color: #6768ab;
  color: #ffffff;
  cursor: pointer;
`;
const ResultContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50%;
`;
const ResultUl = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70%;
`;
const ResultLi = styled.li`
  display: flex;
  padding: 1.5em;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  width: 60%;
  height: 10rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }
  & > div {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 3rem;
    & > h3 {
      font-size: 1.2rem;
      font-weight: 500;
    }
  }
  & > img {
    border-radius: 15px;
  }
`;
const NothingFound = styled.h3`
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  font-weight: 700;
`;
