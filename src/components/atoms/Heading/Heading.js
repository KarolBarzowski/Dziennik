import styled from 'styled-components';

const Heading = styled.h1`
  font-size: ${({ theme, big }) => (big ? theme.xl : theme.l)};
  font-weight: ${({ theme }) => theme.semiBold};
  color: ${({ theme }) => theme.text};
  transition: color ${({ theme }) => theme.themeTransition};
`;

export default Heading;
