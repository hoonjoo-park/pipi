import React from 'react';
import styled from 'styled-components';
function Footer() {
  return (
    <FooterContainer>
      Copyright &copy; 2021 PIPI All rights reserved.
    </FooterContainer>
  );
}
export default Footer;

const FooterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 15vh;
  font-size: 1.2rem;
  font-weight: 500;
  border-top: 2px solid #eaeaea;
`;
