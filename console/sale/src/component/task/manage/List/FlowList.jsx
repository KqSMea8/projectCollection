import React from 'react';
import Search from './Search';
import FlowListTable from './FlowListTable';
import ListUtil from './ListUtil';

class FlowList extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  handleSearch = (data) => {
    this.setState({
      search: ListUtil.processFormData(data),
    });
  };
  render() {
    const { search } = this.state;
    return (
      <div>
        <Search {...this.props} onSearch={this.handleSearch} />
        <FlowListTable search={search} {...this.props} />
      </div>
    );
  }
}

export default FlowList;
