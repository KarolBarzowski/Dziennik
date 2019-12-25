import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUser, faExclamation } from '@fortawesome/free-solid-svg-icons';
import Paragraph from 'components/atoms/Paragraph/Paragraph';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 300px;
  border-radius: 1rem;
`;

const StyledHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: 4.8rem;
  padding: 0.8rem 1rem;
  background-color: ${({ bgColor }) => bgColor};
  border-radius: ${({ isOpen }) => (isOpen ? '1rem 1rem 0 0' : '1rem')};
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  cursor: pointer;
  transition: border-radius 0.1s ease-in-out;
`;

const StyledCollapse = styled.div`
  display: flex;
  flex-flow: column nowrap;
  border-radius: ${({ isOpen }) => (isOpen ? '0 0 1rem 1rem' : '1rem')};
  max-height: ${({ isOpen }) => (isOpen ? '6rem' : 0)};
  overflow: hidden;
  background-color: ${({ theme }) => theme.dp08}; /* to fix at lesson plan card */
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  transition: max-height 0.3s ease-in-out 0.05s, border-radius 0.1s ease-in-out;
  transform-origin: top center;
`;

const StyledContent = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 1rem 0;
  &:last-of-type {
    padding-bottom: 1.5rem;
  }
`;

const StyledIcon = styled(FontAwesomeIcon)`
  margin: ${({ ml = 0, mr = 0 }) => `0 ${mr}rem 0 ${ml}rem`};
`;

const StyledWarnIcon = styled(StyledIcon)`
  color: ${({ theme }) => theme.error};
  font-size: 1.6rem;
`;

function Lesson({ hours, name, room, teacher, bgColor, multiple, warn }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <StyledWrapper>
      <StyledHeader bgColor={bgColor} onClick={() => handleToggle()} isOpen={isOpen}>
        <Paragraph>{hours.split(' - ')[0]}</Paragraph>
        <Paragraph>{name}</Paragraph>
        <Paragraph>
          {room}
          {warn.type && <StyledWarnIcon icon={faExclamation} ml={1} />}
        </Paragraph>
      </StyledHeader>
      {
        <StyledCollapse isOpen={isOpen}>
          <StyledContent>
            <Paragraph>
              <StyledIcon icon={faClock} mr={0.5} />
              {hours}
            </Paragraph>
            <Paragraph>
              {teacher}
              <StyledIcon icon={faUser} ml={0.5} />
            </Paragraph>
          </StyledContent>
          {warn.type && (
            <StyledContent>
              <Paragraph regular>
                <StyledWarnIcon icon={faExclamation} mr={0.5} />
                {warn.type}: {warn.desc}
              </Paragraph>
            </StyledContent>
          )}
        </StyledCollapse>
      }
    </StyledWrapper>
  );
}

Lesson.propTypes = {
  hours: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired,
  teacher: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  warn: PropTypes.objectOf(PropTypes.string),
};

Lesson.defaultProps = {
  multiple: false,
  warn: {
    type: '',
    desc: '',
  },
};

export default Lesson;
