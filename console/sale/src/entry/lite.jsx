import '../common/';
// import 'babel-polyfill';
import KbAppFrameworkLite from '@alipay/kb-framework/framework/KbAppFrameworkLite';
import workflowRoutes from '../component/workflow/routes';
import ReactDOM from 'react-dom';
import React from 'react';
import {Router} from 'react-router';
const buserviceUrl = window.APP.buserviceUrl || '';

ReactDOM.render(<KbAppFrameworkLite
  additionalInfo={window.APP.serviceInfo}
  urlWhiteList={[/^.*$/]}
  platformType="kb-sale"
  buserviceUrl={buserviceUrl}
  Router={Router} name="销售工作台">
  {[].concat(workflowRoutes)}
</KbAppFrameworkLite>, document.getElementById('react-content'));
