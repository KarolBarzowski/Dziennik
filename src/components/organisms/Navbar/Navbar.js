import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Media from 'react-media';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

const StyledWrapper = styled.nav`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: 6.4rem;
  padding: 0.8rem 2.5rem;
  background-color: ${({ theme }) => theme.navbar};
  border-radius: 5rem;
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
  transition: background-color ${({ theme }) => theme.themeTransition};
`;

const StyledParagraph = styled(Paragraph)`
  text-decoration: none;
  transition: color 0.1s ease-in-out;
  padding: 2.5rem;

  &.active,
  :hover {
    color: ${({ theme }) => theme.text};
  }

  @media screen and (min-width: 600px) {
    padding: 0;
  }
`;

const StyledList = styled.ul`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  list-style: none;
`;

const StyledListItem = styled.li`
  margin: 2.5rem;
  @media screen and (min-width: 600px) {
    margin: 0;
    &:not(:first-of-type) {
      margin: 0 0 0 2.5rem;
    }
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
  padding: 1.5rem;
  margin-left: 0;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: transform 0.15s ease-in-out, color ${({ theme }) => theme.themeTransition};

  :hover {
    transform: rotate(90deg);
  }

  @media screen and (min-width: 600px) {
    margin-left: 5rem;
    padding: 0;
  }
`;

const StyledBurger = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 1.5rem;
  display: inline-block;
  cursor: pointer;
  background-color: transparent;
  border: none;
  margin: 0;
  z-index: 16;
`;

const StyledBurgerBox = styled.span`
  width: 3.4rem;
  height: 2.1rem;
  display: inline-block;
  position: relative;
`;

const StyledBurgerInner = styled.span`
  width: 100%;
  height: 0.3rem;
  background-color: ${({ theme, isOpen }) => (isOpen ? 'transparent' : theme.burger)};
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  transition: background-color 0.1s ease-in-out 0.2s;

  &::before,
  &::after {
    content: '';
    width: 100%;
    height: 0.3rem;
    background-color: ${({ theme }) => theme.burger};
    position: absolute;
    left: 0;
    transition: transform 0.2s ease-in-out 0.2s;
  }

  &::before {
    top: -1rem;
    transform: ${({ isOpen }) => (isOpen ? 'translateY(1rem) rotate(45deg)' : '')};
  }

  &::after {
    top: 1rem;
    transform: ${({ isOpen }) => (isOpen ? 'translateY(-1rem) rotate(-45deg)' : '')};
  }
`;

const StyledMobileWrapper = styled(StyledWrapper)`
  top: 0;
  left: 0;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  box-shadow: none;
  border-radius: 0;
  height: 100vh;
  width: 100%;
  padding: 2.5rem;
  z-index: 15;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s ease-in-out;
`;

const StyledMobileList = styled(StyledList)`
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

function Navbar({ handleModalToggle }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <Media queries={{ mobile: '(max-width: 599px)', desktop: '(min-width: 600px)' }}>
      {({ mobile, desktop }) => (
        <>
          {desktop && (
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
              </StyledList>
              <StyledBtn type="button" onClick={() => handleModalToggle()}>
                <FontAwesomeIcon icon={faCog} />
              </StyledBtn>
            </StyledWrapper>
          )}
          {mobile && (
            <>
              <StyledBurger type="button" onClick={() => handleToggle()}>
                <StyledBurgerBox>
                  <StyledBurgerInner isOpen={isOpen} />
                </StyledBurgerBox>
              </StyledBurger>
              <StyledMobileWrapper isOpen={isOpen}>
                <StyledMobileList>
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
                </StyledMobileList>
                <StyledBtn
                  type="button"
                  onClick={() => {
                    handleModalToggle();
                    handleToggle();
                  }}
                >
                  <FontAwesomeIcon icon={faCog} />
                </StyledBtn>
              </StyledMobileWrapper>
            </>
          )}
        </>
      )}
    </Media>
  );
}

Navbar.propTypes = {
  handleModalToggle: PropTypes.func.isRequired,
};

export default Navbar;
