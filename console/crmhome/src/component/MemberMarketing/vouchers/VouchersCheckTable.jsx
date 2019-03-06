import React, { PropTypes } from 'react';
import { Table, Button, Breadcrumb, Form, Select, message } from 'antd';
import ShopChoose from './ShopChoose';
import ajax from '../../../common/ajax';

const FormItem = Form.Item;
const Option = Select.Option;

class VouchersCheckTable extends React.Component {
  static propTypes = {
    params: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.columns = [{
      title: '券码',
      dataIndex: 'conponId',
    }, {
      title: '券名称',
      dataIndex: 'coponName',
    }, {
      title: '顾客信息',
      dataIndex: 'ownerInfo',
    }, {
      title: '验券时间',
      dataIndex: 'verifyTime',
    }, {
      title: '验券人（操作员)',
      dataIndex: 'operatorInfo',
    }];
  }

  state = {
    shopId: 0,
    operatorId: 0,
    operators: [],
    data: [],
    tableLoading: false,
    pagination: {
      showSizeChangeer: true,
      showQuickJumper: true,
      showTotal: (total) => `共${total}个记录`,
      current: 1,
      pageSize: 10,
      total: 0,
    },
  };

  componentDidMount() {
    this.getVoucherList();
  }

  getVoucherList = (params = {}) => {
    if (!this.state.tableLoading) {
      this.setState({ tableLoading: true });
      const { pagination } = this.state;
      const { current, pageSize } = pagination;
      const { operatorId, shopId } = params;
      const data = { pageSize, pageIndex: current };
      if (operatorId) {
        data.operatorId = operatorId;
      }
      if (shopId) {
        data.shopId = shopId;
      }
      ajax({
        url: '/promo/conponsVerify/verifyRecordsQuery.json',
        data,
        success: (res) => {
          const { totalSize, currentPage } = res.page;
          this.setState({
            shopId,
            operatorId,
            data: res.data,
            tableLoading: false,
            pagination: { ...pagination, current: currentPage || 1, total: totalSize },
          });
        },
        error: (e) => {
          const info = e.error || e.reultMessage || '系统繁忙，请重试';
          message.error(info);
          this.setState({
            shopId,
            operatorId,
            tableLoading: false,
          });
        },
      });
    }
  }

  getOperates = shopId => {
    ajax({
      url: '/promo/conponsVerify/operatorsQuery.json',
      data: {
        shopId,
      },
      success: (res) => {
        if (res.data) {
          const operators = Object.keys(res.data).map(id => { return { id, info: res.data[id] }; });
          this.setState({
            operators: [{ id: 0, info: '全部' }, ...operators],
          });
        }
      },
    });
  }

  handleChange = pagination => {
    const { pagination: statePagination, shopId, operatorId } = this.state;
    this.setState({
      pagination: { ...statePagination, ...pagination },
    }, () => {
      this.getVoucherList({ shopId, operatorId });
    });
  }

  resetPageSize = () => {
    const { pagination } = this.state;
    this.setState({ pagination: { ...pagination, current: 1 } });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values = {}) => {
      if (!err) {
        const { pagination } = this.state;
        this.setState({ pagination: { ...pagination, current: 1 } }, () => {
          this.getVoucherList({ shopId: values.checkShop && values.checkShop.shopId ? values.checkShop.shopId : null, operatorId: values.operatorId });
        });
      }
    });
  }

  render() {
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    const { operators, data, tableLoading, pagination } = this.state;
    return (
      <div className="vourcher-record-panel">
        <div className="app-detail-header">
          验券
        </div>
        <div className="app-detail-content-padding">
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="#/marketing/vouchers/cancel">验券</Breadcrumb.Item>
            <Breadcrumb.Item><span style={{ fontWeight: 400 }}>兑换券验券记录</span></Breadcrumb.Item>
          </Breadcrumb>
          <Form inline onSubmit={this.handleSubmit}>
            <FormItem label="请选择门店" style={{ minWidth: 350, width: 475 }} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
              <ShopChoose {...getFieldProps('checkShop', {
                onChange: (value) => {
                  if (value.shopId) {
                    this.getOperates(value.shopId);
                  }
                  this.resetPageSize();
                  setFieldsValue({ 'operatorId': [] });
                  return value;
                },
              }) } />
            </FormItem>
            <FormItem label="操作员">
              <Select className="voucers-cancel-select" placeholder="请选择操作员" style={{ width: '300px' }} disabled={!(getFieldValue('checkShop') && getFieldValue('checkShop').shopId)} {...getFieldProps('operatorId', {
                rules: { type: 'array' },
                onChange: () => { this.resetPageSize(); },
              }) }>
                {operators.map((operator, i) => {
                  return <Option value={operator.id} key={`${operator.id}${i}`}>{operator.info}</Option>;
                })}
              </Select>
            </FormItem>
            <Button loading={tableLoading} type="primary" htmlType="submit">搜索</Button>
          </Form>
          <Table rowKey={(_, i) => `${_.conponId}${i}`} columns={this.columns} dataSource={data} loading={tableLoading} onChange={(tablePagination) => { this.handleChange(tablePagination); }} pagination={pagination} />
        </div>
      </div>
    );
  }
}

export default Form.create()(VouchersCheckTable);
