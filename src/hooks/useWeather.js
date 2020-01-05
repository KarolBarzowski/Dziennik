import { useState, useEffect } from 'react';

export const useWeather = () => {
  const URL = `http://api.openweathermap.org/data/2.5/weather?q=Gdynia,pl&APPID=${process.env.REACT_APP_WEATHER_API_KEY}`;
  const [data, setData] = useState({});

  useEffect(() => {
    const { AbortController } = window;
    const controller = new AbortController();
    window
      .fetch(URL)
      .then(res => res.json())
      .then(json => setData({ sunset: json.sys.sunset, sunrise: json.sys.sunrise }));
    return () => controller.abort();
    // eslint-disable-next-line
  }, []);

  return data;
};
