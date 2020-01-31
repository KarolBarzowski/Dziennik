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

      setExams(results);
    }
    // eslint-disable-next-line
  }, [examsData]);

  useEffect(() => {
    if (planData) setPlan(planData);
  }, [planData]);

  return (
    <Section>
      <StyledWrapper>
        {plan.map((lessons, i) => (
          <Card cardType="plan" lessons={lessons} nextDayExams={exams[i]} key={i.toString()}>
            <StyledCenter>
              <Heading>{daysInWeek[i + 1]}</Heading>
            </StyledCenter>
          </Card>
        ))}
      </StyledWrapper>
    </Section>
  );
}

export default Plan;
