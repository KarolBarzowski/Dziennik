import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { HotKeys } from 'react-hotkeys';
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

function UserTemplate({
  children,
  toggleTheme,
  isAutomatic,
  isCustom,
  setOptions,
  schedule,
  theme,
}) {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleModalToggle = () => setModalOpen(!isModalOpen);

  return (
    <HotKeys>
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
    </HotKeys>
  );
}

UserTemplate.propTypes = {
  children: PropTypes.element.isRequired,
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
  isAutomatic: PropTypes.string.isRequired,
  isCustom: PropTypes.string.isRequired,
  setOptions: PropTypes.func.isRequired,
  schedule: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default UserTemplate;
