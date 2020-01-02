import styled from 'styled-components';

const Section = styled.section`
  display: flex;
  flex-flow: column wrap;
  min-height: 100vh;
  width: 100%;
  padding: 7rem 2.5rem 2.5rem;
  background-color: ${({ theme }) => theme.background};
  transition: background-color ${({ theme }) => theme.themeTransition};

  @media screen and (min-width: 600px) and (max-width: ${({ width }) => width - 1}px) {
    padding-top: 8.9rem;
  }

  @media screen and (min-width: ${({ width }) => width}px) {
    padding-top: 2.5rem;
  }
`;

export default Section;
