import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { css, keyframes } from 'styled-components';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Button from 'components/atoms/Button/Button';
import Lesson from 'components/molecules/Lesson/Lesson';
import { slideInDown } from 'functions/animations';
import Tooltip from 'components/atoms/Tooltip/Tooltip';

const DelayedAppear = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  margin: 0 0 1.5rem 0;
  padding: 1rem 1.5rem 1.5rem;
  background-color: ${({ theme }) => theme.card};
  border-radius: 1.5rem;
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  break-inside: avoid-column;
  transition: background-color ${({ theme }) => theme.themeTransition};
  animation: ${slideInDown} ${({ theme }) => theme.slideTransition} 0.15s;
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

const StyledRow = styled(StyledParagraph)`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem;
  width: 100%;
  break-inside: avoid-column;

  ${({ color, theme }) =>
    theme[color]
      ? css`
          color: theme[color];
        `
      : css`
          color: theme.text;
        `};

  :nth-of-type(even) {
    background-color: ${({ theme }) => theme.modalHover};
  }

  :hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;

const StyledSpan = styled.span`
  text-align: left;
  min-width: 12rem;
  max-width: 12rem;
  cursor: default;

  :last-of-type {
    min-width: 14rem;
    max-width: 14rem;
  }
`;

const StyledColor = styled(StyledSpan)`
  color: ${({ theme, color }) => (theme[color] !== undefined ? theme[color] : theme.text)};
`;

const StyledMiniCard = styled(StyledContent)`
  align-items: flex-start;
`;

const StyledGradesWrapper = styled.span`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-start;
  min-width: 16rem;
`;

const StyledTip = styled.span`
  position: absolute;
  top: calc(100% + 1rem);
  left: 50%;
  transform: translateX(-50%);
  border-radius: 1rem;
  padding: 0.8rem;
  font-size: ${({ theme }) => theme.m};
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  text-align: left;
  opacity: 0;
  background-color: ${({ theme }) => theme.tip};
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  transition: opacity 0.04s ease-in-out 0.02s;
  break-inside: avoid-column;
  z-index: 10;
  visibility: hidden;
  transition: opacity 0.15s ease-in-out, visibility 0s linear 0.15s;

  ::before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;

    border-bottom: 0.8rem solid rgb(58, 58, 60);
    border-top: 0.8rem solid transparent;
    border-right: 0.8rem solid transparent;
    border-left: 0.8rem solid transparent;

    top: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const StyledGrade = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3.4rem;
  width: 3.4rem;
  background-color: ${({ theme, isNotCounted }) =>
    isNotCounted ? 'rgba(255, 255, 255, 0.12)' : theme.modalHover};
  border-radius: 0.8rem;
  margin: 0.5rem 0.5rem 0 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.12);

  :hover ${StyledTip} {
    transition: opacity 0.15s ease-in-out;
    opacity: 1;
    visibility: visible;
  }
`;

const StyledNumber = styled.span`
  position: relative;
  color: ${({ theme, color }) => (theme[color] ? theme[color] : theme.text)};
  font-size: 2.1rem;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  text-align: center;

  :hover ${Tooltip} {
    transform: translateX(-50%) scale(1);
  }
`;

const StyledBorder = styled.hr`
  margin: 0.4rem 0 0.2rem;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.textSecondary};
`;

const StyledTooltipDescription = styled.span`
  color: ${({ theme, color }) => (theme[color] ? theme[color] : theme.text)};
  display: block;
  width: 100%;
  text-align: left;
  font-size: 1.6rem;
  margin: 0.2rem 0 0;
`;

const StyledDescription = styled(Paragraph)`
  align-self: center;
  animation: ${DelayedAppear} 0.3s ease-in-out backwards 0.3s;
`;

function Card({
  children,
  cardType,
  lessons,
  exams,
  grades,
  points,
  link,
  ctaText,
  nextDayExams,
  active,
}) {
  const [uniqueLessons, setUniqueLessons] = useState(null);
  const [time, setTime] = useState('Brak danych');

  useEffect(() => {
    if (lessons && lessons.length) {
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
    // eslint-disable-next-line
  }, [lessons]);

  useEffect(() => {
    if (uniqueLessons) {
      nextDayExams.forEach(exam => {
        uniqueLessons.forEach(({ name }, i) => {
          if (name === exam.name) {
            uniqueLessons[i].warn = {
              type: exam.category,
              desc: exam.desc,
            };
          }
        });
      });
    }
  }, [nextDayExams, uniqueLessons]);

  return (
    <StyledWrapper active={active}>
      {children}
      {cardType === 'plan' && (
        <StyledContent>
          {uniqueLessons ? (
            <>
              <StyledParagraph>{time}</StyledParagraph>
              {uniqueLessons.map(({ name, hours, teacher, room, multiple, warn }) => (
                <Lesson
                  key={name}
                  hours={hours}
                  name={name}
                  room={room}
                  teacher={teacher}
                  multiple={multiple}
                  warn={warn}
                />
              ))}
            </>
          ) : (
            <StyledDescription secondary>Brak danych</StyledDescription>
          )}
        </StyledContent>
      )}
      {cardType === 'mini' && (
        <StyledMiniCard>
          <Button as="a" href={link}>
            {ctaText}
          </Button>
        </StyledMiniCard>
      )}
      {cardType === 'exams' && (
        <StyledMiniCard>
          {exams && exams.length ? (
            exams.map(
              ({ name, isNextWeek, dayName, dateSyntax, desc, nameColor, color, category }) => (
                <StyledRow key={desc}>
                  <StyledSpan>{isNextWeek ? dayName : dateSyntax}</StyledSpan>
                  <StyledColor color={color}>{category}</StyledColor>
                  <StyledColor color={nameColor}>{name}</StyledColor>
                </StyledRow>
              ),
            )
          ) : (
            <StyledDescription secondary>Brak nadchodzących zadań</StyledDescription>
          )}
        </StyledMiniCard>
      )}
      {cardType === 'grades' && (
        <StyledMiniCard>
          {grades && grades.length ? (
            grades.map(({ color: nameColor, name, grades: gradesList }) => (
              <StyledRow color={nameColor} key={name}>
                <StyledSpan>{name}</StyledSpan>
                <StyledGradesWrapper>
                  {gradesList.map(
                    (
                      {
                        color,
                        grade,
                        notCounted,
                        category,
                        weight,
                        dateSyntax,
                        gradeDesc,
                        categoryDesc,
                      },
                      i,
                    ) => (
                      <StyledGrade key={i.toString()} isNotCounted={notCounted}>
                        <StyledNumber color={color}>{grade}</StyledNumber>
                        <StyledTip>
                          {notCounted ? (
                            <StyledTooltipDescription color="textSecondary">
                              Nie liczona do średniej
                            </StyledTooltipDescription>
                          ) : null}
                          <StyledTooltipDescription color={color}>
                            {category}
                          </StyledTooltipDescription>
                          <StyledTooltipDescription>Waga {weight}</StyledTooltipDescription>
                          <StyledTooltipDescription>{dateSyntax}</StyledTooltipDescription>
                          {categoryDesc || gradeDesc ? <StyledBorder /> : null}
                          <StyledTooltipDescription>{categoryDesc}</StyledTooltipDescription>
                          <StyledTooltipDescription>{gradeDesc}</StyledTooltipDescription>
                        </StyledTip>
                      </StyledGrade>
                    ),
                  )}
                </StyledGradesWrapper>
              </StyledRow>
            ))
          ) : (
            <StyledDescription secondary>Brak nowych ocen</StyledDescription>
          )}
        </StyledMiniCard>
      )}
      {cardType === 'points' && (
        <StyledMiniCard>
          {points && points.length ? (
            points.map(({ type = 'Inne', points, teacher, color, isCounted }, i) => (
              <StyledRow key={i.toString()}>
                <StyledColor color={isCounted ? color : null}>{type}</StyledColor>
                <StyledColor>{points > 0 ? `+${points}` : points}</StyledColor>
                <StyledSpan>{teacher}</StyledSpan>
              </StyledRow>
            ))
          ) : (
            <StyledDescription secondary>Brak nowych uwag</StyledDescription>
          )}
        </StyledMiniCard>
      )}
    </StyledWrapper>
  );
}

Card.propTypes = {
  children: PropTypes.element,
  cardType: PropTypes.oneOf(['plan', 'grades', 'exams', 'mini', 'points']).isRequired,
  lessons: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.objectOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.objectOf(PropTypes.string),
        ]),
      ),
    ),
  ]),
  exams: PropTypes.arrayOf(
    PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date), PropTypes.bool]),
    ),
  ),
  link: PropTypes.string,
  ctaText: PropTypes.string,
  nextDayExams: PropTypes.arrayOf(
    PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date), PropTypes.bool]),
    ),
  ),
  grades: PropTypes.arrayOf(
    PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(
          PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool])),
        ),
      ]),
    ),
  ),
  points: PropTypes.arrayOf(
    PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])),
  ),
  active: PropTypes.bool,
};

Card.defaultProps = {
  lessons: null,
  children: null,
  exams: null,
  points: null,
  link: '',
  ctaText: '',
  nextDayExams: [],
  grades: null,
  active: false,
};

export default Card;
