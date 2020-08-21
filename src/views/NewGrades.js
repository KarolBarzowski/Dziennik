import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useData } from 'hooks/useData';
import Section from 'components/atoms/Section/Section';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Heading from 'components/atoms/Heading/Heading';
import Switch from 'components/atoms/Switch/Switch';
import Editor from 'components/molecules/Editor/Editor';
import GradesTable from 'components/organisms/GradesTable/GradesTable';
import GradesRow from 'components/molecules/GradesRow/GradesRow';
import { slideInDown } from 'functions/animations';
import { getColor } from 'functions/functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as Laurels } from 'assets/laurels.svg';

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
      justify-content: space-around;
    `}

  ${({ border }) =>
    border &&
    css`
      padding: 0 0 1.7rem;

      ::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: -1.5rem;
        width: calc(100% + 3rem);
        height: 0.2rem;
        background-color: ${({ theme }) => theme.background};
      }
    `}
`;

const StyledColumn = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const StyledNumber = styled(Paragraph)`
  position: relative;
  font-size: 3.4rem;
  font-family: 'Roboto';
`;

const StyledBox = styled.div`
  position: relative;
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
`;

const StyledInfo = styled(Paragraph)`
  text-align: center;
  font-size: 1.6rem;
  margin: 1rem 0;
`;

const StyledEmoji = styled.span`
  color: #ffffff;
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

function NewGrades() {
  const [currentSemester, setCurrentSemester] = useState(
    window.localStorage.getItem('semester') || '1',
  );
  const [lastSyncDate, setLastSyncDate] = useState(null);

  const { userData, gradesData } = useData();

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

  const handleSwitchSemester = () => {
    const semester = currentSemester === '1' ? '2' : '1';

    setCurrentSemester(semester);
    window.localStorage.setItem('semester', semester);
  };

  return (
    <Section>
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
        <StyledBox>
          <StyledParagraph secondary>Ostatnia aktualizacja</StyledParagraph>
          <Heading>{lastSyncDate}</Heading>
        </StyledBox>
        <StyledBox>
          <StyledParagraph secondary>Średnia przewidywana</StyledParagraph>
          <StyledNumber>4.87</StyledNumber>
        </StyledBox>
        <StyledBox>
          <StyledParagraph secondary>Średnia końcowa</StyledParagraph>
          <StyledNumber>4.64</StyledNumber>
        </StyledBox>
      </StyledRow>
      <StyledBox main>
        <StyledColumn>
          <StyledRow spacing="true" border>
            <StyledColumnTitle>Przedmiot</StyledColumnTitle>
            <StyledColumnTitle>Oceny</StyledColumnTitle>
            <StyledColumnTitle>Średnia</StyledColumnTitle>
            <StyledColumnTitle>Przewidywana</StyledColumnTitle>
            <StyledColumnTitle>Końcowa</StyledColumnTitle>
          </StyledRow>
          {gradesData.length ? (
            gradesData.map(({ name, grades }) => (
              <GradesRow key={name} name={name} grades={grades} />
            ))
          ) : (
            <StyledInfo secondary>
              Brak ocen do wyświetlenia{' '}
              <StyledEmoji role="img" aria-label="Sad">
                🙁
              </StyledEmoji>
            </StyledInfo>
          )}
        </StyledColumn>
      </StyledBox>
    </Section>
  );
}

export default NewGrades;
