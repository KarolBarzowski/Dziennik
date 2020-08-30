import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga';
import styled, { css } from 'styled-components';
import GlobalStyle from 'theme/GlobalStyle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';

ReactGA.initialize(process.env.REACT_APP_TRACKING_ID);
ReactGA.pageview('update');

const StyledWrapper = styled.div`
  min-height: 100vh;
  max-height: 100vh;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.87);

  h2 {
    margin-bottom: 1.5rem;
  }
`;

const StyledButton = styled.button`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0.8rem 1.6rem;
  margin-top: 2rem;
  text-decoration: none;
  color: rgb(255, 255, 255, 0.87);
  font-size: 1.6rem;
  font-weight: 500;
  border-radius: 5rem;
  background-color: rgb(10, 132, 255);
  transition: background-color 0.1s ease-in-out;

  ${({ isDisabled }) =>
    isDisabled &&
    css`
      background-color: rgba(10, 132, 255, 0.38);
      cursor: default;
      pointer-events: none;
    `}
`;

const Red = styled.span`
  color: rgb(255, 69, 58);
`;

const Green = styled.span`
  color: rgb(48, 209, 88);
`;

const Contact = styled.a`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  color: rgba(255, 255, 255, 0.87);
  text-decoration: none;
`;

const handleAddEvent = () => {
  ReactGA.event({
    category: 'Synchronizacja',
    action: 'Z Aktualizacji',
  });
};

const Update = () => {
  const [isScriptUpdated, setIsScriptUpdated] = useState(false);
  const [currentScriptVersion, setCurrentScriptVersion] = useState(null);
  const [newScriptVersion, setNewScriptVersion] = useState(null);

  useEffect(() => {
    const actualScriptVersion = window.localStorage.getItem('script_version');
    const newScriptVersion = process.env.REACT_APP_SCRIPT_VERSION;

    setCurrentScriptVersion(actualScriptVersion);
    setNewScriptVersion(newScriptVersion);
  }, []);

  const handleUpdate = () => {
    setTimeout(() => {
      setIsScriptUpdated(true);
    }, 1000);
  };

  return (
    <>
      <GlobalStyle />
      <StyledWrapper>
        <h2>Dostępna jest nowa wersja skryptu.</h2>
        <h2>
          <Red>{currentScriptVersion}</Red> &gt; <Green>{newScriptVersion}</Green>
        </h2>
        <h3>Zaktualizuj skrypt i wykonaj synchronizację, aby móc korzystać z aplikacji.</h3>
        <StyledButton
          as="a"
          href="https://github.com/KarolBarzowski/Dziennik/raw/master/script.user.js"
          isDisabled={isScriptUpdated}
          onClick={handleUpdate}
        >
          Zaktualizuj skrypt
        </StyledButton>
        <StyledButton
          as="a"
          href="https://nasze.miasto.gdynia.pl/ed_miej/zest_start.pl?autoSync=true"
          onClick={handleAddEvent}
          isDisabled={!isScriptUpdated}
        >
          Synchronizuj
        </StyledButton>
        <Contact href="https://m.me/walterbialy" target="_blank" rel="noopener noreferrer">
          Zgłoś błąd <FontAwesomeIcon icon={faFacebookMessenger} fixedWidth />
        </Contact>
      </StyledWrapper>
    </>
  );
};

export default Update;
