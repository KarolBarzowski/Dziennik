import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import { getColor } from 'functions/functions';
import { fadeIn } from 'functions/animations';

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.8rem;
  animation: ${fadeIn} ${({ theme }) => theme.fadeTransition} 0.15s;

  :nth-of-type(odd) {
    background-color: ${({ theme }) => theme.modalHover};
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

const StyledParagraph = styled(Paragraph)`
  width: 100%;
  text-align: center;
  font-size: ${({ theme }) => theme.m};
  color: ${({ theme, color }) => (color ? theme[color] : theme.text)};
  cursor: default;
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

function GradesRow({ title, grades, semester }) {
  const [casual, setCasual] = useState(null);
  const [estimated, setEstimated] = useState('-');
  const [final, setFinal] = useState('-');
  const [average, setAverage] = useState('-');

  const gradeDesc = ['', 'ndst', 'dop', 'dst', 'db', 'bdb', 'cel'];

  useEffect(() => {
    const casualGrades = [];
    let sortedGrades;
    const gradesArray = [];
    const weights = [];
    grades.forEach(grade => {
      const gradeObj = {};
      // the same semester
      if (grade.semester === semester) {
        if (grade.isCounted) {
          // casual grade
          gradeObj.grade = grade.grade;
          gradeObj.category = grade.category;
          gradeObj.weight = grade.weight;
          gradeObj.desc = grade.gradeDesc;
          gradeObj.color = getColor(grade.category);
          gradeObj.dateSyntax = grade.date;
          const dateArray = grade.date.split(' ');
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
          gradeObj.date = actualDate;
          casualGrades.push(gradeObj);
          if (grade.grade.length > 1) {
            const mark = grade.grade.slice(-1);
            if (mark === '+') {
              gradesArray.push((parseFloat(grade.grade) + 0.5) * parseFloat(grade.weight));
            } else gradesArray.push((parseFloat(grade.grade) - 0.25) * parseFloat(grade.weight));
            weights.push(parseFloat(grade.weight));
          } else {
            gradesArray.push(parseFloat(grade.grade) * parseFloat(grade.weight));
            weights.push(parseFloat(grade.weight));
          }
        } else if (grade.category === 'Ocena przewidywana') {
          setEstimated(grade.grade);
        } else if (grade.category === 'Ocena za półrocze') {
          setFinal(gradeDesc.findIndex(desc => desc === grade.grade));
        } else {
          // not counted grade
          gradeObj.grade = grade.grade;
          gradeObj.weight = grade.weight;
          gradeObj.category = grade.category;
          gradeObj.desc = grade.gradeDesc;
          gradeObj.color = 'textSecondary';
          gradeObj.dateSyntax = grade.date;
          const dateArray = grade.date.split(' ');
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
          gradeObj.date = actualDate;
          gradeObj.notCounted = true;
          casualGrades.push(gradeObj);
        }

        sortedGrades = casualGrades.sort((a, b) => b.date - a.date);
        sortedGrades.reverse();
      } else {
        setEstimated('-');
        setFinal('-');
      }
    });

    // avg
    let nominator = 0;
    let denominator = 0;
    for (let i = 0; i < gradesArray.length; i += 1) {
      nominator += gradesArray[i];
      denominator += weights[i];
    }
    const avg = (nominator / denominator).toFixed(2);
    setAverage(avg);
    setCasual(sortedGrades);
    // eslint-disable-next-line
  }, [grades, semester]);

  return (
    <StyledWrapper>
      <StyledTitle>{title}</StyledTitle>
      <StyledParagraph>
        {casual &&
          casual.map(({ grade, category, weight, desc, dateSyntax, color, notCounted }, i) => (
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
              {i !== casual.length - 1 && <span>, </span>}
            </React.Fragment>
          ))}
      </StyledParagraph>
      <StyledParagraph color={parseFloat(average) <= 1.85 ? 'red' : 'text'}>
        {!Number.isNaN(parseFloat(average)) && average}
      </StyledParagraph>
      <StyledParagraph>{estimated}</StyledParagraph>
      <StyledParagraph>{final}</StyledParagraph>
    </StyledWrapper>
  );
}

GradesRow.propTypes = {
  title: PropTypes.string.isRequired,
  grades: PropTypes.arrayOf(
    PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool])),
  ),
  semester: PropTypes.string.isRequired,
};

GradesRow.defaultProps = {
  grades: null,
};

export default GradesRow;
