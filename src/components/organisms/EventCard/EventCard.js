import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { events } from 'utils/calendarData';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Heading from 'components/atoms/Heading/Heading';
import Card from 'components/atoms/Card/Card';
import CountUp from 'react-countup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faRedoAlt } from '@fortawesome/free-solid-svg-icons';

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
  align-items: baseline;

  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
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

const StyledHeading = styled(Heading)`
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const Month = styled(Paragraph)`
  font-size: 2.1rem;
  margin-left: 0.5rem;
`;

const Label = styled(Paragraph)`
  font-size: 2.1rem;
`;

const Header = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
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

const Button = styled.button`
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.text};
  padding: 0.5rem 1rem;
  border-radius: 5rem;
  background-color: transparent;
  border: 0.2rem solid ${({ theme }) => theme.border};
  cursor: pointer;
  margin-left: 0.5rem;
  outline: none;
  transition: background-color 0.05s ease-in-out;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};

  :hover,
  :focus {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`;

const Icon = styled(FontAwesomeIcon)`
  margin-left: 0.5rem;
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

const today = new Date();
today.setHours(0, 0, 0, 0);
const todayTs = today.getTime();

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);
const tomorrowTs = tomorrow.getTime();

const year = today.getFullYear();

function EventCard() {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [defaultEvent, setDefaultEvent] = useState(null);
  const [isReset, setIsReset] = useState(false);
  const [isNext, setIsNext] = useState(true);
  const [prevCount, setPrevCount] = useState(1);

  useEffect(() => {
    let closestEvent = null;
    let closestTs = null;

    events.forEach(({ label, date }, i) => {
      if (date.getFullYear() === year) {
        const ts = date.getTime();
        if (ts >= todayTs) {
          if (ts <= closestTs || closestEvent === null) {
            closestTs = ts;
            closestEvent = {
              label,
              day: date.getDate(),
              month: date.getMonth(),
              index: i,
            };
          }
        }
      }
    });

    const timeleft = closestTs - new Date().getTime();

    const daysLeft = parseFloat((timeleft / (1000 * 60 * 60 * 24)).toFixed());

    if (closestTs === todayTs) {
      closestEvent.left = 'Dzisiaj';
    } else if (closestTs === tomorrowTs) {
      closestEvent.left = 'Jutro';
    } else {
      closestEvent.left = daysLeft;
    }

    if (closestEvent.day === 31 && closestEvent.month === 11) {
      setIsNext(false);
      setIsReset(false);
    }

    setCurrentEvent(closestEvent);
    setDefaultEvent(closestEvent);
  }, []);

  const handleNext = () => {
    setIsReset(true);

    let closestEvent = null;
    let closestTs = null;

    events.forEach(({ label, date }, i) => {
      if (date.getFullYear() === year) {
        const ts = date.getTime();
        const currentTs = events[currentEvent.index].date.getTime();

        if (ts > currentTs) {
          if (ts <= closestTs || closestTs === null) {
            closestTs = ts;
            closestEvent = {
              label,
              day: date.getDate(),
              month: date.getMonth(),
              index: i,
            };
          }
        }
      }
    });

    const timeleft = closestTs - new Date().getTime();

    const daysLeft = parseFloat((timeleft / (1000 * 60 * 60 * 24)).toFixed());

    if (closestTs === todayTs) {
      closestEvent.left = 'Dzisiaj';
    } else if (closestTs === tomorrowTs) {
      closestEvent.left = 'Jutro';
    } else {
      closestEvent.left = daysLeft;
    }

    if (closestEvent.day === 31 && closestEvent.month === 11) {
      setIsNext(false);
    }

    setPrevCount(currentEvent.left);
    setCurrentEvent(closestEvent);
  };

  const handleReset = () => {
    setIsReset(false);
    setIsNext(true);
    setCurrentEvent(defaultEvent);
  };

  return currentEvent ? (
    <Card>
      <Header>
        <StyledHeading delay={0.05}>Przypominacz</StyledHeading>
        <Row>
          {isReset && (
            <Button type="button" onClick={handleReset}>
              <FontAwesomeIcon icon={faRedoAlt} />
            </Button>
          )}
          {isNext && (
            <Button type="button" onClick={handleNext} delay={0.1}>
              Następne
              <Icon icon={faArrowRight} fixedWidth />
            </Button>
          )}
        </Row>
      </Header>
      <Row delay={0.15}>
        <Column>
          <Paragraph secondary>Pozostało</Paragraph>
          <Row>
            <Day>
              {typeof currentEvent.left === 'number' ? (
                <CountUp start={prevCount} end={currentEvent.left} duration={1.5} delay={0.35} />
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
            <Day border>{currentEvent.day}</Day>
            <Month secondary>{monthsInYear[currentEvent.month]}</Month>
          </Row>
        </Column>
      </Row>
      <Row delay={0.2}>
        <Column marginTop>
          <Paragraph secondary>Święto / Okazja</Paragraph>
          <Label>{currentEvent.label}</Label>
        </Column>
      </Row>
    </Card>
  ) : null;
}

export default EventCard;
