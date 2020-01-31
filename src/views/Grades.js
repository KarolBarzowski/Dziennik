import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useData } from 'hooks/useData';
import Section from 'components/atoms/Section/Section';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Switch from 'components/atoms/Switch/Switch';
import Editor from 'components/molecules/Editor/Editor';
import GradesTable from 'components/organisms/GradesTable/GradesTable';
import { slideInDown } from 'functions/animations';

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column wrap;
  height: 100%;
  width: 100%;
  padding: 1.5rem 2.5rem;
  background-color: ${({ theme }) => theme.card};
  border-radius: 1.5rem;
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  animation: ${slideInDown} ${({ theme }) => theme.slideTransition} 0.1s;
`;

const StyledRadioGroup = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  align-self: center;
  margin-bottom: 1.5rem;
  border: 0.2rem solid ${({ theme }) => theme.border};
  border-radius: 10px;
  overflow: hidden;
  opacity: ${({ disabled }) => (disabled ? 0.38 : 1)};
  transition: opacity 0.3s ease-in-out;
`;

const StyledLabel = styled.label`
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out, opacity 0.3s ease-in-out;

  :not(:first-of-type) {
    border-left: 0.2rem solid ${({ theme }) => theme.border};
  }

  :hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`;

const StyledInput = styled.input`
  display: none;

  :checked + ${StyledLabel} {
    background-color: ${({ theme }) => theme.border};
  }

  :disabled + ${StyledLabel} {
    opacity: 0.38;
    pointer-events: none;
  }
`;

const StyledSwitch = styled(Switch)`
  margin-left: 0.5rem !important;
`;

const StyledPanel = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 2.5rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
`;

const StyledSwitchParagraph = styled(Paragraph)`
  color: ${({ theme, highlight }) => (highlight ? theme.text : theme.textSecondary)};
  transition: color eases-in-out 0.35s;
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
  transition: opacity 0.2s ease-in-out 0.1s, transform 0.4s cubic-bezier(0.39, 0.575, 0.565, 1) 0s;

  ::first-letter {
    text-transform: uppercase;
  }

  ${({ fadeOut }) =>
    fadeOut &&
    css`
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease-in-out 0.05s, visibility 0s linear 0.3s;
    `};

  ${({ move }) =>
    move &&
    css`
      transform: translateX(100%);
      transition: transform 0.4s cubic-bezier(0.39, 0.575, 0.565, 1) 0.1s;
    `}
`;

function Grades() {
  const { gradesData, behaviourData } = useData(null);
  const [isEditor, setIsEditor] = useState(false);
  const [semester, setSemester] = useState(window.localStorage.getItem('semester') || '1');

  const handleSemesterChange = sem => {
    setSemester(sem);
    window.localStorage.setItem('semester', sem);
  };

  return (
    <Section>
      <StyledWrapper>
        <StyledRadioGroup disabled={isEditor}>
          <StyledInput
            type="radio"
            id="semI"
            name="semester"
            checked={semester === '1'}
            onChange={() => handleSemesterChange('1')}
            disabled={isEditor}
          />
          <StyledLabel htmlFor="semI">
            <Paragraph>I sem.</Paragraph>
          </StyledLabel>
          <StyledInput
            type="radio"
            id="semII"
            name="semester"
            checked={semester === '2'}
            onChange={() => handleSemesterChange('2')}
            disabled={isEditor}
          />
          <StyledLabel htmlFor="semII">
            <Paragraph>II sem.</Paragraph>
          </StyledLabel>
        </StyledRadioGroup>
        <StyledPanel>
          <StyledSwitchParagraph highlight={isEditor}>Symulator</StyledSwitchParagraph>
          <StyledSwitch onChange={() => setIsEditor(!isEditor)} checked={isEditor} />
        </StyledPanel>
        <StyledHeadRow>
          <StyledHeadItem secondary>Przedmiot</StyledHeadItem>
          <StyledHeadItem secondary>Oceny</StyledHeadItem>
          <StyledHeadItem secondary move={isEditor}>
            Średnia
          </StyledHeadItem>
          <StyledHeadItem secondary fadeOut={isEditor}>
            Przewidywana
          </StyledHeadItem>
          <StyledHeadItem secondary>Końcowa</StyledHeadItem>
        </StyledHeadRow>
        {isEditor ? (
          <Editor gradesData={gradesData} semester={semester} />
        ) : (
          <GradesTable gradesData={gradesData} behaviourData={behaviourData} semester={semester} />
        )}
      </StyledWrapper>
    </Section>
  );
}

export default Grades;
