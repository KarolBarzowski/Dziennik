import { useState, useEffect } from 'react';

export const useDarkMode = weather => {
  const { localStorage } = window;
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isAutomatic, setIsAutomatic] = useState(localStorage.getItem('isAutomatic') || 'false');
  const [isCustom, setIsCustom] = useState(localStorage.getItem('isCustom') || 'false');
  const [schedule, setSchedule] = useState(
    JSON.parse(localStorage.getItem('schedule')) || { start: '20:00', end: '08:00' },
  );

  const setMode = mode => {
    localStorage.setItem('theme', mode);
    setTheme(mode);
  };

  const toggleTheme = newTheme => {
    setMode(newTheme);
  };

  const setOptions = (option, value) => {
    localStorage.setItem(option, value);
    switch (option) {
      case 'isAutomatic':
        setIsAutomatic(value);
        break;
      case 'isCustom': {
        setIsCustom(value);
        break;
      }
      case 'schedule':
        setSchedule(value);
        localStorage.setItem('schedule', JSON.stringify(value));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const automatic = localStorage.getItem('isAutomatic');
    if (automatic === 'true') {
      const custom = localStorage.getItem('isCustom');
      if (custom === 'true') {
        const { start, end } = schedule;
        const date = new Date();
        const time = `${date.getHours()}:${date.getMinutes()}`;
        if (start > end) {
          if (time > start && time > end) setMode('dark');
          else setMode('light');
        } else if (time > start && time < end) setMode('dark');
        else setMode('light');
      } else {
        // night - day
        const date = new Date();
        const time = `${date.getHours()}:${date.getMinutes()}`;
        if (weather) {
          if (time > weather.sunset) setMode('dark');
          else setMode('light');
        }
      }
    } else {
      const currentTheme = localStorage.getItem('theme');
      if (currentTheme) setTheme(currentTheme);
      else setMode('light');
    }
  }, [weather, isAutomatic, isCustom, schedule]);

  return [theme, toggleTheme, isAutomatic, isCustom, setOptions, schedule];
};
