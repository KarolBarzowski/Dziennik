import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';
import { useWindowWidth } from 'hooks/useWindowWidth';

const SlideInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-1.5rem);
  }
  
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledHeader = styled.h1`
  font-size: ${({ theme }) => theme.xl};
  font-weight: ${({ theme }) => theme.semiBold};
  color: ${({ theme }) => theme.text};
  transition: color ${({ theme }) => theme.themeTransition},
    background-color ${({ theme }) => theme.themeTransition};
  animation: ${SlideInDown} 0.3s ease-in-out 0.1s both;

  ${({ visible }) =>
    visible &&
    css`
      position: absolute;
      visibility: hidden;
    `}
`;

const StyledAnimated = styled.span`
  animation: ${SlideInDown} 0.3s ease-in-out both;
`;

function DynamicHeader({ location }) {
  const headerRef = useRef();
  const width = useWindowWidth();
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState('');

  useEffect(() => {
    let currentPage;
    switch (location.pathname) {
      case '/':
        currentPage = 'Podsumowanie';
        break;
      case '/oceny':
        currentPage = 'Oceny';
        break;
      case '/plan':
        currentPage = 'Plan lekcji';
        break;
      case '/sprawdziany':
        currentPage = 'Sprawdziany';
        break;
      case '/frekwencja':
        currentPage = 'Frekwencja';
        break;
      case '/uwagi':
        currentPage = 'Uwagi';
        break;
      default:
        break;
    }
    setPage(currentPage);
  }, [location]);

  useEffect(() => {
    const headerWidth = headerRef.current.offsetWidth;
    const isVisible = width - headerWidth < 750;
    setVisible(isVisible);
  }, [width]);

  return (
    <StyledHeader ref={headerRef} visible={visible}>
      <StyledAnimated>{page}</StyledAnimated>
    </StyledHeader>
  );
}

DynamicHeader.propTypes = {
  location: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default withRouter(DynamicHeader);
