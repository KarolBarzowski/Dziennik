import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useData } from 'hooks/useData';
import Section from 'components/atoms/Section/Section';
import Heading from 'components/atoms/Heading/Heading';
import Card from 'components/organisms/Card/Card';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  width: 100%;
  padding-top: 4.5rem;
`;

function Plan() {
  const { planData } = useData(null);
  const [plan, setPlan] = useState([
    'Ładowanie...',
    'Ładowanie...',
    'Ładowanie...',
    'Ładowanie...',
    'Ładowanie...',
  ]);

  useEffect(() => {
    if (planData) setPlan(planData);
  }, [planData]);

  return (
    <Section width={830}>
      <Heading big>Plan lekcji</Heading>
      <StyledWrapper>
        <Card cardType="plan" center title="Poniedziałek" lessons={plan[0]} />
        <Card cardType="plan" center title="Wtorek" lessons={plan[1]} />
        <Card cardType="plan" center title="Środa" lessons={plan[2]} />
        <Card cardType="plan" center title="Czwartek" lessons={plan[3]} />
        <Card cardType="plan" center title="Piątek" lessons={plan[4]} />
      </StyledWrapper>
    </Section>
  );
}

export default Plan;
