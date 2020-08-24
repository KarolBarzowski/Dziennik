import React from 'react';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import GlobalStyle from 'theme/GlobalStyle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';

ReactGA.initialize(process.env.REACT_APP_TRACKING_ID);
ReactGA.pageview('tutorial');

const StyledWrapper = styled.div`
  padding: 2.5rem;
  color: rgba(255, 255, 255, 0.87);

  a {
    color: rgb(10, 132, 255);
  }

  ol,
  ul {
    margin-left: 3.5rem;
  }
`;

const StyledWarn = styled(FontAwesomeIcon)`
  color: rgb(211, 47, 47);
  margin-right: 0.5rem;
`;

const StyledInfo = styled.div`
  margin-top: 2.5rem;
  font-size: 1.6rem;
  font-weight: 400;
`;

const handleAddEvent = () => {
  ReactGA.event({
    category: 'Synchronizacja',
    action: 'Z tutoriala',
  });
};

const Tutorial = () => (
  <>
    <GlobalStyle />
    <StyledWrapper id="tutorial">
      <h1>Prawdopodobnie jesteś tutaj pierwszy raz.</h1>
      <p>Aktualnie wspierane przeglądarki: Google Chrome, Mozilla Firefox, Opera, Opera GX, Edge</p>
      <p>
        <StyledWarn icon={faExclamation} />
        Aktualnie aplikacja działa wyłącznie na komputerze, w przyszłości powstanie wersja mobilna.
      </p>
      <br />
      <h3>1. Aby móc używać aplikacji, wymagany jest dodatek do przeglądarki Tampermonkey.</h3>
      <p>Linki do pobrania (otworzą się w nowym oknie): </p>
      <ul>
        <li>
          <a
            href="https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=pl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Chrome
          </a>
        </li>
        <li>
          <a
            href="https://addons.mozilla.org/pl/firefox/addon/tampermonkey/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mozilla Firefox
          </a>
        </li>
        <li>
          <a
            href="https://addons.opera.com/en/extensions/details/tampermonkey-beta/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Opera i Opera GX
          </a>
        </li>
        <li>
          <a
            href="https://www.microsoft.com/pl-pl/p/tampermonkey/9nblggh5162s?rtc=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft Edge
          </a>
        </li>
      </ul>

      <br />
      <h3>
        2. Po pobraniu dodatku, pobierz skrypt. (otworzy się nowe okno z instalacją skryptu,
        naciśnij przycisk Zainstaluj){' '}
        <a href="https://github.com/KarolBarzowski/Dziennik/raw/master/script.user.js">Pobierz</a>
      </h3>
      <br />
      <h3>3. Jeżeli skrypt został zainstalowany, należy wykonać synchronizację:</h3>
      <br />
      <ol>
        <li>
          Wystarczy, że{' '}
          <a
            href="https://nasze.miasto.gdynia.pl/ed_miej/zest_start.pl?autoSync=true"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAddEvent}
          >
            klikniesz tutaj
          </a>{' '}
          i się zalogujesz (na ucznia lub rodzica, nie ma to znaczenia).
        </li>
        <li>Po zalogowaniu się synchronizacja przebiegnie automatycznie.</li>
        <br />
        <h4>
          <StyledWarn icon={faExclamation} />
          Uwaga! Jeżeli coś się stało i się nie zsynchronizowało skontaktuj się ze mną{' '}
          <a href="https://m.me/walterbialy" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebookMessenger} />
          </a>
          .
        </h4>
        <br />
      </ol>
      <StyledInfo>
        <a href="https://m.me/walterbialy" target="_blank" rel="noopener noreferrer">
          Zgłoś błąd <FontAwesomeIcon icon={faFacebookMessenger} />
        </a>
      </StyledInfo>
      <StyledInfo>
        <h4>
          <FontAwesomeIcon icon={faInfoCircle} fixedWidth /> Jak działa skrypt?
        </h4>
        <br />
        Skrypt pobiera dane (oceny, plan lekcji, sprawdziany, nieobecności i uwagi) z dziennika
        elektornicznego, następnie zapisuje je w pamięci dodatku Tampermonkey oraz w pamięci
        lokalnej przeglądarki.
        <br />
        Pobrane dane są widoczne tylko dla Ciebie.
        <br />
        Twórca tej aplikacji nie ma dostępu do żadnych z tych danych.
        <br />
        <br />W razie pytań:{' '}
        <a href="https://m.me/walterbialy" target="_blank" rel="noopener noreferrer">
          Kontakt przez messengera <FontAwesomeIcon icon={faFacebookMessenger} />
        </a>
      </StyledInfo>
    </StyledWrapper>
  </>
);

export default Tutorial;
