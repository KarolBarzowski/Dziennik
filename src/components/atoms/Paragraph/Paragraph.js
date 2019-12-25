import styled from 'styled-components';

const Paragraph = styled.p`
  font-family: 'Montserrat';
  font-weight: ${({ theme, regular }) => (regular ? theme.regular : theme.medium)};
  font-size: ${({ theme }) => theme.s};
  color: ${({ theme, secondary }) => (secondary ? theme.textSecondary : theme.text)};
`;

export default Paragraph;
