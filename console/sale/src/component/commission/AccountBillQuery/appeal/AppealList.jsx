import React, {PropTypes} from 'react';
import AppealTable from './AppealTable';
import AppealForm from './AppealForm';

const AppealList = React.createClass({
  propTypes: {
    setParams: PropTypes.func,
    location: PropTypes.any,
  },
  getInitialState() {
    return {
      merchantData: [],
    };
  },

  onSearch(params) {
    this.props.setParams(params);
    this.setState({
      params,
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
        <AppealForm {...option} merchantData={merchantData} onSearch={this.onSearch}/>
        <AppealTable merchantData={this.state.merchantData} params={this.state.params}/>
      </div>
    );
  },
});

export default AppealList;
