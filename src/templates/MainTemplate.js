import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { useSnackbar } from 'notistack';
import { theme } from 'theme/mainTheme';

function MainTemplate({ children }) {
  const [isUpdate] = useState(JSON.parse(window.localStorage.getItem('isUpdate')));
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isUpdate) {
      enqueueSnackbar('Zaktualizowano dane', { variant: 'success', autoHideDuration: 3000 });
      window.localStorage.removeItem('isUpdate');
    }
  }, [isUpdate, enqueueSnackbar]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

MainTemplate.propTypes = {
  children: PropTypes.element.isRequired,
};

export default MainTemplate;
