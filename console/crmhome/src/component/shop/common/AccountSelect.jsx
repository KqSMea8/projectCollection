import React, { PropTypes } from 'react';
import { Select } from 'antd';
import ajax from '../../../common/ajax';

const AccountSelect = React.createClass({
  propTypes: {
    placeholder: PropTypes.string,
  },

  getDefaultProps() {
    return {
      placeholder: '请选择账户',
    };
  },

  getInitialState() {
    return {
      accounts: null,
    };
  },

  componentWillMount() {
    ajax({
      url: '/shop/crm/payeeSelect.json',
      method: 'get',
    }).then((response) => {
      this.setState({
        accounts: response.receiveAccountNos,
      });
    });
  },

  render() {
    const accounts = this.state.accounts || [];
    const options = accounts.map((acc) => {
      return <Select.Option value={acc.userId} key={acc.userId}>{acc.logonId}</Select.Option>;
    });
    return (<Select {...this.props} placeholder={this.props.placeholder} disabled={!this.state.accounts}>
      {options}
    </Select>);
  },
});

export default AccountSelect;
