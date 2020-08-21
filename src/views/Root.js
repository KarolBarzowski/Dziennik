import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import { Router, Switch, Route } from 'react-router-dom';
// import firebase from 'firebase/config';
import { SnackbarProvider } from 'notistack';
import { useData } from 'hooks/useData';
// import { isMobile } from 'react-device-detect';
import MainTemplate from 'templates/MainTemplate';
import UserTemplate from 'templates/UserTemplate';
import Dashboard from 'views/Dashboard';
import Grades from 'views/Grades';
import Plan from 'views/Plan';
import Exams from 'views/Exams';
import Absences from 'views/Absences';
import Tutorial from 'views/Tutorial';
import Points from 'views/Points';
// import Login from 'views/Login';
import GlobalStyle from 'theme/GlobalStyle';

import NewGrades from 'views/NewGrades';

ReactGA.initialize(process.env.REACT_APP_TRACKING_ID);

const history = createBrowserHistory();

history.listen(location => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
});

function Root() {
  const { data } = useData();
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
    <>
      <GlobalStyle />
      <SnackbarProvider>
        <Router history={history}>
          <MainTemplate isUser={isUser}>
            <Switch>
              {/* {isMobile && !isUser ? <Login /> : null} */}
              {/* <Route path="/login" component={Login} /> */}
              <UserTemplate>
                <>
                  <Route exact path="/" component={Dashboard} />
                  <Route path="/oceny" component={NewGrades} />
                  {/* <Route path="/oceny" component={Grades} /> */}
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
