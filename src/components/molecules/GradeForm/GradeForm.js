import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { useOutsideClick } from 'hooks/useOutsideClick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Paragraph from 'components/atoms/Paragraph/Paragraph';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-flow: column nowrap;
  background-color: rgb(72, 72, 74);
  padding: 1rem;
  border-radius: 1rem;
  z-index: 99;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.12);
  transform: ${({ x, y }) => `translate(${x}px, ${y}px)`};

  ${({ isVisible }) =>
    isVisible
      ? css`
          visibility: visible;
          opacity: 1;
          transition: opacity 0.15s ease-in-out, visibility 0s linear 0s,
            transform 0.15s ease-in-out;
        `
      : css`
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.15s ease-in-out, visibility 0s linear 0.15s;
        `};

  ::before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;

    border-bottom: 0.8rem solid transparent;
    border-top: 0.8rem solid transparent;
    border-right: 0.8rem solid rgb(72, 72, 74);
    border-left: 0.8rem solid transparent;

    top: 1rem;
    left: -0.8rem;
    transform: translateX(-50%);
  }
`;

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;

  :not(:first-of-type) {
    margin-top: 1rem;
  }
`;

const Input = styled.input`
  border: none;
  margin-left: 0.5rem;
  height: 3.4rem;
  width: 5.5rem;
  font-size: 2.1rem;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  border-radius: 0.5rem;
  background-color: rgb(99, 99, 102);
  padding: 0 0.5rem;

  ::placeholder {
    color: rgba(255, 255, 255, 0.38);
  }
`;

const StyledParagraph = styled(Paragraph)`
  font-size: 1.6rem;
`;

const StyledDescription = styled(Paragraph)`
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  font-size: 1.6rem;
`;

const StyledBtn = styled.button`
  position: relative;
  border: none;
  border-radius: 0.5rem;
  background-color: ${({ theme, isRemove }) => (isRemove ? theme.red : theme.blue)};
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  outline: none;

  ::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: #000000;
    opacity: 0;
    transition: opacity 0.05s ease-in-out;
  }

  :hover,
  :focus {
    ::before {
      opacity: 0.08;
    }
  }

  :not(:first-of-type) {
    margin-left: 1rem;
  }
`;

const TrashIcon = styled(FontAwesomeIcon)`
  color: #fff;
  font-size: 1.6rem;
`;

function GradeForm({
  x,
  y,
  isVisible,
  setIsVisible,
  grade,
  weight,
  handleSaveGrade,
  handleRemoveGrade,
  canRemove,
}) {
  const outsideRef = useRef(null);

  const [newGrade, setNewGrade] = useState(grade);
  const [newWeight, setNewWeight] = useState(weight);

  useOutsideClick(outsideRef, setIsVisible);

  useEffect(() => {
    setNewGrade(grade);
    setNewWeight(weight);
  }, [grade, weight, isVisible]);

  return (
    <Wrapper x={x} y={y} isVisible={isVisible} ref={outsideRef}>
      <Row>
        <StyledParagraph>Ocena</StyledParagraph>
        <Input
          type="text"
          placeholder={grade}
          value={newGrade}
          onChange={e => setNewGrade(e.target.value)}
        />
      </Row>
      <Row>
        <StyledParagraph>Waga</StyledParagraph>
        <Input
          type="number"
          placeholder={weight}
          value={newWeight}
          onChange={e => setNewWeight(e.target.value)}
        />
      </Row>
      <Row>
        {canRemove ? (
          <StyledBtn type="button" isRemove onClick={handleRemoveGrade}>
            <TrashIcon icon={faTrashAlt} />
          </StyledBtn>
        ) : null}
        <StyledBtn type="button" onClick={() => handleSaveGrade(newGrade, newWeight)}>
          <StyledDescription>Zapisz</StyledDescription>
        </StyledBtn>
      </Row>
    </Wrapper>
  );
}

GradeForm.propTypes = {
  grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  weight: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  isVisible: PropTypes.bool,
  setIsVisible: PropTypes.func.isRequired,
  handleSaveGrade: PropTypes.func.isRequired,
  handleRemoveGrade: PropTypes.func.isRequired,
  canRemove: PropTypes.bool,
};

GradeForm.defaultProps = {
  grade: 5,
  weight: 1,
  x: 0,
  y: 0,
  isVisible: false,
  canRemove: true,
};

export default GradeForm;
