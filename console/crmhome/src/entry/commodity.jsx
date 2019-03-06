import React from 'react';
import ReactDOM from 'react-dom';
import '../common/';
import clueTrackerInit from '../common/ClueTracker';
import { Router, Route, hashHistory } from 'react-router';
import itemManagementRoutes from '../component/ItemManagement/routes';

clueTrackerInit();

const RouteCollection = itemManagementRoutes.map((props, index) => {
  return <Route {...props} key={index} />;
});

ReactDOM.render((
  <Router history={hashHistory}>
    {RouteCollection}
  </Router>
), document.getElementById('react-content'));

