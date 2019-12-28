import styled from 'styled-components';

const TimePicker = styled.input`
  padding: 0.2rem 0.4rem;
  background-color: ${({ theme }) => theme.switch};
  color: ${({ theme }) => theme.text};
  font-family: 'Montserrat', sans-serif;
  font-size: ${({ theme }) => theme.m};
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.themeTransition},
    color ${({ theme }) => theme.themeTransition};
`;

export default TimePicker;
