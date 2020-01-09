import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import { fadeIn } from 'functions/animations';
import { getColor } from 'functions/functions';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const StyledHeadRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.8rem;
  margin: 0 0 0.5rem;
`;

const StyledHeadItem = styled(Paragraph)`
  width: 100%;
  text-align: center;

  ::first-letter {
    text-transform: uppercase;
  }
`;

const StyledParagraph = styled(StyledHeadItem)`
  font-size: ${({ theme }) => theme.m};
  color: ${({ theme, color }) => (color ? theme[color] : theme.text)};
  cursor: default;
`;

const StyledBodyRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.8rem;
  animation: ${fadeIn} ${({ theme }) => theme.fadeTransition} 0.15s;

  :nth-of-type(odd) {
    background-color: ${({ theme }) => theme.modalHover};
  }

  :last-of-type {
    margin-top: 1rem;
    background-color: transparent;
  }

  :hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;

const StyledTitle = styled(Paragraph)`
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledGradeWrapper = styled.span`
  position: relative;
`;

const StyledTip = styled.span`
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0.5rem;
  padding: 0.6rem;
  font-size: ${({ theme }) => theme.s};
  white-space: nowrap;
  text-align: left;
  opacity: 0;
  visibility: hidden;
  background-color: ${({ theme }) => theme.tip};
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  transition: opacity 0.04s ease-in-out 0.02s;
  z-index: 10;
`;

const StyledGrade = styled.span`
  color: ${({ theme, color }) => theme[color]};

  :hover + ${StyledTip} {
    visibility: visible;
    opacity: 1;
  }
`;

function GradesTable({ gradesData, behaviourData, semester }) {
  const [grades, setGrades] = useState(null);
  const [avgEst, setAvgEst] = useState('');
  const [avgFin, setAvgFin] = useState('');

  useEffect(() => {
    if (gradesData) {
      const results = [];
      gradesData.forEach(({ name, grades: gradesList }) => {
        const avgGrades = [];
        const avgWeights = [];
        const actualObj = {
          name,
          grades: [],
        };
        gradesList.forEach(
          ({ semester: gradeSem, isCounted, grade, weight, category, gradeDesc, value, date }) => {
            if (gradeSem === semester) {
              if (category === 'Ocena przewidywana') {
                actualObj.est = value;
                return;
              }
              if (category === 'Ocena za półrocze') {
                actualObj.fin = value;
                return;
              }

              const dateArray = date.split(' ');
              const [day, month, year] = dateArray[0].split('/');
              const [hour, minute, second] = dateArray[1].split(':');
              const actualDate = new Date(
                `20${year}`,
                parseFloat(month) - 1,
                parseFloat(day),
                parseFloat(hour),
                parseFloat(minute),
                parseFloat(second),
              );

              const gradeObj = {
                grade,
                weight,
                category,
                desc: gradeDesc,
                dateSyntax: date,
                date: actualDate,
                notCounted: !isCounted,
              };

              if (isCounted) {
                gradeObj.color = getColor(category);
                avgGrades.push(parseFloat(value) * parseFloat(weight));
                avgWeights.push(parseFloat(weight));
              } else gradeObj.color = 'textSecondary';

              actualObj.grades.push(gradeObj);
            }
          },
        );
        const sortedGrades = actualObj.grades.sort((a, b) => b.date - a.date);
        sortedGrades.reverse();

        let nominator = 0;
        let denominator = 0;
        for (let i = 0; i < avgGrades.length; i += 1) {
          nominator += avgGrades[i];
          denominator += avgWeights[i];
        }

        const avg = (nominator / denominator).toFixed(2);
        actualObj.avg = avg;

        if (!actualObj.est) {
          if (avg <= 1.85) actualObj.est = 1;
          else if (avg > 1.86 && avg <= 2.85) actualObj.est = 2;
          else if (avg > 2.86 && avg <= 3.85) actualObj.est = 3;
          else if (avg > 3.86 && avg <= 4.85) actualObj.est = 4;
          else if (avg > 4.86 && avg <= 5.3) actualObj.est = 5;
          else if (avg > 5.3) actualObj.est = 6;
        }

        if (!actualObj.fin) {
          if (avg <= 1.85) actualObj.fin = 1;
          else if (avg > 1.86 && avg <= 2.85) actualObj.fin = 2;
          else if (avg > 2.86 && avg <= 3.85) actualObj.fin = 3;
          else if (avg > 3.86 && avg <= 4.85) actualObj.fin = 4;
          else if (avg > 4.86 && avg <= 5.3) actualObj.fin = 5;
          else if (avg > 5.3) actualObj.fin = 6;
        }

        results.push(actualObj);
      });

      let estSum = 0;
      let finSum = 0;

      results.forEach(({ est, fin }) => {
        estSum += parseFloat(est);
        finSum += parseFloat(fin);
      });

      const avgE = (estSum / results.length).toFixed(2);
      const avgF = (finSum / results.length).toFixed(2);

      setAvgEst(avgE);
      setAvgFin(avgF);
      setGrades(results);
    }
  }, [gradesData, behaviourData, semester]);

  return (
    <StyledWrapper>
      <StyledHeadRow>
        <StyledHeadItem secondary>Przedmiot</StyledHeadItem>
        <StyledHeadItem secondary>Oceny</StyledHeadItem>
        <StyledHeadItem secondary>Średnia</StyledHeadItem>
        <StyledHeadItem secondary>Przewidywana</StyledHeadItem>
        <StyledHeadItem secondary>Końcowa</StyledHeadItem>
      </StyledHeadRow>
      {grades &&
        grades.map(({ grades: gradesList, name, avg, fin, est }) => (
          <StyledBodyRow key={name}>
            <StyledTitle>{name}</StyledTitle>
            <StyledParagraph>
              {gradesList.map(
                ({ grade, category, weight, desc, dateSyntax, color, notCounted }, i) => (
                  <React.Fragment key={dateSyntax}>
                    <StyledGradeWrapper>
                      <StyledGrade color={color}>{grade}</StyledGrade>
                      <StyledTip>
                        {notCounted && (
                          <>
                            Nie liczona do średniej
                            <br />
                          </>
                        )}
                        {category}
                        <br />
                        Waga {weight}
                        <br />
                        {dateSyntax}
                        <br />
                        {desc}
                      </StyledTip>
                    </StyledGradeWrapper>
                    {i !== gradesList.length - 1 && <span>, </span>}
                  </React.Fragment>
                ),
              )}
            </StyledParagraph>
            <StyledParagraph color={parseFloat(avg) <= 1.85 ? 'red' : 'text'}>
              {!Number.isNaN(parseFloat(avg)) && avg}
            </StyledParagraph>
            <StyledParagraph color={parseFloat(est) === 1 ? 'red' : 'text'}>
              {typeof est === 'number' ? `- (${est})` : est}
            </StyledParagraph>
            <StyledParagraph color={parseFloat(fin) === 1 ? 'red' : 'text'}>
              {typeof fin === 'number' ? `- (${fin})` : fin}
            </StyledParagraph>
          </StyledBodyRow>
        ))}
      <StyledHeadRow>
        <StyledParagraph />
        <StyledParagraph />
        <StyledParagraph />
        <StyledParagraph>{!Number.isNaN(parseFloat(avgEst)) && avgEst}</StyledParagraph>
        <StyledParagraph>{!Number.isNaN(parseFloat(avgFin)) && avgFin}</StyledParagraph>
      </StyledHeadRow>
      {behaviourData && (
        <StyledBodyRow>
          <StyledTitle>Zachowanie</StyledTitle>
          <StyledHeadItem />
          <StyledHeadItem />
          <StyledHeadItem>
            {semester === '1' ? behaviourData.estSemI : behaviourData.estSemII}
          </StyledHeadItem>
          <StyledHeadItem>
            {semester === '1' ? behaviourData.semI : behaviourData.semII}
          </StyledHeadItem>
        </StyledBodyRow>
      )}
    </StyledWrapper>
  );
}

GradesTable.propTypes = {
  gradesData: PropTypes.arrayOf(
    PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.arrayOf(
          PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool])),
        ),
        PropTypes.string,
      ]),
    ),
  ),
  semester: PropTypes.string.isRequired,
  behaviourData: PropTypes.objectOf(PropTypes.string),
};

GradesTable.defaultProps = {
  gradesData: null,
  behaviourData: null,
};

export default GradesTable;
