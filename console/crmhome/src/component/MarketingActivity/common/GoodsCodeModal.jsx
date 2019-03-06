import React, {PropTypes} from 'react';
import {Modal} from 'antd';
import {array2StringJoinByComma} from '../../../common/utils';


const GoodsCodeModal = React.createClass({

  propTypes: {
    goodsCodeList: PropTypes.array,
    onCancel: PropTypes.func,
  },

  getInitialState() {
    return {};
  },

  render() {
    return (<Modal visible title="商品编码" onCancel={this.props.onCancel} footer="" width={420} bodyStyle={{height: 250, overflow: 'auto'}}>
      {array2StringJoinByComma(this.props.goodsCodeList, 2)}
    </Modal>);
  },
});

export default GoodsCodeModal;
