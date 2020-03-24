import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useData } from 'hooks/useData';
import Section from 'components/atoms/Section/Section';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import { getColor } from 'functions/functions';
import { slideInDown } from 'functions/animations';

const StyledBox = styled.div`
  background-color: ${({ theme }) => theme.card};
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  animation: ${slideInDown} ${({ theme }) => theme.slideTransition} 0.1s;
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
  position: relative;
  width: 100%;
  color: ${({ color, theme }) => (theme[color] !== undefined ? theme[color] : theme.text)};

  :first-of-type {
    min-width: 15rem;
    max-width: 15rem;
  }

  :nth-of-type(2) {
    min-width: 15rem;
    max-width: 15rem;
  }

  :nth-of-type(3) {
    min-width: 10rem;
    max-width: 10rem;
  }

  :nth-of-type(4) {
    min-width: 15rem;
    max-width: 20rem;
  }

  :nth-of-type(5) {
    min-width: 20rem;
    max-width: 20rem;
  }
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

const StyledSum = styled(Paragraph)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0.8rem;
  font-size: ${({ theme }) => theme.m};
  border-top: 0.1rem dashed ${({ theme }) => theme.border};
  margin: 1rem 0 1.5rem;

  ${StyledItem} {
    :first-of-type {
      min-width: 30rem;
      max-width: 30rem;
      text-align: right;
      padding-right: 2rem;
    }
  }
`;

const StyledDivider = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 1.5rem 0;
  color: ${({ theme }) => theme.text};
  font-size: ${({ theme }) => theme.m};
  font-weight: 500;

  ::after {
    content: '';
    position: absolute;
    left: 10rem;
    top: 50%;
    transform: translateY(-50%);
    border-top: 0.1rem solid ${({ theme }) => theme.border};
    width: calc(100% - 10rem);
  }
`;

function Points() {
  const { pointsData } = useData(null);
  const [points, setPoints] = useState([]);
  const [sum, setSum] = useState([0, 0]);

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
    if (pointsData && pointsData.length) {
      const pointsArray = [[], []];
      const pointsSum = [0, 0];
      pointsData.forEach(({ desc, type, points, date, teacher, lesson, isCounted, semester }) => {
        const dateArray = date.split('/');
        const day = parseFloat(dateArray[0]);
        const month = parseFloat(dateArray[1]) - 1;
        const year = `20${dateArray[2]}`;
        const dateResult = new Date(year, month, day);
        const dd = dateResult.getDate();
        const mm = monthsInYear[dateResult.getMonth()];

        const capitalizedType = type.length ? type[0].toUpperCase() + type.slice(1) : 'Inne';

        if (isCounted) pointsSum[parseFloat(semester) - 1] += parseFloat(points);

        pointsArray[parseFloat(semester) - 1].push({
          desc,
          type: capitalizedType,
          points,
          teacher,
          date: dateResult,
          dateSyntax: `${dd} ${mm}`,
          color: getColor(type),
          lesson,
          isCounted,
          semester,
        });
      });

      const sortedPoints = [
        pointsArray[0].sort((a, b) => b.date - a.date),
        pointsArray[1].sort((a, b) => b.date - a.date),
      ];
      setPoints(sortedPoints);

      setSum(pointsSum);
    }
    // eslint-disable-next-line
  }, [pointsData]);

  return (
    <Section>
      <StyledBox>
        <StyledHeading>
          <span>Wszystkie</span>
          <span>{(points[0] || points[1]) && points[0].length + points[1].length}</span>
        </StyledHeading>
        {points[0] || points[1] ? (
          <>
            <StyledDivider>Semestr 2</StyledDivider>
            {points &&
              points[1] &&
              points[1].map(
                ({ desc, type = 'Inne', points, teacher, dateSyntax, color, isCounted }, i) => (
                  <StyledRow key={i.toString()}>
                    <StyledItem>{dateSyntax}</StyledItem>
                    <StyledItem color={isCounted ? color : null}>{type}</StyledItem>
                    <StyledItem>{points > 0 ? `+${points}` : points}</StyledItem>
                    <StyledItem>{teacher}</StyledItem>
                    {isCounted ? <StyledItem /> : <StyledItem>Nie liczona</StyledItem>}
                    <StyledItem>{desc}</StyledItem>
                  </StyledRow>
                ),
              )}
            <StyledSum>
              <StyledItem>Suma</StyledItem>
              <StyledItem>{sum[1]}</StyledItem>
              <StyledItem />
              <StyledItem />
              <StyledItem />
              <StyledItem />
            </StyledSum>
            <StyledDivider>Semestr 1</StyledDivider>
            {points &&
              points[0] &&
              points[0].map(
                ({ desc, type = 'Inne', points, teacher, dateSyntax, color, isCounted }, i) => (
                  <StyledRow key={i.toString()}>
                    <StyledItem>{dateSyntax}</StyledItem>
                    <StyledItem color={isCounted ? color : null}>{type}</StyledItem>
                    <StyledItem>{points > 0 ? `+${points}` : points}</StyledItem>
                    <StyledItem>{teacher}</StyledItem>
                    {isCounted ? <StyledItem /> : <StyledItem>Nie liczona</StyledItem>}
                    <StyledItem>{desc}</StyledItem>
                  </StyledRow>
                ),
              )}
            <StyledSum>
              <StyledItem>Suma</StyledItem>
              <StyledItem>{sum[0]}</StyledItem>
              <StyledItem />
              <StyledItem />
              <StyledItem />
              <StyledItem />
            </StyledSum>
          </>
        ) : (
          <></>
        )}
      </StyledBox>
    </Section>
  );
}

export default Points;
