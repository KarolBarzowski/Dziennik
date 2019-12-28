import styled from 'styled-components';

const Section = styled.section`
  display: flex;
  min-height: 100vh;
  width: 100%;
  padding: 2.5rem;
  background-color: ${({ theme }) => theme.background};
  transition: background-color ${({ theme }) => theme.themeTransition};
`;

export default Section;
