import React, { PureComponent } from 'react';
import { object, array, func, bool } from 'prop-types';
import { Table, Input, Modal, Form } from 'antd';

import { orderStatus } from '../constants';

const FormItem = Form.Item;

export default class WaitConsumeTable extends PureComponent {
  static propTypes = {
    dispatch: func,
    onTableChange: func,
    refresh: func,
    loading: bool,
    list: array,
    page: object,
    form: object,
  }

  state = {
    showConsumeModal: false, // 是否显示Modal
    confirmLoading: false, // 是正在loading
    orderId: '', // 正在处理的orderId
  }

  getColumns() {
    const { getFieldProps } = this.props.form;
    return [{
      title: '订单号',
      width: 124,
      dataIndex: 'orderId',
      key: 'orderId',
    }, {
      title: '门店',
      width: 100,
      dataIndex: 'shopName',
      key: 'shopName',
    }, {
      title: '手机号',
      width: 90,
      dataIndex: 'telphone',
      key: 'telphone',
    }, {
      title: '预订信息',
      width: 180,
      dataIndex: 'reservedInfo',
      key: 'reservedInfo',
    }, {
      title: '价格（元）',
      width: 80,
      dataIndex: 'price',
      key: 'price',
    }, {
      title: '房号/备注',
      width: 100,
      dataIndex: 'remark',
      key: 'remark',
      render: (_, row) => {
        const fieldName = `[${row.orderId}]_remark`;
        return (
          <FormItem className="mb0">
            <Input placeholder="请输入" {...getFieldProps(fieldName, {
              initialValue: '',
              validateFirst: true,
              rules: [{
                rrequired: true, whitespace: true, message: '请输入房号/备注',
              }, {
                validator(rule, val, callback) {
                  // eslint-disable-next-line no-control-regex
                  if (val.replace(/[^\x00-\xff]/g, 'xx').length > 100) {
                    callback('房号/备注不能超过50个字');
                    return;
                  }
                  callback();
                },
              }],
            })} />
          </FormItem>
        );
      },
    }, {
      title: '状态',
      width: 60,
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (text) => (orderStatus[text]),
    }, {
      title: '操作',
      width: 60,
      key: 'operation',
      render: (t, record) => (
        <a onClick={this.showModal(record.orderId)}>确认消费</a>
      ),
    }];
  }

  showModal = (orderId) => () => {
    const { form: { validateFieldsAndScroll } } = this.props;
    const fieldName = `[${orderId}]_remark`;
    validateFieldsAndScroll(['checkShop', fieldName], { force: true, scroll: { offsetTop: 100 } }, (err) => {
      if (!err) {
        this.setState({ showConsumeModal: true, orderId });
      }
    });
  }

  onCancel = () => {
    this.setState({ confirmLoading: false, showConsumeModal: false, orderId: '' });
  }

  handleOk = () => {
    const { form: { validateFieldsAndScroll, setFieldsValue }, dispatch, refresh } = this.props;
    const { orderId } = this.state;
    const fieldName = `[${orderId}]_remark`;
    validateFieldsAndScroll(['checkShop', fieldName, 'voucherCode'], { force: true, scroll: { offsetTop: 100 } }, (err, values) => {
      if (!err) {
        const { checkShop, [fieldName]: remark, voucherCode } = values;
        this.setState({ confirmLoading: true });
        dispatch({ type: 'consumeOrder', payload: {
          shopId: checkShop.shopId,
          orderId,
          remark,
          voucherCode,
        } }).then(() => {
          this.setState({ confirmLoading: false, showConsumeModal: false, orderId: '' });
          refresh();
          setFieldsValue({ [fieldName]: '', voucherCode: '' });
        }).catch(() => {
          this.setState({ confirmLoading: false });
        });
      }
    });
  }

  render() {
    const { list, loading, page: { currentPage, pageSize, totalCount },
      onTableChange, form } = this.props;
    const { showConsumeModal, confirmLoading } = this.state;
    const { getFieldProps } = form;
    const pagination = {
      current: currentPage,
      pageSize,
      total: totalCount,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    return (
      <div>
        <Table loading={loading} columns={this.getColumns()}
          onChange={onTableChange} pagination={pagination}
          locale={{ emptyText: '没有相应订单' }} dataSource={list} />
        <Modal title="确认核销"
          style={{ textAlign: 'center' }}
          visible={showConsumeModal}
          onCancel={this.onCancel}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}>
          <FormItem>
            <Input placeholder="请输入用户的券码" autosize={{ minRows: 5, maxRows: 6 }} type="textarea" {...getFieldProps('voucherCode', {
              initialValue: '',
              rules: [{
                required: true, whitespace: true, message: '请输入用户的券码',
              }, {
                pattern: /^[0-9]+$/, message: '券码只能输入数字',
              }],
            })} />
          </FormItem>
        </Modal>
      </div>
    );
  }
}
