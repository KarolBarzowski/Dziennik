import { useState, useEffect } from 'react';

export const useWeather = () => {
  const URL = `https://api.weatherbit.io/v2.0/forecast/daily?city=Gdynia&key=${process.env.REACT_APP_WEATHER_API_KEY}`;
  const [data, setData] = useState([]);

  const daysInWeek = [
    'Niedziela',
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
  ];
  const date = new Date();
  const today = date.getDay();
  const daysToGet = [
    [1, 2, 3, 4, 5], // sunday
    [0, 1, 2, 3, 4], // monday
    [0, 1, 2, 3, 6], // tuesday
    [0, 1, 2, 5, 6], // wednesday
    [0, 1, 4, 5, 6], // thursday
    [0, 3, 4, 5, 6], // friday
    [2, 3, 4, 5, 6], // saturday
  ];

  const getWeather = (days, weather) => {
    const results = [];
    days.forEach(day => {
      /* eslint camelcase: 0 */
      const { temp, pop, sunset_ts, sunrise_ts } = weather[day];
      const dayName = daysInWeek[new Date(weather[day].valid_date).getDay()];
      const splitDate = weather[day].valid_date.split('-');
      const dd = splitDate[2];
      const mm = splitDate[1];
      const sunsetHour = Math.round((sunset_ts / 3600) % 24);
      const sunsetMinutes = Math.round((sunset_ts / 60) % 60);

      const sunriseHour = Math.round((sunrise_ts / 3600) % 24);
      const sunriseMinutes = Math.round((sunrise_ts / 60) % 60);

      const sunset = `${sunsetHour}:${sunsetMinutes}`;
      const sunrise = `${sunriseHour}:${sunriseMinutes}`;
      results.push({
        temp,
        pop,
        name: dayName,
        date: `${dd}.${mm}`,
        sunset,
        sunrise,
      });
    });
    setData(results);
  };

  useEffect(() => {
    const { AbortController } = window;
    const controller = new AbortController();
    window
      .fetch(URL)
      .then(res => res.json())
      .then(json => getWeather(daysToGet[today], json.data));
    return () => controller.abort();
  }, [URL]);

  return data;
};
