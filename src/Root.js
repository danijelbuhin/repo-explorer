import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';

import AppProvider from './components/shared/app/Context';
import Router from './components/shared/app/Router';
import './GlobalStyle.scss';
import 'flag-icon-css/css/flag-icon.min.css';

class App extends Component {
  render() {
    return (
      <AppProvider>
        <Router />
        <ToastContainer />
      </AppProvider>
    );
  }
}

export default App;
