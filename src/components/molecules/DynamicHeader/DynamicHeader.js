import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router';
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
  animation: ${SlideInDown} 0.3s ease-in-out 0.5s both;

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

function DynamicHeader() {
  const headerRef = useRef();
  const width = useWindowWidth();
  const [visible, setVisible] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [page, setPage] = useState('');

  useEffect(() => {
    const storage = window.sessionStorage.getItem('welcome');
    if (!storage) {
      window.sessionStorage.setItem('welcome', true);
      const data = JSON.parse(window.localStorage.getItem('data'));
      const {
        user: { name },
      } = data;
      setWelcome(`Witaj, ${name}`);
      setTimeout(() => {
        setWelcome(false);
      }, 5000);
    }
  }, []);

  useEffect(() => {
    let currentPage;
    switch (window.location.pathname) {
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
  }, [window.location.pathname]);

  useEffect(() => {
    const headerWidth = headerRef.current.offsetWidth;
    const isVisible = width - headerWidth < 600;
    setVisible(isVisible);
  }, [width]);

  return (
    <StyledHeader ref={headerRef} visible={visible}>
      {welcome || <StyledAnimated>{page}</StyledAnimated>}
    </StyledHeader>
  );
}

export default withRouter(DynamicHeader);
