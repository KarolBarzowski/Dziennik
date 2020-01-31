import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledWrapper = styled.label`
  display: inline-block;
  position: relative;
  height: 2.1rem;
  width: 3.4rem;
  margin-left: 0.5rem;
  background-color: ${({ theme, isChecked }) => (isChecked ? theme.green : theme.switch)};
  border-radius: 5rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
`;

const StyledCheckmark = styled.span`
  background-color: #fff;
  width: 1.9rem;
  height: 1.9rem;
  position: absolute;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.48);
  border-radius: 50%;
  top: 1px;
  left: 1px;
  transition: transform cubic-bezier(0.41, 0.03, 0.34, 1.28) 0.35s;
`;

const StyledInput = styled.input`
  position: absolute;
  height: 0;
  width: 0;
  opacity: 0;

  :checked ~ ${StyledCheckmark} {
    transform: translateX(1.35rem);
  }
`;

const Switch = ({ onChange, checked }) => {
  return (
    <StyledWrapper isChecked={checked}>
      <StyledInput type="checkbox" checked={checked} onChange={() => onChange()} />
      <StyledCheckmark />
    </StyledWrapper>
  );
};

Switch.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
};

Switch.defaultProps = {
  checked: false,
};

export default Switch;
