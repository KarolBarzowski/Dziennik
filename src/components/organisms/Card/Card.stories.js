import React from 'react';
import StoryRouter from 'storybook-react-router';
import Card from './Card';

export default {
  title: 'Organisms/Card',
  decorators: [StoryRouter()],
};

const dummyData = {
  lessons: [
    {
      name: 'Programowanie i algorytmika',
      hours: '08:55 - 09:40',
      teacher: 'Wioleta Budny',
      room: 'Sala 212',
    },
    {
      name: 'Programowanie i algorytmika',
      hours: '09:50 - 10:35',
      teacher: 'Wioleta Budny',
      room: 'Sala 212',
    },
    {
      name: 'Programowanie i algorytmika',
      hours: '10:45 - 11:30',
      teacher: 'Wioleta Budny',
      room: 'Sala 212',
    },
    {
      name: 'Zajęcia z wychowawcą',
      hours: '11:50 - 12:35',
      teacher: 'Dawid Ladach',
      room: 'Sala 21',
    },
    {
      name: 'Język angielski',
      hours: '12:45 - 13:30',
      teacher: 'Wiesława Klimek',
      room: 'Sala 124',
    },
    {
      name: 'Religia',
      hours: '13:40 - 14:25',
      teacher: 'Andreas Wulgaris',
      room: 'Sala 103',
    },
    {
      name: 'Sieci komputerowe',
      hours: '14:35 - 15:20',
      teacher: 'Kamil Batożyński',
      room: 'Sala 203',
    },
    {
      name: 'Sieci komputerowe',
      hours: '15:30 - 16:15',
      teacher: 'Kamil Batożyński',
      room: 'Sala 203',
    },
  ],
};

export const Plan = () => (
  <Card
    cardType="plan"
    title="Plan lekcji"
    description="Poniedziałek, 22.12"
    weather="12&deg;C | 68%"
    link="/plan"
    time="8:55 - 16:15"
    lessons={dummyData.lessons}
  />
);

export const Grades = () => (
  <Card
    cardType="grades"
    title="Oceny"
    description="Oceny dodane od ostatniej synchronizacji"
    link="/grades"
  />
);

export const Exams = () => (
  <Card
    cardType="exams"
    title="Sprawdziany"
    description="Nadchodzące sprawdziany i inne zadania"
    link="/exams"
  />
);
