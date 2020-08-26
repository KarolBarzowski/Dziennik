import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { slideInDown } from 'functions/animations';
import { events } from 'utils/calendarData';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Heading from 'components/atoms/Heading/Heading';
import CountUp from 'react-countup';

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  margin: 0 0 1.5rem 0;
  padding: 1rem 1.5rem 1.5rem;
  background-color: ${({ theme }) => theme.card};
  border-radius: 1.5rem;
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  break-inside: avoid-column;
  transition: background-color ${({ theme }) => theme.themeTransition};
  animation: ${slideInDown} ${({ theme }) => theme.slideTransition} 0.15s;
`;

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: baseline;
`;

const Day = styled(Paragraph)`
  font-size: 5.5rem;

  ${({ border }) =>
    border &&
    css`
      position: relative;
      margin-left: 1.5rem;
      padding-left: 1.5rem;

      ::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        border-left: 1px solid ${({ theme }) => theme.textSecondary};
        height: 5.5rem;
      }
    `}
`;

const Month = styled(Paragraph)`
  font-size: 2.1rem;
  margin-left: 0.5rem;
`;

const Label = styled(Paragraph)`
  font-size: 2.1rem;
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
`;

const Column = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-top: ${({ marginTop }) => (marginTop ? '1.5rem' : 0)};
`;

const StyledParagraph = styled(Paragraph)`
  margin-left: 3rem;
`;

const monthsInYear = [
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

function EventCard() {
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTs = today.getTime();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const tomorrowTs = tomorrow.getTime();

    const year = today.getFullYear();

    let closestEvent = null;
    let closestTs = null;

    events.forEach(({ label, date }) => {
      if (date.getFullYear() === year) {
        const ts = date.getTime();
        if (ts >= todayTs) {
          if (ts <= closestTs || closestEvent === null) {
            closestTs = ts;
            closestEvent = {
              label,
              day: date.getDate(),
              month: date.getMonth(),
            };
          }
        }
      }
    });

    const timeleft = closestTs - new Date().getTime();

    const daysLeft = Math.floor(timeleft / (1000 * 60 * 60 * 24));

    if (closestTs === todayTs) {
      closestEvent.left = 'Dzisiaj';
    } else if (closestTs === tomorrowTs) {
      closestEvent.left = 'Jutro';
    } else {
      closestEvent.left = daysLeft;
    }

    setCurrentEvent(closestEvent);
  }, []);

  return currentEvent ? (
    <Wrapper>
      <Header>
        <Heading>Przypominacz</Heading>
      </Header>
      <Row>
        <Column>
          <Paragraph secondary>Pozostało</Paragraph>
          <Row>
            <Day>
              {typeof currentEvent.left === 'number' ? (
                <CountUp start={0} end={currentEvent.left} duration={1.25} delay={0.1} />
              ) : (
                currentEvent.left
              )}
            </Day>
            {typeof currentEvent.left === 'number' ? <Month secondary>dni</Month> : null}
          </Row>
        </Column>
        <Column>
          <StyledParagraph secondary>Data</StyledParagraph>
          <Row>
            <Day border>
              <CountUp start={0} end={currentEvent.day} duration={1.25} delay={0.1} />
            </Day>
            <Month secondary>{monthsInYear[currentEvent.month]}</Month>
          </Row>
        </Column>
      </Row>
      <Row>
        <Column marginTop>
          <Paragraph secondary>Święto / Okazja</Paragraph>
          <Label>{currentEvent.label}</Label>
        </Column>
      </Row>
    </Wrapper>
  ) : null;
}

export default EventCard;
