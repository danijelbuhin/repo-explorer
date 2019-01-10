import React from 'react';

import { Consumer } from './Context';

const withAppContext = WrappedComponent => props => (
  <Consumer>
    {state => <WrappedComponent {...props} appContext={state} />}
  </Consumer>
);

export default withAppContext;
