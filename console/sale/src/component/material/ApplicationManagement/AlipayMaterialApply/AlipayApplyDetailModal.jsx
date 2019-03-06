import React, { PropTypes } from 'react';
import { Modal, Table } from 'antd';
import { History } from 'react-router';
// import ajax from 'Utility/ajax';
// import { appendOwnerUrlIfDev } from '../../../../common/utils';
import { format, formatTime } from '../../../../common/dateUtils';

// const FormItem = Form.Item;

const AlipayApplyDetailModal = React.createClass({
  propTypes: {
    params: PropTypes.object,
    onReturn: PropTypes.func,
    refresh: PropTypes.func,
    form: PropTypes.object,
    // modalType: PropTypes.string,
    orderId: PropTypes.string,
    visible: PropTypes.bool,
    purchaseList: PropTypes.array,
    bizSourceData: PropTypes.string,
  },

  mixins: [History],

  // 发货明细
  getInitialState() {
    // 供业务来源为转账码的使用
    this.columns = [{
      title: '发货数量',
      dataIndex: 'purchaseQuantity',
      width: 100,
    }, {
      title: '发货时间',
      dataIndex: 'gmtCreate',
      width: 120,
      render(text, record) {
        if (!text) {
          return '';
        }
        const processDate = format(new Date(record.gmtCreate));
        const gmtCreate = formatTime(new Date(record.gmtCreate));
        return [processDate, <br />, gmtCreate];
      },
    }, {
      title: '物流公司/物流单号',
      dataIndex: 'expressCompany',
      width: 200,
      render(text, record) {
        if (!record) {
          return '';
        }
        return [record.expressCompany || '', <br/>, record.expressNo || ''];
      },
    }, {
      title: '供应商名称',
      dataIndex: 'supplier',
      width: 200,
    }, {
      title: 'PO单号',
      dataIndex: 'poNo',
      width: 200,
    }, {
      title: '操作人',
      dataIndex: 'operatorName',
      width: 100,
    }];
    // 供业务来源为Isv的使用
    this.isvColomn = [{
      title: '发货数量',
      dataIndex: 'purchaseQuantity',
      width: 100,
    }, {
      title: '发货时间',
      dataIndex: 'gmtCreate',
      width: 120,
      render(text, record) {
        if (!text) {
          return '';
        }
        const processDate = format(new Date(record.gmtCreate));
        const gmtCreate = formatTime(new Date(record.gmtCreate));
        return [processDate, <br />, gmtCreate];
      },
    }, {
      title: '物流公司/物流单号',
      dataIndex: 'expressCompany',
      width: 200,
      render(text, record) {
        if (!record) {
          return '';
        }
        return [record.expressCompany || '', <br/>, record.expressNo || ''];
      },
    }, {
      title: '操作人',
      dataIndex: 'operatorName',
      width: 100,
    }];
    return {};
  },
  onCancel() {
    this.props.onReturn();
  },
  // 驳回
  // getRejectModal() {
  //   // 判断条件
  //   const { getFieldProps } = this.props.form;
  //   const title = '驳回';
  //   const content = (
  //     <div>
  //       <Form horizontal form={this.props.form}>
  //         <FormItem
  //           label="备注："
  //           required
  //           labelCol={{ span: 3 }}
  //           wrapperCol={{ span: 19 }}
  //         >
  //           <Input
  //             type="textarea"
  //             placeholder="驳回申请单请填写备注"
  //             rows={6}
  //             {...getFieldProps('rejectReason', { initialValue: '', rules: [{ required: true, message: '请填写驳回备注' }, {
  //               max: 200, message: '不能超过200字',
  //             }] })}
  //           />
  //         </FormItem>
  //       </Form>
  //     </div>
  //   );
  //   const footer = [
  //     <Button key="back" type="ghost" onClick={this.onCancel}>取消</Button>,
  //     <Button key="submit" type="primary" onClick={this.submitRejectRemarks}>确定</Button>,
  //   ];
  //   return { title, content, footer };
  // },
  getConsignmentModal() {
    const title = '发货明细';
    const bizSourceData = this.props.bizSourceData;
    const content = (
      <div>
        <Table
          rowKey={record => record.gmtOrder}
          columns={bizSourceData === 'TRANSFER_CODE' ? this.columns : this.isvColomn}
          dataSource={this.props.purchaseList}
          pagination={false}
          bordered
        />
      </div>
    );
    const footer = null;

    return { title, content, footer };
  },
  // submitRejectRemarks() {
  //   const self = this;
  //   this.props.form.validateFields((error, value) => {
  //     if (error) {
  //       return;
  //     }
  //     if (value.rejectReason && value.rejectReason !== '') {
  //       const params = {
  //         mappingValue: 'kbasset.rejectStuffOrder',
  //         orderId: this.props.orderId,
  //         reason: value.rejectReason,
  //       };
  //       ajax({
  //         url: appendOwnerUrlIfDev('/proxy.json'),
  //         method: 'get',
  //         data: params,
  //         type: 'json',
  //         success: (result) => {
  //           if (result.status === 'succeed') {
  //             message.success('驳回成功', 2);
  //             self.props.refresh();
  //           } else if (result.status === 'failed') {
  //             if (result.resultMsg) {
  //               message.error(result.resultMsg, 2);
  //             }
  //           }
  //         },
  //         error: () => {
  //           message.error('系统异常,请刷新页面或稍后重试', 3);
  //         },
  //       });
  //     }
  //   });
  // },
  render() {
    let title = '';
    let footer = null;
    let content = '';

    // if (this.props.modalType === 'reject') {
    //   ({ title, content, footer } = this.getRejectModal()); // 驳回Modal的title, content, footer
    // } else {
    ({ title, content, footer } = this.getConsignmentModal()); // 发货记录Modal的title, content, footer
    // }
    return (
      <div>
        {this.props.visible ?
          <Modal title={title} width={830} visible={this.props.visible} footer={footer} onCancel={this.onCancel}>
            {content}
          </Modal> : null
        }
      </div>
    );
  },
});

export default AlipayApplyDetailModal;
