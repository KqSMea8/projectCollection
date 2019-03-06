import React, {PropTypes} from 'react';
import InvoicesQueryTable from './InvoicesQueryTable';
import InvoicesQueryForm from './InvoicesQueryForm';
import ajax from 'Utility/ajax';
import {appendOwnerUrlIfDev} from '../../../common/utils';

const InvoicesQueryList = React.createClass({
  propTypes: {
    setParams: PropTypes.func,
    location: PropTypes.any,
  },
  getInitialState() {
    return {
      merchantData: [],
    };
  },
  componentDidMount() {
    this.getMerchantInfo();
  },
  onSearch(params) {
    this.props.setParams(params);
    this.setState({
      params,
    });
  },
  getMerchantInfo() {
    ajax({
      url: appendOwnerUrlIfDev('/sale/rebate/getMerchantInfo.json'),
      method: 'post',
      data: {},
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          const merchantData = result.data;
          this.setState({
            merchantData,
          });
        }
      },
    });
  },

  render() {
    const option = {
      pid: this.props.pid,
      billNo: this.props.billNo,
    };
    const merchantData = this.state.merchantData;
    return (
      <div>
        {merchantData.length > 0 && <InvoicesQueryForm {...option} merchantData={merchantData} onSearch={this.onSearch}/>}
        {merchantData.length === 0 && <InvoicesQueryForm {...option} merchantData={merchantData} onSearch={this.onSearch}/>}
        <InvoicesQueryTable merchantData={this.state.merchantData} params={this.state.params}/>
      </div>
    );
  },
});

export default InvoicesQueryList;
