import { keyframes } from 'styled-components';

export const slideInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-2rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
}
`;
