import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { useSnackbar } from 'notistack';
import GlobalStyle from 'theme/GlobalStyle';
import { theme } from 'theme/mainTheme';

function MainTemplate({ children, isUser }) {
  const [isUpdate] = useState(JSON.parse(window.localStorage.getItem('isUpdate')));
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isUpdate) {
      enqueueSnackbar('Zaktualizowano dane', { variant: 'success', autoHideDuration: 3000 });
      window.localStorage.removeItem('isUpdate');
    }
  }, [isUpdate, enqueueSnackbar]);

  useEffect(() => {
    if (isUser) {
      enqueueSnackbar('Zalogowano', { variant: 'success', autoHideDuration: 3000 });
    }
  }, [isUser, enqueueSnackbar]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}

MainTemplate.propTypes = {
  children: PropTypes.element.isRequired,
  isUser: PropTypes.bool,
};

MainTemplate.defaultProps = {
  isUser: false,
};

export default MainTemplate;
