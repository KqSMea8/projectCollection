import React, { Component } from 'react';
import logo from './logo.svg';
import Edit from './uditor'
import './App.css';

class App extends Component {
  testSubmit(){
   
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Edit id="content" height="200"></Edit>
        <button>保存</button>
      </div>
    );
  }
}

export default App;
