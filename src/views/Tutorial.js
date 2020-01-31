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
      <h3>1. Aby móc używać aplikacji, wymagany jest dodatek Tampermonkey.</h3>
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
        2. Po pobraniu, pobierz skrypt. (otworzy się nowe okno z instalacją skryptu, naciśnij
        przycisk Zainstaluj){' '}
        <a href="https://github.com/KarolBarzowski/Dziennik/raw/master/script.user.js">Pobierz</a>
      </h3>
      <br />
      <h3>3. Po zainstalowaniu skryptu, trzeba go użyć.</h3>
      <h3>Instrukcja:</h3>
      <br />
      <ol>
        <li>
          <a
            href="https://nasze.miasto.gdynia.pl/ed_miej/login.pl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Naciśnij tu
          </a>
          , otworzy się e-dziennik w nowym oknie.
        </li>
        <li>Zaloguj się na konto ucznia lub rodzica i przejdź do zakładki Ogłoszenia.</li>
        <li>Po prawej u góry powinien być przycisk Synchronizuj - kliknij go i czekaj.</li>
        <li>Na końcu synchronizacji pokaże się informacja o sukcesie.</li>
        <li>
          Po zakończeniu - <a href="https://edziennik.netlify.com/">odśwież</a>, przeniesie cię do
          aplikacji.
        </li>
        <h4>
          <StyledWarn icon={faExclamation} />
          Uwaga! Jeżeli wystąpił jakikolwiek błąd, przez co synchronizacja nie zakończyła się
          sukcesem, wciśnij przycisk Resetuj (w Ogłoszeniach), następnie ponów instrukcję lub
          skontaktuj się ze mną{' '}
          <a href="https://m.me/walterbialy" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebookMessenger} />
          </a>
          .
        </h4>
      </ol>
      <StyledInfo>
        <a href="https://m.me/walterbialy" target="_blank" rel="noopener noreferrer">
          Zgłoś błąd <FontAwesomeIcon icon={faFacebookMessenger} />
        </a>
      </StyledInfo>
      <StyledInfo>
        <h4>
          <FontAwesomeIcon icon={faInfoCircle} fixedWidth />
          Jak działa skrypt?
        </h4>
        <br />
        Skrypt pobiera dane (oceny, plan lekcji, sprawdziany i nieobecności) z dziennika
        elektornicznego, następnie zapisuje je w pamięci dodatku Tampermonkey oraz w pamięci
        lokalnej przeglądarki.
        <br />
        Pobrane dane są widoczne tylko dla Ciebie.
        <br />
        Twórca tej aplikacji nie ma dostępu do żadnych z tych danych.
      </StyledInfo>
    </StyledWrapper>
  </>
);

export default Tutorial;
