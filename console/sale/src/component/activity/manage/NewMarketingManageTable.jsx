import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import Table from '../../../common/Table';
import { Modal, Form, Input, message} from 'antd';

const activityTypeMap = {
  'CONSUME_SEND': '消费送礼',
  'GUESS_SEND': '口令送',
  'DIRECT_SEND': '精准发券',
  'REAL_TIME_SEND': '实时优惠',
  'BUY_ONE_SEND_ONE': '买一送一',
  'RANDOM_REDUCE': '随机立减',
  'BUY_ITEM_CUT': '商品立减',
  'BUY_ITEM_REDUCE_TO': '商品特价',
  'MULTI_STEP_CASH': '买单立减',
  'BRAND_CART_DISCOUNT': '商品购物车满减',
  'BUY_ITEM_VOUCHER_DEDUCT': '商品抵用券',
  'GROUP_PURCHASE': '商品拼团',
  'BK_ITEM_DEDUCT': '预订立减',
};
const FormItem = Form.Item;
const NewMarketingManageTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    form: PropTypes.object,
  },
  getInitialState() {
    const columns = [
      {
        title: '活动创建时间',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        render(t) {
          return (<span>{t && t.replace(/\//g, '-')}</span>);
        },
      },
      {
        title: '活动ID',
        dataIndex: 'campId',
        key: 'campId',
      },
      {
        title: '活动名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '活动类型',
        dataIndex: 'campType',
        key: 'campType',
        render: (t) => {
          return (<span>{activityTypeMap[t]}</span>);
        },
      },
      {
        title: '活动开始-活动结束',
        dataIndex: 'actTime',
        key: 'actTime',
        render(t, r) {
          return (
            <span>{r.beginTime && r.beginTime.replace(/\//g, '-')}{r.beginTime ? ' 至' : null}
            <br/>{r.endTime && r.endTime.replace(/\//g, '-')}
            </span>
            );
        },
      },
      {
        title: '商户名称',
        dataIndex: 'merchantName',
        key: 'merchantName',
      },
      {
        title: '当前状态',
        dataIndex: 'displayStatusName',
        key: 'displayStatusName',
      },
      {
        title: '创建来源',
        dataIndex: 'sourceChannelName',
        key: 'sourceChannelName',
        render: (t, r) => {
          return r.sourceChannelName ? t + (r.creatorName ? ('-' + r.creatorName) : '') : '';
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 100,
        render: (t, r) => {
          let sold = null;
          let type = r.campType;

          // 商品抵用券 隐藏所有操作
          if (type === 'BUY_ITEM_VOUCHER_DEDUCT') {
            return <span> -- </span>;
          }

          if (r.campStatusFlag === 'CAMP_NEW') {
            sold = <a onClick={this.showModal.bind(this, r.campId, r.campStatusFlag, r.merchantId)}>下架</a>;
          } else if (type === 'CONSUME_SEND' && r.campStatusFlag === 'CAMP_OLD') {
            type = 'CONSUME_SEND_OLD';
            sold = <a onClick={this.handleOldActivity.bind(this, r.campId, r.campStatusFlag, r.merchantId)}>下架</a>;
          }
          return (
            <span>
              <a href={`#/activity/activitydetail/${r.merchantId}/${r.campId }/${String(r.allowKbOffline)}/${type}/${r.campStatusFlag}/${r.fromSource}`} target="_blank">查看</a>

              {permission('SERVICEC_CAMPAIGN_OFFLINE') && r.allowKbOffline ? <span className="ant-divider"></span> : null}
              {permission('SERVICEC_CAMPAIGN_OFFLINE') && r.allowKbOffline ? sold : null}
            </span>
          );
        },
      },
    ];
    return {
      columns,
      data: [],
      loading: false,
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
      visible: false,
    };
  },
  componentDidMount() {
    // 如果有初始化参数，则自动加载列表
    if (this.props.params.merchantId) {
      this.initTable();
    }
  },
  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.initTable();
    }
  },
  onTableChange(pagination) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      pageNo: pagination.current,
    };
    this.fetch(params);
  },
  initTable() {
    this.onTableChange({
      current: 1,
      pageSize: this.state.pagination.pageSize,
    });
  },
  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNo: current,
    });
  },
  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: window.APP.crmhomeUrl + '/goods/koubei/promotionList.json',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        result.data = result.result || [];
        const pagination = {...this.state.pagination};
        pagination.total = result.PAGE_INFO.totalSize;
        this.setState({
          loading: false,
          data: result.data || [],
          pagination,
        });
      },
      error: err => {
        this.setState({
          loading: false,
          data: [],
        });
        message.error(err && err.resultMsg || '请检查网络连接', 3);
      },
    });
  },
  showModal(campId, campStatusFlag, merchantId, e) {
    e.preventDefault();
    this.setState({
      visible: true,
      campId: campId,
      campStatusFlag: campStatusFlag,
      merchantId: merchantId,
    });
  },
  handleOffline(campId, campStatusFlag, merchantId) {
    const params = {
      campId: campId,
      campStatus: campStatusFlag,
      merchantId: merchantId,
      memo: this.props.form.getFieldValue('reason'),
      sourcechannel: 'kbservcenter',
    };
    ajax({
      url: window.APP.crmhomeUrl + '/goods/koubei/promotionOffline.json',
      method: 'post',
      data: params || {},
      type: 'json',
      success: (result) => {
        if (result.status === 'failed') {
          message.error(result.resultMsg);
        } else {
          this.setState({
            visible: false,
          });
          message.success(result.resultMsg);
          this.refresh();
        }
      },
    });
  },
  handleOk() {
    this.props.form.validateFieldsAndScroll((errors) => {
      if (!errors) {
        const {campId, campStatusFlag, merchantId} = this.state;
        this.handleOffline(campId, campStatusFlag, merchantId);
      }
    });
  },
  handleOldActivity(campId, campStatusFlag, merchantId) {
    this.handleOffline(campId, campStatusFlag, merchantId);
  },
  handleCancel() {
    this.setState({
      visible: false,
    });
  },
  render() {
    const {pagination, columns, loading, data} = this.state;
    const {getFieldProps} = this.props.form;
    return (
      <div style={{padding: 16}}>
        <Table columns={columns}
          rowKey={r => r.campId}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={this.onTableChange}
          bordered/>
          <Modal title="下架" visible={this.state.visible}
            onOk={this.handleOk} onCancel={this.handleCancel}>
              <div style={{height: 150, paddingTop: 30}}>
                <Form horizontal>
                  <FormItem label="下架原因：" extra="限50字" labelCol={{span: 4}} wrapperCol={{span: 16}}>
                    <Input type="textarea" placeholder="输入原因" rows="4" {...getFieldProps('reason', {
                      rules: [
                        { required: true, message: '此处必填'},
                        { max: 50, message: '限50字'},
                      ],
                    })}/>
                  </FormItem>
                </Form>
              </div>
          </Modal>
      </div>
    );
  },
});

export default Form.create()(NewMarketingManageTable);
