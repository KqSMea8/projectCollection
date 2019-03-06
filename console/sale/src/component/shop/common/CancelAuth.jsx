import React, {PropTypes} from 'react';
import {Button, Modal, message} from 'antd';
import ajax from 'Utility/ajax';
import {remoteLog} from '../../../common/utils';

const CancelAuth = React.createClass({
  propTypes: {
    selectedRows: PropTypes.array,
    type: PropTypes.string,
    buttonText: PropTypes.string,
    onEnd: PropTypes.func,
    multiple: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      type: 'button', // button or text
      buttonText: '停止授权',
    };
  },

  onClick(e) {
    e.preventDefault();
    remoteLog('SHOP_AUTH_CANCEL');
    Modal.confirm({
      title: '二次确认',
      content: '确定停止授权吗？',
      onOk: this.postData,
    });
  },

  postData() {
    const {selectedRows} = this.props;
    let params;
    if (this.props.multiple) {
      params = selectedRows.map((row) => {
        row.children = row.children || [];
        return {
          shopId: row.shopId,
          operators: row.children.concat(row).map((r) => {
            return {
              id: r.staffId,
              authTypes: r.authTypes,
            };
          }),
        };
      });
    } else {
      params = selectedRows.map((row) => {
        return {
          shopId: row.shopId,
          operators: [{
            id: row.staffId,
            authTypes: row.authTypes,
          }],
        };
      });
    }
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/batchCancelAuthorization.json',
      method: 'post',
      data: {
        param: JSON.stringify(params),
      },
      success: (result)=> {
        if (result.status === 'failed') {
          message.error(result.resultMsg || '操作失败，请重试');
          return;
        }
        message.success('解绑成功');
        this.closeModal();
        this.props.onEnd();
      },
    });
  },

  closeModal() {
    this.setState({
      showModal: false,
    });
  },

  render() {
    const {selectedRows, type, buttonText} = this.props;
    return (<div style={{display: 'inline-block', marginRight: 12}}>
      {type === 'button' && <Button type="primary" onClick={this.onClick} disabled={selectedRows.length === 0}>{buttonText}</Button>}
      {type === 'text' && <a href="#" onClick={this.onClick}>{buttonText}</a>}
    </div>);
  },
});

export default CancelAuth;
