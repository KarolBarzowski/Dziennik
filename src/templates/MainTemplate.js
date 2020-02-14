import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { useSnackbar } from 'notistack';
import GlobalStyle from 'theme/GlobalStyle';
import { theme as themeTemplate } from 'theme/mainTheme';

function MainTemplate({ children, theme, isUser }) {
  const [isUpdate] = useState(JSON.parse(window.localStorage.getItem('isUpdate')));
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isUpdate) {
      enqueueSnackbar('Zaktualizowano dane', { variant: 'success', autoHideDuration: 3000 });
      window.localStorage.removeItem('isUpdate');
    }
  }, [isUpdate]);

  useEffect(() => {
    if (isUser) {
      enqueueSnackbar('Zalogowano', { variant: 'success', autoHideDuration: 3000 });
    }
  }, [isUser]);

  return (
    <ThemeProvider theme={themeTemplate[theme]}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}

MainTemplate.propTypes = {
  children: PropTypes.element.isRequired,
  theme: PropTypes.string.isRequired,
  isUser: PropTypes.bool,
};

MainTemplate.defaultProps = {
  isUser: false,
};

export default MainTemplate;
