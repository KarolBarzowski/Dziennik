import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DynamicHeader from 'components/molecules/DynamicHeader/DynamicHeader';
import Navbar from 'components/organisms/Navbar/Navbar';

const StyledTopbar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
  background-color: ${({ theme }) => theme.background};
  transition: background-color ${({ theme }) => theme.themeTransition};
`;

function UserTemplate({ children }) {
  return (
    <>
      <StyledTopbar>
        <DynamicHeader />
        <Navbar />
      </StyledTopbar>
      {children}
    </>
  );
}

UserTemplate.propTypes = {
  children: PropTypes.element.isRequired,
};

export default UserTemplate;
