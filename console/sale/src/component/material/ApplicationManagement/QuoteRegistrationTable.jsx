import React, { PropTypes } from 'react';
import { Form, Button, InputNumber, message, Input, Modal } from 'antd';
import Table from '../../../common/Table';
import ajax from 'Utility/ajax';

const stuffTypeMap = {
  'ACTIVITY': '活动物料',
  'BASIC': '基础物料',
  'ACTUAL': '实物物料',
  'OTHER': '其他物料',
};
const storageTypeMap = {
  'CITY': '城市',
  'KA': 'KA',
  'YUNZONG': '云纵',
};
const FormItem = Form.Item;
const QuoteApprovalContentTable = React.createClass({

  propTypes: {
    id: PropTypes.any,
    form: PropTypes.object,
  },

  getInitialState() {
    this.columns = [
      {
        title: '模版ID/名称', width: 180, dataIndex: 'templateId', key: 'templateId',
        render: (_, r) => {
          return (<a href={'#/material/templatemanage/tempinfo/' + r.templateId} target="_blank">{r.templateId}/{r.templateName}</a>);
        },
      },
      {
        title: '物料属性', width: 180, dataIndex: 'stuffType', key: 'stuffType',
        render: (t) => {
          return (<span>{stuffTypeMap[t]}</span>);
        }
      },
      { title: '物料类型', width: 180, dataIndex: 'stuffAttrName', key: 'stuffAttrName' },
      { title: '规格尺寸', width: 180, dataIndex: 'sizeName', key: 'sizeName' },
      { title: '物料材质', width: 180, dataIndex: 'materialName', key: 'materialName' },
      { title: '申请数量', width: 180, dataIndex: 'applyQuantity', key: 'applyQuantity' },
      {
        title: '报价参考数量', width: 180, dataIndex: 'quoteRefQuantity', key: 'quoteRefQuantity',
        render: (_, r) => {
          return (r.quoteRefQuantity);
        },
      },
      {
        title: '物料报价(单价)', width: 180, key: 'unitPrice', dataIndex: 'unitPrice',
        render: (_, r, i) => {
          const { getFieldProps} = this.props.form;
          return (
            <FormItem style={{ marginBottom: 0 }}>
              <InputNumber {...getFieldProps('quote' + i, { rules: [{ required: true, message: '物料报价必填', type: 'number' }] }) } step={0.001} placeholder="请输入数字" />
            </FormItem>
          );
        },
      }];
    this.approvalInfo = {};
    return {
      loading: true,
      data: [],
      quoteRefQuantity: 0,
      purchaser: [],
      itemDtoList: [],
      reject: '',
    };
  },

  componentDidMount() {
    this.fetchData();
  },

  getApplyAmount() {
    const dataList = { ...this.state.data };
    const datas = {
      storageType: dataList.storageType,
      storageCode: dataList.storageCode,
    };
    ajax({
      url: '/sale/asset/cityMonthAmount.json',
      method: 'get',
      data: datas,
      type: 'json',
      success: (res) => {
        this.setState({
          monthAmount: res.data,
        });
      },
    });
  },

  // needOneApproval(rule, value, callback) {
  //   const {getFieldValue} = this.props.form;
  //   if (!Object.keys(this.approvalInfo).find(item => { return !!getFieldValue(item); })) {
  //     callback(new Error('请至少填一项'));
  //     return;
  //   }
  //   callback();
  // },

  sumApproval() {
    const {getFieldValue} = this.props.form;
    const self = this;
    return Object.keys(this.approvalInfo).reduce((memo, item) => {
      return memo + Number(getFieldValue(item) || 0) * Number(self.approvalInfo[item]);
    }, 0).toFixed(3, 10);
  },

  handleReject() {
    const self = this;
    this.setState({
      reject: 'show',
    });
    Modal.confirm({
      title: '确定驳回该报价申请吗？',
      content: '驳回该报价申请',
      onOk() {
        self.props.form.submit(() => {
          self.props.form.validateFields(['reject'], (error) => {
            if (!!error) {
              return;
            }
            const rejectList = {};
            rejectList.orderId = self.props.id;
            rejectList.quotePriceMemo = self.props.form.getFieldValue('reject');
            rejectList.quotePriceStuffOrderItem = '';
            rejectList.action = 'REJECT';
            ajax({
              url: '/sale/asset/stuffApplyOrderQuotePrice.json',
              method: 'get',
              data: rejectList,
              type: 'json',
              success: (result) => {
                if (result.status === 'succeed') {
                  setTimeout(() => {
                    window.location.hash = '/material/applicationManagement/applicationRecord/koubei';
                  }, 3000);
                }
              },
              error: (result) => {
                if (result.status === 'failed') {
                  message.error(result.resultMsg);
                }
              },
            });
          });
        });
      },
      onCancel() {
      },
    });
  },

  transformFormData(values) {
    const formData = { ...values };
    return formData;
  },

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      reject: '',
    });
    this.props.form.submit(() => {
      this.props.form.validateFieldsAndScroll((error) => {
        if (!!error) {
          // console.log('Errors in form!!!');
          return;
        }
        const info = this.state.data.itemDtoList;
        const priceInfo = {};
        const priceList = Object.keys(info).map((item, index) => {
          const infoObj = {};
          infoObj.itemId = info[item].itemId;
          infoObj.unitPrice = this.props.form.getFieldValue('quote' + index);
          priceInfo.orderId = info[item].orderId;
          return infoObj;
        });
        priceInfo.quotePriceMemo = this.props.form.getFieldValue('reject');
        priceInfo.quotePriceStuffOrderItem = JSON.stringify(priceList);
        priceInfo.action = 'PASS';
        ajax({
          url: '/sale/asset/stuffApplyOrderQuotePrice.json',
          method: 'get',
          data: priceInfo,
          type: 'json',
          success: (result) => {
            if (result.status === 'succeed') {
              message.success('提交成功', 3);
              setTimeout(() => {
                window.location.hash = '/material/applicationManagement/applicationRecord/koubei';
              }, 3000);
            }
          },
          error: (result) => {
            if (result.status === 'failed') {
              message.error(result.resultMsg);
            }
          },
        });
      });
    });
  },

  fetchData() {
    const params = {
      orderId: this.props.id,
    };

    ajax({
      url: '/sale/asset/stuffApplyOrderDetail.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        const {stuffApplyOrderVO} = res;
        const {itemDtoList} = stuffApplyOrderVO;
        const approval = {};
        itemDtoList.map((item, index) => {
          approval['quote' + index] = item.applyQuantity;
          ajax({
            url: '/sale/asset/referenceQuotePrice.json',
            method: 'get',
            data: {
              templateId: item.templateId,
              purchaserId: stuffApplyOrderVO.purchaserId,
            },
            type: 'json',
            success: (result) => {
              itemDtoList[index].quoteRefQuantity = result.data;
              this.setState({
                data: Object.assign({}, this.state.data, { itemDtoList: [].concat(itemDtoList) }),
              });
            },
          });
        });
        this.approvalInfo = { ...approval };
        this.setState({
          loading: false,
          data: stuffApplyOrderVO,
        });
        this.getApplyAmount();
      },
    });
  },

  render() {
    const {getFieldProps} = this.props.form;
    const sum = this.sumApproval();
    const {loading} = this.state;
    const {itemDtoList, orderId, storageName, bizTypeDesc, remark, storageType} = this.state.data;
    const monthAmount = { ...this.state.monthAmount };
    return (<div>
      <div className="approval-content app-detail-content-padding" style={{ paddingBottom: 10, paddingTop: 10 }}>
        <table >
          <tbody>
            <tr>
              <td>申请单号</td>
              <td><a href={'#/material/applicationManagement/applyDetail/' + orderId} target="_blank">{orderId}</a></td>
              <td>本单申请金额</td>
              <td><div>{sum}元</div></td>
            </tr>
            <tr>
              <td>申请城市</td>
              <td>{storageName}</td>
              <td>当前城市本月已审批金额</td>
              <td><div>{monthAmount.amount}元</div></td>
            </tr>
            <tr>
              <td>仓库类型</td>
              <td>{storageTypeMap[storageType]}</td>
              <td>业务类型</td>
              <td>{bizTypeDesc}</td>
            </tr>
            <tr>
              <td>申请备注</td>
              <td colSpan="3">{remark}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Form horizontal>
        <div className="app-detail-content-padding" style={{ paddingTop: 0 }}>
          <Table columns={this.columns}
            rowKey={r => r.itemId}
            dataSource={itemDtoList}
            pagination={false}
            loading={loading}
            className="approval-content-table"
            bordered
          />
          <div className="approval-content-table-footer">总价：<span>{sum}</span>元</div>
        </div>
      </Form>
      <Form>
        <FormItem labelCol={{ span: 2 }}
          wrapperCol={{ span: 21 }}
          label="报价批注:"
          className="rejectForm"
          style={{ backgroundColor: '#f4f4f4', padding: '20px 10px 90px', marginTop: 40, marginBottom: 0 }}>
          <Input type="textarea" {...getFieldProps('reject', {
            rules: [{ required: this.state.reject === 'show' ? true : false, message: '请填写驳回信息' }, {
              max: 200, message: '不能超过200字',
            }]
          }) } placeholder="驳回时，请填写报价批注" rows="3" style={{ marginBottom: 0, marginLeft: 10 }} />
        </FormItem>
      </Form>
      <div style={{ padding: '20px 0px 20px 3%', backgroundColor: '#f4f4f4' }}>
        <Button type="primary" size="large" style={{ marginRight: 10, marginLeft: 70 }} onClick={this.handleSubmit}>确认</Button>
        <Button size="large" onClick={this.handleReject}>撤回</Button>
      </div>
    </div>);
  },
});
export default Form.create()(QuoteApprovalContentTable);
