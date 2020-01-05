import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Collapse from '@kunukn/react-collapse';
import { getColor, getStatus } from 'functions/functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  background-color: ${({ theme }) => theme.card};
  border-radius: 1rem;
  margin: 1.5rem 0;
  box-shadow: rgba(0, 0, 0, 0.16) 0 1px 2px;
`;

const StyledIcon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.text};
  will-change: transform;
  transition: transform 0.2s ease-in-out;
`;

const StyledHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  ${StyledIcon} {
    transform: rotate(${({ isOpen }) => (isOpen ? '90deg' : '0')});
  }
`;

const StyledCollapse = styled(Collapse)`
  padding: 0 1.5rem;
  transition: height 0.25s ease-in-out 0.05s;
`;

const StyledColor = styled.span`
  color: ${({ theme, color }) => (color ? theme[color] : theme.text)};
`;

const StyledParagraph = styled(Paragraph)`
  font-size: ${({ theme }) => theme.m};
  text-align: left;
  width: 100%;
`;

const StyledHeading = styled(Heading)`
  max-width: 40rem;
  width: 100%;
`;

function Collapsible({ children, title, info, opened }) {
  const [isOpen, setIsOpen] = useState(opened);

  return (
    <StyledWrapper>
      <StyledHeader onClick={() => setIsOpen(!isOpen)} isOpen={isOpen}>
        <StyledHeading>{title}</StyledHeading>
        <StyledParagraph>
          {Array.from(new Set(info)).map((status, i) => (
            <React.Fragment key={i.toString()}>
              {i !== 0 && ' / '}
              <StyledColor color={getColor(status)}>{getStatus(status)}</StyledColor>
            </React.Fragment>
          ))}
        </StyledParagraph>
        <StyledIcon icon={faChevronRight} />
      </StyledHeader>
      <StyledCollapse isOpen={isOpen}>{children}</StyledCollapse>
    </StyledWrapper>
  );
}

Collapsible.propTypes = {
  title: PropTypes.string.isRequired,
  opened: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.element),
  info: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Collapsible.defaultProps = {
  opened: false,
  children: null,
};

export default Collapsible;
