import {Tag} from 'antd';
import React, {PropTypes} from 'react';
import { fetchShopTagMap } from '../common/fetchShopTag';

const ShowTag = React.createClass({
  propTypes: {
    shopSaleLabels: PropTypes.any,
    shopActivityLabels: PropTypes.any,
    pureTextMode: PropTypes.bool,
  },

  getInitialState() {
    return {
      shopTags: {},
    };
  },

  componentDidMount() {
    fetchShopTagMap().then(shopTags => {
      this.setState({ shopTags });
    });
  },

  showTag(shopSaleLabels) {
    const { shopTags } = this.state;
    const tags = [];
    if (shopSaleLabels && shopSaleLabels.length > 0) {
      for (let i = 0; i < shopSaleLabels.length; i++) {
        if (shopTags[shopSaleLabels[i]]) {
          tags.push(<Tag color="red" key={i}>
            {shopTags[shopSaleLabels[i]]}
          </Tag>);
        }
      }
    }
    return tags;
  },
  render() {
    const { shopTags } = this.state;
    if (this.props.pureTextMode) {
      return (<span>
        {this.props.shopSaleLabels && this.props.shopSaleLabels.map(label => shopTags[label]).filter(v => v).join('、')}
      </span>);
    }
    return <div>{this.showTag(this.props.shopSaleLabels)}</div>;
  },
});

export default ShowTag;
