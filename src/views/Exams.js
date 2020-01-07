import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useData } from 'hooks/useData';
import Section from 'components/atoms/Section/Section';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import { getColor, getCleanName } from 'functions/functions';
import { slideInDown } from 'functions/animations';

const StyledWrapper = styled.div`
  margin-top: 3.5rem;
`;

const StyledBox = styled.div`
  background-color: ${({ theme }) => theme.card};
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  animation: ${slideInDown} ${({ theme }) => theme.slideTransition} 0.1s;
`;

const StyledParagraph = styled(Paragraph)`
  margin: 0.4rem 0;
  font-size: ${({ theme }) => theme.m};
`;

const StyledRow = styled(Paragraph)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.8rem;
  font-size: ${({ theme }) => theme.m};

  :nth-of-type(even) {
    background-color: ${({ theme }) => theme.modalHover};
  }

  :hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;

const StyledItem = styled.span`
  width: 100%;
  ${({ color, theme }) =>
    theme[color] !== undefined ? `color: ${theme[color]}` : `color: ${theme.text}`};

  :first-of-type {
    min-width: 15rem;
    max-width: 15rem;
  }
  :nth-of-type(2) {
    min-width: 15rem;
    max-width: 15rem;
  }
`;

const StyledName = styled(StyledItem)`
  ${({ color, theme }) =>
    theme[color] !== undefined && theme.name === 'light'
      ? css`
          border-left: 0.5rem solid ${theme[color]};
          padding: 0.2rem 0 0.2rem 0.4rem;
          color: ${theme.text};
        `
      : css`
          color: ${theme[color]};
        `}
`;

const StyledHeading = styled(Heading)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 0.1rem solid ${({ theme }) => theme.border};
`;

function Exams() {
  const { examsData } = useData(null);
  const [upcoming, setUpcoming] = useState(null);
  const [late, setLate] = useState(null);
  const [next, setNext] = useState(null);

  const today = new Date();
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

  useEffect(() => {
    if (examsData && examsData.length) {
      const upcomingExams = [];
      const lateExams = [];
      examsData.forEach(({ category, date, name, description }) => {
        const dateArray = date.split('/');
        const day = parseFloat(dateArray[0]);
        const month = parseFloat(dateArray[1]) - 1;
        const year = `20${dateArray[2]}`;
        const dateResult = new Date(year, month, day);
        const dd = dateResult.getDate();
        const mm = monthsInYear[dateResult.getMonth()];

        if (today < dateResult)
          upcomingExams.push({
            category,
            date: dateResult,
            dateSyntax: `${dd} ${mm}`,
            name,
            desc: description,
            color: getColor(category),
            nameColor: getCleanName(name),
          });
        else
          lateExams.push({
            category,
            date: dateResult,
            dateSyntax: `${dd} ${mm}`,
            name,
            desc: description,
            color: getColor(category),
            nameColor: getCleanName(name),
          });
      });

      const sortedUpcoming = upcomingExams.sort((a, b) => b.date - a.date);
      sortedUpcoming.reverse();
      const sortedLate = lateExams.sort((a, b) => b.date - a.date);

      const diff = 1000 * 3600 * 24;
      const differenceInTime = sortedUpcoming[0].date.getTime() - today.getTime();
      const differenceInDays = Math.round(Math.abs(differenceInTime / diff) + 0.5);

      let diffMessage;
      if (differenceInDays === 0) diffMessage = 'już dziś! - ';
      else if (differenceInDays === 1) diffMessage = 'już jutro! - ';
      else diffMessage = `za ${differenceInDays} dni - `;

      const nextExam = {};

      if (sortedUpcoming[0].category === 'Sprawdzian')
        nextExam.category = `Następny sprawdzian ${diffMessage}`;
      else if (sortedUpcoming[0].category === 'Kartkówka')
        nextExam.category = `Następna kartkówka ${diffMessage}`;
      else nextExam.category = `Następne zadanie ${diffMessage}`;

      nextExam.name = sortedUpcoming[0].name;
      nextExam.desc = sortedUpcoming[0].desc;
      nextExam.nameColor = getCleanName(sortedUpcoming[0].name);

      const dd = sortedUpcoming[0].date.getDate();
      const mm = sortedUpcoming[0].date.getMonth();
      nextExam.date = `${dd} ${monthsInYear[mm]}`;

      const dayName = daysInWeek[sortedUpcoming[0].date.getDay()];
      nextExam.dayName = dayName;

      setNext(nextExam);
      setUpcoming(sortedUpcoming);
      setLate(sortedLate);
    }
    // eslint-disable-next-line
  }, [examsData]);

  return (
    <Section width={880}>
      <Heading big>Sprawdziany</Heading>
      <StyledWrapper>
        {next && (
          <StyledBox>
            <Heading>
              {next.category} {next.date} ({next.dayName})
            </Heading>
            <StyledParagraph>
              <StyledName color={next.nameColor}>{next.name}</StyledName>
              {next.desc !== '' && ` - ${next.desc}`}
            </StyledParagraph>
          </StyledBox>
        )}
        <StyledBox>
          <StyledHeading>
            <span>Nadchodzące</span>
            <span>{upcoming && upcoming.length}</span>
          </StyledHeading>
          {upcoming &&
            upcoming.map(({ name, dateSyntax, desc, category, color, nameColor }) => (
              <StyledRow key={desc}>
                <StyledItem>{dateSyntax}</StyledItem>
                <StyledItem color={color}>{category || 'Inne'}</StyledItem>
                <StyledName color={nameColor}>{name}</StyledName>
                <StyledItem>{desc}</StyledItem>
              </StyledRow>
            ))}
        </StyledBox>
        <StyledBox>
          <StyledHeading>
            <span>Ubiegłe</span>
            <span>{late && late.length}</span>
          </StyledHeading>
          {late &&
            late.map(({ name, dateSyntax, desc, category, color, nameColor }) => (
              <StyledRow key={desc}>
                <StyledItem>{dateSyntax}</StyledItem>
                <StyledItem color={color}>{category || 'Inne'}</StyledItem>
                <StyledName color={nameColor}>{name}</StyledName>
                <StyledItem>{desc}</StyledItem>
              </StyledRow>
            ))}
        </StyledBox>
      </StyledWrapper>
    </Section>
  );
}

export default Exams;
