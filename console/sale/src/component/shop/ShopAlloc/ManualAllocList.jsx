import React from 'react';
import ManualAllocListForm from './ManualAllocListForm';
import ManualAllocListTable from './ManualAllocListTable';

const ManualAllocList = React.createClass({
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
        <ManualAllocListForm onSearch={this.onSearch}/>
        <ManualAllocListTable params={this.state.params}/>
      </div>
    );
  },
});

export default ManualAllocList;
