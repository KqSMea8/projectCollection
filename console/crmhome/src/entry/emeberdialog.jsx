import 'matchmedia-polyfill/matchMedia.js';
import '../common/';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {message} from 'antd';
import clueTrackerInit from '../common/ClueTracker';
import {Router, Route, hashHistory} from 'react-router';
import {getUriParam} from '../common/utils';
import emeberRouters from '../component/emeber/modals/routes';

clueTrackerInit();

const RouteArray = emeberRouters;
console.log(RouteArray);
const RouteCollection = RouteArray.map((props, index) => {
  return <Route {...props} key={index} />;
});

ReactDOM.render(<div>
  <div>
    <Router history={hashHistory}>
      {RouteCollection}
    </Router>
  </div>
</div>, document.getElementById('react-content'));

// 展示通用提示信息
const commonMessage = getUriParam('cmsg');
if (commonMessage) {
  message.info(commonMessage, 0);
}
