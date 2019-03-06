import React from 'react';
import getLoginUser from '@alipay/kb-framework/framework/getLoginUser';

import {TaskType} from '../../common/enum';
import Search from './Search/Search';
import FlowListTable from './FlowListTable';

class FlowList extends React.Component {
  constructor() {
    super();
    const loginUser = getLoginUser();
    this.initialSearch = {
      executor: {
        user: {
          ...loginUser,
          loginName: loginUser.operatorName,
          mobile: loginUser.mobileNumber,
          channel: loginUser.userChannel,
        },
        onlySelf: true,
      }
    };
    this.state = {
      search: { ...this.initialSearch }
    };
  }

  initialSearch = null;
  handleSearch = (search) => {
    this.setState({search});
  };

  render() {
    const {search} = this.state;
    return (
      <div>
        <Search initialData={this.initialSearch} {...this.props} type={TaskType.FLOW} onSearch={this.handleSearch}/>
        <FlowListTable search={search} {...this.props} />
      </div>
    );
  }
}

export default FlowList;
