import React, {PropTypes} from 'react';
import {Modal} from 'antd';
import {array2StringJoinByComma} from '../../../common/utils';


const ExternalSingleProductListModal = React.createClass({

  propTypes: {
    singleProductList: PropTypes.array,
    onCancel: PropTypes.func,
  },

  getInitialState() {
    return {};
  },

  render() {
    return (<Modal visible title="外部单品列表" onCancel={this.props.onCancel} footer="" width={528} bodyStyle={{height: 300, overflow: 'auto'}}>
      {array2StringJoinByComma(this.props.singleProductList, 6)}
    </Modal>);
  },
});

export default ExternalSingleProductListModal;
