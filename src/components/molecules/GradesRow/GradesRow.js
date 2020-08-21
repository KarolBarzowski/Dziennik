import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Collapse from '@kunukn/react-collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { getCleanName } from 'functions/functions';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;

  /* :nth-of-type(odd) {
    background-color: ${({ theme }) => theme.hover};
  } */

  :hover {
    /* background-color: ${({ theme }) => theme.modalHover}; */
    background-color: ${({ theme }) => theme.hover};
  }

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
  cursor: pointer;
  padding: 1.5rem 1.5rem 1.5rem 8.9rem;
  min-height: 6.4rem;

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
`;

function GradesRow({ name, grades }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <StyledWrapper isOpen={isCollapsed}>
      <StyledHeader
        type="button"
        onClick={() => setIsCollapsed(prevState => !prevState)}
        isOpen={isCollapsed}
      >
        <StyledButtonMark isOpen={isCollapsed}>
          <StyledIcon icon={faChevronUp} fixedWidth isopen={isCollapsed ? 1 : 0} />
        </StyledButtonMark>
        <StyledSpan color={getCleanName(name)}>{name}</StyledSpan>
      </StyledHeader>
      <StyledCollapse isOpen={isCollapsed}>expandable content here</StyledCollapse>
    </StyledWrapper>
  );
}

export default GradesRow;
