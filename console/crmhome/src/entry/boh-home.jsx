import React from 'react';
import ReactDOM from 'react-dom';

import App from '../component/boh-home/app';

import '../common/';
import clueTrackerInit from '../common/ClueTracker';

clueTrackerInit();

ReactDOM.render(<App />, document.getElementById('react-content'));
