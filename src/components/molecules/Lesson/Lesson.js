import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUser, faExclamation } from '@fortawesome/free-solid-svg-icons';
import Paragraph from 'components/atoms/Paragraph/Paragraph';

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  border-radius: 1rem;
  margin-bottom: ${({ margin }) => margin * 0.8 + 1}rem;

  &:first-of-type {
    margin-top: 1.5rem;
  }

  &:last-of-type {
    margin-bottom: ${({ margin }) => margin * 0.5}rem;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: 4.8rem;
  padding: 0.8rem 1rem;
  background-color: ${({ bgColor, theme }) => (bgColor ? theme[bgColor] : theme.dp02)};
  border-radius: ${({ isOpen }) => (isOpen ? '1rem 1rem 0 0' : '1rem')};
  box-shadow: ${({ isOpen }) =>
    isOpen ? 'rgba(0, 0, 0, 0.16) 0 0 6px' : 'rgba(0, 0, 0, 0.16) 0 3px 6px'};
  cursor: pointer;
  transition: border-radius 0.1s ease-in-out;
  z-index: 10;
`;

const StyledCollapse = styled.div`
  display: flex;
  flex-flow: column nowrap;
  border-radius: ${({ isOpen }) => (isOpen ? '0 0 1rem 1rem' : '1rem')};
  max-height: ${({ isOpen }) => (isOpen ? '6rem' : 0)};
  overflow: hidden;
  background-color: ${({ theme }) => theme.collapse};
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  transition: max-height 0.3s ease-in-out 0.05s, border-radius 0.1s ease-in-out;
  transform-origin: top center;
  z-index: 11;
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

const StyledParagraph = styled(Paragraph)`
  color: ${({ theme }) => theme.textBlack};
`;

const StyledStack = styled.div`
  position: absolute;
  top: ${({ stack }) => 0.8 * stack}rem;
  left: ${({ stack }) => 0.8 * stack}rem;
  height: 4.8rem;
  width: ${({ stack }) => `calc(100% - ${1.6 * stack}rem)`};
  background-color: ${({ bgColor, theme }) => (bgColor ? theme[bgColor] : theme.dp02)};
  border-radius: 1rem;
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  z-index: ${({ stack }) => 10 - stack};
`;

function Lesson({ hours, name, room, teacher, multiple, warn }) {
  const [isOpen, setIsOpen] = useState(false);
  const [bgColor, setBgColor] = useState(null);

  useEffect(() => {
    const cleanName = name
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/ą/g, 'a')
      .replace(/ć/g, 'c')
      .replace(/ę/g, 'e')
      .replace(/ń/g, 'n')
      .replace(/ó/g, 'o')
      .replace(/ś/g, 's')
      .replace(/ź/g, 'z')
      .replace(/ż/g, 'z');
    setBgColor(cleanName);
  }, [name]);

  const handleToggle = () => setIsOpen(!isOpen);

  const stacks = [];

  for (let i = 1; i < multiple; i += 1) {
    stacks.push(<StyledStack key={i} stack={i} bgColor={bgColor} />);
  }

  return (
    <StyledWrapper margin={stacks.length}>
      <StyledHeader bgColor={bgColor} onClick={() => handleToggle()} isOpen={isOpen}>
        <StyledParagraph>{hours.split(' - ')[0]}</StyledParagraph>
        <StyledParagraph>{name}</StyledParagraph>
        <StyledParagraph>
          {room}
          {warn.type && <StyledWarnIcon icon={faExclamation} ml={1} />}
        </StyledParagraph>
      </StyledHeader>
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
      {stacks}
    </StyledWrapper>
  );
}

Lesson.propTypes = {
  hours: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired,
  teacher: PropTypes.string.isRequired,
  multiple: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  warn: PropTypes.objectOf(PropTypes.string),
};

Lesson.defaultProps = {
  multiple: 0,
  warn: {
    type: '',
    desc: '',
  },
};

export default Lesson;
