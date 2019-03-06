import React from 'react';
import ToConfirmListForm from './ToConfirmListForm';
import ToConfirmListTable from './ToConfirmListTable';

const ToConfirmList = React.createClass({
  getInitialState() {
    return {};
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },

  render() {
    return (
      <div>
        <ToConfirmListForm onSearch={this.onSearch}/>
        <ToConfirmListTable params={this.state.params}/>
      </div>
    );
  },
});

export default ToConfirmList;
