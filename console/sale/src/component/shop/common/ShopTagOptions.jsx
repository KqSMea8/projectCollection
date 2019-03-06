import {Select} from 'antd';
import React from 'react';
import { fetchShopTagGroupList } from '../common/fetchShopTag';

const Option = Select.Option;
const OptGroup = Select.OptGroup;

const ShopTagSelect = React.createClass({
  getInitialState() {
    return {
      shopGroupTags: [],
    };
  },

  componentDidMount() {
    fetchShopTagGroupList().then(shopGroupTags => {
      this.setState({ shopGroupTags });
    });
  },

  render() {
    const { shopGroupTags } = this.state;
    return (<Select {...this.props}>
      {shopGroupTags.map((group, index) => (
        <OptGroup label={group.groupName} key={index}>
          {group.labelList.map((item, i) => <Option key={i} value={item.labelCode}>{item.labelName}</Option>)}
        </OptGroup>
      ))}
    </Select>);
  },
});

export default ShopTagSelect;
