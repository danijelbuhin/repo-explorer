import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

const ExtendedRoute = ({
  component: Component, title, ...rest
}) => (
  <Route
    {...rest}
    render={props => (
      <DocumentTitle title={title}>
        <div className="content">
          <Component {...props} />
        </div>
      </DocumentTitle>
    )}
  />
);

ExtendedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  title: PropTypes.string.isRequired,
};

export default ExtendedRoute;
