import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import styled, { keyframes } from 'styled-components';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import { getCleanName } from 'functions/functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

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

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  margin-top: 2.5rem;
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const Time = styled(Paragraph)`
  font-size: 2.1rem;
`;

const Column = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
`;

const LessonWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-radius: 1.5rem;
  padding: 0 1.5rem;
  margin: 1rem 0 0;
  min-height: 6.4rem;
  background-color: ${({ theme, color }) => (theme[color] ? theme[color] : theme.default)};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const StyledParagraph = styled(Paragraph)`
  font-size: 1.6rem;
  color: ${({ theme, color }) => (theme[color] ? theme.textBlack : theme.text)};
  transition: color 0s;

  :nth-of-type(2) {
    text-align: center;
  }

  :nth-of-type(3) {
    text-align: right;
  }
`;

const TextButton = styled.button`
  align-self: flex-end;
  border: none;
  background-color: transparent;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  color: ${({ theme }) => theme.blue};
  font-size: 1.8rem;
  outline: none;
  cursor: pointer;
  width: 8.9rem;
  text-align: right;

  :hover,
  :focus {
    text-decoration: underline;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 1.8rem;
  margin-left: 0.5rem;
  transform: ${({ isexpanded }) => (isexpanded ? 'rotate(-180deg)' : 'rotate(0deg)')};
  transition: transform 0.25s ease-in-out;
`;

function PlanContent({ plan }) {
  const wrapperRef = useRef(null);
  const [time, setTime] = useState('');
  const [results, setResults] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    const tl = gsap.timeline();

    Array.from(wrapper.children).forEach((child, i) => {
      tl.fromTo(
        child,
        {
          y: -(i * 74),
          x: 0,
        },
        {
          y: 0,
          x: 0,
          width: '100%',
          duration: 0.5,
        },
        0,
      );
    });

    let lastIndex = 0;
    Array.from(wrapper.children).forEach((child, i) => {
      if (results[i].index > 0) {
        lastIndex += 1;
      }

      if (isExpanded) {
        tl.to(
          child,
          {
            x: 0,
            y: 0,
            width: '100%',
            duration: 0.5,
          },
          0.5,
        );
      } else {
        tl.fromTo(
          child,
          { x: 0, y: 0, zIndex: 10 - results[i].index },
          {
            x: results[i].index * 10,
            y: -(lastIndex * 64),
            width: `calc(100% - ${results[i].index * 20}px)`,
            duration: 0.5,
          },
          0.5,
        );
      }
    });

    // eslint-disable-next-line
  }, [results]);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    const tl = gsap.timeline();

    let lastIndex = 0;
    Array.from(wrapper.children).forEach((child, i) => {
      if (results[i].index > 0) {
        lastIndex += 1;
      }

      if (isExpanded) {
        tl.to(
          child,
          {
            x: 0,
            y: 0,
            width: '100%',
            duration: 0.5,
          },
          0,
        );
      } else {
        tl.fromTo(
          child,
          { x: 0, y: 0, zIndex: 10 - results[i].index },
          {
            x: results[i].index * 10,
            y: -(lastIndex * 64),
            width: `calc(100% - ${results[i].index * 20}px)`,
            duration: 0.5,
          },
          0,
        );
      }
    });

    // eslint-disable-next-line
  }, [isExpanded]);

  useEffect(() => {
    if (plan.length) {
      const results = [];
      const [startHour] = plan[0].hours.split(' - ');
      const endHour = plan[plan.length - 1].hours.split(' - ')[1];
      setTime(`${startHour} - ${endHour}`);

      let lastLesson = null;
      let index = 0;
      plan.forEach(({ name, room, hours }) => {
        const [start, end] = hours.split(' - ');
        const color = getCleanName(name);

        if (lastLesson === name) {
          lastLesson = name;
          index += 1;
        } else {
          lastLesson = name;
          index = 0;
        }

        results.push({
          name,
          room,
          start,
          end,
          color,
          index,
        });
      });

      setResults(results);
    }
  }, [plan]);

  return (
    <Wrapper delay={0.15}>
      <Time>{time}</Time>
      <TextButton type="button" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Zwiń' : 'Rozwiń'}
        <Icon icon={faChevronDown} isexpanded={isExpanded ? 1 : 0} />
      </TextButton>
      <Column ref={wrapperRef}>
        {results.map(({ name, color, room, start }) => (
          <LessonWrapper color={color} key={start}>
            <StyledParagraph color={color}>{start}</StyledParagraph>
            <StyledParagraph color={color}>{name}</StyledParagraph>
            <StyledParagraph color={color}>{room}</StyledParagraph>
          </LessonWrapper>
        ))}
      </Column>
    </Wrapper>
  );
}

PlanContent.propTypes = {
  plan: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
};

PlanContent.defaultProps = {
  plan: [],
};

export default PlanContent;
