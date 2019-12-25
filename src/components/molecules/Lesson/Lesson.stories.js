import React from 'react';
import Lesson from './Lesson';

export default {
  title: 'Molecules/Lesson',
};

export const Default = () => (
  <Lesson
    hours="8:55 - 9:40"
    name="Programowanie i algorytmika"
    room="s. 212"
    teacher="Wioleta Budny"
    bgColor="rgb(51, 154, 240)"
  />
);

export const withWarning = () => (
  <Lesson
    hours="8:55 - 9:40"
    name="Programowanie i algorytmika"
    room="s. 212"
    teacher="Wioleta Budny"
    bgColor="rgb(51, 154, 240)"
    warn={{ type: 'Sprawdzian', desc: 'Pętle w C++' }}
  />
);

export const Stacked = () => (
  <Lesson
    hours="8:55 - 9:40"
    name="Programowanie i algorytmika"
    room="s. 212"
    teacher="Wioleta Budny"
    bgColor="rgb(51, 154, 240)"
    multiple
  />
);
