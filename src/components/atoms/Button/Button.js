import styled from 'styled-components';

const Button = styled.button`
  max-height: 3.2rem;
  padding: 0.6rem 1.4rem;
  border: 0.2rem solid ${({ theme }) => theme.border};
  border-radius: 5rem;
  text-align: center;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  font-family: 'Montserrat';
  font-size: ${({ theme }) => theme.s};
  font-weight: ${({ theme }) => theme.medium};
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out, border ${({ theme }) => theme.themeTransition},
    color ${({ theme }) => theme.themeTransition};
  :hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`;

export default Button;
