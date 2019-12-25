import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useDarkMode } from 'hooks/useDarkMode';
import { useData } from 'hooks/useData';
import MainTemplate from 'templates/MainTemplate';
import Dashboard from 'views/Dashboard';

function Root() {
  const [theme, toggleTheme] = useDarkMode();
  const data = useData();

  return (
    <BrowserRouter>
      <MainTemplate theme={theme} toggleTheme={toggleTheme}>
        <Switch>
          <Route exact path="/" render={() => <Dashboard data={data} />} />
        </Switch>
      </MainTemplate>
    </BrowserRouter>
  );
}

export default Root;
