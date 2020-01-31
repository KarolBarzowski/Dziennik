import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import EditorRow from 'components/molecules/EditorRow/EditorRow';
import { fadeIn } from 'functions/animations';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const StyledRow = styled.div`
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

  :last-of-type {
    margin-top: 1rem;
    background-color: transparent;
  }
`;

const StyledParagraph = styled(Paragraph)`
  position: relative;
  width: 100%;
  font-size: ${({ theme }) => theme.m};
  color: ${({ theme, color }) => (color ? theme[color] : theme.text)};
  text-align: center;
  transition: opacity 0.2s ease-in-out 0.1s;
  cursor: default;

  ::first-letter {
    text-transform: uppercase;
  }
`;

const StyledDefault = styled.span`
  position: absolute;
  top: 100%;
  left: 50%;
  font-weight: ${({ theme }) => theme.regular};
  font-size: ${({ theme }) => theme.s};
  color: ${({ theme }) => theme.text};
  transition: opacity 0.15s ease-in-out 0.05s, transform 0.15s ease-in-out 0.05s;

  ${({ isVisible }) =>
    isVisible
      ? css`
          visibility: visible;
          opacity: 1;
          transform: translate(-50%, 0);
        `
      : css`
          visibility: hidden;
          opacity: 0;
          transform: translate(-50%, -1rem);
          transition: opacity 0.15s ease-in-out 0.05s, transform 0.15s ease-in-out 0.05s,
            visibility 0s linear 0.2s;
        `}
`;

function Editor({ gradesData, semester }) {
  const [avgGrades, setAvgGrades] = useState({});
  const [avgFin, setAvgFin] = useState('');
  const [defaultAvgFin, setDefaultAvgFin] = useState('');
  const [avgColor, setAvgColor] = useState('text');

  const avgCallback = (grade, name) => {
    const newAvgGrades = avgGrades;
    newAvgGrades[name] = grade;

    let sum = 0;
    Object.keys(newAvgGrades).forEach(n => {
      sum += parseFloat(newAvgGrades[n]);
    });
    const avg = (sum / Object.keys(newAvgGrades).length).toFixed(2);

    if (Object.keys(newAvgGrades).length === gradesData.length && defaultAvgFin === '') {
      setDefaultAvgFin(avg);
    }

    if (avg > parseFloat(defaultAvgFin)) setAvgColor('green');
    else if (avg < parseFloat(defaultAvgFin)) setAvgColor('red');
    else setAvgColor('text');

    setAvgFin(avg);
    setAvgGrades(newAvgGrades);
  };

  return (
    <StyledWrapper>
      {gradesData &&
        gradesData.map((gradesObj, lessonIndex) => (
          <EditorRow
            key={lessonIndex.toString()}
            grades={gradesObj}
            semester={semester}
            avgCallback={avgCallback}
          />
        ))}
      <StyledRow>
        <StyledParagraph />
        <StyledParagraph />
        <StyledParagraph />
        <StyledParagraph />
        <StyledParagraph color={avgColor}>
          {!Number.isNaN(parseFloat(avgFin)) && avgFin}
          <StyledDefault isVisible={defaultAvgFin !== avgFin}>
            {!Number.isNaN(parseFloat(defaultAvgFin)) && defaultAvgFin}
          </StyledDefault>
        </StyledParagraph>
      </StyledRow>
    </StyledWrapper>
  );
}

Editor.propTypes = {
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
};

Editor.defaultProps = {
  gradesData: null,
};

export default Editor;
