import React from 'react';
import {Table, Icon, Button, Form, DatePicker, Input, Select, Row, Col, message} from 'antd';
import ajax from 'Utility/ajax';
import PromotionBillModal from './PromotionBillModal.jsx';
import moment from 'moment';

const FormItem = Form.Item;
const {MonthPicker} = DatePicker;
const Option = Select.Option;

const PromotionBill = React.createClass({

  getInitialState() {
    this.columns = [{
      title: (<span>账单信息<br/><span style={{color: 'rgb(153,153,153)'}}>月份|ID</span></span>),
      render: (_, r) => {
        const date = r.billDate.substr(0, 4) + '-' + r.billDate.substr(4);
        return (<span>{date}<br/><span style={{color: 'rgb(153,153,153)'}}>{r.billId}</span></span>);
      },
    }, {
      title: '推广任务类型',
      dataIndex: 'taskType',
    }, {
      title: (<span>服务信息<br/><span style={{color: 'rgb(153,153,153)'}}>名称|ID</span></span>),
      render: (_, r) => {
        return (<span>{r.commodityName || '-'}<br/><span style={{color: 'rgb(153,153,153)'}}>{r.commodityId || '-'}</span></span>);
      },
    }, {
      title: (<span>任务信息<br/><span style={{color: 'rgb(153,153,153)'}}>名称|ID</span></span>),
      render: (_, r) => {
        return (<span>{r.taskName || '-'}<br/><span style={{color: 'rgb(153,153,153)'}}>{r.taskId || '-'}</span></span>);
      },
    }, {
      title: (<span>ISV信息<br/><span style={{color: 'rgb(153,153,153)'}}>名称|ID|联系方式</span></span>),
      render: (_, r) => {
        return (<span>{r.isvName || '-'}<br/><span style={{color: 'rgb(153,153,153)'}}>{r.isvId || '-'}<br/>{r.isvPhone || '-'}</span></span>);
      },
    }, {
      title: '应结算佣金',
      dataIndex: 'totalSettlement',
    }, {
      title: '账单状态',
      render: (_, r) => {
        let ret;
        switch (r.status) {
        case 'INIT':
          ret = '初始';
          break;
        case 'WAIT_SETTLE':
          ret = '待结算';
          break;
        case 'SETTLEING':
          ret = '结算中';
          break;
        case 'SETTLE_DONE':
          ret = '已结算';
          break;
        case 'SETTLE_FAIL':
          ret = '结算失败';
          break;
        default:
          ret = '--';
        }
        return (<span>{ret}</span>);
      },
    }];
    return {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        current: 1,
      },
      loading: false,
      settlementInfo: {},
      taskConfig: [],
      searchParams: {'billDate': moment().add(-1, 'months').format('YYYYMM')},
    };
  },

  componentDidMount() {
    this.renderTaskType();
    this.refresh();
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
      pageNum: pagination.current,
    };
    this.fetch(params, this.state.searchParams);
  },

  onSearch() {
    const {validateFields} = this.props.form;
    validateFields((error, searchParams) => {
      if (!error) {
        if (searchParams.billDate) {
          searchParams.billDate = moment(searchParams.billDate).format('YYYYMM');
        } else {
          delete searchParams.billDate;
        }
        if (searchParams.taskType === 'ALL') delete searchParams.taskType;
        if (searchParams.status === 'ALL') delete searchParams.status;
        if (searchParams.name && searchParams.name.trim().length > 0) {
          searchParams.name = searchParams.name.trim();
        } else {
          delete searchParams.name;
        }
        const pageParams = {
          pageSize: this.state.pagination.pageSize,
          pageNum: 1,
        };
        this.setState({'searchParams': searchParams});
        this.fetch(pageParams, searchParams);
      }
    });
  },

  fetch(pageParams = {}, searchParams = {}) {
    const params = {
      ...pageParams,
      ...searchParams,
    };
    this.setState({loading: true});
    ajax({
      url: window.APP.kbopenprodUrl + '/commodity/bill/queryBillListForProvider.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed' && res.data) {
          const data = res.data;
          const pagination = {...this.state.pagination};
          pagination.total = data.pageInfo.totalCount || data.list.length;
          pagination.current = data.pageInfo.pageNum;
          pagination.pageSize = data.pageInfo.pageSize;
          const settlementInfo = {
            'totalSettlement': data.totalSettlement,
            'alreadySettlement': data.alreadySettlement,
            'waitSettlement': data.waitSettlement,
          };
          data.list = data.list.map((d, i) => {
            d.key = i;
            return d;
          });

          this.setState({
            loading: false,
            list: data.list,
            settlementInfo: settlementInfo,
            pagination,
          });
        }
      },
      error: () => {
        this.setState({
          loading: false,
          settlementInfo: {},
          list: [],
        });
      },
    });
  },

  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    }, this.state.searchParams);
  },

  disabledMonth(current) {
    // can not select days after today and today
    const nowMonth = new Date(moment().format('YYYY-MM'));
    return current.getTime() >= nowMonth.getTime();
  },

  renderTaskType() {
    ajax({
      url: window.APP.kbopenprodUrl + '/commodity/taskQuery/queryTaskConfigForProvider.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed' && res.data && res.data.length > 0) {
          this.setState({
            taskConfig: res.data || [],
          });
        } else {
          message.error(res.resultMsg);
        }
      }, error: (_, error) => {
        message.error(error);
      },
    });
  },

  render() {
    const {list, pagination, loading, settlementInfo, taskConfig} = this.state;
    const {getFieldProps} = this.props.form;
    const locale = {
      emptyText: '尚未出账单',
    };
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const modalParams = {
      'taskConfig': taskConfig,
    };

    return (<div>
      <div className="app-detail-header" style={{position: 'relative'}}>
        任务账单
        <p style={{fontSize: '12px', position: 'absolute', right: '20px', top: '30px'}}>
          <Icon type="info-circle" style={{color: '#2db7f5', fontSize: '16px', marginRight: '6px'}}/>
          只包含按线下交易额分佣模式
        </p>
      </div>
      <div className="promotion-bill-head">
          <FormItem
          {...formItemLayout}
          label="账单时间:  ">
            <MonthPicker placeholder="请选择账单月份"
              disabledDate={this.disabledMonth}
              format="YYYY-MM"
              {...getFieldProps('billDate', {
                initialValue: moment().add(-1, 'months').format('YYYY-MM')
              })}/>
        </FormItem>
        <div className="promotion-bill-amount">
          <span >应结算佣金：<span style={{color: '#FF6600'}}>￥{settlementInfo.totalSettlement || '--'}</span></span>
          <span style={{marginLeft: '20px'}}>已结算佣金：<span style={{color: '#FF6600'}}>￥{settlementInfo.alreadySettlement || '--'}</span></span>
           <span style={{marginLeft: '20px'}}>待结算佣金：<span style={{color: '#FF6600'}}>￥{settlementInfo.waitSettlement || '--'}</span></span>
        </div>
        </div>
      <div className="app-detail-content-padding promotion" style={{paddingTop: 24}}>
          <Row style={{marginBottom: 20}}>
            <Col span="20">
            {
              <Select defaultValue="ALL" style={{width: 130}}
                {...getFieldProps('taskType', {
                  initialValue: 'ALL',
                })}>
                <Option value="ALL" key="ALL">全部推广任务类型</Option>
                {
                  taskConfig.map(item => {
                    return (<Option value={item.taskType} key={item.taskType}>{item.taskTypeName}</Option>);
                  })
                }
              </Select>
            }
            <Select defaultValue="ALL" style={{width: 130, marginLeft: 20}}
              {...getFieldProps('status', {
                initialValue: 'ALL',
              })}>
              <Option value="ALL" key="ALL">全部账单状态</Option>
              <Option value="WAIT_SETTLE" key="WAIT_SETTLE">待结算</Option>
              <Option value="SETTLE_DONE" key="SETTLE_DONE">已结算</Option>
            </Select>
            <div className="promotionbill-search">
              <Select defaultValue="1" style={{width: 90, marginLeft: 20}}>
                <Option value="1">ISV名称</Option>
              </Select>
              <Input
                className="promotion-bill-search"
                style={{ width: 160 }}
                placeholder="请输入名称"
                {...getFieldProps('name')}/>
              <Button className="promotion-bill-btn" onClick={this.onSearch}>搜索</Button>
            </div>
            </Col>
            <Col style={{ height: 28, overflow: 'hidden'}}>
              <div style={{float: 'right'}}><PromotionBillModal {...modalParams} /></div>
            </Col>
          </Row>
        <Table columns={this.columns}
               locale={locale}
               dataSource={list}
               pagination={pagination}
               loading={loading}
               onChange={this.onTableChange}/>
      </div>
    </div>);
  },
});

export default Form.create()(PromotionBill);
