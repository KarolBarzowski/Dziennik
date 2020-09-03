import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ReactGA from 'react-ga';
import { useData } from 'hooks/useData';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Card from 'components/atoms/Card/Card';

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

const StyledParagraph = styled(Paragraph)`
  font-size: 2.1rem;
  font-weight: 600;
  margin: 0.5rem 0 0;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const StyledDescription = styled(Paragraph)`
  margin-top: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const Button = styled.a`
  display: block;
  padding: 0.6rem 1.4rem;
  max-width: 14.4rem;
  margin-top: 1.5rem;
  border: 0.2rem solid rgb(99, 99, 102);
  border-radius: 5rem;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out 0s, border 0.3s ease-in-out 0.05s,
    color 0.3s ease-in-out 0.05s;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};

  :hover {
    background-color: rgba(255, 255, 255, 0.07);
  }

  ${Paragraph} {
    font-size: 1.6rem;
  }
`;

const StyledHeading = styled(Heading)`
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
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

function SyncCard() {
  const [dataDate, setDataDate] = useState('');
  const [lastSyncDate, setLastSyncDate] = useState('');

  const { userData } = useData();

  useEffect(() => {
    if (userData) {
      let fullDate = '';

      const { lastSync, timestamp } = userData;
      const [date, time] = lastSync.split(' ');

      let [, month, day] = date.split('-');
      day = parseFloat(day);
      month = parseFloat(month) - 1;

      let [hour, minute] = time.split(':');
      hour = parseFloat(hour);

      const today = new Date();
      const currentDay = today.getDate();
      const currentMonth = today.getMonth();

      let yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const yesterdayMonth = yesterday.getMonth();
      yesterday = yesterday.getDate();

      if (currentDay === day && currentMonth === month) {
        fullDate = `Dzisiaj o ${hour}:${minute}`;
      } else if (yesterday === day && yesterdayMonth === month) {
        fullDate = `Wczoraj o ${hour}:${minute}`;
      } else {
        fullDate = `${day} ${monthsInYearInGenitive[month]} o ${hour}:${minute}`;
      }

      let fullSyncDate = '';

      const syncDate = new Date(timestamp);
      const syncDateDay = syncDate.getDate();
      const syncDateMonth = syncDate.getMonth();
      const syncHour = syncDate.getHours();
      const syncMinute = syncDate.getMinutes();

      if (syncDateDay === currentDay && syncDateMonth === currentMonth) {
        fullSyncDate = `Dzisiaj o ${syncHour}:${syncMinute}`;
      } else if (yesterday === syncDateDay && yesterdayMonth === syncDateMonth) {
        fullSyncDate = `Wczoraj o ${syncHour}:${syncMinute}`;
      } else {
        fullSyncDate = `${syncDateDay} ${monthsInYearInGenitive[syncDateMonth]} o ${syncHour}:${syncMinute}`;
      }

      setLastSyncDate(fullSyncDate);
      setDataDate(fullDate);
    }
  }, [userData]);

  const handleAddEvent = () => {
    ReactGA.event({
      category: 'Synchronizacja',
      action: 'Z nawigacji',
      label: userData.name,
    });
  };

  return (
    <Card>
      <StyledHeading delay={0.05}>Aktualność danych</StyledHeading>
      <StyledDescription secondary delay={0.1}>
        Wyświetlam dane z:
      </StyledDescription>
      <StyledParagraph delay={0.15}>{dataDate}</StyledParagraph>
      <StyledDescription secondary delay={0.2}>
        Ostatnia synchronizacja
      </StyledDescription>
      <StyledParagraph delay={0.25}>{lastSyncDate}</StyledParagraph>
      <Button
        href="https://nasze.miasto.gdynia.pl/ed_miej/zest_start.pl?autoSync=true"
        onClick={handleAddEvent}
        delay={0.3}
      >
        <Paragraph>Synchronizuj</Paragraph>
      </Button>
    </Card>
  );
}

export default SyncCard;
