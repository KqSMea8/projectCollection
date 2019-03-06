import 'matchmedia-polyfill/matchMedia.js';
import '../common/';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import clueTrackerInit from '../common/ClueTracker';
import App from '../component/boh-auth';

clueTrackerInit();

ReactDOM.render(<App />, document.getElementById('react-content'));
