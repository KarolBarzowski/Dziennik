import React from 'react';
import styled from 'styled-components';
import GlobalStyle from 'theme/GlobalStyle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

const StyledWrapper = styled.div`
  padding: 2.5rem;
`;

const StyledWarn = styled(FontAwesomeIcon)`
  color: rgb(211, 47, 47);
  margin-right: 0.5rem;
`;

const Tutorial = () => (
  <>
    <GlobalStyle />
    <StyledWrapper id="tutorial">
      <h1>Prawdopodobnie jesteś tutaj pierwszy raz.</h1>
      <p>
        <StyledWarn icon={faExclamation} />
        Aplikacja jest tworzona pod przeglądarkę Google Chrome. Na innych dodatek może się różnić, a
        skrypt nie działać poprawnie.
      </p>
      <br />
      <h3>1. Aby móc używać aplikacji, wymagany jest dodatek Tampermonkey.</h3>
      <p>
        Link do pobrania (otworzy się w nowym oknie):{' '}
        <a
          href="https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=pl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pobierz
        </a>
      </p>
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
        <li>Zaloguj się na konto ucznia i przejdź do zakładki Ogłoszenia.</li>
        <li>
          Jeżeli masz pobrany dodatek - po prawej u góry powinien być przycisk Synchronizuj -
          kliknij go i nic nie rób.
        </li>
        <li>Otworzy się kilka nowych kart.</li>
        <li>Kiedy synchronizacja się zakończy, wyświetli się informacja o tym.</li>
        <li>Po zakończeniu - odśwież tę stronę, przeniesie cię do aplikacji.</li>
        <h4>
          <StyledWarn icon={faExclamation} />
          Uwaga! Jeżeli wystąpił jakikolwiek błąd, przez co synchronizacja nie zakończyła się
          sukcesem, wciśnij przycisk Resetuj (w Ogłoszeniach), następnie ponów instrukcję.
        </h4>
      </ol>
    </StyledWrapper>
  </>
);

export default Tutorial;
