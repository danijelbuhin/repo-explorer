import React, { Fragment } from 'react';
import { Router, Switch } from 'react-router-dom';

import history from '../../../history';
import ExtendedRoute from '../route/ExtendedRoute';

import Header from '../header/Header';
import Home from '../../home/Home';
import RepoProfile from '../../repo-profile/RepoProfile';
import SearchResults from '../../search-results/SearchResults';

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
          path="/repo/:id"
          component={RepoProfile}
          title="Repo Profile | Explore GitHub Repositories"
          exact
        />
        <ExtendedRoute
          path="/search"
          component={SearchResults}
          title="Search results | Explore GitHub Repositories"
          exact
        />
      </Switch>
    </Fragment>
  </Router>
);

export default AppRouter;
