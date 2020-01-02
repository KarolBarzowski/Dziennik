import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledLabel = styled.label`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const StyledCheckmark = styled.span`
  display: inline-block;
  height: 2rem;
  width: 2rem;
  margin-right: 0.5rem;
  background-color: transparent;
  border-radius: 50%;
  border: 1px solid silver;
  transition: background-color 0.15s ease-in-out 0.05s;

  ::after {
    content: '';
    position: absolute;
    display: none;
    left: 0.65rem;
    bottom: 0.5rem;
    width: 0.6rem;
    height: 1.2rem;
    border: solid ${({ theme }) => theme.checkmark};
    border-width: 0 1.5px 1.5px 0;
    transform: rotate(45deg);
    transition: border-color 0.15s ease-in-out 0.05s;
  }
`;

const StyledInput = styled.input`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;

  :checked ~ ${StyledCheckmark} {
    background-color: ${({ theme }) => theme.blue};
    border-color: ${({ theme }) => theme.blue};
  }

  :checked ~ ${StyledCheckmark}::after {
    display: block;
  }
`;

function Radio({ children, name, checked, onChange }) {
  return (
    <StyledLabel>
      <StyledInput type="radio" name={name} checked={checked} onChange={() => onChange()} />
      <StyledCheckmark />
      {children}
    </StyledLabel>
  );
}

Radio.propTypes = {
  children: PropTypes.element,
  name: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

Radio.defaultProps = {
  children: null,
  name: '',
  checked: false,
  onChange: null,
};

export default Radio;
