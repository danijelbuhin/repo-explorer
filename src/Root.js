import React, { Component } from 'react';

import AppProvider from './components/shared/app/Context';
import Router from './components/shared/app/Router';

class App extends Component {
  render() {
    return (
      <AppProvider>
        <Router />
      </AppProvider>
    );
  }
}

export default App;
