import React from 'react';
import Search from './Search';
import SingleListTable from './SingleListTable';
import ListUtil from './ListUtil';

class SingleList extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  handleSearch = (data) => {
    this.setState({
      search: ListUtil.processFormData(data)
    });
  };
  render() {
    const { search } = this.state;
    return (
      <div>
        <Search {...this.props} onSearch={this.handleSearch} />
        <SingleListTable search={search} {...this.props} />
      </div>
    );
  }
}

export default SingleList;

