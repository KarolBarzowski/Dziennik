import React from 'react';
import styled from 'styled-components';
import Section from 'components/atoms/Section/Section';
import LoginForm from 'components/molecules/LoginForm/LoginForm';

const StyledSection = styled(Section)`
  min-height: 100vh;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  width: 32rem;
`;

function Login() {
  return (
    <StyledSection>
      <StyledWrapper>
        <LoginForm />
      </StyledWrapper>
    </StyledSection>
  );
}

export default Login;
