import React, {PropTypes} from 'react';
import BillsQueryTable from './BillsQueryTable';
import BillsQueryFrom from './BillsQueryForm';
import ajax from 'Utility/ajax';
import {appendOwnerUrlIfDev} from '../../../common/utils';

const BillQueryList = React.createClass({
  propTypes: {
    setParams: PropTypes.func,
  },
  getInitialState() {
    return {
      merchantData: [],
      params: this.props.params,
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
    const {merchantData} = this.state;
    return (
      <div>
        {merchantData.length >= 0 && <BillsQueryFrom onSearch={this.onSearch} merchantData={merchantData} params={this.props.params}/> }
        <BillsQueryTable merchantData={this.state.merchantData} params={this.state.params}/>
      </div>
    );
  },
});

export default BillQueryList;
