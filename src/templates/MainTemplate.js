import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { useSnackbar } from 'notistack';
import { theme } from 'theme/mainTheme';

function MainTemplate({ children }) {
  const [isUpdate] = useState(JSON.parse(window.localStorage.getItem('isUpdate')));
  const [isNotSynced] = useState(JSON.parse(window.localStorage.getItem('isNotSynced')));
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isUpdate) {
      enqueueSnackbar('Zaktualizowano dane', { variant: 'success', autoHideDuration: 5000 });
      window.localStorage.removeItem('isUpdate');
    }
  }, [isUpdate, enqueueSnackbar]);

  useEffect(() => {
    if (isNotSynced) {
      enqueueSnackbar('Brak nowych danych do synchronizacji', {
        variant: 'info',
        autoHideDuration: 5000,
      });
      window.localStorage.removeItem('isNotSynced');
    }
  }, [isNotSynced, enqueueSnackbar]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

MainTemplate.propTypes = {
  children: PropTypes.element.isRequired,
};

export default MainTemplate;
