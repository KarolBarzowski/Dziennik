import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import { Router, Switch, Route } from 'react-router-dom';
// import firebase from 'firebase/config';
import { SnackbarProvider } from 'notistack';
import { HotKeys } from 'react-hotkeys';
import { useDarkMode } from 'hooks/useDarkMode';
import { useData } from 'hooks/useData';
import { useWeather } from 'hooks/useWeather';
// import { isMobile } from 'react-device-detect';
import MainTemplate from 'templates/MainTemplate';
import UserTemplate from 'templates/UserTemplate';
import Dashboard from 'views/Dashboard';
import Grades from 'views/Grades';
import Plan from 'views/Plan';
import Exams from 'views/Exams';
import Absences from 'views/Absences';
import Tutorial from 'views/Tutorial';
// import Login from 'views/Login';
import GlobalStyle from 'theme/GlobalStyle';

ReactGA.initialize(process.env.REACT_APP_TRACKING_ID);

const history = createBrowserHistory();

history.listen(location => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
});

const keyMap = {
  SYNC: 's',
  DASHBOARD: '1',
  GRADES: '2',
  PLAN: '3',
  EXAMS: '4',
  ABSENCES: '5',
};

const shortcuts = {
  sync: () => {
    window.location.href = 'https://nasze.miasto.gdynia.pl/ed_miej/zest_start.pl';
  },
  dashboard: () => {
    window.location.pathname = '/';
  },
  grades: () => {
    window.location.pathname = '/oceny';
  },
  plan: () => {
    window.location.pathname = '/plan';
  },
  exams: () => {
    window.location.pathname = '/sprawdziany';
  },
  absences: () => {
    window.location.pathname = '/frekwencja';
  },
};

const handlers = {
  SYNC: shortcuts.sync,
  DASHBOARD: shortcuts.dashboard,
  GRADES: shortcuts.grades,
  PLAN: shortcuts.plan,
  EXAMS: shortcuts.exams,
  ABSENCES: shortcuts.absences,
};

function Root() {
  const { data } = useData();
  const weather = useWeather();
  const [theme, toggleTheme, isAutomatic, isCustom, setOptions, schedule] = useDarkMode(weather);
  const [isUser, setIsUser] = useState(false);

  // useEffect(() => {
  //   firebase.auth().onAuthStateChanged(user => {
  //     if (user) {
  //       // User is signed in.
  //       setIsUser(true);
  //     } else {
  //       // User is signed out.
  //     }
  //   });
  // }, []);

  if (!data) {
    return <Tutorial />;
  }
  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <GlobalStyle />
      <SnackbarProvider>
        <Router history={history}>
          <MainTemplate theme={theme} isUser={isUser}>
            <Switch>
              {/* {isMobile && !isUser ? <Login /> : null} */}
              {/* <Route path="/login" component={Login} /> */}
              <UserTemplate
                theme={theme}
                toggleTheme={toggleTheme}
                isAutomatic={isAutomatic}
                isCustom={isCustom}
                setOptions={setOptions}
                schedule={schedule}
              >
                <>
                  <Route exact path="/" component={Dashboard} />
                  <Route path="/oceny" component={Grades} />
                  <Route path="/plan" component={Plan} />
                  <Route path="/sprawdziany" component={Exams} />
                  <Route path="/frekwencja" component={Absences} />
                </>
              </UserTemplate>
            </Switch>
          </MainTemplate>
        </Router>
      </SnackbarProvider>
    </HotKeys>
  );
}

export default Root;
