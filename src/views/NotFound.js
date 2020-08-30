import React from 'react';
import styled from 'styled-components';
import Heading from 'components/atoms/Heading/Heading';

const Wrapper = styled.main`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`;

function NotFound() {
  return (
    <Wrapper>
      <Heading>Nie znaleziono takiej podstrony!</Heading>
    </Wrapper>
  );
}

export default NotFound;
