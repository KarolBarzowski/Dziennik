import React from 'react';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import { Router, Switch, Route } from 'react-router-dom';
import { useDarkMode } from 'hooks/useDarkMode';
import { useData } from 'hooks/useData';
import { useWeather } from 'hooks/useWeather';
import MainTemplate from 'templates/MainTemplate';
import Dashboard from 'views/Dashboard';
import Grades from 'views/Grades';
import Plan from 'views/Plan';
import Exams from 'views/Exams';
import Absences from 'views/Absences';
import Tutorial from 'views/Tutorial';

ReactGA.initialize(process.env.REACT_APP_TRACKING_ID);

const history = createBrowserHistory();

history.listen(location => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
});

function Root() {
  const { data } = useData();
  const weather = useWeather();
  const [theme, toggleTheme, isAutomatic, isCustom, setOptions, schedule] = useDarkMode(weather);

  if (!data) {
    return <Tutorial />;
  }
  return (
    <Router history={history}>
      <MainTemplate
        theme={theme}
        toggleTheme={toggleTheme}
        isAutomatic={isAutomatic}
        isCustom={isCustom}
        setOptions={setOptions}
        schedule={schedule}
      >
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/oceny" component={Grades} />
          <Route path="/plan" component={Plan} />
          <Route path="/sprawdziany" component={Exams} />
          <Route path="/frekwencja" component={Absences} />
        </Switch>
      </MainTemplate>
    </Router>
  );
}

export default Root;
