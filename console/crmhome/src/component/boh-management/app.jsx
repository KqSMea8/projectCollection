import React from 'react';
import {Router, Route, hashHistory} from 'react-router';

import Home from './index';
import BOHActivationHelp from '../boh-activation-help';

export default class App extends React.Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={Home} />
        <Route path="/help" component={BOHActivationHelp} />
      </Router>
    );
  }
}
