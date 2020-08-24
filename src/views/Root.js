import React from 'react';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import { Router, Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { useData } from 'hooks/useData';
import MainTemplate from 'templates/MainTemplate';
import UserTemplate from 'templates/UserTemplate';
import Dashboard from 'views/Dashboard';
import NewGrades from 'views/NewGrades';
import Plan from 'views/Plan';
import Exams from 'views/Exams';
import Absences from 'views/Absences';
import Tutorial from 'views/Tutorial';
import Points from 'views/Points';
import GlobalStyle from 'theme/GlobalStyle';

ReactGA.initialize(process.env.REACT_APP_TRACKING_ID);

const history = createBrowserHistory();

history.listen(location => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
});

function Root() {
  const { data } = useData();

  if (!data) {
    return <Tutorial />;
  }
  return (
    <>
      <GlobalStyle />
      <SnackbarProvider>
        <Router history={history}>
          <MainTemplate>
            <Switch>
              <UserTemplate>
                <>
                  <Route exact path="/" component={Dashboard} />
                  <Route path="/oceny" component={NewGrades} />
                  <Route path="/plan" component={Plan} />
                  <Route path="/sprawdziany" component={Exams} />
                  <Route path="/frekwencja" component={Absences} />
                  <Route path="/uwagi" component={Points} />
                </>
              </UserTemplate>
            </Switch>
          </MainTemplate>
        </Router>
      </SnackbarProvider>
    </>
  );
}

export default Root;
