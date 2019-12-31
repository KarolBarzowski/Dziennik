import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Section from 'components/atoms/Section/Section';
import Heading from 'components/atoms/Heading/Heading';
import Card from 'components/organisms/Card/Card';

const StyledSection = styled(Section)`
  padding-top: 7rem;

  @media screen and (min-width: 600px) and (max-width: 929px) {
    padding-top: 8.9rem;
  }

  @media screen and (min-width: 930px) {
    padding-top: 2.5rem;
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  width: 100%;
  padding-top: 8.9rem;
`;

const StyledHeading = styled(Heading)`
  position: absolute;
`;

function Dashboard({ data, weather }) {
  const [weatherSyntax, setWeatherSyntax] = useState('');
  const [dateSyntax, setDateSyntax] = useState('');
  const [plan, setPlan] = useState('Ładowanie...');

  useEffect(() => {
    if (weather) {
      const { temp, pop } = weather;
      const syntax = `${temp}°C | ${pop}%`;
      setWeatherSyntax(syntax);
    }
  }, [weather]);

  const daysInWeek = [
    'Niedziela',
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
  ];
  const date = new Date();
  const today = date.getDay();

  useEffect(() => {
    const tomorrow = new Date(date);
    let planDay = date.getDay();
    if (date.getDay() > 4) planDay = 0;
    if (today < 5) tomorrow.setDate(tomorrow.getDate() + 1);
    else if (today === 5) tomorrow.setDate(tomorrow.getDate() + 3);
    else tomorrow.setDate(tomorrow.getDate() + 2);
    const d = tomorrow.getDate() < 10 ? `0${tomorrow.getDate()}` : tomorrow.getDate();
    const m =
      tomorrow.getMonth() + 1 < 10 ? `0${tomorrow.getMonth() + 1}` : tomorrow.getMonth() + 1;
    const result = `${daysInWeek[tomorrow.getDay()]}, ${d}.${m}`;
    if (data) setPlan(data.plan[planDay]);
    setDateSyntax(result);
  }, [data]);

  return (
    <StyledSection>
      <StyledHeading big>Podsumowanie</StyledHeading>
      <StyledWrapper>
        <Card
          cardType="plan"
          title="Plan lekcji"
          description={dateSyntax}
          weather={weatherSyntax}
          link="/plan"
          lessons={plan}
        />
      </StyledWrapper>
    </StyledSection>
  );
}

Dashboard.propTypes = {
  weather: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

Dashboard.defaultProps = {
  weather: null,
};

export default Dashboard;
