import React from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { withKnobs, select } from '@storybook/addon-knobs';
import { theme } from 'theme/mainTheme';
import styled, { ThemeProvider } from 'styled-components';
import { themes } from '@storybook/theming';

const Background = styled.div`
  background-color: ${({ theme }) => theme.background};
  min-height: 100vh;
`;

addParameters({
  options: {
    theme: themes.normal,
  },
});

addDecorator(withKnobs);
addDecorator(story => {
  const content = story();
  return (
    <ThemeProvider theme={select('Theme', theme, theme.light)}>
      <Background>{content}</Background>
    </ThemeProvider>
  );
});

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.js$/), module);
