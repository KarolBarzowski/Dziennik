import React from 'react';
import styled from 'styled-components';
import Section from 'components/atoms/Section/Section';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import WelcomeCard from 'components/organisms/WelcomeCard/WelcomeCard';
import SyncCard from 'components/organisms/SyncCard/SyncCard';
import EventCard from 'components/organisms/EventCard/EventCard';

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  width: 100%;
`;

const Column = styled.div`
  height: 100%;
  width: 33%;

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
  @media screen and (min-width: 1440px) {
    width: 50%;
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
          <ColumnDescription secondary>Kolumna 1</ColumnDescription>
          <WelcomeCard />
          <SyncCard />
          <EventCard />
        </Column>
        <Column>
          <ColumnDescription secondary>Kolumna 2 i 3</ColumnDescription>
          <Row>
            <InnerColumn>a</InnerColumn>
            <InnerColumn>b</InnerColumn>
          </Row>
        </Column>
        <Column>
          <ColumnDescription secondary>Kolumna 4</ColumnDescription>
        </Column>
      </Container>
    </Section>
  );
}

export default Dashboard;
