import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [theme, setTheme] = useState(window.localStorage.getItem('theme') || 'light');

  const setMode = mode => {
    window.localStorage.setItem('theme', mode);
    setTheme(mode);
  };

  const toggleTheme = () => {
    if (theme === 'light') setMode('dark');
    else setMode('light');
  };

  useEffect(() => {
    const actualTheme = window.localStorage.getItem('theme');
    if (actualTheme) setTheme(actualTheme);
    else setMode('light');
  }, []);

  return [theme, toggleTheme];
};
