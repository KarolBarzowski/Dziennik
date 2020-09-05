import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useData } from 'hooks/useData';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Card from 'components/atoms/Card/Card';
import MiniGradesRow from 'components/molecules/MiniGradesRow/MiniGradesRow';
import { ReactComponent as NoData } from 'assets/images/no_grades.svg';

const slideIn = keyframes`
  from {
    transform: translateX(-1.5rem);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
`;

const StyledHeading = styled(Heading)`
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const StyledParagraph = styled(Paragraph)`
  position: relative;
  font-size: 1.6rem;
  z-index: 1;
`;

const SwitchActive = styled.span`
  position: absolute;
  left: 0;
  top: 0;
  background-color: ${({ theme }) => theme.border};
  height: 100%;
  width: 50%;
  transform: ${({ active }) => (active ? 'translateX(100%)' : 'transalteX(0)')};
  transition: transform 0.3s ease-in-out;
`;

const SwitchWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: 3.4rem;
  border-radius: 10rem;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.border};
`;

const SwitchItem = styled.button`
  border: none;
  background-color: transparent;
  height: 100%;
  padding: 0.5rem 1rem;
  cursor: pointer;
  outline: none;
`;

const Empty = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  margin: 2.5rem;
`;

const StyledImg = styled(NoData)`
  pointer-events: none;
  height: 14.4rem;
  width: 14.4rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const Info = styled(Paragraph)`
  font-size: 1.6rem;
  margin-top: 1.5rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

function GradesCard() {
  const [grades, setGrades] = useState([]);
  const [currentSemester, setCurrentSemester] = useState(0);
  const [isMultipleSemesters, setIsMultipleSemesters] = useState(false);
  const [semesters, setSemesters] = useState([]);

  const { gradesData } = useData([]);

  useEffect(() => {
    const results = [];
    const lastTs = JSON.parse(window.localStorage.getItem('lastTs'));

    gradesData.forEach(({ name, grades }) => {
      const localResults = [];
      const allResults = [];

      grades.forEach(grade => {
        const [d, t] = grade.date.split(' ');
        const [day, month, year] = d.split('/');
        const [hour, minute, second] = t.split(':');
        const dateOfPublication = new Date(
          `20${year}`,
          month - 1,
          day,
          hour,
          minute,
          second,
        ).getTime();

        if (dateOfPublication > lastTs) {
          localResults.push(grade);
        } else {
          allResults.push(grade);
        }
      });

      if (localResults.length) {
        results.push({
          name,
          newGrades: localResults,
          allGrades: allResults,
        });
      }
    });
    setGrades(results);
  }, [gradesData]);

  useEffect(() => {
    if (semesters.length) {
      const semestersSet = Array.from(new Set(semesters));
      if (semestersSet.length === 2) {
        setCurrentSemester(0);
        setIsMultipleSemesters(true);
      } else {
        setCurrentSemester(parseFloat(semestersSet[0]) - 1);
        setIsMultipleSemesters(false);
      }
    }
  }, [semesters]);

  return (
    <Card>
      <Row>
        <StyledHeading delay={0.05}>Oceny</StyledHeading>
        {isMultipleSemesters ? (
          <SwitchWrapper>
            <SwitchActive active={currentSemester} />
            <SwitchItem type="button" onClick={() => setCurrentSemester(0)}>
              <StyledParagraph>Sem. I</StyledParagraph>
            </SwitchItem>
            <SwitchItem type="button" onClick={() => setCurrentSemester(1)}>
              <StyledParagraph>Sem. II</StyledParagraph>
            </SwitchItem>
          </SwitchWrapper>
        ) : null}
      </Row>
      {grades.length ? (
        grades.map(({ name, newGrades, allGrades }, i) => (
          <MiniGradesRow
            key={name}
            name={name}
            newGrades={newGrades}
            allGrades={allGrades}
            delay={i * 0.05 + 0.05}
            semester={currentSemester}
            setSemesters={setSemesters}
          />
        ))
      ) : (
        <Empty>
          <StyledImg delay={0.1} />
          <Info secondary delay={0.15}>
            Żadnych nowych ocen
          </Info>
        </Empty>
      )}
    </Card>
  );
}

export default GradesCard;
