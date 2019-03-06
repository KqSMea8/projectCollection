import React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {connect} from '@alipay/page-store';

import Home from './index';
import BOHActivationHelp from '../boh-activation-help';
import BOHSolutionDetail from '../boh-solution-detail';
import store from './store';

@connect(store)
class Main extends React.Component {
  render() {
    return this.props.children;
  }
}

function scrollToTop() {
  window.scrollTo(0, 0);
}

export default class App extends React.Component {
  render() {
    return (
      <Router history={hashHistory} onUpdate={scrollToTop}>
        <Route path="/" component={Main}>
          <IndexRoute component={Home} />
          <Route path="/help" component={BOHActivationHelp} />
          <Route path="/solution/:id" component={BOHSolutionDetail} />
          <Route path="/demo/:id" component={BOHSolutionDetail} />
        </Route>
      </Router>
    );
  }
}
