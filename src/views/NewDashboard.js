import React from 'react';
import styled from 'styled-components';
import Section from 'components/atoms/Section/Section';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import WelcomeCard from 'components/organisms/WelcomeCard/WelcomeCard';
import SyncCard from 'components/organisms/SyncCard/SyncCard';
import EventCard from 'components/organisms/EventCard/EventCard';
import GradesCard from 'components/organisms/GradesCard/GradesCard';
import ExamsCard from 'components/organisms/ExamsCard/ExamsCard';

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  width: 100%;
`;

const Column = styled.div`
  height: 100%;
  width: 33%;

  :not(:first-of-type) {
    margin-left: 1.5rem;
  }

  @media screen and (min-width: 1440px) {
    width: 50%;

    :first-of-type,
    :last-of-type {
      width: 25%;
    }
  }
`;

const InnerColumn = styled.div`
  width: 100%;

  :not(:first-of-type) {
    margin-left: 0rem;
  }

  @media screen and (min-width: 1440px) {
    width: calc(50% - 1.5rem);
    :not(:first-of-type) {
      margin-left: 1.5rem;
    }
  }
`;

const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const ColumnDescription = styled(Paragraph)`
  text-transform: uppercase;
  letter-spacing: 0.1rem;
`;

function Dashboard() {
  return (
    <Section>
      <Container>
        <Column>
          <ColumnDescription secondary>Informacje ogólne</ColumnDescription>
          <WelcomeCard />
          <SyncCard />
          <EventCard />
        </Column>
        <Column>
          <ColumnDescription secondary>Od ostatniej synchronizacji</ColumnDescription>
          <Row>
            <InnerColumn>
              <GradesCard />
            </InnerColumn>
            <InnerColumn>
              <ExamsCard />
            </InnerColumn>
          </Row>
        </Column>
        <Column>
          <ColumnDescription secondary>Reszta</ColumnDescription>
        </Column>
      </Container>
    </Section>
  );
}

export default Dashboard;
