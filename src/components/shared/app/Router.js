import React from 'react';
import { Router, Switch } from 'react-router-dom';

import history from '../../../history';
import ExtendedRoute from '../route/ExtendedRoute';

import Home from '../../home/Home';

const AppRouter = () => (
  <Router history={history}>
    <Switch>
      <ExtendedRoute
        path="/"
        component={Home}
        title="Repo Explorer | Explore GitHub Repositories"
      />
    </Switch>
  </Router>
);

export default AppRouter;
