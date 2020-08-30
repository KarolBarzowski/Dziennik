import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700&display=swap');
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@500,600&display=swap');

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
        background-color: rgb(28, 28, 30);
    }

    body::-webkit-scrollbar {
        width: 1.2rem;
        background-color: rgb(28, 28, 30);
    }

    body::-webkit-scrollbar-thumb {
        background-color: rgb(44, 44, 46);
        border-radius: 2rem;
    }

    .MuiSnackbarContent-message {
        font-size: 1.6rem;
        font-family: 'Montserrat', sans-serif;
    }

    div[tabindex="-1"]:focus {
        outline: 0;
    }

    span[role=img] {
        color: #ffffff;
    }
`;

export default GlobalStyle;
