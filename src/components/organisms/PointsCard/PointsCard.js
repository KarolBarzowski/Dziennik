import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useData } from 'hooks/useData';
import { getColor } from 'functions/functions';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Card from 'components/atoms/Card/Card';
import { ReactComponent as NoData } from 'assets/images/no_points.svg';

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
`;

const StyledImg = styled(NoData)`
  pointer-events: none;
  height: 14.4rem;
  width: 14.4rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const Empty = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  margin: 2.5rem;
`;

const Info = styled(Paragraph)`
  font-size: 1.6rem;
  margin-top: 1.5rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.dp01};
  margin: 1rem 0;
  border-radius: 1rem;
  padding: 1.5rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const Color = styled(Paragraph)`
  font-size: 1.6rem;
  color: ${({ color, theme }) => (theme[color] ? theme[color] : theme.text)};
  width: calc(33% - 1.5rem);

  ::first-letter {
    text-transform: uppercase;
  }
`;

function PointsCard() {
  const [points, setPoints] = useState([]);

  const { pointsData } = useData();

  useEffect(() => {
    const lastTs = JSON.parse(window.localStorage.getItem('lastTs'));

    if (pointsData && lastTs) {
      const results = [];

      pointsData.forEach(({ date, type, points, teacher }) => {
        const [day, month, year] = date.split('/');
        const d = new Date(`20${year}`, month - 1, day);

        if (d.getTime() > lastTs) {
          results.push({
            type: type.length ? type : 'Inne',
            points,
            teacher,
            color: getColor(type),
          });
        }
      });

      setPoints(results);
    }
  }, [pointsData]);

  return (
    <Card>
      <StyledHeading delay={0.05}>Uwagi</StyledHeading>
      {points.length ? (
        points.map(({ type, teacher, points, color }) => (
          <Row>
            <Color color={color}>{type}</Color>
            <Color>
              {points > 0 ? '+' : ''}
              {points}
            </Color>
            <Color>{teacher}</Color>
          </Row>
        ))
      ) : (
        <Empty>
          <StyledImg delay={0.1} />
          <Info secondary delay={0.15}>
            Żadnych nowych uwag
          </Info>
        </Empty>
      )}
    </Card>
  );
}

export default PointsCard;
