import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useData } from 'hooks/useData';
import Section from 'components/atoms/Section/Section';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import GradesRow from 'components/molecules/GradesRow/GradesRow';
import { slideInDown, fadeIn } from 'functions/animations';

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

const StyledTable = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const StyledTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.8rem;
  margin: 1.5rem 0 0.5rem;
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.8rem;
  margin-top: 1.5rem;
  animation: ${fadeIn} ${({ theme }) => theme.fadeTransition} 0.15s;

  :hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;

const StyledParagraph = styled(Paragraph)`
  width: 100%;
  text-align: center;
  ::first-letter {
    text-transform: uppercase;
  }
`;

const StyledTitle = styled(Paragraph)`
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledAvg = styled(StyledRow)`
  margin: 0;
  ${StyledParagraph} {
    font-size: ${({ theme }) => theme.m};
  }

  :hover {
    background-color: transparent;
  }
`;

function Grades() {
  const { gradesData, behaviourData } = useData(null);
  const [semester, setSemester] = useState(window.localStorage.getItem('semester') || '1');
  const [est, setEst] = useState('-');
  const [fin, setFin] = useState('-');

  useEffect(() => {
    if (gradesData) {
      let estSum = 0;
      let estIndex = 0;
      let finSum = 0;
      let finIndex = 0;
      gradesData.forEach(({ grades }) => {
        grades.forEach(grade => {
          if (grade.semester === semester) {
            if (grade.category === 'Ocena przewidywana') {
              estSum += parseFloat(grade.value);
              estIndex += 1;
            } else if (grade.category === 'Ocena za półrocze') {
              finSum += parseFloat(grade.value);
              finIndex += 1;
            }
          }
        });
      });
      setEst((estSum / estIndex).toFixed(2));
      setFin((finSum / finIndex).toFixed(2));
    }
  }, [gradesData, semester]);

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
        <StyledTable>
          <StyledTitleRow>
            <StyledParagraph secondary>Przedmiot</StyledParagraph>
            <StyledParagraph secondary>Oceny</StyledParagraph>
            <StyledParagraph secondary>Średnia</StyledParagraph>
            <StyledParagraph secondary>Przewidywana</StyledParagraph>
            <StyledParagraph secondary>Końcowa</StyledParagraph>
          </StyledTitleRow>
          {gradesData
            ? gradesData.map(({ name, grades }) => (
                <GradesRow key={name} title={name} grades={grades} semester={semester} />
              ))
            : 'Ładowanie'}
          <StyledAvg>
            <StyledParagraph />
            <StyledParagraph />
            <StyledParagraph />
            <StyledParagraph>{!Number.isNaN(parseFloat(est)) && est}</StyledParagraph>
            <StyledParagraph>{!Number.isNaN(parseFloat(fin)) && fin}</StyledParagraph>
          </StyledAvg>
          {behaviourData ? (
            <StyledRow>
              <StyledTitle>Zachowanie</StyledTitle>
              <StyledParagraph />
              <StyledParagraph />
              <StyledParagraph>
                {semester === '1' ? behaviourData.estSemI : behaviourData.estSemII}
              </StyledParagraph>
              <StyledParagraph>
                {semester === '1' ? behaviourData.semI : behaviourData.semII}
              </StyledParagraph>
            </StyledRow>
          ) : (
            'Ładowanie...'
          )}
        </StyledTable>
      </StyledWrapper>
    </Section>
  );
}

export default Grades;
