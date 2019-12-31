import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from 'theme/GlobalStyle';
import { theme as themeTemplate } from 'theme/mainTheme';
import Navbar from 'components/organisms/Navbar/Navbar';
import Modal from 'components/organisms/Modal/Modal';

function MainTemplate({
  children,
  theme,
  toggleTheme,
  isAutomatic,
  isCustom,
  setOptions,
  schedule,
}) {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleModalToggle = () => setModalOpen(!isModalOpen);

  return (
    <ThemeProvider theme={themeTemplate[theme]}>
      <>
        <GlobalStyle />
        <Navbar handleModalToggle={handleModalToggle} />
        {isModalOpen && (
          <Modal
            handleModalToggle={handleModalToggle}
            toggleTheme={toggleTheme}
            theme={theme}
            isAutomatic={isAutomatic}
            isCustom={isCustom}
            setOptions={setOptions}
            schedule={schedule}
          />
        )}
        {children}
      </>
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
