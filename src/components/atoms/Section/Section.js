import styled from 'styled-components';

const Section = styled.section`
  display: flex;
  flex-flow: column wrap;
  min-height: calc(100vh - 7.9rem);
  width: 100%;
  padding: 2.5rem 1.5rem;
  background-color: ${({ theme }) => theme.background};
  transition: background-color ${({ theme }) => theme.themeTransition};
`;

export default Section;
