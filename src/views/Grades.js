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

const StyledSwitchWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  align-self: center;
  border-radius: 5rem;
  background-color: ${({ theme }) => theme.gray3};
  height: 4.2rem;
  padding: 0 0.5rem;
  margin-bottom: 1.5rem;
`;

const StyledLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 5rem;
  height: 100%;
  padding: 0 1rem;

  :not(:first-of-type) {
    margin-left: 2rem;
  }

  ${Paragraph} {
    color: ${({ theme }) => theme.textSecondary};
    transition: color 0.1s ease-in-out, font-size 0.2s ease-in-out;
    z-index: 1;
  }

  :hover {
    ${Paragraph} {
      color: ${({ theme }) => theme.text};
    }
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

const StyledRadio = styled.input`
  display: none;

  :checked + ${StyledLabel} {
    cursor: default;

    ${Paragraph} {
      color: ${({ theme }) => theme.textInvert};
      font-size: ${({ theme }) => theme.m};
      transition: color 0s ease-in-out 0.1s, font-size 0.2s ease-in-out;
    }
  }

  :disabled + ${StyledLabel} {
    opacity: 0.38;
    pointer-events: none;

    :hover {
      cursor: default;
    }
  }
`;

const StyledIndicator = styled.span`
  position: absolute;
  top: 50%;
  left: 0;
  height: 4.8rem;
  width: 11.5rem;
  background-color: ${({ theme }) => (theme.name === 'dark' ? '#ffffff' : 'rgb(44, 44, 46)')};
  border-radius: 5rem;
  transition: transform 0.2s ease-in-out;

  ${({ isLeft }) =>
    isLeft
      ? css`
          transform: translate(-0.5rem, -50%);
        `
      : css`
          transform: translate(9.6rem, -50%);
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
        <StyledSwitchWrapper disabled={isEditor}>
          <StyledIndicator isLeft={semester === '1'} />
          <StyledRadio
            type="radio"
            id="semI"
            name="semester"
            checked={semester === '1'}
            onChange={() => handleSemesterChange('1')}
            disabled={isEditor}
          />
          <StyledLabel htmlFor="semI">
            <Paragraph>I semestr</Paragraph>
          </StyledLabel>
          <StyledRadio
            type="radio"
            id="semII"
            name="semester"
            checked={semester === '2'}
            onChange={() => handleSemesterChange('2')}
            disabled={isEditor}
          />
          <StyledLabel htmlFor="semII">
            <Paragraph>II semestr</Paragraph>
          </StyledLabel>
        </StyledSwitchWrapper>
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
