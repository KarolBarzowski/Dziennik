import React from 'react';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import GlobalStyle from 'theme/GlobalStyle';

ReactGA.initialize(process.env.REACT_APP_TRACKING_ID);
ReactGA.pageview('tutorial');

const StyledWrapper = styled.div`
  padding: 2.5rem;
  color: rgba(255, 255, 255, 0.87);

  a {
    color: rgb(10, 132, 255);
    text-decoration: none;
  }

  ol,
  ul {
    margin-left: 2.5rem;
  }
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
      <h1>Witaj! Prawdopodobnie jesteś tutaj pierwszy raz.</h1>
      <br />

      <h2>Dlaczego widzisz to okno, a nie aplikacje?</h2>
      <h2>- Aplikacja aby działać potrzebuje danych ze szkolnego edziennika.</h2>
      <br />

      <h2>Jak pobrać te dane?</h2>
      <h2>- Jest to bardzo proste. Potrzebujesz jedynie dodatku do przeglądarki i gotowe!</h2>
      <br />

      <h2>1. Pobierz dodatek Tampermonkey.</h2>
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

      <h2>2. Pobierz skrypt do dodatku Tampermonkey.</h2>
      <p>Otworzy się nowe okno z instalacją skryptu, naciśnij przycisk Zainstaluj.</p>
      <a href="https://github.com/KarolBarzowski/Dziennik/raw/master/script.user.js">Pobierz</a>
      <br />
      <br />

      <h2>3. Wykonaj swoją pierwszą synchronizację!</h2>
      <p>
        Wystarczy, że klikniesz poniższy niebieski napis &quot;Synchronizuj&quot;. Otworzy się
        edziennik, wtedy zaloguj się na konto ucznia bądź rodzica - nie ma to znaczenia.
      </p>
      <p>
        Po zalogowaniu synchronizacja przebiegnie automatycznie, a na koniec przekieruje Cię do
        właściwej aplikacji!{' '}
        <span role="img" aria-label="Sunglasses emoji">
          😎
        </span>
      </p>
      <a
        href="https://nasze.miasto.gdynia.pl/ed_miej/zest_start.pl?autoSync=true"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleAddEvent}
      >
        Synchronizuj
      </a>
      <br />
      <br />
      <br />
      <br />

      <p>FAQ:</p>
      <p>Q: Mam się zalogować, ale skąd wiem, że skrypt nie ukradnie mi mojego hasła?</p>
      <p>
        A: Bez obaw! Skrypt nie działa na podstronie wymagającej zalogowania się. Możesz to
        sprawdzić - gdy będziesz się logował zobacz,
        <br />
        że po kliknięciu na dodatek Tampermonkey nie widać aktywnego skryptu, a po zalogowaniu -
        widać.
      </p>
      <br />
      <p>
        W razie pytań - pisz śmiało na{' '}
        <a href="https://m.me/walterbialy" target="_blank" rel="noopener noreferrer">
          messengerze
        </a>
        !
      </p>
    </StyledWrapper>
  </>
);

export default Tutorial;
