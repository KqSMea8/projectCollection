import './quote.less';
import React, {PropTypes}from 'react';
import QuoteRegistrationTable from './QuoteRegistrationTable';
import {Form} from 'antd';

const QuoteRegistration = React.createClass({

  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    return {};
  },
  render() {
    return (<div>
      <div className="app-detail-header quote-header">申请记录 > <a>报价登记</a></div>
      <div>
        <h3 className="kb-page-sub-title kb-title-border">订单内容</h3>
        <QuoteRegistrationTable id={this.props.params.id}/>
      </div>
	</div>);
  },
});

export default Form.create()(QuoteRegistration);
