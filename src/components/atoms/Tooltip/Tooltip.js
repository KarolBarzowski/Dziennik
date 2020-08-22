import styled from 'styled-components';

const Tooltip = styled.span`
  position: absolute;
  top: calc(100% + 0.2rem);
  left: 50%;
  padding: 0.8rem;
  background-color: rgb(58, 58, 60);
  border-radius: 0.4rem;
  color: ${({ theme }) => theme.text};
  font-size: ${({ theme }) => theme.s};
  font-weight: ${({ theme }) => theme.medium};
  font-family: 'Montserrat';
  white-space: nowrap;
  transform: translateX(-50%) scale(0);
  transition: transform 0.15s ease-in-out;
  transform-origin: top;
  z-index: 99;
`;

export default Tooltip;
