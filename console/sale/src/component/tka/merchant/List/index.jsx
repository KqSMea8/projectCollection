import React from 'react';
import {Page} from '@alipay/kb-framework-components/lib/layout';
import SearchForm from './SearchForm';
import ListTable from './ListTable';

class List extends React.Component {
  state = {
    search: {
      isSelf: '0'
    }
  };
  handleSearch = (search) => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;
    return (
      <Page title="商户管理">
        <SearchForm onSearch={this.handleSearch}/>
        <ListTable search={search} history={this.props.history}/>
      </Page>
    );
  }
}

export default List;
