import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MainLogo } from '../Image';

function Header({ user, requests }) {
  return (
    <Nav>
      <Logo to="/">
        <img src={MainLogo} alt="logo" />
      </Logo>
      {user && (
        <MenuBox>
          <Link to="/search">검색</Link>
          <ProfileLink to={`/myProfile`}>
            {user ? (
              <span>
                {user.displayName}
                <Alert exist={Boolean(requests.length > 0)}>
                  {requests && requests.length}
                </Alert>
              </span>
            ) : (
              '프로필'
            )}
          </ProfileLink>
        </MenuBox>
      )}
    </Nav>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Header);

const Nav = styled.nav`
  display: flex;
  align-items: center;
  width: 100vw;
  height: 8vh;
  background-color: #434472;
  /* box-shadow: 0px 3px 8px -3px rgba(0, 0, 0, 0.71); */
`;
const ProfileLink = styled(Link)`
  & > span {
    position: relative;
  }
`;
const Alert = styled.span`
  position: absolute;
  display: ${(props) => (props.exist ? 'flex' : 'none')};
  top: -10px;
  right: -15px;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 100%;
  color: #ffffff;
  background-color: #d64f78;
`;
const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-left: 4.5vw;
  padding: 1em;
  & > img {
    width: 6rem;
    margin-right: 1.2rem;
  }
`;
const MenuBox = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 15%;
  height: 100%;
  gap: 1rem;
  margin-left: auto;
  margin-right: 6vw;
  & > * {
    text-align: center;
    padding: 1em;
    width: max-content;
    font-weight: 700;
    font-size: 1.2rem;
    color: #ffffff;
  }
`;
