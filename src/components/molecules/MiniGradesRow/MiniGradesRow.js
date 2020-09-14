import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';
import { getCleanName, getColor } from 'functions/functions';
import Tooltip from 'components/atoms/Tooltip/Tooltip';

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
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
  min-height: 6.4rem;
  padding: 1rem;
  width: 100%;
  margin-top: 1rem;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.dp01};
  animation: ${slideIn} 0.3s ease-in-out backwards;
  animation-delay: ${({ delay }) => `${delay + 0.3}s`};
`;

const Name = styled.p`
  color: ${({ theme, color }) => (theme[color] ? theme[color] : theme.text)};
  font-size: 1.6rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  width: 33%;
  text-align: left;
`;

const GradesWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-start;
  width: calc(33% - 1.5rem);
`;

const Number = styled.span`
  position: relative;
  color: ${({ theme, color }) => (theme[color] ? theme[color] : theme.text)};
  font-size: 2.1rem;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  width: 15%;
  text-align: center;

  :hover ${Tooltip} {
    transform: translate(-50%, 0.8rem) scale(1);
  }
`;

const Avg = styled(Number)`
  width: 100%;

  ${({ secondary }) =>
    secondary &&
    css`
      color: ${({ theme }) => theme.textSecondary};
      font-size: 1.6rem;
    `}
`;

const AvgWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-end;
  width: calc(33% - 1.5rem);
`;

const StyledTooltip = styled(Tooltip)`
  border-radius: 1rem;

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

const Description = styled.span`
  color: ${({ theme, color }) => (theme[color] ? theme[color] : theme.text)};
  display: block;
  width: 100%;
  text-align: left;
  font-size: 1.6rem;
  margin: 0.2rem 0 0;
`;

const Border = styled.hr`
  margin: 0.4rem 0 0.2rem;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.textSecondary};
`;

const Grade = styled.span`
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

  ${Number} {
    width: 100%;
  }

  :hover ${Tooltip} {
    transform: translate(-50%, 0.8rem) scale(1);
  }
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

const today = new Date();
const currentDay = today.getDate();
const currentMonth = today.getMonth();

let yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const yesterdayMonth = yesterday.getMonth();
yesterday = yesterday.getDate();

function MiniGradesRow({ name, newGrades, allGrades, delay, semester, setSemesters }) {
  const [grades, setGrades] = useState([]);
  const [isUpdate, setIsUpdate] = useState(0);
  const [avg, setAvg] = useState();
  const [fullAvg, setFullAvg] = useState();
  const [avgColor, setAvgColor] = useState('text');

  useEffect(() => {
    const newResults = [[], []];
    const semesters = [];
    const allResults = [[], []];
    const avgs = [];
    const fullAvgs = [];

    newGrades.forEach(
      ({
        semester: gradeSem,
        isCounted,
        grade,
        weight,
        category,
        gradeDesc,
        value,
        date,
        categoryDesc,
      }) => {
        if (gradeSem === '') {
          return;
        }

        if (category === 'Ocena przewidywana') {
          return;
        }
        if (category === 'Ocena za półrocze') {
          return;
        }

        const dateArray = date.split(' ');
        let [day, month, year] = dateArray[0].split('/');
        day = parseFloat(day);
        month = parseFloat(month) - 1;
        year = parseFloat(year);

        const [hour, minute, second] = dateArray[1].split(':');
        const actualDate = new Date(
          `20${year}`,
          parseFloat(month),
          parseFloat(day),
          parseFloat(hour),
          parseFloat(minute),
          parseFloat(second),
        );

        let fullDate;

        if (currentDay === day && currentMonth === month) {
          fullDate = `Dzisiaj o ${hour}:${minute}`;
        } else if (yesterday === day && yesterdayMonth === month) {
          fullDate = `Wczoraj o ${hour}:${minute}`;
        } else {
          fullDate = `${day} ${monthsInYearInGenitive[month]} | ${hour}:${minute}`;
        }

        const gradeObj = {
          grade,
          weight,
          category,
          categoryDesc,
          value,
          desc: gradeDesc,
          dateSyntax: fullDate,
          date: actualDate,
          notCounted: !isCounted,
          semester: parseFloat(gradeSem) - 1,
        };

        if (isCounted) {
          gradeObj.color = getColor(category);
        } else gradeObj.color = 'textSecondary';

        semesters.push(gradeSem);
        newResults[parseFloat(gradeSem) - 1].push(gradeObj);
      },
    );

    allGrades.forEach(({ semester: gradeSem, isCounted, weight, category, value }) => {
      if (gradeSem === '') {
        return;
      }

      if (category === 'Ocena przewidywana') {
        return;
      }
      if (category === 'Ocena za półrocze') {
        return;
      }

      if (isCounted) {
        const gradeObj = {
          value,
          weight,
        };

        allResults[parseFloat(gradeSem) - 1].push(gradeObj);
      }
    });

    // count avgs for 2 semesters
    const semestersSet = Array.from(new Set(semesters));

    if (!isUpdate) {
      setSemesters(prevState => [...prevState, ...semestersSet]);
    }
    setIsUpdate(prevState => prevState + 1);

    semestersSet.forEach(sem => {
      const currentSem = parseFloat(sem) - 1;

      let n = 0;
      let d = 0;

      allResults[currentSem].forEach(({ value, weight }) => {
        n += parseFloat(value) * parseFloat(weight);
        d += parseFloat(weight);
      });

      let avg = (n / d).toFixed(2);

      avgs[currentSem] = avg;

      newResults[currentSem].forEach(({ value, weight }) => {
        n += parseFloat(value) * parseFloat(weight);
        d += parseFloat(weight);
      });

      avg = (n / d).toFixed(2);

      fullAvgs[currentSem] = avg;
    });

    if (fullAvgs[semester] > avgs[semester]) {
      setAvgColor('green');
    } else if (fullAvgs[semester] < avgs[semester]) {
      setAvgColor('red');
    } else {
      setAvgColor('text');
    }

    if (avgs[semester] === 'NaN') {
      setAvgColor('text');
    }

    const sorted = newResults[semester].sort((a, b) => a.date - b.date);
    setGrades(sorted);
    setAvg(avgs[semester]);
    setFullAvg(fullAvgs[semester]);

    // eslint-disable-next-line
  }, [allGrades, newGrades, semester]);

  return grades.length ? (
    <Wrapper delay={delay}>
      <Name color={getCleanName(name)}>{name}</Name>
      <GradesWrapper>
        {grades.map(
          ({ grade, color, notCounted, category, weight, dateSyntax, categoryDesc, desc }, i) => (
            <Grade key={i.toString()} isNotCounted={notCounted}>
              <Number color={color}>{grade}</Number>
              <StyledTooltip>
                {notCounted ? (
                  <Description color="textSecondary">Nie liczona do średniej</Description>
                ) : null}
                <Description color={color}>{category}</Description>
                <Description>Waga {weight}</Description>
                <Description>{dateSyntax}</Description>
                {categoryDesc || desc ? <Border /> : null}
                <Description>{categoryDesc}</Description>
                <Description>{desc}</Description>
              </StyledTooltip>
            </Grade>
          ),
        )}
      </GradesWrapper>
      <AvgWrapper>
        <Avg color={avgColor}>{fullAvg}</Avg>
        {avg !== 'NaN' ? <Avg secondary>{avg}</Avg> : null}
      </AvgWrapper>
    </Wrapper>
  ) : null;
}

MiniGradesRow.propTypes = {
  name: PropTypes.string.isRequired,
  semester: PropTypes.number,
  newGrades: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string,
      categoryDesc: PropTypes.string,
      date: PropTypes.string,
      grade: PropTypes.string,
      gradeDesc: PropTypes.string,
      isCounted: PropTypes.bool,
      semester: PropTypes.string,
      teacher: PropTypes.string,
      value: PropTypes.string,
      weight: PropTypes.string,
    }),
  ),
  allGrades: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string,
      categoryDesc: PropTypes.string,
      date: PropTypes.string,
      grade: PropTypes.string,
      gradeDesc: PropTypes.string,
      isCounted: PropTypes.bool,
      semester: PropTypes.string,
      teacher: PropTypes.string,
      value: PropTypes.string,
      weight: PropTypes.string,
    }),
  ),
  delay: PropTypes.number.isRequired,
  setSemesters: PropTypes.func.isRequired,
};

MiniGradesRow.defaultProps = {
  semester: 0,
  newGrades: [],
  allGrades: [],
};

export default MiniGradesRow;
