import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700&display=swap');
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,500&display=swap');

  *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    html {
        font-size: 62.5%;
    }

    body {
        font-size: 1.6rem;
        font-family: 'Montserrat', sans-serif;
    }

    .MuiSnackbarContent-message {
        font-size: 1.6rem;
        font-family: 'Montserrat', sans-serif;
    }
`;

export default GlobalStyle;
