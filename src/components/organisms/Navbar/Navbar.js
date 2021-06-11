import React from 'react';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useData } from 'hooks/useData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Tooltip from 'components/atoms/Tooltip/Tooltip';

const StyledWrapper = styled.nav`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: 6.4rem;
  padding: 0.8rem 2.5rem;
  background-color: rgb(44, 44, 46);
  border-radius: 5rem;
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  transition: background-color ${({ theme }) => theme.themeTransition};
`;

const StyledParagraph = styled(Paragraph)`
  font-size: 1.6rem;
  text-decoration: none;
  transition: color 0.1s ease-in-out;
  padding: 1rem;
  border-radius: 6px;

  &.active,
  :hover {
    color: ${({ theme }) => theme.text};
    background-color: rgb(58, 58, 60);
  }
`;

const StyledList = styled.ul`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  list-style: none;
  margin-right: 1.5rem;
`;

const StyledListItem = styled.li`
  margin: 0;
  &:not(:first-of-type) {
    margin: 0 0 0 1.5rem;
  }
`;

const StyledBtn = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: none;
  outline: none;
  font-size: 2.4rem;
  padding: 8px;
  border-radius: 6px;
  margin-left: 1rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: transform 0.15s ease-in-out, color ${({ theme }) => theme.themeTransition};

  :hover ${Tooltip} {
    transform: translate(-50%, 1rem) scale(1);
    background-color: rgb(58, 58, 60);
  }
`;

function Navbar() {
  const { userData } = useData();

  const handleAddEvent = () => {
    ReactGA.event({
      category: 'Synchronizacja',
      action: 'Z nawigacji',
      label: userData.name,
    });
  };

  return (
    <StyledWrapper>
      <StyledList>
        <StyledListItem>
          <StyledParagraph exact as={NavLink} secondary="true" to="/">
            Podsumowanie
          </StyledParagraph>
        </StyledListItem>
        <StyledListItem>
          <StyledParagraph as={NavLink} secondary="true" to="/oceny">
            Oceny
          </StyledParagraph>
        </StyledListItem>
        <StyledListItem>
          <StyledParagraph as={NavLink} secondary="true" to="/plan">
            Plan lekcji
          </StyledParagraph>
        </StyledListItem>
        <StyledListItem>
          <StyledParagraph as={NavLink} secondary="true" to="/sprawdziany">
            Sprawdziany
          </StyledParagraph>
        </StyledListItem>
        <StyledListItem>
          <StyledParagraph as={NavLink} secondary="true" to="/frekwencja">
            Frekwencja
          </StyledParagraph>
        </StyledListItem>
        <StyledListItem>
          <StyledParagraph as={NavLink} secondary="true" to="/uwagi">
            Uwagi
          </StyledParagraph>
        </StyledListItem>
      </StyledList>
      <StyledBtn
        as="a"
        href="https://nasze.miasto.gdynia.pl/ed_miej/zest_start.pl?autoSync=true"
        onClick={handleAddEvent}
      >
        <FontAwesomeIcon icon={faSyncAlt} />
        <Tooltip>Synchronizuj</Tooltip>
      </StyledBtn>
    </StyledWrapper>
  );
}

export default Navbar;
