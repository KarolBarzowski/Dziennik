import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from 'theme/GlobalStyle';
import { theme as themeTemplate } from 'theme/mainTheme';
import Navbar from 'components/organisms/Navbar/Navbar';

function MainTemplate({ children, theme, toggleTheme }) {
  return (
    <ThemeProvider theme={themeTemplate[theme]}>
      <>
        <GlobalStyle />
        <Navbar />
        {children}
      </>
    </ThemeProvider>
  );
}

MainTemplate.propTypes = {
  children: PropTypes.element.isRequired,
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default MainTemplate;
