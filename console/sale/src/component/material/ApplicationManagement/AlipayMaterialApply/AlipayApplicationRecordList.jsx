import React, { PropTypes } from 'react';
import permission from '@alipay/kb-framework/framework/permission';
import AlipayApplicationRecordForm from './AlipayApplicationRecordForm';
import AlipayApplicationRecordTable from './AlipayApplicationRecordTable';

const AlipayApplicationRecordList = React.createClass({
  propTypes: {
    applycationType: PropTypes.string,
    form: PropTypes.object,
  },
  getInitialState() {
    // 用于业务来源的下拉选并且当选择ISV物料或者支付宝转账码时table里的展示是有区别的
    const bizSourceOptions = [];
    const items = [];
    if (permission('ISV_ORDER_QUERY')) {
      bizSourceOptions.push(<Option key= "ISV_STUFF">ISV物料</Option>);
      items.push('ISV_STUFF');
    }
    if (permission('TRANSFER_CODE_ORDER_QUERY')) {
      bizSourceOptions.push(<Option key= "TRANSFER_CODE">支付宝转账码</Option>);
      items.push('TRANSFER_CODE');
    }
    const bizSourceData = items[0];
    return {
      bizSourceOptions,
      bizSourceData,
    };
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },
  // 当ApplicationRecordForm里触发业务来源选择时控制ApplicationRecordTable里table的展示
  rebackBizSourceData(value) {
    if (value === 'ISV_STUFF') {
      this.setState({
        bizSourceData: 'ISV_STUFF',
      });
    }
    if (value === 'TRANSFER_CODE') {
      this.setState({
        bizSourceData: 'TRANSFER_CODE',
      });
    }
  },
  render() {
    return (
      <div>
        <div className="app-detail-content-padding">
          <AlipayApplicationRecordForm rebackBizSourceData = {this.rebackBizSourceData} bizSourceData={this.state.bizSourceData} bizSourceOptions={this.state.bizSourceOptions} applycationType={this.props.applycationType} onSearch={this.onSearch} />
          {this.state.bizSourceData && <AlipayApplicationRecordTable bizSourceData={this.state.bizSourceData} params={this.state.params} />}
        </div>
      </div>
    );
  },
});

export default AlipayApplicationRecordList;
