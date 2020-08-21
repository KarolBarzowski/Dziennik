import React from 'react';
import styled, { css } from 'styled-components';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import { getCleanName } from 'functions/functions';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-start;
  min-height: 6.4rem;
  padding: 0.8rem;
  border-radius: 1rem;

  :nth-of-type(even) {
    background-color: ${({ theme }) => theme.modalHover};
  }

  :hover {
    background-color: ${({ theme }) => theme.modalFocus};
  }
`;

const StyledParagraph = styled(Paragraph)`
  font-size: 1.6rem;
  color: ${({ theme, color }) => (color ? theme[color] : theme.text)};
`;

const StyledRow = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  height: 100%;
  width: 100%;

  :first-of-type {
    width: 15%;
  }

  :nth-of-type(2) {
    width: 30%;
    /* flex-flow: row nowrap; */
  }
`;

const StyledGradeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.1rem;
  height: 4rem;
  width: 3.6rem;
  border-radius: 0.5rem;
  cursor: default;

  :hover {
    background-color: ${({ theme }) => theme.modalFocus};
  }

  ${({ highlight, color, theme }) =>
    highlight &&
    css`
      background-color: ${theme[color]};
      text-shadow: #000000 0px 0px 4px;
    `}
`;

const StyledGrade = styled(StyledParagraph)`
  font-size: 2.1rem;
  font-family: 'Roboto';
`;

function GradesRow({ name, grades }) {
  return (
    <StyledWrapper>
      <StyledRow>
        <StyledParagraph color={getCleanName(name)}>{name}</StyledParagraph>
      </StyledRow>
      <StyledRow>
        {grades.length ? (
          grades.map(grade => (
            <StyledGradeWrapper>
              <StyledGrade color={grade.color}>{grade.grade}</StyledGrade>
            </StyledGradeWrapper>
          ))
        ) : (
          <StyledParagraph>Brak ocen</StyledParagraph>
        )}
        {/* <StyledGradeWrapper highlight color="green">
          <StyledGrade>5</StyledGrade>
        </StyledGradeWrapper> */}
      </StyledRow>
    </StyledWrapper>
  );
}

export default GradesRow;
