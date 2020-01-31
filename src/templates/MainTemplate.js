import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { useSnackbar } from 'notistack';
import GlobalStyle from 'theme/GlobalStyle';
import { theme as themeTemplate } from 'theme/mainTheme';
import DynamicHeader from 'components/molecules/DynamicHeader/DynamicHeader';
import Navbar from 'components/organisms/Navbar/Navbar';
import Modal from 'components/organisms/Modal/Modal';

const StyledTopbar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
  background-color: ${({ theme }) => theme.background};
  transition: background-color ${({ theme }) => theme.themeTransition};
`;

function MainTemplate({
  children,
  theme,
  toggleTheme,
  isAutomatic,
  isCustom,
  setOptions,
  schedule,
}) {
  const [isUpdate] = useState(JSON.parse(window.localStorage.getItem('isUpdate')));
  const [isModalOpen, setModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleModalToggle = () => setModalOpen(!isModalOpen);

  useEffect(() => {
    if (isUpdate) {
      enqueueSnackbar('Zaktualizowano dane', { variant: 'success', autoHideDuration: 3000 });
      window.localStorage.removeItem('isUpdate');
    }
  }, [isUpdate]);

  return (
    <ThemeProvider theme={themeTemplate[theme]}>
      <GlobalStyle />
      <StyledTopbar>
        <DynamicHeader />
        <Navbar handleModalToggle={handleModalToggle} />
      </StyledTopbar>
      <Modal
        isVisible={isModalOpen}
        handleModalToggle={handleModalToggle}
        toggleTheme={toggleTheme}
        theme={theme}
        isAutomatic={isAutomatic}
        isCustom={isCustom}
        setOptions={setOptions}
        schedule={schedule}
      />
      {children}
    </ThemeProvider>
  );
}

MainTemplate.propTypes = {
  children: PropTypes.element.isRequired,
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
  isAutomatic: PropTypes.string.isRequired,
  isCustom: PropTypes.string.isRequired,
  setOptions: PropTypes.func.isRequired,
  schedule: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default MainTemplate;
