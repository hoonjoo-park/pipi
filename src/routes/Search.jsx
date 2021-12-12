import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../firebase';

function Search() {
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState({});
  const [isFound, setIsFound] = useState();
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
    <div>
      <div>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="search"
            id="search"
            onChange={handleChange}
            value={searchText}
            placeholder="검색하고자 하는 상대방 이메일을 입력해주세요"
          />
          <input type="submit" value="검색" />
        </form>
      </div>
      <div>
        <ul>
          {isFound ? (
            <li key={searchResult.uid}>
              <img src={searchResult.photoURL} alt="profile" />
              <h3>{searchResult.displayName}</h3>
              <h3>{searchResult.email}</h3>
            </li>
          ) : (
            <h3>검색 결과가 없습니다</h3>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Search;
