import React, { Fragment } from 'react';
import { Router, Switch } from 'react-router-dom';

import history from '../../../history';
import ExtendedRoute from '../route/ExtendedRoute';

import Header from '../header/Header';
import Home from '../../home/Home';
import RepoProfile from '../../repo-profile/RepoProfile';
import SearchResults from '../../search-results/SearchResults';
import NotFound from '../not-found/NotFound';

const AppRouter = () => (
  <Router history={history}>
    <Fragment>
      <Header />
      <Switch>
        <ExtendedRoute
          path="/"
          component={Home}
          title="Repo Explorer | Explore GitHub Repositories"
          exact
        />
        <ExtendedRoute
          path="/:user/:repo/(overview|stats|views)?"
          component={RepoProfile}
          title="Repo Profile | Repo Explorer - Explore Github Repositories"
          exact
        />
        <ExtendedRoute
          path="/search"
          component={SearchResults}
          title="Search results | Repo Explorer - Explore Github Repositories"
          exact
        />
        <ExtendedRoute
          component={NotFound}
          title="FourOFour | Repo Explorer - Explore Github Repositories"
        />
      </Switch>
    </Fragment>
  </Router>
);

export default AppRouter;
