import styled from 'styled-components';
import { slideInDown } from 'functions/animations';

const Card = styled.div`
  background-color: ${({ theme }) => theme.card};
  border-radius: 1.5rem;
  padding: 1.5rem 1rem;
  margin: 1.5rem 0 0;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px;
  animation: ${slideInDown} 0.3s ease-in-out backwards;
`;

export default Card;
