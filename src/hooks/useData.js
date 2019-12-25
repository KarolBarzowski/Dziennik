import { useState, useEffect } from 'react';

export const useData = () => {
  const [data, setData] = useState(JSON.parse(window.localStorage.getItem('data')));

  useEffect(() => {
    const actualData = JSON.parse(window.localStorage.getItem('data'));
    if (actualData !== null) setData(actualData);
    else setData(null);
  }, []);

  return data;
};
