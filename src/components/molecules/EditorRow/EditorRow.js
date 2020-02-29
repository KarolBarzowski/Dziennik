import React, { useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Tooltip from 'components/atoms/Tooltip/Tooltip';
import { fadeIn } from 'functions/animations';
import AddCircleRounded from '@material-ui/icons/AddCircleRounded';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import RemoveCircle from '@material-ui/icons/RemoveCircle';

const SlideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.8rem;
  animation: ${fadeIn} ${({ theme }) => theme.fadeTransition} 0.15s;

  :nth-of-type(odd) {
    background-color: ${({ theme }) => theme.modalHover};
  }

  :hover {
    background-color: ${({ theme }) => theme.hover};
  }

  :last-of-type {
    margin-top: 1rem;
    background-color: transparent;
  }
`;

const StyledTitle = styled(Paragraph)`
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledGradesGroup = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-around;
  height: 100%;
`;

const StyledInput = styled.input`
  background-color: ${({ theme }) => theme.gray3};
  border: none;
  border-radius: 0.4rem;
  font-family: 'Roboto', sans-serif;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.text};
  height: 2.8rem;
  width: 2.8rem;
  padding: 0.2rem 0.4rem;
  margin: 0.25rem;
  transition: background-color ${({ theme }) => theme.themeTransition},
    color ${({ theme }) => theme.themeTransition};
  animation: ${SlideInUp} 0.3s ease-in-out both;

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const StyledGrades = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  width: 200%;
  max-width: 200%;
`;

const StyledInfo = styled(Paragraph)`
  font-weight: ${({ theme }) => theme.regular};
  margin: 0.75rem 0.25rem;
`;

const StyledDefault = styled.span`
  position: absolute;
  top: 100%;
  left: 50%;
  font-weight: ${({ theme }) => theme.regular};
  font-size: ${({ theme }) => theme.s};
  color: ${({ theme }) => theme.text};
  transition: opacity 0.15s ease-in-out 0.05s, transform 0.15s ease-in-out 0.05s;

  ${({ isVisible }) =>
    isVisible
      ? css`
          visibility: visible;
          opacity: 1;
          transform: translate(-50%, 0);
        `
      : css`
          visibility: hidden;
          opacity: 0;
          transform: translate(-50%, -1rem);
          transition: opacity 0.15s ease-in-out 0.05s, transform 0.15s ease-in-out 0.05s,
            visibility 0s linear 0.2s;
        `}
`;

const StyledButtonIcon = styled.button`
  border: none;
  background-color: transparent;
  font-size: 2.6rem;
  height: 2.6rem;
  width: 2.6rem;
  color: ${({ theme }) => theme.text};
  outline: none;
  cursor: pointer;
  transition: color ${({ theme }) => theme.themeTransition};
  animation: ${fadeIn} ${({ theme }) => theme.fadeTransition} 0.1s;
`;

const StyledParagraph = styled(Paragraph)`
  position: relative;
  width: 100%;
  font-size: ${({ theme }) => theme.m};
  color: ${({ theme, color }) => (color ? theme[color] : theme.text)};
  text-align: center;
  transition: opacity 0.2s ease-in-out 0.1s;
  cursor: default;

  ::first-letter {
    text-transform: uppercase;
  }
`;

const StyledIconWrapper = styled.div`
  position: relative;
  animation: ${fadeIn} ${({ theme }) => theme.fadeTransition} 0.1s;

  :hover ${Tooltip} {
    transform: translateX(-50%) scale(1);
  }
`;

const StyledInfoIcon = styled(InfoOutlined)`
  color: ${({ theme }) => theme.blue};
`;

const StyledRemoveIcon = styled(RemoveCircle)`
  color: ${({ theme }) => theme.red};
`;

function Input({ type, value, func, placeholder }) {
  const [val, setVal] = useState(value);

  useEffect(() => {
    setVal(value);
  }, [value]);

  const handleChange = e => {
    setVal(e.target.value);
    func(e);
  };

  return (
    <StyledInput
      type={type}
      value={val}
      placeholder={placeholder}
      onChange={e => handleChange(e)}
    />
  );
}

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  func: PropTypes.func.isRequired,
};

Input.defaultProps = {
  type: 'text',
  value: '',
  placeholder: '',
};

function EditorRow({ grades: { name, grades: gradesData }, semester, avgCallback }) {
  const [grades, setGrades] = useState(null);
  const [final, setFin] = useState('');
  const [defaultFinal, setDefaultFinal] = useState('');
  const [finalColor, setFinalColor] = useState('text');
  const [average, setAvg] = useState('');
  const [defaultAvg, setDefaultAvg] = useState('');
  const [avgColor, setAvgColor] = useState('text');
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [gradesSteps] = useState(
    JSON.parse(window.localStorage.getItem('settings_regulation')) || [
      1.86,
      2.86,
      3.86,
      4.86,
      5.51,
    ],
  );
  useEffect(() => {
    if (gradesData) {
      const results = [];
      const avgGrades = [];
      const avgWeights = [];
      gradesData.forEach(
        ({
          semester: gradeSem,
          isCounted,
          category,
          categoryDesc,
          grade,
          weight,
          value,
          date,
          gradeDesc,
        }) => {
          if (isCounted && gradeSem === semester) {
            if (category === 'Ocena przewidywana' || category === 'Ocena za półrocze') return;

            const dateArray = date.split(' ');
            const [day, month, year] = dateArray[0].split('/');
            const [hour, minute, second] = dateArray[1].split(':');
            const actualDate = new Date(
              `20${year}`,
              parseFloat(month) - 1,
              parseFloat(day),
              parseFloat(hour),
              parseFloat(minute),
              parseFloat(second),
            );

            const gradeObj = {
              grade,
              weight,
              category,
              categoryDesc,
              desc: gradeDesc,
              dateSyntax: date,
              date: actualDate,
            };

            avgGrades.push(parseFloat(value) * parseFloat(weight));
            avgWeights.push(parseFloat(weight));

            results.push(gradeObj);
          }
        },
      );

      const sortedGrades = results.sort((a, b) => b.date - a.date);
      sortedGrades.reverse();

      let nominator = 0;
      let denominator = 0;
      for (let i = 0; i < avgGrades.length; i += 1) {
        nominator += avgGrades[i];
        denominator += avgWeights[i];
      }

      const avg = (nominator / denominator).toFixed(2);

      let fin;

      if (avg <= gradesSteps[0] - 0.01) fin = 1;
      else if (avg >= gradesSteps[0] && avg <= gradesSteps[1] - 0.01) fin = 2;
      else if (avg >= gradesSteps[1] && avg <= gradesSteps[2] - 0.01) fin = 3;
      else if (avg >= gradesSteps[2] && avg <= gradesSteps[3] - 0.01) fin = 4;
      else if (avg >= gradesSteps[3] && avg <= gradesSteps[4] - 0.01) fin = 5;
      else if (avg >= gradesSteps[4]) fin = 6;

      if (fin > parseFloat(defaultFinal)) setFinalColor('green');
      else if (fin < parseFloat(defaultFinal)) setFinalColor('red');
      else setFinalColor('text');

      if (avg > parseFloat(defaultAvg)) setAvgColor('green');
      else if (avg < parseFloat(defaultAvg)) setAvgColor('red');
      else setAvgColor('text');

      avgCallback(fin, name);

      setFin(fin);
      setDefaultFinal(fin);
      setAvg(avg);
      setDefaultAvg(avg);
      setGrades(results);
    }
  }, [gradesData, avgCallback, defaultAvg, defaultFinal, gradesSteps, name, semester]);

  const getAverage = () => {
    const avgGrades = [];
    const avgWeights = [];
    grades.forEach(({ grade, weight }) => {
      if (grade !== '' || weight !== '') {
        if (!Number.isNaN(grade) || !Number.isNaN(weight)) {
          let currentGrade = parseFloat(grade);
          const currentWeight = parseFloat(weight);

          if (grade.length > 1) {
            const mark = grade.slice(-1);
            let value = 0;
            if (mark === '-') value = -0.25;
            else if (mark === '+') value = 0.5;
            currentGrade += value;
          }
          avgGrades.push(currentGrade * currentWeight);
          avgWeights.push(currentWeight);
        }
      }
    });

    let nominator = 0;
    let denominator = 0;
    for (let i = 0; i < avgGrades.length; i += 1) {
      nominator += avgGrades[i];
      denominator += avgWeights[i];
    }

    const avg = (nominator / denominator).toFixed(2);

    let fin;

    if (avg <= gradesSteps[0] - 0.01) fin = 1;
    else if (avg >= gradesSteps[0] && avg <= gradesSteps[1] - 0.01) fin = 2;
    else if (avg >= gradesSteps[1] && avg <= gradesSteps[2] - 0.01) fin = 3;
    else if (avg >= gradesSteps[2] && avg <= gradesSteps[3] - 0.01) fin = 4;
    else if (avg >= gradesSteps[3] && avg <= gradesSteps[4] - 0.01) fin = 5;
    else if (avg >= gradesSteps[4]) fin = 6;

    if (fin > parseFloat(defaultFinal)) setFinalColor('green');
    else if (fin < parseFloat(defaultFinal)) setFinalColor('red');
    else setFinalColor('text');

    if (avg > parseFloat(defaultAvg)) setAvgColor('green');
    else if (avg < parseFloat(defaultAvg)) setAvgColor('red');
    else setAvgColor('text');

    avgCallback(fin, name);

    setFin(fin);
    setAvg(avg);
  };

  const handleAddGrade = (
    grade = '',
    weight = '',
    index,
    isAdded,
    category,
    desc,
    dateSyntax,
    categoryDesc,
  ) => {
    const newGrades = grades;
    if (index || index === 0)
      newGrades[index] = { grade, weight, isAdded, category, desc, dateSyntax, categoryDesc };
    else newGrades.push({ grade, weight, isAdded: true });
    setGrades(newGrades);
    getAverage();
    forceUpdate();
  };

  const handleGradeChange = (
    e,
    index,
    isAdded = false,
    category,
    desc,
    dateSyntax,
    categoryDesc,
  ) => {
    const { value } = e.target;
    const { weight } = grades[index];
    if (value.length === 1) {
      if (!Number.isNaN(parseFloat(value))) {
        handleAddGrade(
          parseFloat(value),
          weight,
          index,
          isAdded,
          category,
          desc,
          dateSyntax,
          categoryDesc,
        );
      }
    } else if (value.length === 2) {
      const [grade, mark] = value;
      if (!Number.isNaN(parseFloat(grade)) && Number.isNaN(parseFloat(mark))) {
        if (mark === '-' || mark === '+') {
          handleAddGrade(value, weight, index, isAdded, category, desc, dateSyntax, categoryDesc);
        }
      } else if (!Number.isNaN(parseFloat(grade)) && !Number.isNaN(parseFloat(mark))) {
        handleAddGrade(value, weight, index, isAdded, category, desc, dateSyntax);
      }
    } else if (value.length > 2) {
      if (!Number.isNaN(parseFloat(value))) {
        handleAddGrade(value, weight, index, isAdded, category, desc, dateSyntax, categoryDesc);
      }
    }
  };

  const handleWeightChange = (
    e,
    index,
    isAdded = false,
    category,
    desc,
    dateSyntax,
    categoryDesc,
  ) => {
    const { value } = e.target;
    const { grade } = grades[index];
    if (value.length > 0) {
      handleAddGrade(grade, value, index, isAdded, category, desc, dateSyntax, categoryDesc);
    }
  };

  const handleRemoveGrade = index => {
    const newGrades = grades;
    newGrades.splice(index, 1);
    setGrades(newGrades);
    getAverage();
    forceUpdate();
    forceUpdate();
  };

  return (
    <StyledWrapper>
      <StyledTitle>{name}</StyledTitle>
      <StyledGrades>
        <StyledGradesGroup>
          <StyledInfo secondary>Ocena</StyledInfo>
          <StyledInfo secondary>Waga</StyledInfo>
          <br />
        </StyledGradesGroup>
        {grades &&
          grades.map(
            ({ grade, weight, category, desc, dateSyntax, isAdded, categoryDesc }, gradeIndex) => (
              <StyledGradesGroup key={gradeIndex.toString()}>
                <Input
                  type="text"
                  value={grade}
                  func={e =>
                    handleGradeChange(
                      e,
                      gradeIndex,
                      isAdded,
                      category,
                      desc,
                      dateSyntax,
                      categoryDesc,
                    )
                  }
                  placeholder={grade}
                />
                <Input
                  type="number"
                  value={weight}
                  func={e =>
                    handleWeightChange(
                      e,
                      gradeIndex,
                      isAdded,
                      category,
                      desc,
                      dateSyntax,
                      categoryDesc,
                    )
                  }
                  placeholder={weight}
                />
                {isAdded ? (
                  <StyledButtonIcon type="button" onClick={() => handleRemoveGrade(gradeIndex)}>
                    <StyledRemoveIcon fontSize="large" />
                  </StyledButtonIcon>
                ) : (
                  <StyledIconWrapper>
                    <StyledInfoIcon fontSize="large" />
                    <Tooltip>
                      {category}
                      <br />
                      {dateSyntax}
                      {categoryDesc && <br />}
                      {categoryDesc}
                      {desc && <br />}
                      {desc}
                    </Tooltip>
                  </StyledIconWrapper>
                )}
              </StyledGradesGroup>
            ),
          )}
        <StyledGradesGroup>
          <StyledButtonIcon type="button" onClick={() => handleAddGrade()}>
            <AddCircleRounded fontSize="inherit" />
          </StyledButtonIcon>
          <br />
        </StyledGradesGroup>
      </StyledGrades>
      <StyledParagraph color={avgColor}>
        {!Number.isNaN(parseFloat(average)) && average}
        <StyledDefault isVisible={defaultAvg !== average}>
          {!Number.isNaN(parseFloat(defaultAvg)) && defaultAvg}
        </StyledDefault>
      </StyledParagraph>
      <StyledParagraph color={finalColor}>
        {final}
        <StyledDefault isVisible={defaultFinal !== final}>
          {!Number.isNaN(parseFloat(defaultFinal)) && defaultFinal}
        </StyledDefault>
      </StyledParagraph>
    </StyledWrapper>
  );
}

EditorRow.propTypes = {
  grades: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool])),
      ),
      PropTypes.string,
    ]),
  ),
  semester: PropTypes.string.isRequired,
  avgCallback: PropTypes.func.isRequired,
};

EditorRow.defaultProps = {
  grades: null,
};

export default EditorRow;
