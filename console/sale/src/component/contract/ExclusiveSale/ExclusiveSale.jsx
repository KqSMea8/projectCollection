import React, { PropTypes } from 'react';
import ajax from 'Utility/ajax';
import { Tabs, Table, Button, message, Form, Row, Col, Input, Icon, Dropdown, Menu, Modal } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import PayModal from './PayModal';
import ModifyModal from './ModifyModal';
import RepayModal from './RepayModal';
// import { logContrastActionList } from '../../../common/OperationLogMap';
import './ExclusiveSale.less';

const ExclusiveSale = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },
  getInitialState() {
    const columns = [
      {
        title: '商户名称',
        dataIndex: 'merchantName',
        width: '20%',
      },
      {
        title: '商户PID',
        dataIndex: 'partnerId',
        width: '15%',
      },
      {
        title: '订单号',
        dataIndex: 'orderNum',
        width: '15%',
      },
      {
        title: '销售方案名称',
        dataIndex: 'merSalesPlanName',
        width: '15%',
      },
      {
        title: '生效/失效时间',
        dataIndex: 'expiryDate',
        width: '15%',
        render(text, record) {
          let expiryDateTxt = '-';
          if (record.merOrderLinkGmtVaild) {
            expiryDateTxt = record.merOrderLinkGmtVaild + ' 至 ' + record.merOrderLinkGmtInvaild;
          } else if (record.merOrderLinkGmtVaildDue) {
            expiryDateTxt = record.merOrderLinkGmtVaildDue + '(预计) 至 ' + record.merOrderLinkGmtInvaildDue + '(预计)';
          }
          return expiryDateTxt;
        },
      },
      {
        title: '状态',
        dataIndex: 'merOrderLinkState',
        width: '5%',
      },
      {
        title: '操作',
        dataIndex: 'moreActions',
        width: '15%',
        render: (moreActions, record) => {
          let moreDom = null;
          const menuArr = [];
          if (record.errorMsg) {
            moreDom = (<a onClick={() => {
              Modal.confirm({
                title: '合同加载出错',
                content: record.errorMsg || '合同加载出错,请重试',
                onOk: () => {
                  // window.location.reload();
                  this.fetch();
                },
                onCancel: () => {},
                okText: '重新加载',
              });
            }}>更多</a>);
          } else {
            // logContrastActionList.forEach((row) => {
            if (moreActions.includes('PAY')) {
              menuArr.push(<Menu.Item><a onClick={this.openPAYModal.bind(this, record)}>打款</a></Menu.Item>);
            }
            if (moreActions.includes('MODIFY')) {
              menuArr.push(<Menu.Item><a onClick={this.openModifyModal.bind(this, record)}>调整</a></Menu.Item>);
            }
            if (moreActions.includes('REPAY')) {
              menuArr.push(<Menu.Item><a onClick={this.openRepayModal.bind(this, record)}>回款</a></Menu.Item>);
            }
            if (moreActions.includes('LOG')) {
              menuArr.push(<Menu.Item><a onClick={this.contractLog.bind(this, record)}>操作日志</a></Menu.Item>);
            }
            // });
            moreDom = (<span><Dropdown overlay={<Menu key={record.key + 'menu'}>{menuArr}</Menu>} trigger={['click']} key={record.key + 'dropdown'}>
              <a className="ant-dropdown-link">
                更多 <Icon type="down" />
              </a>
            </Dropdown>
            {this.state.showPayModal && this.state.selectedRecord.orderLinkId === record.orderLinkId ? <PayModal onOk={this.onPayOk} onCancel={this.onCancel} record={record}/> : null}
            {this.state.showModifyModal && this.state.selectedRecord.orderLinkId === record.orderLinkId ? <ModifyModal onOk={this.onModifyOk} onCancel={this.onCancel} record={record} /> : null}
            {this.state.showRepayModal && this.state.selectedRecord.orderLinkId === record.orderLinkId ? <RepayModal onOk={this.onRepayOk} onCancel={this.onCancel} record={record} /> : null}</span>);
          }

          return (<span>
            <a href={'https://salesmng.alipay.com/order/orderInfo.htm?orderNum=' + record.orderNum} target="_blank">查看</a>
            <span className="ant-divider" />
            {moreDom}
          </span>);
        },
      },
    ];

    return {
      columns,
      data: [],
      loading: false,
      showPayModal: false,
      showModifyModal: false,
      showRepayModal: false,
      selectedRecord: {},
    };
  },
  onSearch() {
    const { getFieldValue } = this.props.form;
    this.setState({
      merchantName: getFieldValue('merchantName'),
      partnerId: getFieldValue('partnerId'),
    }, () => {
      this.fetch();
    });
  },
  onCancel() {
    this.setState({
      showPayModal: false,
      showModifyModal: false,
      showRepayModal: false,
    });
  },
  onRepayOk(amount, record) {
    ajax({
      url: '/isale/contract/doEsRepay.json',
      method: 'post',
      data: {
        bizContractId: record.bizContractId,
        partnerId: record.partnerId,
        amount,
      },
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          message.success('操作成功');
        }
      },
    });
    this.setState({
      showPayModal: false,
      showModifyModal: false,
      showRepayModal: false,
    });
    this.fetch();
  },
  onPayOk(record) {
    ajax({
      url: '/isale/contract/doEsPay.json',
      method: 'post',
      data: {
        bizContractId: record.bizContractId,
        partnerId: record.partnerId,
      },
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          message.success('操作成功');
        }
      },
    });
    this.setState({
      showPayModal: false,
      showModifyModal: false,
      showRepayModal: false,
    });
    this.fetch();
  },
  onModifyOk(shopIds, record, fileObj) {
    const newShopIds = [];
    shopIds.forEach((el) => {
      newShopIds.push(el.shopId);
    });
    if (newShopIds.length > 0) {
      ajax({
        url: '/isale/contract/doModifyShop.json',
        method: 'post',
        data: {
          bizContractId: record.bizContractId,
          partnerId: record.partnerId,
          shopIds: newShopIds.join(','),
          fileUrl: fileObj.fileUrl,
          fileName: fileObj.fileName,
          remark: record.remark,
        },
        type: 'json',
        success: (result) => {
          if (result.status === 'succeed') {
            message.success('操作成功');
          }
          this.setState({
            showPayModal: false,
            showModifyModal: false,
            showRepayModal: false,
          }, () => {
            this.fetch();
          });
        },
      });
    } else {
      message.error('请至少选择一家门店');
    }
  },
  openPAYModal(record) {
    if (!this.state.showPayModal) {
      if (record.participateShopSize === 0) {
        this.openModifyModal(record);
      } else if (record.overThirtyDayFlag) {
        message.error('不允许打款');
      } else {
        this.setState({
          showPayModal: true,
          selectedRecord: record,
        });
      }
    }
  },
  openModifyModal(record) {
    if (!this.state.showModifyModal) {
      this.setState({
        showModifyModal: true,
        selectedRecord: record,
      });
    }
  },
  openRepayModal(record) {
    if (!this.state.showRepayModal) {
      this.setState(
        {
          showRepayModal: true,
          selectedRecord: record,
        }
      );
    }
  },
  contractLog(record) {
    window.location.hash = 'contractoperationlog?bizContractId=' + record.bizContractId + '&partnerId=' + record.partnerId;
  },
  fetch() {
    const params = {
      merchantName: this.state.merchantName,
      partnerId: this.state.partnerId,
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: '/isale/contract/contractList.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        result.data = result.data || {};
        const pagination = {...this.state.pagination};
        pagination.total = result.data.length;
        this.setState({
          data: result.data || [],
          pagination,
        });
      },
      complete: () => {
        this.setState({
          loading: false,
        });
      },
    });
  },
  render() {
    const { getFieldProps } = this.props.form;
    const operations = <a href="https://zarmng.alipay.com/order.htm#/merchant-search" target="_blank">新增合同</a>;
    const { data, columns, loading } = this.state;
    return (
      <div className="kb-tabs-main" style={{position: 'relative'}}>
        <Tabs
          defaultActiveKey="contract"
          tabBarExtraContent={operations}
        >
          <TabPane tab="包销合同" key="contract">
            <Form horizontal className="advanced-search-form">
              <Row type="flex" justify="center">
                <Col span="8">
                  <FormItem
                    label="商户名称："
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}>
                    <Input
                      {...getFieldProps('merchantName')}
                      placeholder="请输入商户名称"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem
                    label="商户PID："
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}>
                    <Input
                      {...getFieldProps('partnerId')}
                      placeholder="请输入商户PID"/>
                  </FormItem>
                </Col>
                <Col span="8" style={{direction: 'rtl', paddingRight: '20px'}}>
                  <Button type="primary" style={{marginRight: 12}} onClick={this.onSearch}>搜索</Button>
                </Col>
              </Row>
            </Form>
            <div style={{padding: 16}}>
              <Table
                dataSource={data}
                columns={columns}
                pagination={false}
                loading={loading}
                bordered
              />
            </div>
          </TabPane>
        </Tabs>
      </div>);
  },
});

export default Form.create()(ExclusiveSale);
