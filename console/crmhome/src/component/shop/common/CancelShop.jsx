import React from 'react';
import {Modal, message} from 'antd';
import ajax from '../../../common/ajax';
import moment from 'moment';

export function cancelShop(id, type, callback) {
  Modal.confirm({
    title: '当前门店正在审核中，需撤回后再发起修改。',
    content: '',
    okText: '撤销审核',
    onOk() {
      const params = {};
      params.id = id;
      params.type = type;
      ajax({
        url: '/shop/crm/cancelSingleShop.json',
        method: 'post',
        data: params,
        type: 'json',
        success: (result) => {
          if (result && result.status === 'succeed') {
            if (callback) {
              callback();
            }
            message.success('撤销成功，可重新修改了');
            location.reload();
          } else {
            message.error(result.resultMsg);
          }
        },
      });
    },
    onCancel() {},
  });
}

export function checkIsCancelShop(id, type, callback, cancelCallback) {
  this.setState({
    loading: true,
  });
  const params = {};
  params.id = id;
  params.type = type;
  ajax({
    url: '/shop/crm/shopCanCancelQuery.json',
    method: 'get',
    data: params,
    type: 'json',
    success: (result) => {
      this.setState({
        loading: false,
      });
      if (result && result.status === 'succeed') {
        if (result.data && result.data.needCancel) {
          const date = moment(result.data.createTime).format('YYYY-MM-DD HH:mm');
          const content = (<div>
            <p>{date} [修改审核中]</p>
            <p>修改操作人：{result.data.operatorName} {!result.data.cancelEnable ? '(非您本人，如需继续修改当前的门店，请联系此人)' : null}</p>
          </div>);
          Modal.confirm({
            title: '当前门店正在审核中，需撤回后再发起修改。',
            content: content,
            okText: '撤销审核',
            width: 500,
            onOk() {
              if (result.data.cancelEnable) {
                cancelShop(result.data.orderId, type, cancelCallback);
              } else {
                message.warning('非您本人，如需继续修改当前的门店，请联系此人。');
              }
            },
            onCancel() {},
          });
        } else {
          callback(id);
        }
      } else {
        message.error(result.resultMsg || '未知错误');
      }
    },
    error: (result) => {
      this.setState({
        loading: false,
      });
      message.error(result.resultMsg || '未知错误');
    },
  });
}
