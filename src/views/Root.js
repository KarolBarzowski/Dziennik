import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useDarkMode } from 'hooks/useDarkMode';
import { useData } from 'hooks/useData';
import { useWeather } from 'hooks/useWeather';
import MainTemplate from 'templates/MainTemplate';
import Dashboard from 'views/Dashboard';
import Tutorial from 'views/Tutorial';

function Root() {
  const data = useData();
  const weather = useWeather();
  const [theme, toggleTheme, isAutomatic, isCustom, setOptions, schedule] = useDarkMode(weather[0]);

  if (!data) {
    return <Tutorial />;
  }
  return (
    <BrowserRouter>
      <MainTemplate
        theme={theme}
        toggleTheme={toggleTheme}
        isAutomatic={isAutomatic}
        isCustom={isCustom}
        setOptions={setOptions}
        schedule={schedule}
      >
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Dashboard data={data} weather={weather[new Date().getDay() === 6 ? 0 : 1]} />
            )}
          />
        </Switch>
      </MainTemplate>
    </BrowserRouter>
  );
}

export default Root;
