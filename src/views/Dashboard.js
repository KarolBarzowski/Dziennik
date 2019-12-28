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
  const [syntax, setSyntax] = useState({
    dateSyntax: 'Ładowanie...',
    weatherSyntax: 'Ładowanie...',
  });

  useEffect(() => {
    if (weather) {
      const { name, date, temp, pop } = weather;
      const dateSyntax = `${name}, ${date}`;
      const weatherSyntax = `${temp}°C | ${pop}%`;
      setSyntax({ dateSyntax, weatherSyntax });
    }
  }, [weather]);

  return (
    <StyledSection>
      <StyledHeading big>Podsumowanie</StyledHeading>
      <StyledWrapper>
        <Card
          cardType="plan"
          title="Plan lekcji"
          description={syntax.dateSyntax}
          weather={syntax.weatherSyntax}
          link="/plan"
          time="8:55 - 16:15"
          lessons={data.plan[3]}
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
