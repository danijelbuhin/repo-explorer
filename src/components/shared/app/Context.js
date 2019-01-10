import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';

export const AppContext = createContext();
export const { Consumer, Provider } = AppContext;

class AppProvider extends Component {
  render() {
    return (
      <Provider
        value={{
          foo: 'bar',
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
