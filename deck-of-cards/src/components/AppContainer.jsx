import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import '../css/App.css';

import CardTable from './CardTable';

class AppContainer extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <CardTable />
      </div>
    );
  }
}

export default AppContainer;
