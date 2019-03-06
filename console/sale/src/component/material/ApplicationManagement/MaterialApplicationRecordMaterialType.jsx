import {Select} from 'antd';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import {appendOwnerUrlIfDev} from '../../../common/utils';
const Option = Select.Option;

const MaterialApplicationRecordMaterialType = React.createClass({
  propTypes: {
    applycationType: PropTypes.string,
  },
  getInitialState() {
    return {
      stuffAttrNameOptions: [],
    };
  },

  componentWillMount() {
    this.getStuffAttrId();
  },

  getStuffAttrId() {
    const params = {
      mappingValue: 'kbasset.queryStuffAttribute',
      domain: 'KOUBEI',
    };
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          const items = result.data;
          const options = [];
          for (let i = 0; i < items.length; i++) {
            options.push(<Option key={items[i].stuffAttrId} value={items[i].stuffAttrId}>{items[i].stuffAttrName}</Option>);
          }
          this.setState({
            stuffAttrNameOptions: options,
          });
        } else {
          if (result.resultMsg) {
            return;
          }
        }
      },
    });
  },

  render() {
    const {stuffAttrNameOptions} = this.state;
    return (<Select {...this.props}>
      <option key="ALL" value="">全部</option>
      {stuffAttrNameOptions}
    </Select>);
  },
});

export default MaterialApplicationRecordMaterialType;
