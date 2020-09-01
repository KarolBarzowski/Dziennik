import React, { useState, useEffect, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { useOutsideClick } from 'hooks/useOutsideClick';
import { useData } from 'hooks/useData';
import { slideInDown } from 'functions/animations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import Section from 'components/atoms/Section/Section';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Heading from 'components/atoms/Heading/Heading';
import GradesRow from 'components/molecules/GradesRow/GradesRow';

const StyledHeading = styled(Heading)`
  margin-bottom: 1rem;
`;

const StyledParagraph = styled(Paragraph)`
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  margin-bottom: 1rem;
`;

const StyledRow = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;

  ${({ spacing }) =>
    spacing &&
    css`
      justify-content: space-between;
    `};

  ${({ border }) =>
    border &&
    css`
      padding: 0 0 1.7rem 0;

      ::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: -1.5rem;
        width: calc(100% + 3rem);
        height: 0.2rem;
        background-color: ${({ theme }) => theme.background};
      }
    `};
`;

const StyledColumn = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const StyledNumber = styled(Paragraph)`
  position: relative;
  font-size: 3.4rem;
  font-family: 'Roboto';
  color: ${({ theme, color }) => (theme[color] ? theme[color] : theme.text)};
`;

const StyledBox = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  border-radius: 1.5rem;
  background-color: ${({ theme }) => theme.card};
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  padding: 1.5rem;
  margin: 0 1.5rem 0 0;
  z-index: 1;
  min-width: 15rem;
  animation: ${slideInDown} ${({ theme }) => theme.slideTransition} 0.15s;

  :last-of-type {
    margin-right: 0;
  }

  ${({ main }) =>
    main &&
    css`
      margin-top: 1.5rem;
      padding: 1.5rem 0;
    `}
`;

const StyledRomanNumber = styled.span`
  font-family: 'Roboto Slab', serif;
  text-transform: uppercase;
`;

const StyledSwitchBtn = styled.button`
  position: relative;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 0.8rem;
  font-family: 'Montserrat';
  font-weight: 500;
  font-size: 1.6rem;
  background-color: rgb(10, 132, 255);
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  outline: none;

  ::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: #000000;
    opacity: 0;
    transition: opacity 0.05s ease-in-out;
  }

  :hover {
    ::before {
      opacity: 0.04;
    }
  }

  :focus {
    ::before {
      opacity: 0.12;
    }
  }
`;

const StyledSyncIcon = styled(FontAwesomeIcon)`
  margin-left: 0.5rem;
  font-size: 1.6rem;
`;

const StyledColumnTitle = styled(Paragraph)`
  color: ${({ theme }) => theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  text-align: center;
  width: 15%;

  :nth-of-type(1) {
    width: 20%;
  }

  :nth-of-type(2) {
    width: 50%;
  }
`;

const StyledInfo = styled(Paragraph)`
  text-align: center;
  font-size: 1.6rem;
  margin: 1rem 0;
`;

const StyledDefault = styled.span`
  position: absolute;
  left: 0;
  bottom: 0;
  font-size: 2.1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};

  ${({ isVisible }) =>
    isVisible
      ? css`
          visibility: visible;
          opacity: 1;
          font-size: 2.1rem;
          transform: translateX(7rem);
          transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out,
            font-size 0.2s ease-in-out;
        `
      : css`
          visibility: hidden;
          opacity: 0;
          transform: translateX(0);
          font-size: 3.4rem;
          transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out,
            font-size 0.2s ease-in-out, visibility 0s linear 0.25s;
        `};
`;

const Modal = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-flow: column nowrap;
  background-color: ${({ theme }) => theme.collapse};
  padding: 1rem;
  border-radius: 1rem;
  z-index: 99;
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  transform: ${({ x, y }) => `translate(-${x}px, ${y}px)`};

  ${({ isOpen }) =>
    isOpen
      ? css`
          visibility: visible;
          opacity: 1;
          transition: opacity 0.15s ease-in-out, visibility 0s linear 0s,
            transform 0.15s ease-in-out;
        `
      : css`
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.15s ease-in-out, visibility 0s linear 0.15s;
        `};
`;

const StyledSeparator = styled.div`
  margin: ${({ mt = 0, mr = 0, mb = 0, ml = 0 }) => `${mt}rem ${mr}rem ${mb}rem ${ml}rem`};
`;

const SettingsRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  max-width: 20rem;
  margin: 0.5rem 0;

  :first-of-type {
    margin-top: 1.5rem;
  }
`;

const StyledNumberInput = styled.input`
  width: 6rem;
  padding: 0.2rem 0.4rem;
  background-color: ${({ theme }) => theme.gray3};
  color: ${({ theme }) => theme.text};
  font-family: 'Roboto', sans-serif;
  font-size: ${({ theme }) => theme.m};
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.themeTransition},
    color ${({ theme }) => theme.themeTransition};

  :read-only {
    width: 4rem;
    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

const SettingsParagraph = styled(Paragraph)`
  font-size: ${({ theme }) => theme.m};
`;

const SettingsFooter = styled(StyledRow)`
  margin-top: 1rem;
  animation: ${slideInDown} 0.15s ease-in-out 0.05s backwards;
`;

const TextButton = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  outline: none;

  ${Paragraph} {
    color: ${({ theme }) => theme.blue} !important;
    :hover {
      text-decoration: underline;
    }
  }
`;

const List = styled.ul`
  list-style-type: none;
`;

const ListItem = styled.li`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-top: 0.5rem;

  :first-of-type {
    margin-top: 1.5rem;
  }
`;

const ColorBox = styled.div`
  height: 2.5rem;
  width: 2.5rem;
  background-color: ${({ color, theme }) => theme[color]};
  margin-right: 0.5rem;
  border-radius: 0.5rem;
`;

const monthsInYearInGenitive = [
  'stycznia',
  'lutego',
  'marca',
  'kwietnia',
  'maja',
  'czerwca',
  'lipca',
  'sierpnia',
  'września',
  'października',
  'listopada',
  'grudnia',
];

function NumberInput({ type, value, readOnly, func }) {
  const [val, setVal] = useState(value);

  useEffect(() => {
    setVal(value);
  }, [value]);

  const handleChange = e => {
    setVal(e.target.value);
    func(e);
  };

  return (
    <StyledNumberInput
      type={type}
      value={val}
      onChange={handleChange}
      step={0.01}
      readOnly={readOnly}
    />
  );
}

NumberInput.propTypes = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  func: PropTypes.func,
  readOnly: PropTypes.bool,
};

NumberInput.defaultProps = {
  type: 'number',
  readOnly: false,
  func: null,
};

function Grades() {
  const settingsModalRef = useRef(null);
  const settingsBtnRef = useRef(null);
  const legendModalRef = useRef(null);
  const legendBtnRef = useRef(null);

  const [currentSemester, setCurrentSemester] = useState(
    window.localStorage.getItem('semester') || '1',
  );
  const [lastSyncDate, setLastSyncDate] = useState(null);
  const [estimatedGrades, setEstimatedGrades] = useState([]);
  const [finalGrades, setFinalGrades] = useState([]);
  const [estimatedAverage, setEstimatedAverage] = useState();
  const [finalAverage, setFinalAverage] = useState();
  const [shouldUpdate, setShouldUpdate] = useState(0);
  const [defaultFinAvg, setDefaultFinAvg] = useState(finalAverage);
  const [defaultEstAvg, setDefaultEstAvg] = useState(estimatedAverage);
  const [estAvgColor, setEstAvgColor] = useState('text');
  const [finAvgColor, setFinAvgColor] = useState('text');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [gradesSteps, setGradesSteps] = useState(
    JSON.parse(window.localStorage.getItem('settings_regulation')) || [
      1.86,
      2.86,
      3.86,
      4.86,
      5.51,
    ],
  );
  const [isEdited, setIsEdited] = useState(false);
  const [estBehaviourGrades, setEstBehaviourGrades] = useState(['Brak', 'Brak']);
  const [finBehaviourGrades, setFinBehaviourGrades] = useState(['Brak', 'Brak']);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const { userData, gradesData, behaviourData } = useData();
  useOutsideClick(settingsModalRef, () => setIsSettingsOpen(false));
  useOutsideClick(legendModalRef, () => setIsLegendOpen(false));

  useEffect(() => {
    if (estimatedGrades.length && estimatedGrades.length <= gradesData.length) {
      let sum = 0;
      estimatedGrades.forEach(grade => {
        sum += parseFloat(grade);
      });

      const avg = (sum / estimatedGrades.length).toFixed(2);

      if (avg < defaultEstAvg) setEstAvgColor('red');
      else if (avg > defaultEstAvg) setEstAvgColor('green');
      else setEstAvgColor('text');

      setEstimatedAverage(avg);
      if (shouldUpdate === 0) {
        setDefaultEstAvg(avg);
      }
    }

    // eslint-disable-next-line
  }, [estimatedGrades, shouldUpdate, defaultEstAvg]);

  useEffect(() => {
    if (finalGrades.length && finalGrades.length <= gradesData.length) {
      let sum = 0;
      finalGrades.forEach(grade => {
        sum += parseFloat(grade);
      });

      const avg = (sum / finalGrades.length).toFixed(2);

      if (avg < defaultFinAvg) setFinAvgColor('red');
      else if (avg > defaultFinAvg) setFinAvgColor('green');
      else setFinAvgColor('text');

      setFinalAverage(avg);
      if (shouldUpdate === 0) {
        setDefaultFinAvg(avg);
      }
    }

    // eslint-disable-next-line
  }, [finalGrades, shouldUpdate, defaultFinAvg]);

  useEffect(() => {
    if (userData) {
      let fullDate = '';

      const { lastSync } = userData;
      const [date, time] = lastSync.split(' ');

      let [, month, day] = date.split('-');
      day = parseFloat(day);
      month = parseFloat(month) - 1;

      let [hour, minute] = time.split(':');
      hour = parseFloat(hour);

      const today = new Date();
      const currentDay = today.getDate();
      const currentMonth = today.getMonth();

      let yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const yesterdayMonth = yesterday.getMonth();
      yesterday = yesterday.getDate();

      if (currentDay === day && currentMonth === month) {
        fullDate = `Dzisiaj o ${hour}:${minute}`;
      } else if (yesterday === day && yesterdayMonth === month) {
        fullDate = `Wczoraj o ${hour}:${minute}`;
      } else {
        fullDate = `${day} ${monthsInYearInGenitive[month]} o ${hour}:${minute}`;
      }

      setLastSyncDate(fullDate);
    }
  }, [userData]);

  useEffect(() => {
    if (behaviourData) {
      const { estSemI, estSemII, semI, semII } = behaviourData;

      setEstBehaviourGrades([estSemI, estSemII]);
      setFinBehaviourGrades([semI, semII]);
    }
  }, [behaviourData]);

  const handleSwitchSemester = () => {
    const semester = currentSemester === '1' ? '2' : '1';

    setShouldUpdate(0);
    setFinAvgColor('text');
    setEstAvgColor('text');
    setEstimatedGrades([]);
    setFinalGrades([]);
    setCurrentSemester(semester);
    window.localStorage.setItem('semester', semester);
  };

  const handleGradeChange = (e, index) => {
    setIsEdited(true);
    const newObj = gradesSteps;
    const value = parseFloat(e.target.value);
    gradesSteps[index] = value;
    setGradesSteps(newObj);
    window.localStorage.setItem('settings_regulation', JSON.stringify(newObj));
    forceUpdate();
  };

  const handleReset = () => {
    setIsEdited(true);
    const newObj = [1.86, 2.86, 3.86, 4.86, 5.51];
    setGradesSteps(newObj);
    window.localStorage.setItem('settings_regulation', JSON.stringify(newObj));
    forceUpdate();
  };

  const handleSettingsToggle = e => {
    const { target } = e;

    const { offsetTop } = target;
    setX(15);
    setY(offsetTop + 149);
    setIsSettingsOpen(prevState => !prevState);
  };

  const handleLegendToggle = e => {
    const { target } = e;

    const { offsetTop } = target;
    setX(230);
    setY(offsetTop + 149);
    setIsLegendOpen(prevState => !prevState);
  };

  return (
    <Section>
      <Modal ref={settingsModalRef} isOpen={isSettingsOpen} x={x} y={y}>
        <Heading>Regulacja progów ocen</Heading>
        <Paragraph secondary>
          Jeżeli nauczyciel nie wystawił oceny przewidywanej
          <br /> lub końcowej, będą one liczone ze średniej ważonej.
        </Paragraph>
        <SettingsRow>
          <SettingsParagraph>1</SettingsParagraph>
          <StyledSeparator ml={0.5} mr={0.5}>
            <SettingsParagraph regular>do</SettingsParagraph>
          </StyledSeparator>
          <NumberInput type="number" value={(gradesSteps[0] - 0.01).toFixed(2)} readOnly />
          <StyledSeparator mr={4.4} />
          <StyledSeparator mr={4.4} />
        </SettingsRow>
        <SettingsRow>
          <SettingsParagraph>2</SettingsParagraph>
          <StyledSeparator ml={0.5} mr={0.5}>
            <SettingsParagraph regular>od</SettingsParagraph>
          </StyledSeparator>
          <NumberInput type="number" func={e => handleGradeChange(e, 0)} value={gradesSteps[0]} />
          <StyledSeparator ml={0.5} mr={0.5}>
            <SettingsParagraph regular>do</SettingsParagraph>
          </StyledSeparator>
          <NumberInput type="number" value={(gradesSteps[1] - 0.01).toFixed(2)} readOnly />
        </SettingsRow>
        <SettingsRow>
          <SettingsParagraph>3</SettingsParagraph>
          <StyledSeparator ml={0.5} mr={0.5}>
            <SettingsParagraph regular>od</SettingsParagraph>
          </StyledSeparator>
          <NumberInput type="number" func={e => handleGradeChange(e, 1)} value={gradesSteps[1]} />
          <StyledSeparator ml={0.5} mr={0.5}>
            <SettingsParagraph regular>do</SettingsParagraph>
          </StyledSeparator>
          <NumberInput type="number" value={(gradesSteps[2] - 0.01).toFixed(2)} readOnly />
        </SettingsRow>
        <SettingsRow>
          <SettingsParagraph>4</SettingsParagraph>
          <StyledSeparator ml={0.5} mr={0.5}>
            <SettingsParagraph regular>od</SettingsParagraph>
          </StyledSeparator>
          <NumberInput type="number" func={e => handleGradeChange(e, 2)} value={gradesSteps[2]} />
          <StyledSeparator ml={0.5} mr={0.5}>
            <SettingsParagraph regular>do</SettingsParagraph>
          </StyledSeparator>
          <NumberInput type="number" value={(gradesSteps[3] - 0.01).toFixed(2)} readOnly />
        </SettingsRow>
        <SettingsRow>
          <SettingsParagraph>5</SettingsParagraph>
          <StyledSeparator ml={0.5} mr={0.5}>
            <SettingsParagraph regular>od</SettingsParagraph>
          </StyledSeparator>
          <NumberInput type="number" func={e => handleGradeChange(e, 3)} value={gradesSteps[3]} />
          <StyledSeparator ml={0.5} mr={0.5}>
            <SettingsParagraph regular>do</SettingsParagraph>
          </StyledSeparator>
          <NumberInput type="number" value={(gradesSteps[4] - 0.01).toFixed(2)} readOnly />
        </SettingsRow>
        <SettingsRow>
          <SettingsParagraph>6</SettingsParagraph>
          <StyledSeparator ml={0.5} mr={0.5}>
            <SettingsParagraph regular>od</SettingsParagraph>
          </StyledSeparator>
          <NumberInput type="number" func={e => handleGradeChange(e, 4)} value={gradesSteps[4]} />
          <StyledSeparator mr={3.6} />
          <StyledSeparator mr={3.6} />
        </SettingsRow>
        <SettingsRow>
          <TextButton type="button" onClick={handleReset}>
            <Paragraph secondary>Resetuj</Paragraph>
          </TextButton>
        </SettingsRow>
        {isEdited ? (
          <SettingsFooter>
            <TextButton type="button" onClick={() => window.location.reload()}>
              <Paragraph secondary>Odśwież</Paragraph>
            </TextButton>
            <Paragraph secondary>, aby zobaczyć zmiany.</Paragraph>
          </SettingsFooter>
        ) : null}
      </Modal>
      <Modal ref={legendModalRef} isOpen={isLegendOpen} x={x} y={y}>
        <Heading>Legenda</Heading>
        <List>
          <ListItem>
            <ColorBox color="textSecondary" />
            <SettingsParagraph>Nie liczona do średniej</SettingsParagraph>
          </ListItem>
          <ListItem>
            <ColorBox color="red" />
            <SettingsParagraph>Sprawdzian</SettingsParagraph>
          </ListItem>
          <ListItem>
            <ColorBox color="red" />
            <SettingsParagraph>Test</SettingsParagraph>
          </ListItem>
          <ListItem>
            <ColorBox color="red" />
            <SettingsParagraph>Praca klasowa</SettingsParagraph>
          </ListItem>
          <ListItem>
            <ColorBox color="orange" />
            <SettingsParagraph>Kartkówka</SettingsParagraph>
          </ListItem>
          <ListItem>
            <ColorBox color="orange" />
            <SettingsParagraph>Praca z tekstem</SettingsParagraph>
          </ListItem>
          <ListItem>
            <ColorBox color="orange" />
            <SettingsParagraph>Rozumienie ze słuchu</SettingsParagraph>
          </ListItem>
          <ListItem>
            <ColorBox color="blue" />
            <SettingsParagraph>Odpowiedź ustna</SettingsParagraph>
          </ListItem>
          <ListItem>
            <ColorBox color="blue" />
            <SettingsParagraph>Konwersacja</SettingsParagraph>
          </ListItem>
          <ListItem>
            <ColorBox color="blue" />
            <SettingsParagraph>Ćwiczenie</SettingsParagraph>
          </ListItem>
          <ListItem>
            <ColorBox color="green" />
            <SettingsParagraph>Aktywność</SettingsParagraph>
          </ListItem>
          <ListItem>
            <ColorBox color="green" />
            <SettingsParagraph>Praca domowa</SettingsParagraph>
          </ListItem>
          <ListItem>
            <ColorBox color="purple" />
            <SettingsParagraph>Praca pisemna/referat</SettingsParagraph>
          </ListItem>
          <ListItem>
            <ColorBox color="purple" />
            <SettingsParagraph>Projekt/zadanie</SettingsParagraph>
          </ListItem>
          <ListItem>
            <ColorBox color="purple" />
            <SettingsParagraph>Prezentacja</SettingsParagraph>
          </ListItem>
          <ListItem>
            <ColorBox color="text" />
            <SettingsParagraph>Inne</SettingsParagraph>
          </ListItem>
        </List>
      </Modal>
      <StyledRow spacing>
        <StyledRow>
          <StyledBox>
            <StyledHeading>
              Semestr <StyledRomanNumber>{currentSemester === '1' ? 'I' : 'II'}</StyledRomanNumber>
            </StyledHeading>
            <StyledSwitchBtn type="button" onClick={handleSwitchSemester}>
              Semestr{' '}
              <StyledRomanNumber>
                {currentSemester === '1' ? 'II' : 'I'}
                <StyledSyncIcon icon={faSyncAlt} />
              </StyledRomanNumber>
            </StyledSwitchBtn>
          </StyledBox>
          {lastSyncDate ? (
            <StyledBox>
              <StyledParagraph secondary>Ostatnia aktualizacja</StyledParagraph>
              <Heading>{lastSyncDate}</Heading>
            </StyledBox>
          ) : null}
          {estimatedAverage !== 'NaN' ? (
            <StyledBox>
              <StyledParagraph secondary>Średnia przewidywana</StyledParagraph>
              <StyledNumber color={estAvgColor}>
                {estimatedAverage}
                <StyledDefault isVisible={defaultEstAvg !== estimatedAverage}>
                  {defaultEstAvg}
                </StyledDefault>
              </StyledNumber>
            </StyledBox>
          ) : null}
          {finalAverage !== 'NaN' ? (
            <StyledBox>
              <StyledParagraph secondary>Średnia końcowa</StyledParagraph>
              <StyledNumber color={finAvgColor}>
                {finalAverage}
                <StyledDefault isVisible={defaultFinAvg !== finalAverage}>
                  {defaultFinAvg}
                </StyledDefault>
              </StyledNumber>
            </StyledBox>
          ) : null}
          <StyledBox>
            <StyledParagraph secondary>
              Zachowanie <br />
              Proponowana | Końcowa
            </StyledParagraph>
            <StyledRow spacing>
              <Heading>{estBehaviourGrades[parseFloat(currentSemester) - 1]}</Heading>
              <Heading>{finBehaviourGrades[parseFloat(currentSemester) - 1]}</Heading>
            </StyledRow>
          </StyledBox>
        </StyledRow>
        <StyledRow>
          <StyledBox>
            <StyledParagraph secondary>Legenda</StyledParagraph>
            <StyledSwitchBtn type="button" onClick={handleLegendToggle} ref={legendBtnRef}>
              Pokaż legendę
            </StyledSwitchBtn>
          </StyledBox>
          <StyledBox>
            <StyledParagraph secondary>Ustawienia</StyledParagraph>
            <StyledSwitchBtn type="button" onClick={handleSettingsToggle} ref={settingsBtnRef}>
              Otwórz ustawienia
            </StyledSwitchBtn>
          </StyledBox>
        </StyledRow>
      </StyledRow>
      <StyledBox main>
        <StyledColumn>
          <StyledRow border>
            <StyledColumnTitle>Przedmiot</StyledColumnTitle>
            <StyledColumnTitle>Oceny</StyledColumnTitle>
            <StyledColumnTitle>Średnia</StyledColumnTitle>
            <StyledColumnTitle>Przewidywana</StyledColumnTitle>
            <StyledColumnTitle>Końcowa</StyledColumnTitle>
          </StyledRow>
          {gradesData.length ? (
            gradesData.map(({ name, grades }, i) => (
              <GradesRow
                key={name}
                name={name}
                grades={grades}
                semester={currentSemester}
                estimatedGrades={estimatedGrades}
                finalGrades={finalGrades}
                setEstimatedGrades={setEstimatedGrades}
                setFinalGrades={setFinalGrades}
                index={i}
                setShouldUpdate={setShouldUpdate}
              />
            ))
          ) : (
            <StyledInfo secondary>
              Brak ocen do wyświetlenia{' '}
              <span role="img" aria-label="Sad">
                🙁
              </span>
            </StyledInfo>
          )}
        </StyledColumn>
      </StyledBox>
    </Section>
  );
}

export default Grades;
