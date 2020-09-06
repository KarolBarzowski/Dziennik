import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useData } from 'hooks/useData';
import { getCleanName, getColor } from 'functions/functions';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Card from 'components/atoms/Card/Card';
import { ReactComponent as NoData } from 'assets/images/no_exams.svg';

const slideIn = keyframes`
  from {
    transform: translateX(-1.5rem);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const StyledHeading = styled(Heading)`
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const Title = styled(Paragraph)`
  margin-top: 1.5rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const Name = styled(Paragraph)`
  font-size: 1.6rem;
  width: calc(33% - 1rem);
  color: ${({ theme, color }) => (theme[color] ? theme[color] : theme.text)};

  :nth-of-type(3) {
    text-align: right;
  }
`;

const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.dp01};
  margin: 1rem 0;
  border-radius: 1rem;
  padding: 1.5rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const StyledImg = styled(NoData)`
  pointer-events: none;
  height: 14.4rem;
  width: 14.4rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const Empty = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  margin: 2.5rem;
`;

const Info = styled(Paragraph)`
  font-size: 1.6rem;
  margin-top: 1.5rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
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

const daysInWeek = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

const today = new Date();
const currentDay = today.getDate();
const currentMonth = today.getMonth();

let tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const tomorrowMonth = tomorrow.getMonth();
tomorrow = tomorrow.getDate();

function ExamsCard() {
  const [todayExams, setTodayExams] = useState([]);
  const [tomorrowExams, setTomorrowExams] = useState([]);
  const [nextWeekExams, setNextWeekExams] = useState([]);
  const [restExams, setRestExams] = useState([]);
  const [isData, setIsData] = useState(false);

  const { examsData } = useData();

  useEffect(() => {
    if (examsData) {
      const today = [];
      const tomorrow = [];
      const nextWeek = [];
      const rest = [];

      examsData.forEach(exam => {
        const { name, category } = exam;

        const [day, month, year] = exam.date.split('/');
        const date = new Date(`20${year}`, month - 1, day, 0, 0, 0, 0);
        const dateTs = date.getTime();

        const now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        const ts = now.getTime();

        let dateSyntax;

        if (currentDay === day && currentMonth === month - 1) {
          dateSyntax = `Dzisiaj`;
        } else if (tomorrow === day && tomorrowMonth === month - 1) {
          dateSyntax = `Jutro`;
        } else {
          dateSyntax = `${parseFloat(day)} ${monthsInYearInGenitive[month - 1]}`;
        }

        const dayName = daysInWeek[date.getDay()];

        let newCategory = category;

        if (!exam.category.length) {
          newCategory = 'Inne';
        }

        const examObj = {
          name,
          dateSyntax,
          dayName,
          category: newCategory,
        };

        if (dateTs >= ts) {
          const difference = dateTs - ts;
          const dayInSeconds = 1000 * 60 * 60 * 24;
          const daysDifference = Math.floor(difference / dayInSeconds);
          const isNextWeek = daysDifference < 6;

          if (isNextWeek) {
            if (daysDifference === 0) {
              today.push(examObj);
            } else if (daysDifference === 1) {
              tomorrow.push(examObj);
            } else {
              nextWeek.push(examObj);
            }
          } else {
            rest.push(examObj);
          }
        }
      });

      setIsData(today.length + tomorrow.length + nextWeek.length + rest.length);
      setTodayExams(today);
      setTomorrowExams(tomorrow);
      setNextWeekExams(nextWeek);
      setRestExams(rest);
    }
  }, [examsData]);

  return (
    <Card>
      <StyledHeading delay={0.05}>Sprawdziany</StyledHeading>
      {!isData ? (
        <Empty>
          <StyledImg delay={0.1} />
          <Info secondary delay={0.15}>
            Żadnych nadchodzących zadań
          </Info>
        </Empty>
      ) : null}
      {todayExams.length ? (
        <>
          <Title secondary delay={0.1}>
            Dzisiaj
          </Title>
          {todayExams.map(({ name, category, dayName }) => (
            <Row delay={0.15}>
              <Name>{dayName}</Name>
              <Name color={getCleanName(name)}>{name}</Name>
              <Name color={getColor(category)}>{category}</Name>
            </Row>
          ))}
        </>
      ) : null}
      {tomorrowExams.length ? (
        <>
          <Title secondary delay={0.1}>
            Jutro
          </Title>
          {tomorrowExams.map(({ name, category, dayName }) => (
            <Row delay={0.15}>
              <Name>{dayName}</Name>
              <Name color={getCleanName(name)}>{name}</Name>
              <Name color={getColor(category)}>{category}</Name>
            </Row>
          ))}
        </>
      ) : null}
      {nextWeekExams.length ? (
        <>
          <Title secondary delay={0.1}>
            Najbliższy tydzień
          </Title>
          {nextWeekExams.map(({ name, category, dayName }) => (
            <Row delay={0.15}>
              <Name>{dayName}</Name>
              <Name color={getCleanName(name)}>{name}</Name>
              <Name color={getColor(category)}>{category}</Name>
            </Row>
          ))}
        </>
      ) : null}
      {restExams.length ? (
        <>
          <Title secondary delay={0.1}>
            Później
          </Title>
          {restExams.map(({ name, category, dateSyntax }) => (
            <Row delay={0.15}>
              <Name>{dateSyntax}</Name>
              <Name color={getCleanName(name)}>{name}</Name>
              <Name color={getColor(category)}>{category}</Name>
            </Row>
          ))}
        </>
      ) : null}
    </Card>
  );
}

export default ExamsCard;
