import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import styled, { keyframes } from 'styled-components';

function Loading() {
  return (
    <LoadingContainer>
      <AiOutlineLoading3Quarters
        style={{
          width: '3rem',
          height: '3rem',
          color: '#6768AB',
        }}
      />
    </LoadingContainer>
  );
}

export default Loading;

const rotating = keyframes`
    0%{
        transform:rotate(0deg)
        }
    100%{
        transform:rotate(360deg);
    }
`;
const LoadingContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${rotating} 1.5s 0s infinite cubic-bezier(0.29, -0.13, 0.1, 1.04);
`;
