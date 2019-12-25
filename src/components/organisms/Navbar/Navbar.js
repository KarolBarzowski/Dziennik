import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

const StyledWrapper = styled.nav`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: 6.4rem;
  padding: 0.8rem 2.5rem;
  background-color: ${({ theme }) => theme.dp08};
  border-radius: 5rem;
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
`;

const StyledParagraph = styled(Paragraph)`
  text-decoration: none;
  transition: color 0.1s ease-in-out;

  &.active,
  :hover {
    color: ${({ theme }) => theme.text};
  }
`;

const StyledList = styled.ul`
  display: flex;
  list-style: none;
`;

const StyledListItem = styled.li`
  &:not(:first-of-type) {
    margin-left: 2.5rem;
  }
`;

const StyledBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: none;
  outline: none;
  font-size: 2.4rem;
  margin-left: 5rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: transform 0.15s ease-in-out;

  :hover {
    transform: rotate(90deg);
  }
`;

const Navbar = () => (
  <StyledWrapper>
    <StyledList>
      <StyledListItem>
        <StyledParagraph exact as={NavLink} secondary to="/">
          Podsumowanie
        </StyledParagraph>
      </StyledListItem>
      <StyledListItem>
        <StyledParagraph as={NavLink} secondary to="/grades">
          Oceny
        </StyledParagraph>
      </StyledListItem>
      <StyledListItem>
        <StyledParagraph as={NavLink} secondary to="/plan">
          Plan lekcji
        </StyledParagraph>
      </StyledListItem>
      <StyledListItem>
        <StyledParagraph as={NavLink} secondary to="/exams">
          Sprawdziany
        </StyledParagraph>
      </StyledListItem>
      <StyledListItem>
        <StyledParagraph as={NavLink} secondary to="/absences">
          Nieobecności
        </StyledParagraph>
      </StyledListItem>
    </StyledList>
    <StyledBtn type="button">
      <FontAwesomeIcon icon={faCog} />
    </StyledBtn>
  </StyledWrapper>
);

export default Navbar;
