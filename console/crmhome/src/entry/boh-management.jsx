import React from 'react';
import ReactDOM from 'react-dom';

import App from '../component/boh-management/app';

import '../common/';
import clueTrackerInit from '../common/ClueTracker';

clueTrackerInit();

ReactDOM.render(<App />, document.getElementById('react-content'));
