import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useData } from 'hooks/useData';
import Section from 'components/atoms/Section/Section';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Card from 'components/atoms/Card/Card';
import PlanContent from 'components/molecules/PlanContent/PlanContent';

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

const StyledHeading = styled(Heading)`
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
  text-align: center;
`;

const StyledWrapper = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  height: 100%;
  width: 100%;
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
  margin: 0 auto;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.border};
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const SwitchItem = styled.button`
  border: none;
  background-color: transparent;
  height: 100%;
  padding: 0.5rem 1rem;
  cursor: pointer;
  outline: none;
`;

const StyledParagraph = styled(Paragraph)`
  position: relative;
  font-size: 1.6rem;
  z-index: 1;
`;

const StyledCard = styled(Card)`
  width: 100%;

  @media screen and (min-width: 800px) {
    width: calc(50% - 1.5rem);
  }

  @media screen and (min-width: 1200px) {
    width: calc(33% - 1.5rem);
  }

  @media screen and (min-width: 1440px) {
    width: calc(25% - 1.5rem);
  }

  @media screen and (min-width: 1920px) {
    width: calc(20% - 1.5rem);
  }
`;

const monthsInYearInGenitive = [
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

function Plan() {
  const { planData } = useData(null);
  const [plan, setPlan] = useState([]);
  const [weeks, setWeeks] = useState(['I tydzien', 'II tydzień']);
  const [currentPlan, setCurrentPlan] = useState(0);

  useEffect(() => {
    if (planData.length) {
      const results = [[], []];
      const weeks = [];

      planData.forEach((week, weekIndex) => {
        const start = week[0].title.split(' ')[1];
        let [dd, mm, yy] = start.split('/');
        dd = parseFloat(dd);
        mm = parseFloat(mm) - 1;
        yy = `20${yy}`;

        let currentDate = new Date(yy, mm, dd, 0, 0, 0, 0);

        const startDate = `${currentDate.getDate()} ${
          monthsInYearInGenitive[currentDate.getMonth()]
        }`;

        const end = week[4].title.split(' ')[1];
        [dd, mm, yy] = end.split('/');
        dd = parseFloat(dd);
        mm = parseFloat(mm) - 1;
        yy = `20${yy}`;

        currentDate = new Date(yy, mm, dd, 0, 0, 0, 0);

        const endDate = `${currentDate.getDate()} ${
          monthsInYearInGenitive[currentDate.getMonth()]
        }`;

        weeks[weekIndex] = `${startDate} - ${endDate}`;

        week.forEach(({ title, plan }) => {
          const [day, titleDate] = title.split(' ');
          let [dd, mm, yy] = titleDate.split('/');
          dd = parseFloat(dd);
          mm = parseFloat(mm) - 1;
          yy = `20${yy}`;

          const currentDate = new Date(yy, mm, dd, 0, 0, 0, 0);

          const date = `${currentDate.getDate()} ${monthsInYearInGenitive[currentDate.getMonth()]}`;

          results[weekIndex].push({
            day,
            date,
            plan,
          });
        });
      });

      setPlan(results);
      setWeeks(weeks);
    }
  }, [planData]);

  return (
    <Section>
      <SwitchWrapper delay={0.05}>
        <SwitchActive active={currentPlan} />
        <SwitchItem type="button" onClick={() => setCurrentPlan(0)}>
          <StyledParagraph>{weeks[0]}</StyledParagraph>
        </SwitchItem>
        <SwitchItem type="button" onClick={() => setCurrentPlan(1)}>
          <StyledParagraph>{weeks[1]}</StyledParagraph>
        </SwitchItem>
      </SwitchWrapper>
      <StyledWrapper>
        {plan.length
          ? plan[currentPlan].map(({ plan, day, date }) => (
              <StyledCard key={date}>
                <StyledHeading delay={0.1}>{day}</StyledHeading>
                <StyledHeading delay={0.15}>{date}</StyledHeading>
                <PlanContent plan={plan} />
              </StyledCard>
            ))
          : null}
      </StyledWrapper>
    </Section>
  );
}

export default Plan;
