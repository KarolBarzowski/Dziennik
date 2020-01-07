import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useData } from 'hooks/useData';
import { useOutsideClick } from 'hooks/useOutsideClick';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Heading from 'components/atoms/Heading/Heading';
import Switch from 'components/atoms/Switch/Switch';
import Radio from 'components/atoms/Radio/Radio';
import TimePicker from 'components/atoms/TimePicker/TimePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSyncAlt,
  faPalette,
  faCogs,
  faTimes,
  faExternalLinkAlt,
  faExclamation,
  faDownload,
  faCodeBranch,
} from '@fortawesome/free-solid-svg-icons';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import { fadeIn } from 'functions/animations';

const StyledBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.32);
  z-index: 19;
`;

const StyledWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  display: flex;
  flex-flow: row nowrap;
  height: 80vh;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
  border-radius: 1.5rem;
  color: ${({ theme }) => theme.text};
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  z-index: 20;
  transition: background-color ${({ theme }) => theme.themeTransition};
  animation: ${fadeIn} ${({ theme }) => theme.fadeTransition};

  @media screen and (min-width: 600px) {
    width: 80%;
  }
`;

const StyledSidenav = styled.aside`
  position: relative;
  height: 100%;
  width: 26rem;
  background-color: ${({ theme }) => theme.card};
  border-radius: 1.5rem 0 0 1.5rem;
  padding: 1rem 0;
`;

const StyledContent = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.card};
  border-radius: 0 1.5rem 1.5rem 0;
  border-left: 1px solid ${({ theme }) => theme.border};
  padding: 1rem 1.5rem;
`;

const StyledList = styled.ul`
  list-style: none;
  margin-top: 2rem;
`;

const StyledListItem = styled.li`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: ${({ theme, active }) => (active ? theme.modalFocus : 'transparent')};
  user-select: none;
  cursor: pointer;

  :hover {
    background-color: ${({ theme, active }) => !active && theme.modalHover};
  }

  :last-of-type {
    position: absolute;
    bottom: 1.5rem;
    width: 100%;
  }
`;

const StyledIcon = styled(FontAwesomeIcon)`
  margin: ${({ ml = 0, mr = 0 }) => `0 ${mr}rem 0 ${ml}rem`};
  font-size: 2rem;
  transition: color ${({ theme }) => theme.themeTransition};
`;

const StyledHeading = styled(Heading)`
  margin-left: 1.5rem;
`;

const StyledTopbar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding-bottom: 1rem;
`;

const StyledClose = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  font-size: 2.4rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: color ${({ theme }) => theme.themeTransition};
`;

const StyledPage = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  height: 90%;
  width: 100%;
  overflow-y: scroll;
  @media screen and (min-width: 600px) {
    overflow-y: auto;
  }
`;

const StyledParagraph = styled(Paragraph)`
  font-size: ${({ theme }) => theme.m};
`;

const StyledButton = styled.button`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0.4rem 1.4rem;
  margin-top: 2rem;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  font-size: ${({ theme }) => theme.s} !important;
  font-weight: ${({ theme }) => theme.medium};
  border: 0.2rem solid ${({ theme }) => theme.border};
  border-radius: 5rem;
  transition: background-color 0.1s ease-in-out;
  :hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }

  ${StyledIcon} {
    font-size: 1.4rem;
  }
`;

const StyledPreviewsContainer = styled.div`
  display: flex;
  margin-bottom: 2.5rem;
`;

const StyledCheckmark = styled.span`
  height: 2rem;
  width: 2rem;
  background-color: transparent;
  border-radius: 50%;
  border: 1px solid silver;
  margin-top: 0.5rem;
  transition: background-color 0.15s ease-in-out 0.05s;

  ::after {
    content: '';
    position: absolute;
    display: none;
    left: 50%;
    bottom: 0.3rem;
    width: 0.6rem;
    height: 1.2rem;
    border: solid ${({ theme }) => theme.checkmark};
    border-width: 0 1.5px 1.5px 0;
    transform: rotate(45deg) translateX(-50%);
    transition: border-color 0.15s ease-in-out 0.05s;
  }
`;

const StyledCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;

  :checked ~ ${StyledCheckmark} {
    background-color: ${({ theme }) => theme.blue};
    border-color: ${({ theme }) => theme.blue};
  }

  :checked ~ ${StyledCheckmark}::after {
    display: block;
  }
`;

const StyledPreviewWrapper = styled.label`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  cursor: pointer;
  :last-child {
    margin-left: 1.5rem;
  }

  :hover ${StyledCheckbox}:not(:checked) ~ ${StyledCheckmark} {
    background-color: ${({ theme }) => theme.modalHover};
  }
`;

const StyledPreview = styled.div`
  position: relative;
  height: 5.5rem;
  width: 8.9rem;
  background-color: ${({ theme, dark }) =>
    dark ? theme.themePreviewDark : theme.themePreviewLight};
  margin-bottom: 0.5rem;
  border-radius: 0.4rem;
  border: 1px solid ${({ theme, dark }) => (dark ? theme.themePreviewDark : theme.gray5)};
`;

const StyledPreviewNav = styled.div`
  position: absolute;
  top: 0.3rem;
  right: 0.4rem;
  height: 0.6rem;
  width: 60%;
  background-color: ${({ theme, dark }) => (dark ? theme.dp08 : theme.gray5)};
  border-radius: 5rem;
`;

const StyledPreviewCard = styled.div`
  position: absolute;
  top: 1.4rem;
  left: 50%;
  transform: translateX(-50%);
  height: 3.4rem;
  width: 2.4rem;
  background-color: ${({ theme, dark }) => (dark ? theme.dp08 : theme.gray5)};
  border-radius: 0.4rem;

  ::before,
  ::after {
    content: '';
    position: absolute;
    width: 100%;
    background-color: ${({ theme, dark }) => (dark ? theme.dp08 : theme.gray5)};
    border-radius: 0.4rem;
  }

  ::before {
    right: 2.8rem;
    height: 60%;
  }

  ::after {
    left: 2.8rem;
    height: 80%;
  }
`;

const StyledOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${Paragraph} {
    font-size: ${({ theme }) => theme.m};
  }
`;

const StyledOptionsWrapper = styled.div`
  min-width: 25rem;
`;

const StyledSeparator = styled.div`
  margin: ${({ mt = 0, mr = 0, mb = 0, ml = 0 }) => `${mt}rem ${mr}rem ${mb}rem ${ml}rem`};
`;

const StyledSlideAnimation = styled.div`
  opacity: ${({ active }) => (active ? 1 : 0)};
  transform: ${({ active }) => (active ? 'translateY(0)' : 'translateY(-1.5rem)')};
  visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
  transition: opacity ${({ active }) => (active ? '.15s' : '.25s')} ease-in-out 0.05s,
    transform ${({ active }) => (active ? '.15s' : '.25s')} ease-in-out 0.05s,
    visibility 0s ${({ active }) => (active ? '0s' : '.3s')};
`;

const StyledWarnIcon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.error};
  font-size: 2rem;
  margin-right: 0.5rem;
`;

function Modal({
  handleModalToggle,
  toggleTheme,
  theme,
  isAutomatic,
  isCustom,
  setOptions,
  schedule,
}) {
  const outsideRef = useRef();
  const { userData } = useData();
  const [currentPage, setCurrentPage] = useState('Synchronizacja');
  const [syncDate, setSyncDate] = useState('Ładowanie...');
  const [lastSync, setLastSync] = useState('Ładowanie...');

  useEffect(() => {
    if (userData) {
      let date = new Date(userData.timestamp);
      let day = `0${date.getDate()}`.slice(-2);
      let month = `0${date.getMonth() + 1}`.slice(-2);
      let hour = `0${date.getHours()}`.slice(-2);
      const minutes = `0${date.getMinutes()}`.slice(-2);
      setSyncDate(`${day}.${month} ${hour}:${minutes}`);

      date = userData.lastSync.split('-');
      let rest;
      [, month, rest] = date;
      rest = rest.split(' ');
      [day, hour] = rest;
      setLastSync(`${day}.${month} ${hour}`);
    }
  }, [userData]);

  useOutsideClick(outsideRef, () => handleModalToggle());

  const handleNavClick = page => setCurrentPage(page);

  const handleTimeChange = (e, option) => {
    switch (option) {
      case 'start':
        setOptions('schedule', { ...schedule, start: e.target.value });
        break;
      case 'end':
        setOptions('schedule', { ...schedule, end: e.target.value });
        break;
      default:
        break;
    }
  };

  return (
    <StyledBackground>
      <StyledWrapper ref={outsideRef}>
        <StyledSidenav>
          <StyledHeading>Ustawienia</StyledHeading>
          <StyledList>
            <StyledListItem
              active={currentPage === 'Synchronizacja'}
              onClick={() => handleNavClick('Synchronizacja')}
            >
              <StyledIcon icon={faSyncAlt} fixedWidth mr={1.5} />
              <Paragraph>Synchronizacja</Paragraph>
            </StyledListItem>
            <StyledListItem
              active={currentPage === 'Motyw'}
              onClick={() => handleNavClick('Motyw')}
            >
              <StyledIcon icon={faPalette} fixedWidth mr={1.5} />
              <Paragraph>Motyw</Paragraph>
            </StyledListItem>
            <StyledListItem
              active={currentPage === 'Funkcje'}
              onClick={() => handleNavClick('Funkcje')}
            >
              <StyledIcon icon={faCogs} fixedWidth mr={1.5} />
              <Paragraph>Funkcje</Paragraph>
            </StyledListItem>
            <StyledListItem
              active={currentPage === 'Wersja'}
              onClick={() => handleNavClick('Wersja')}
            >
              <StyledIcon icon={faCodeBranch} fixedWidth mr={1.5} />
              <Paragraph>Wersja</Paragraph>
            </StyledListItem>
          </StyledList>
        </StyledSidenav>
        <StyledContent>
          <StyledTopbar>
            <Heading>{currentPage}</Heading>
            <StyledClose type="button" onClick={() => handleModalToggle()}>
              <FontAwesomeIcon icon={faTimes} fixedWidth />
            </StyledClose>
          </StyledTopbar>
          {currentPage === 'Synchronizacja' && (
            <StyledPage>
              <StyledParagraph regular>Ostatnia synchronizacja: {syncDate}</StyledParagraph>
              <StyledParagraph regular>Data sychronizacji e-dziennika: {lastSync}</StyledParagraph>
              <StyledButton
                as="a"
                href="https://nasze.miasto.gdynia.pl/ed_miej/login.pl"
                target="_blank"
                rel="noreferrer noopener"
              >
                Synchronizuj
                <StyledIcon icon={faExternalLinkAlt} fixedWidth ml={0.5} />
              </StyledButton>
              <StyledSeparator mt={1.5} />
              <StyledOption>
                <Heading>Jak synchronizować?</Heading>
              </StyledOption>
              <StyledSeparator ml={2} mt={1}>
                <ol>
                  <li>Naciśnij przycisk Synchronizuj, otworzy się e-dziennik w nowym oknie.</li>
                  <li>Zaloguj się na konto UCZNIA i przejdź do zakładki Ogłoszenia.</li>
                  <li>
                    Jeżeli masz pobrany dodatek - po prawej u góry powinien być przycisk
                    Synchronizuj - kliknij go i nic nie rób.
                  </li>
                  <li>Otworzy się kilka nowych kart.</li>
                  <li>Kiedy synchronizacja się zakończy, wyświetli się informacja o tym.</li>
                  <li>Po zakończeniu - odśwież tą stronę.</li>
                </ol>
              </StyledSeparator>
              <StyledSeparator mt={1.5} />
              <StyledOption>
                <StyledWarnIcon icon={faExclamation} />
                <Paragraph>
                  Uwaga! Jeżeli wystąpił jakikolwiek błąd, przez co synchronizacja nie zakończyła
                  się sukcesem, wciśnij przycisk Resetuj (w Ogłoszeniach).
                </Paragraph>
              </StyledOption>
              <StyledOption>
                <StyledButton
                  as="a"
                  href="https://github.com/KarolBarzowski/Dziennik/raw/master/script.user.js"
                >
                  Skrypt
                  <StyledIcon icon={faDownload} fixedWidth ml={0.5} />
                </StyledButton>
              </StyledOption>
            </StyledPage>
          )}
          {currentPage === 'Motyw' && (
            <StyledPage>
              <StyledPreviewsContainer>
                <StyledPreviewWrapper onClick={() => toggleTheme('light')}>
                  <StyledPreview>
                    <StyledPreviewNav />
                    <StyledPreviewCard />
                  </StyledPreview>
                  <Paragraph>Jasny</Paragraph>
                  <StyledCheckbox
                    type="radio"
                    checked={theme === 'light'}
                    name="theme"
                    onChange={() => null}
                  />
                  <StyledCheckmark />
                </StyledPreviewWrapper>
                <StyledPreviewWrapper onClick={() => toggleTheme('dark')}>
                  <StyledPreview dark>
                    <StyledPreviewNav dark />
                    <StyledPreviewCard dark />
                  </StyledPreview>
                  <Paragraph>Ciemny</Paragraph>
                  <StyledCheckbox
                    type="radio"
                    checked={theme === 'dark'}
                    name="theme"
                    onChange={() => null}
                  />
                  <StyledCheckmark />
                </StyledPreviewWrapper>
              </StyledPreviewsContainer>
              <StyledOptionsWrapper>
                <StyledOption>
                  <Paragraph regular>Automatycznie</Paragraph>
                  <Switch
                    onChange={() =>
                      setOptions('isAutomatic', isAutomatic === 'true' ? 'false' : 'true')
                    }
                    checked={isAutomatic === 'true'}
                  />
                </StyledOption>
                <StyledSeparator mt={1} />
                <StyledSlideAnimation active={isAutomatic === 'true'}>
                  <StyledOption>
                    <Radio
                      name="schedule"
                      checked={isCustom === 'false' || !isCustom}
                      onChange={() => setOptions('isCustom', 'false')}
                    >
                      <Paragraph regular>Od zmierzchu do świtu</Paragraph>
                    </Radio>
                  </StyledOption>
                  <StyledSeparator mt={0.4} />
                  <StyledOption>
                    <Radio
                      name="schedule"
                      checked={isCustom === 'true'}
                      onChange={() => setOptions('isCustom', 'true')}
                    >
                      <Paragraph regular>Własny harmonogram</Paragraph>
                    </Radio>
                  </StyledOption>
                </StyledSlideAnimation>
                <StyledSeparator mt={1} />
                <StyledSlideAnimation active={isCustom === 'true' && isAutomatic === 'true'}>
                  <StyledOption>
                    <Paragraph regular>Jasny motyw od:</Paragraph>
                    <StyledSeparator ml={2} />
                    <TimePicker
                      type="time"
                      value={schedule.end}
                      onChange={e => handleTimeChange(e, 'end')}
                    />
                  </StyledOption>
                  <StyledOption>
                    <Paragraph regular>Ciemny motyw od:</Paragraph>
                    <StyledSeparator ml={1} />
                    <TimePicker
                      type="time"
                      value={schedule.start}
                      onChange={e => handleTimeChange(e, 'start')}
                    />
                  </StyledOption>
                </StyledSlideAnimation>
              </StyledOptionsWrapper>
            </StyledPage>
          )}
          {currentPage === 'Funkcje' && <StyledPage>Wkrótce</StyledPage>}
          {currentPage === 'Wersja' && (
            <StyledPage>
              <StyledParagraph regular>Aktualna wersja: 1.1.0</StyledParagraph>
              <StyledParagraph regular>Zalecana wersja skryptu: 1.7.2</StyledParagraph>
              <StyledButton
                as="a"
                href="https://github.com/KarolBarzowski/Dziennik/raw/master/script.user.js"
              >
                Aktualizuj Skrypt
                <StyledIcon icon={faDownload} fixedWidth ml={0.5} />
              </StyledButton>
              <StyledButton
                as="a"
                href="https://github.com/KarolBarzowski/Dziennik/blob/master/CHANGELOG.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Changelog
                <StyledIcon icon={faExternalLinkAlt} fixedWidth ml={0.5} />
              </StyledButton>
              <StyledButton
                as="a"
                href="https://m.me/walterbialy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Zgłoś błąd / Prześlij opinie
                <StyledIcon icon={faFacebookMessenger} fixedWidth ml={0.5} />
              </StyledButton>
            </StyledPage>
          )}
        </StyledContent>
      </StyledWrapper>
    </StyledBackground>
  );
}

Modal.propTypes = {
  handleModalToggle: PropTypes.func.isRequired,
  toggleTheme: PropTypes.func.isRequired,
  theme: PropTypes.string,
  isAutomatic: PropTypes.string.isRequired,
  isCustom: PropTypes.string.isRequired,
  setOptions: PropTypes.func.isRequired,
  schedule: PropTypes.objectOf(PropTypes.string).isRequired,
};

Modal.defaultProps = {
  theme: 'light',
};

export default Modal;
