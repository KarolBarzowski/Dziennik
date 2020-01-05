import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useData } from 'hooks/useData';
import Section from 'components/atoms/Section/Section';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Card from 'components/organisms/Card/Card';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  width: 100%;
  padding-top: 4.5rem;
`;

const StyledCenter = styled.div`
  text-align: center;
  ${Paragraph} {
    font-size: ${({ theme }) => theme.m};
  }
`;

function Plan() {
  const { planData, examsData } = useData(null);
  const [plan, setPlan] = useState([
    'Ładowanie...',
    'Ładowanie...',
    'Ładowanie...',
    'Ładowanie...',
    'Ładowanie...',
  ]);
  const [exams, setExams] = useState([]);
  const [dates, setDates] = useState([]);

  const date = new Date();
  const daysInWeek = [
    'Niedziela',
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
  ];
  const monthsInYear = [
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
  const daysSequence = [
    [0, 0, 1, 2, 3, 4, 0],
    [0, 1, 2, 3, 4, 0, 0],
    [1, 2, 3, 4, 0, 0, 0],
    [2, 3, 4, 0, 0, 0, 1],
    [3, 4, 0, 0, 0, 1, 2],
    [4, 0, 0, 0, 1, 2, 3],
    [0, 0, 0, 1, 2, 3, 4],
  ];
  const today = date.getDay();

  useEffect(() => {
    const upcomingExams = [];
    if (examsData) {
      examsData.forEach(({ category, date: examDate, name, description }) => {
        const dateArray = examDate.split('/');
        const day = parseFloat(dateArray[0]);
        const month = parseFloat(dateArray[1]) - 1;
        const year = `20${dateArray[2]}`;
        const dateResult = new Date(year, month, day);

        if (date < dateResult) {
          const difference = dateResult.getTime() - date.getTime();
          const dayInSeconds = 1000 * 60 * 60 * 24;
          const daysDifference = Math.floor(difference / dayInSeconds);
          if (daysDifference < 6) {
            upcomingExams.push({
              date: dateResult,
              name,
              category,
              desc: description,
            });
          }
        }
      });

      const tomorrow = new Date(date);
      const results = [[], [], [], [], [], []];

      const sortedUpcoming = upcomingExams.sort((a, b) => b.date - a.date);
      sortedUpcoming.reverse();

      for (let i = 0; i < 7; i += 1) {
        const nextExams = [];
        sortedUpcoming.forEach(exam => {
          tomorrow.setDate(date.getDate() + i);
          tomorrow.setHours(0, 0, 0, 0);

          if (exam.date.getTime() === tomorrow.getTime()) {
            nextExams.push(exam);
          }
        });
        results[daysSequence[today][i]].push(...nextExams);
      }

      const datesArray = [[], [], [], [], []];
      for (let i = 0; i < 7; i += 1) {
        tomorrow.setDate(date.getDate() + i);
        if (tomorrow.getDay() !== 0 && tomorrow.getDay() !== 6) {
          const dd = tomorrow.getDate();
          const mm = monthsInYear[tomorrow.getMonth()];
          const dateSyntax = `${dd} ${mm}`;
          datesArray[daysSequence[today][i]].push(dateSyntax);
        }
      }

      setExams(results);
      setDates(datesArray);
    }
    // eslint-disable-next-line
  }, [examsData]);

  useEffect(() => {
    if (planData) setPlan(planData);
  }, [planData]);

  return (
    <Section width={830}>
      <Heading big>Plan lekcji</Heading>
      <StyledWrapper>
        {plan.map((lessons, i) => (
          <Card cardType="plan" lessons={lessons} nextDayExams={exams[i]} key={i.toString()}>
            <StyledCenter>
              <Heading>{daysInWeek[i + 1]}</Heading>
              <Paragraph>{dates[i]}</Paragraph>
            </StyledCenter>
          </Card>
        ))}
      </StyledWrapper>
    </Section>
  );
}

export default Plan;
