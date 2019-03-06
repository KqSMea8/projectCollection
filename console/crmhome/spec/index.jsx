import React from 'react';
import ReactDOM from 'react-dom';
import TreeModalSpec from './TreeModalSpec';
import '../src/common/';
import './style.less';

ReactDOM.render((
  <spec>
    <div>
      <strong>tree-modal spec</strong>
      <TreeModalSpec />
    </div>
  </spec>
), document.querySelector('main'));
