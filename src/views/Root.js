import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import { Router, Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { useData } from 'hooks/useData';
import MainTemplate from 'templates/MainTemplate';
import UserTemplate from 'templates/UserTemplate';
import Dashboard from 'views/Dashboard';
import Grades from 'views/Grades';
import Plan from 'views/Plan';
import Exams from 'views/Exams';
import Absences from 'views/Absences';
import Tutorial from 'views/Tutorial';
import Points from 'views/Points';
import Update from 'views/Update';
import NotFound from 'views/NotFound';
import GlobalStyle from 'theme/GlobalStyle';

ReactGA.initialize(process.env.REACT_APP_TRACKING_ID);

const history = createBrowserHistory();

history.listen(location => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
});

function Root() {
  const [isScriptUpdate, setIsScriptUpdate] = useState(false);
  const { data } = useData();

  useEffect(() => {
    const ACTUAL_SCRIPT_VERSION = "3.0.0";
    const scriptVersion = window.localStorage.getItem('script_version');
    setIsScriptUpdate(scriptVersion !== ACTUAL_SCRIPT_VERSION);
  }, []);

  if (!data) return <Tutorial />;
  if (isScriptUpdate) return <Update />;

  return (
    <>
      <GlobalStyle />
      <SnackbarProvider>
        <Router history={history}>
          <MainTemplate>
            <UserTemplate>
              <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route path="/oceny" component={Grades} />
                <Route path="/plan" component={Plan} />
                <Route path="/sprawdziany" component={Exams} />
                <Route path="/frekwencja" component={Absences} />
                <Route path="/uwagi" component={Points} />
                <Route component={NotFound} />
              </Switch>
            </UserTemplate>
          </MainTemplate>
        </Router>
      </SnackbarProvider>
    </>
  );
}

export default Root;
