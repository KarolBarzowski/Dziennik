import React from 'react';
import ClearSky from 'components/atoms/Weather/ClearSky';
import FewClouds from 'components/atoms/Weather/FewClouds';
import Clouds from 'components/atoms/Weather/Clouds';
import ShowerRain from 'components/atoms/Weather/ShowerRain';
import Rain from 'components/atoms/Weather/Rain';
import Thunderstorm from 'components/atoms/Weather/Thunderstorm';
import Snow from 'components/atoms/Weather/Snow';
import Mist from 'components/atoms/Weather/Mist';

export const getWeatherIcon = icon => {
  switch (`${icon[0]}${icon[1]}`) {
    case '01':
      return <ClearSky />;
    case '02':
      return <FewClouds />;
    case '03':
    case '04':
      return <Clouds />;
    case '09':
      return <ShowerRain />;
    case '10':
      return <Rain />;
    case '11':
      return <Thunderstorm />;
    case '13':
      return <Snow />;
    case '50':
      return <Mist />;

    default:
      return null;
  }
};

export const getColor = name => {
  switch (name) {
    case 'Sprawdzian':
    case 'Test':
    case 'Praca klasowa':
    case 'unexcused':
    case 'negatywna':
      return 'red';
    case 'Kartkówka':
    case 'Praca z tekstem':
    case 'Rozumienie ze słuchu':
      return 'orange';
    case 'Odpowiedź ustna':
    case 'Ćwiczenie':
    case 'Konwersacja':
    case 'pending':
      return 'blue';
    case 'Aktywność':
    case 'Praca domowa':
    case 'excused':
    case 'pozytywna':
      return 'green';
    case 'Praca pisemna/referat':
    case 'Projekt/zadanie':
    case 'Prezentacja':
      return 'purple';
    case 'notCounted':
      return 'teal';
    default:
      return 'text';
  }
};

export const getCleanName = name =>
  name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/ą/g, 'a')
    .replace(/ć/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ń/g, 'n')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ź/g, 'z')
    .replace(/ż/g, 'z');

export const getStatus = status => {
  switch (status) {
    case 'excused':
      return 'Usprawiedliwione';
    case 'unexcused':
      return 'Nieusprawiedliwione';
    case 'pending':
      return 'Wnioskowane';
    case 'notCounted':
      return 'Nieliczone do frekwencji';
    default:
      return '';
  }
};

export const getRGBColor = color => {
  switch (color) {
    case 'red':
      return 'rgb(255, 69, 58)';
    case 'blue':
      return 'rgb(10, 132, 255)';
    case 'orange':
      return 'rgb(255, 159, 10)';
    case 'green':
      return 'rgb(48, 209, 88)';
    case 'purple':
      return 'rgb(191, 90, 242)';
    case 'teal':
      return 'rgb(100, 210, 255)';
    default:
      return 'rgba(255, 255, 255, .87)';
  }
};
