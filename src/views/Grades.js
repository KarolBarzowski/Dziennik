import React, { useState } from 'react';
import styled from 'styled-components';
import { useData } from 'hooks/useData';
import Section from 'components/atoms/Section/Section';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import GradesTable from 'components/organisms/GradesTable/GradesTable';
import { slideInDown } from 'functions/animations';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  height: 100%;
  width: 100%;
  padding: 1.5rem 2.5rem;
  margin-top: 4.5rem;
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
`;

const StyledLabel = styled.label`
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;

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
`;

function Grades() {
  const { gradesData, behaviourData } = useData(null);
  const [semester, setSemester] = useState(window.localStorage.getItem('semester') || '1');

  const handleSemesterChange = sem => {
    setSemester(sem);
    window.localStorage.setItem('semester', sem);
  };

  return (
    <Section width={760}>
      <Heading big>Oceny</Heading>
      <StyledWrapper>
        <StyledRadioGroup>
          <StyledInput
            type="radio"
            id="semI"
            name="semester"
            checked={semester === '1'}
            onChange={() => handleSemesterChange('1')}
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
          />
          <StyledLabel htmlFor="semII">
            <Paragraph>II sem.</Paragraph>
          </StyledLabel>
        </StyledRadioGroup>
        <GradesTable gradesData={gradesData} behaviourData={behaviourData} semester={semester} />
      </StyledWrapper>
    </Section>
  );
}

export default Grades;
