import React from 'react';
import StoryRouter from 'storybook-react-router';
import Navbar from './Navbar';

export default {
  title: 'Organisms/Navbar',
  decorators: [StoryRouter()],
};

export const Default = () => <Navbar />;
