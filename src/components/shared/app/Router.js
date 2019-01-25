import React, { Fragment } from 'react';
import { Router, Switch } from 'react-router-dom';

import history from '../../../history';
import ExtendedRoute from '../route/ExtendedRoute';

import Header from '../header/Header';
import Home from '../../home/Home';

const AppRouter = () => (
  <Router history={history}>
    <Fragment>
      <Header />
      <Switch>
        <ExtendedRoute
          path="/"
          component={Home}
          title="Repo Explorer | Explore GitHub Repositories"
        />
      </Switch>
    </Fragment>
  </Router>
);

export default AppRouter;
