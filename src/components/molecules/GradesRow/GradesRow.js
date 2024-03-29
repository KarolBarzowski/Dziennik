import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Collapse from '@kunukn/react-collapse';
import { Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faSpinner, faSyncAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getCleanName, getColor, getRGBColor } from 'functions/functions';
import { slideInDown } from 'functions/animations';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Tooltip from 'components/atoms/Tooltip/Tooltip';
import GradeForm from 'components/molecules/GradeForm/GradeForm';

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  width: 100%;

  ${({ isOpen }) =>
    isOpen &&
    css`
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16), 0 2px 4px rgba(0, 0, 0, 0.23);
    `}
`;

const StyledButtonMark = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 1.5rem;
  height: 3.4rem;
  width: 3.4rem;
  background-color: ${({ theme }) => theme.modalHover};
  border-radius: 0.8rem;
  transition: background-color 0.1s ease-in-out;
  cursor: pointer;

  ${({ isOpen }) =>
    isOpen &&
    css`
      background-color: ${({ theme }) => theme.blue};
    `};
`;

const StyledIcon = styled(FontAwesomeIcon)`
  transform: rotate(${({ isopen }) => (isopen ? '180deg' : '0deg')});
  color: ${({ theme, isopen }) => (isopen ? theme.text : theme.textSecondary)};
  font-size: 1.6rem;
  transition: transform 0.2s ease-in-out, color 0.1s ease-in-out;
`;

const StyledHeader = styled.button`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 1.5rem 1.5rem 1.5rem 6.4rem;
  min-height: 6.4rem;
  animation: ${slideInDown} ${({ theme }) => theme.slideTransition} 0.15s;

  :hover {
    background-color: ${({ theme }) => theme.modalHover};
  }

  ${({ isOpen }) =>
    isOpen &&
    css`
      ::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: -1.5rem;
        width: calc(100% + 3rem);
        height: 0.1rem;
        background-color: ${({ theme }) => theme.background};
      }
    `}
`;

const StyledCollapse = styled(Collapse)`
  padding: 0 1.5rem;
  transition: height 0.28s cubic-bezier(0.4, 0, 0.2, 1);
`;

const StyledSpan = styled.span`
  color: ${({ theme, color }) => (theme[color] ? theme[color] : theme.text)};
  font-size: 1.6rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  width: 25%;
  text-align: left;
`;

const StyledNumber = styled.span`
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

const StyledGradesWrapper = styled.span`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-start;
  width: 45%;
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

  ${StyledNumber} {
    width: 100%;
  }

  :hover ${Tooltip} {
    transform: translate(-50%, 0.8rem) scale(1);
  }
`;

const StyledTooltip = styled(Tooltip)`
  border-radius: 1rem;
  max-width: 300px;

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

const StyledDescription = styled.span`
  color: ${({ theme, color }) => (theme[color] ? theme[color] : theme.text)};
  display: block;
  width: 300px;
  text-align: left;
  font-size: 1.6rem;
  margin: 0.2rem 0 0;
  word-wrap: break-word;
`;

const StyledBorder = styled.hr`
  margin: 0.4rem 0 0.2rem;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.textSecondary};
`;

const ExpandableWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1.5rem 0;
`;

const StyledGraph = styled.div`
  height: 25rem;
  width: 50%;
`;

const StyledContentWrapper = styled.div`
  height: 28rem;
  width: 50%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  animation: ${slideInDown} ${({ theme }) => theme.slideTransition} 0.15s;

  ${StyledGradesWrapper} {
    width: 100%;
  }
`;

const StyledLoading = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.text};
  margin: 1rem auto;
`;

const StyledContentHeader = styled(Paragraph)`
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  margin-bottom: 1rem;
`;

const StyledContent = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
`;

const StyledGradeBtn = styled.button`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  justify-content: space-between;
  height: 5.5rem;
  width: 5.5rem;
  background-color: ${({ theme }) => theme.modalHover};
  border-radius: 0.8rem;
  margin: 0.5rem 0.5rem 0 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  border: none;
  outline: none;
  padding: 0.5rem;

  :hover,
  :focus {
    background-color: ${({ theme }) => theme.modalFocus};
  }

  ${({ isBlue }) =>
    isBlue &&
    css`
      background-color: ${({ theme }) => theme.blue};

      :hover,
      :focus {
        background-color: ${({ theme }) => theme.blueHover};
      }
    `}
`;

const StyledCustomGrade = styled.span`
  font-size: 3.4rem;
  color: ${({ theme }) => theme.text};
  pointer-events: none;
`;

const StyledWeight = styled.span`
  position: absolute;
  bottom: 0;
  right: 0.5rem;
  font-size: 2.1rem;
  color: ${({ theme }) => theme.textSecondary};
  pointer-events: none;
`;

const StyledResetBtn = styled.button`
  position: absolute;
  top: 2.2rem;
  right: 1.5rem;
  border: none;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  z-index: 100;

  :hover ${Tooltip} {
    border-radius: 1rem 0 1rem 1rem;
    transform: translate(calc(-100% - 0.8rem), 0.4rem) scale(1);
  }
`;

const StyledResetIcon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.text};
  font-size: 2.4rem;
`;

const StyledDefault = styled.span`
  position: absolute;
  top: 100%;
  left: 50%;
  font-weight: ${({ theme }) => theme.regular};
  font-size: ${({ theme }) => theme.s};
  color: ${({ theme }) => theme.textSecondary};

  ${({ isVisible }) =>
    isVisible
      ? css`
          visibility: visible;
          opacity: 1;
          transform: translate(-50%, 0);
          transition: opacity 0.15s ease-in-out 0.05s, transform 0.15s ease-in-out 0.05s;
        `
      : css`
          visibility: hidden;
          opacity: 0;
          transform: translate(-50%, -1rem);
          transition: opacity 0.15s ease-in-out 0.05s, transform 0.15s ease-in-out 0.05s,
            visibility 0s linear 0.2s;
        `}
`;

const StyledPlusIcon = styled(FontAwesomeIcon)`
  font-size: 3.4rem;
  color: ${({ theme }) => theme.text};
  align-self: center;
  margin: auto 0;
  pointer-events: none;
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

function GradesRow({
  name,
  grades,
  semester,
  setEstimatedGrades,
  setFinalGrades,
  index,
  estimatedGrades,
  finalGrades,
  setShouldUpdate,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sortedGrades, setSortedGrades] = useState([]);
  const [average, setAverage] = useState(null);
  const [estimatedGrade, setEstimatedGrade] = useState(null);
  const [finalGrade, setFinalGrade] = useState(null);
  const [gradesSteps] = useState(
    JSON.parse(window.localStorage.getItem('settings_regulation')) || [
      1.86,
      2.86,
      3.86,
      4.86,
      5.51,
    ],
  );
  const [graphData, setGraphData] = useState({ labels: [], datasets: [] });
  const [countedList, setCountedList] = useState([]);
  const [graphList, setGraphList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGradeFormVisible, setIsGradeFormVisible] = useState(false);
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);
  const [currentGrade, setCurrentGrade] = useState(5);
  const [currentWeight, setCurrentWeight] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEdited, setIsEdited] = useState(false);
  const [isReset, setIsReset] = useState(0);
  const [isUpdate, setIsUpdate] = useState(0);
  const [simAverage, setSimAverage] = useState(null);
  const [simEstimatedGrade, setSimEstimatedGrade] = useState(null);
  const [simFinalGrade, setSimFinalGrade] = useState(null);
  const [defaultAvg, setDefaultAvg] = useState(average);
  const [defaultEst, setDefaultEst] = useState(estimatedGrade);
  const [defaultFin, setDefaultFin] = useState(finalGrade);
  const [simAvgColor, setSimAvgColor] = useState('text');
  const [simEstColor, setSimEstColor] = useState('text');
  const [simFinColor, setSimFinColor] = useState('text');
  const [canRemove, setCanRemove] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setIsEdited(false);
    setIsReset(0);
    setIsUpdate(0);

    const results = [];
    const avgGrades = [];
    const avgWeights = [];
    let estimated;
    let final;

    const dataObj = {
      labels: [],
      datasets: [
        {
          data: [],
          fill: false,
          borderCapStyle: 'round',
          borderColor: 'rgba(75, 192, 192, 1)',
          pointBackgroundColor: [],
          pointBorderColor: [],
          pointBorderWidth: 10,
          pointHitRadius: 10,
          pointHoverBorderWidth: 12,
        },
      ],
    };

    grades.forEach(
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
          final = value;
          return;
        }

        if (gradeSem === semester) {
          if (category === 'Ocena przewidywana') {
            estimated = value;
            return;
          }
          if (category === 'Ocena za półrocze') {
            final = value;
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
          };

          if (isCounted) {
            gradeObj.color = getColor(category);
            avgGrades.push(parseFloat(value) * parseFloat(weight));
            avgWeights.push(parseFloat(weight));
          } else gradeObj.color = 'textSecondary';

          results.push(gradeObj);
        }
      },
    );

    const sorted = results.sort((a, b) => a.date - b.date);
    const graphArr = [];
    const countedArr = [];

    sorted.forEach(
      ({ value, dateSyntax, notCounted, color, grade, weight, category, categoryDesc, desc }) => {
        if (!notCounted) {
          graphArr.push({
            grade,
            weight,
            category,
            categoryDesc,
            value,
            desc,
            dateSyntax,
            color,
          });

          countedArr.push({
            grade,
            weight,
            value,
          });

          const [date] = dateSyntax.split(' | ');
          dataObj.labels.push(date);
          dataObj.datasets[0].data.push(parseFloat(value));
          dataObj.datasets[0].pointBackgroundColor.push(getRGBColor(color));
          dataObj.datasets[0].pointBorderColor.push(getRGBColor(color));
        }
      },
    );

    let nominator = 0;
    let denominator = 0;
    for (let i = 0; i < avgGrades.length; i += 1) {
      nominator += avgGrades[i];
      denominator += avgWeights[i];
    }

    const avg = (nominator / denominator).toFixed(2);

    if (!estimated) {
      if (avg <= gradesSteps[0] - 0.01) estimated = 1;
      else if (avg >= gradesSteps[0] && avg <= gradesSteps[1] - 0.01) estimated = 2;
      else if (avg >= gradesSteps[1] && avg <= gradesSteps[2] - 0.01) estimated = 3;
      else if (avg >= gradesSteps[2] && avg <= gradesSteps[3] - 0.01) estimated = 4;
      else if (avg >= gradesSteps[3] && avg <= gradesSteps[4] - 0.01) estimated = 5;
      else if (avg >= gradesSteps[4]) estimated = 6;
    }

    if (!final) {
      if (avg <= gradesSteps[0] - 0.01) final = 1;
      else if (avg >= gradesSteps[0] && avg <= gradesSteps[1] - 0.01) final = 2;
      else if (avg >= gradesSteps[1] && avg <= gradesSteps[2] - 0.01) final = 3;
      else if (avg >= gradesSteps[2] && avg <= gradesSteps[3] - 0.01) final = 4;
      else if (avg >= gradesSteps[3] && avg <= gradesSteps[4] - 0.01) final = 5;
      else if (avg >= gradesSteps[4]) final = 6;
    }

    if (isReset === 0) {
      setEstimatedGrades(prevState => [...prevState, estimated]);
      setFinalGrades(prevState => [...prevState, final]);
      setDefaultAvg(avg);
      setDefaultEst(estimated);
      setDefaultFin(final);
    } else {
      const newEstArr = estimatedGrades;
      newEstArr[index] = estimated;
      setEstimatedGrades(newEstArr);

      const newFinArr = finalGrades;
      newFinArr[index] = final;
      setFinalGrades(newFinArr);
      setShouldUpdate(prevState => prevState + 1);
    }

    setCountedList(countedArr);
    setGraphList(graphArr);
    setGraphData(dataObj);
    setSortedGrades(sorted);
    setAverage(avg);
    setEstimatedGrade(estimated);
    setFinalGrade(final);
    setTimeout(() => {
      setIsLoading(false);
    }, 250);

    // eslint-disable-next-line
  }, [grades, semester, isReset]);

  useEffect(() => {
    let estimated;
    let final;
    let nominator = 0;
    let denominator = 0;

    countedList.forEach(({ value, weight }) => {
      nominator += parseFloat(value) * parseFloat(weight);
      denominator += parseFloat(weight);
    });

    const avg = (nominator / denominator).toFixed(2);

    if (avg <= gradesSteps[0] - 0.01) estimated = 1;
    else if (avg >= gradesSteps[0] && avg <= gradesSteps[1] - 0.01) estimated = 2;
    else if (avg >= gradesSteps[1] && avg <= gradesSteps[2] - 0.01) estimated = 3;
    else if (avg >= gradesSteps[2] && avg <= gradesSteps[3] - 0.01) estimated = 4;
    else if (avg >= gradesSteps[3] && avg <= gradesSteps[4] - 0.01) estimated = 5;
    else if (avg >= gradesSteps[4]) estimated = 6;

    if (avg <= gradesSteps[0] - 0.01) final = 1;
    else if (avg >= gradesSteps[0] && avg <= gradesSteps[1] - 0.01) final = 2;
    else if (avg >= gradesSteps[1] && avg <= gradesSteps[2] - 0.01) final = 3;
    else if (avg >= gradesSteps[2] && avg <= gradesSteps[3] - 0.01) final = 4;
    else if (avg >= gradesSteps[3] && avg <= gradesSteps[4] - 0.01) final = 5;
    else if (avg >= gradesSteps[4]) final = 6;

    if (avg < defaultAvg) setSimAvgColor('red');
    else if (avg > defaultAvg) setSimAvgColor('green');
    else setSimAvgColor('text');

    if (estimated < defaultEst) setSimEstColor('red');
    else if (estimated > defaultEst) setSimEstColor('green');
    else setSimEstColor('text');

    if (final < defaultFin) setSimFinColor('red');
    else if (final > defaultFin) setSimFinColor('green');
    else setSimFinColor('text');

    if (isUpdate !== 0) {
      const newEstArr = estimatedGrades;
      newEstArr[index] = estimated;
      setEstimatedGrades(newEstArr);

      const newFinArr = finalGrades;
      newFinArr[index] = final;
      setFinalGrades(newFinArr);
      setShouldUpdate(prevState => prevState + 1);
    }

    setSimAverage(avg);
    setSimEstimatedGrade(estimated);
    setSimFinalGrade(final);

    // eslint-disable-next-line
  }, [isUpdate]);

  const handleShowGradeForm = (e, grade, weight, i) => {
    const { target } = e;

    if (target.id === 'add') {
      setCanRemove(false);
    } else {
      setCanRemove(true);

      if (countedList.length === 1) {
        setCanRemove(false);
      }
    }

    const { offsetLeft, offsetTop } = target;
    setXPos(offsetLeft + 64);
    setYPos(offsetTop);

    setCurrentGrade(grade);
    setCurrentWeight(parseFloat(weight));
    setCurrentIndex(parseFloat(i));

    setIsGradeFormVisible(true);
  };

  const handleHideGradeForm = () => {
    setIsGradeFormVisible(false);
  };

  const handleSaveGrade = (grade, weight) => {
    setIsEdited(true);
    setIsGradeFormVisible(false);

    const newGrade = {
      weight: parseFloat(weight),
    };

    let lastCharacter;
    let value = parseFloat(grade);
    let g = parseFloat(grade);

    if (grade.length > 1) {
      lastCharacter = grade.slice(-1);

      if (lastCharacter === '+') {
        value -= 0.25;
        g += lastCharacter;
      } else if (lastCharacter === '-') {
        value += 0.5;
        g += lastCharacter;
      }
    }
    newGrade.value = value;
    newGrade.grade = g;

    const newArr = countedList;
    newArr.splice(currentIndex, 1, newGrade);

    setIsUpdate(prevState => prevState + 1);
  };

  const handleRemoveGrade = () => {
    setIsEdited(true);

    const newArr = countedList;
    newArr.splice(currentIndex, 1);

    setIsGradeFormVisible(false);
    setCountedList(newArr);
    setIsUpdate(prevState => prevState + 1);
  };

  const handleReset = () => {
    setIsEdited(false);
    setIsReset(prevState => !prevState);
  };

  return (
    <StyledWrapper isOpen={isCollapsed}>
      <GradeForm
        x={xPos}
        y={yPos}
        isVisible={isGradeFormVisible}
        setIsVisible={handleHideGradeForm}
        grade={currentGrade}
        weight={currentWeight}
        handleSaveGrade={handleSaveGrade}
        handleRemoveGrade={handleRemoveGrade}
        canRemove={canRemove}
      />
      {isEdited ? (
        <StyledResetBtn type="button" onClick={handleReset}>
          <StyledResetIcon icon={faSyncAlt} />
          <Tooltip>
            <StyledDescription>Resetuj</StyledDescription>
          </Tooltip>
        </StyledResetBtn>
      ) : null}
      {isLoading ? (
        <StyledLoading icon={faSpinner} size="2x" spin />
      ) : (
        <StyledHeader
          type="button"
          onClick={() => setIsCollapsed(prevState => !prevState)}
          isOpen={isCollapsed}
        >
          <StyledButtonMark isOpen={isCollapsed}>
            <StyledIcon icon={faChevronUp} fixedWidth isopen={isCollapsed ? 1 : 0} />
          </StyledButtonMark>
          <StyledSpan color={getCleanName(name)}>{name}</StyledSpan>
          <StyledGradesWrapper>
            {sortedGrades.length
              ? sortedGrades.map(
                  (
                    { grade, color, notCounted, category, weight, dateSyntax, categoryDesc, desc },
                    i,
                  ) => (
                    <StyledGrade key={i.toString()} isNotCounted={notCounted}>
                      <StyledNumber color={color}>{grade}</StyledNumber>
                      <StyledTooltip>
                        {notCounted ? (
                          <StyledDescription color="textSecondary">
                            Nie liczona do średniej
                          </StyledDescription>
                        ) : null}
                        <StyledDescription color={color}>{category}</StyledDescription>
                        <StyledDescription>Waga {weight}</StyledDescription>
                        <StyledDescription>{dateSyntax}</StyledDescription>
                        {categoryDesc || desc ? <StyledBorder /> : null}
                        <StyledDescription>{categoryDesc}</StyledDescription>
                        <StyledDescription>{desc}</StyledDescription>
                      </StyledTooltip>
                    </StyledGrade>
                  ),
                )
              : null}
          </StyledGradesWrapper>
          {isEdited ? (
            <StyledNumber color={simAvgColor}>
              {simAverage === 'NaN' ? 'Błąd' : simAverage}
              <StyledDefault isVisible={parseFloat(defaultAvg) !== parseFloat(simAverage)}>
                {defaultAvg}
              </StyledDefault>
            </StyledNumber>
          ) : (
            <StyledNumber color={average <= gradesSteps[0] - 0.01 ? 'red' : 'text'}>
              {average}
            </StyledNumber>
          )}
          {isEdited ? (
            <StyledNumber color={simEstColor}>
              {simEstimatedGrade}
              <StyledDefault isVisible={parseFloat(defaultEst) !== parseFloat(simEstimatedGrade)}>
                {defaultEst}
              </StyledDefault>
            </StyledNumber>
          ) : (
            <StyledNumber color={estimatedGrade === 1 ? 'red' : 'text'}>
              {typeof estimatedGrade === 'number' ? (
                <>
                  - ({estimatedGrade})
                  <StyledTooltip>
                    <StyledDescription>Wyliczona ze średniej</StyledDescription>
                  </StyledTooltip>
                </>
              ) : (
                estimatedGrade
              )}
            </StyledNumber>
          )}
          {isEdited ? (
            <StyledNumber color={simFinColor}>
              {simFinalGrade}
              <StyledDefault isVisible={parseFloat(defaultFin) !== parseFloat(simFinalGrade)}>
                {defaultFin}
              </StyledDefault>
            </StyledNumber>
          ) : (
            <StyledNumber color={finalGrade === 1 ? 'red' : 'text'}>
              {typeof finalGrade === 'number' ? (
                <>
                  - ({finalGrade})
                  <StyledTooltip>
                    <StyledDescription>Wyliczona ze średniej</StyledDescription>
                  </StyledTooltip>
                </>
              ) : (
                finalGrade
              )}
            </StyledNumber>
          )}
        </StyledHeader>
      )}
      <StyledCollapse isOpen={isCollapsed}>
        <ExpandableWrapper>
          {isLoading ? (
            <StyledLoading icon={faSpinner} size="2x" spin />
          ) : (
            <>
              <StyledContentWrapper>
                <StyledContentHeader secondary>
                  SYMULATOR - dodaj | zmień | usuń klikając na ocenę
                  <br />
                  Ocena przewidywana i końcowa będzie liczona ze średniej ważonej
                </StyledContentHeader>
                <StyledContent>
                  <StyledGradesWrapper>
                    {countedList.length
                      ? countedList.map(({ grade, weight, color }, i) => (
                          <StyledGradeBtn
                            key={i.toString()}
                            type="button"
                            onClick={e => handleShowGradeForm(e, grade, weight, i)}
                          >
                            <StyledCustomGrade color={color}>{grade}</StyledCustomGrade>
                            <StyledWeight>{weight}</StyledWeight>
                          </StyledGradeBtn>
                        ))
                      : null}
                    <StyledGradeBtn
                      type="button"
                      onClick={e => handleShowGradeForm(e, 5, 1, countedList.length)}
                      isBlue
                      id="add"
                    >
                      <StyledPlusIcon icon={faPlus} />
                    </StyledGradeBtn>
                  </StyledGradesWrapper>
                </StyledContent>
              </StyledContentWrapper>
              <StyledGraph>
                <Line
                  data={graphData}
                  height={250}
                  options={{
                    legend: {
                      display: false,
                    },
                    maintainAspectRatio: false,
                    scales: {
                      yAxes: [
                        {
                          ticks: {
                            min: 1,
                            max: 6,
                          },
                        },
                      ],
                    },
                    layout: {
                      padding: 15,
                    },
                    tooltips: {
                      titleFontFamily: "'Montserrat', sans-serif",
                      titleFontSize: 16,
                      titleFontColor: 'rgba(255, 255, 255, .87)',
                      titleFontStyle: '500',
                      bodyFontFamily: "'Montserrat', sans-serif",
                      bodyFontSize: 16,
                      bodyFontColor: 'rgba(255, 255, 255, .87)',
                      bodyFontStyle: '500',
                      footerFontFamily: "'Montserrat', sans-serif",
                      footerFontSize: 16,
                      footerFontColor: 'rgba(255, 255, 255, .87)',
                      footerFontStyle: '500',
                      yPadding: 10,
                      xPadding: 10,
                      titleMarginBottom: 2,
                      footerMarginTop: 2,
                      caretPadding: 15,
                      caretSize: 10,
                      cornerRadius: 10,
                      displayColors: false,
                      backgroundColor: 'rgb(58, 58, 60)',
                      callbacks: {
                        title: () => '',
                        label: tooltipItem => graphList[tooltipItem.index].category,
                        labelTextColor: tooltipItem =>
                          getRGBColor(graphList[tooltipItem.index].color),
                        beforeFooter: tooltipItem =>
                          `Ocena ${graphList[tooltipItem[0].index].grade}\nWaga ${
                            graphList[tooltipItem[0].index].weight
                          }`,
                        footer: tooltipItem => graphList[tooltipItem[0].index].dateSyntax,
                        afterFooter: tooltipItem => {
                          const { categoryDesc, desc } = graphList[tooltipItem[0].index];
                          let result = '';
                          if (categoryDesc.length) {
                            result += categoryDesc;
                          }

                          if (categoryDesc.length && desc.length) {
                            result += '\n';
                          }

                          if (desc.length) {
                            result += desc;
                          }

                          return result;
                        },
                      },
                    },
                  }}
                />
              </StyledGraph>
            </>
          )}
        </ExpandableWrapper>
      </StyledCollapse>
    </StyledWrapper>
  );
}

GradesRow.propTypes = {
  name: PropTypes.string.isRequired,
  grades: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string,
      categoryDesc: PropTypes.string,
      date: PropTypes.string,
      grade: PropTypes.string,
      gradeDesc: PropTypes.string,
      value: PropTypes.string,
      weight: PropTypes.string,
      semester: PropTypes.string,
      teacher: PropTypes.string,
      isCounted: PropTypes.bool,
    }),
  ),
  semester: PropTypes.string,
  setEstimatedGrades: PropTypes.func.isRequired,
  setFinalGrades: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  estimatedGrades: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  finalGrades: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  setShouldUpdate: PropTypes.func.isRequired,
};

GradesRow.defaultProps = {
  grades: [],
  estimatedGrades: [],
  finalGrades: [],
  semester: '1',
};

export default GradesRow;
