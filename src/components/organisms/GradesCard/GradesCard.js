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
  margin-top: 1.5rem;
  max-width: 14.4rem;
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

const Warning = styled(Paragraph)`
  color: ${({ theme }) => theme.red};
  opacity: 0.87;
  font-size: 1.6rem;
  margin-top: 0.5rem;
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

function GradesCard() {
  const { gradesData } = useData();

  useEffect(() => {}, []);

  return (
    <Card>
      <StyledHeading delay={0.05}>Oceny</StyledHeading>
    </Card>
  );
}

export default GradesCard;
