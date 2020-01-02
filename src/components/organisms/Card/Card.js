import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudRain } from '@fortawesome/free-solid-svg-icons';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Heading from 'components/atoms/Heading/Heading';
import Lesson from 'components/molecules/Lesson/Lesson';
import { slideInDown } from 'functions/animations';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding: 1rem 1.5rem 1.5rem;
  margin: ${({ center }) => (center ? '1.5rem' : 0)};
  background-color: ${({ theme }) => theme.card};
  border-radius: 1.5rem;
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  transition: background-color ${({ theme }) => theme.themeTransition};
  animation: ${slideInDown} ${({ theme }) => theme.slideTransition} 0.15s;
`;

const StyledHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: ${({ center }) => (center ? 'center' : 'space-between')};
`;

const StyledInfo = styled.div``;

const StyledIcon = styled(FontAwesomeIcon)`
  font-size: 1.4rem;
  margin-left: 0.2rem;
`;

const StyledLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1.5rem;
  max-height: 3.2rem;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  font-size: ${({ theme }) => theme.s};
  font-weight: ${({ theme }) => theme.medium};
  border: 0.2rem solid ${({ theme }) => theme.border};
  border-radius: 5rem;
  transition: background-color 0.1s ease-in-out, border ${({ theme }) => theme.themeTransition},
    color ${({ theme }) => theme.themeTransition};
  :hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`;

const StyledContent = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  text-align: center;
  margin-top: 2.5rem;
`;

const StyledParagraph = styled(Paragraph)`
  font-size: ${({ theme }) => theme.m};
`;

function Card({ cardType, title, description, weather, link, lessons, center }) {
  const [uniqueLessons, setUniqueLessons] = useState(null);
  const [time, setTime] = useState('Ładowanie...');

  useEffect(() => {
    if (lessons !== 'Ładowanie...') {
      const createUniqueLessons = () => {
        const duplicates = {};

        // get duplicates
        lessons.forEach(({ name }) => {
          duplicates[name] = (duplicates[name] || 0) + 1;
        });

        // assign duplicates number to its lesson
        lessons.forEach((lesson, i) => {
          /* eslint no-param-reassign: ["error", { "props": false }] */
          lessons[i].multiple = duplicates[lesson.name];
        });

        // create array of unique lessons
        const unique = Array.from(new Set(lessons.map(({ name }) => name))).map(name =>
          lessons.find(lesson => lesson.name === name),
        );

        // remove empty lessons
        if (unique[0].name === '') {
          unique.shift();
        } else if (unique[unique.length - 1].name === '') {
          unique.pop();
        }

        unique.forEach((lesson, i) => {
          if (lesson.name.includes('Zajęcia dodatkowe')) {
            unique.splice(i, 1);
          }
        });

        const schoolHours = [
          '07:55',
          '08:45',
          '09:40',
          '10:35',
          '11:30',
          '12:35',
          '13:30',
          '14:25',
          '15:20',
          '16:15',
          '17:05',
          '17:55',
          '18:45',
        ];

        unique.forEach(lesson => {
          if (lesson.multiple !== 1) {
            const { multiple, hours } = lesson;
            const endHour = hours.split(' - ')[1];
            const end =
              schoolHours[schoolHours.findIndex(index => index === endHour) + multiple - 1];
            const start = hours.split(' - ')[0];
            lesson.hours = `${start} - ${end}`;
          }
          return lesson;
        });

        const lessonsTime = `${unique[0].hours.split(' - ')[0]} - ${
          unique[unique.length - 1].hours.split(' - ')[1]
        }`;

        setUniqueLessons(unique);
        setTime(lessonsTime);
      };

      switch (cardType) {
        case 'plan':
          createUniqueLessons();
          break;

        default:
          break;
      }
    }
  }, [cardType, lessons]);

  return (
    <StyledWrapper center={center}>
      <StyledHeader center={center}>
        <StyledInfo>
          <Heading>{title}</Heading>
          <Paragraph regular secondary>
            {description}
          </Paragraph>
          {cardType === 'plan' && (
            <Paragraph regular secondary>
              {weather}
              {weather !== '' && <StyledIcon icon={faCloudRain} />}
            </Paragraph>
          )}
        </StyledInfo>
        {link && <StyledLink to={link}>Wszystkie</StyledLink>}
      </StyledHeader>
      <StyledContent>
        {cardType === 'plan' && (
          <>
            <StyledParagraph>{time}</StyledParagraph>
            {uniqueLessons &&
              uniqueLessons.map(({ name, hours, teacher, room, multiple }) => (
                <Lesson
                  key={name}
                  hours={hours}
                  name={name}
                  room={room}
                  teacher={teacher}
                  multiple={multiple}
                />
              ))}
          </>
        )}
      </StyledContent>
    </StyledWrapper>
  );
}

Card.propTypes = {
  cardType: PropTypes.oneOf(['plan', 'grades', 'exams']).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  weather: PropTypes.string,
  link: PropTypes.string,
  lessons: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    ),
  ]).isRequired,
  center: PropTypes.bool,
};

Card.defaultProps = {
  weather: '',
  link: null,
  center: false,
  description: '',
};

export default Card;
