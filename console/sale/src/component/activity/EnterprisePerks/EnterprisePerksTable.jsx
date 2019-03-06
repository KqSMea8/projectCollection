import { Table, message, Icon, Dropdown, Menu } from 'antd';
import ajax from 'Utility/ajax';
import React, {PropTypes} from 'react';
import {format, formatTime} from '../../../common/dateUtils';

const EnterprisePerksTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    isServiceStage: PropTypes.bool,
  },

  getInitialState() {
    this.columns = [{
      title: '活动名称',
      dataIndex: 'name',
    }, {
      title: '活动时间',
      dataIndex: 'time',
      render() {
        return format(new Date()) + ' ' + formatTime(new Date());
      },
    }, {
      title: '活动类型',
      dataIndex: 'subject',
    }, {
      title: '邀约状态',
      dataIndex: 'type',
    }, {
      title: '活动状态',
      dataIndex: 'useMode',
    }, {
      title: '活动数据',
      dataIndex: 'itemId',
    }, {
      title: '创建人',
      dataIndex: 'people',
    }, {
      title: '操作',
      width: 120,
      render: () => {
        const menu = (
          <Menu>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">查看活动效果</a>
            </Menu.Item>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">下载对账单</a>
            </Menu.Item>
          </Menu>
          );
        return (<div>
          <a target="_blank" href="#/activity/enterpriseperks/detail">查看</a>
            <span className="ant-divider"></span>
          <a>下架</a><span className="ant-divider"></span>
          <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link">更多<Icon type="down" /></a>
          </Dropdown>
        </div>);
      },
    }];

    return {
      data: [{ // 测试数据,需要删除
        name: '上海支付宝福利',
        time: '2016.05.10-2016.06.10',
        subject: '实时优惠',
        type: '待确认',
        useMode: '未开始',
        itemId: '发券：0',
        people: 'tst21323@alipay.com',
      }],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        showTotal: this.showTotal,
        current: 1,
      },
      loading: false,
    };
  },

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.refresh();
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
      pageNum: pagination.current,
    };
    this.fetch(params);
  },
  refresh(update) {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: update ? current : 1,
    });
  },
  showTotal(total) {
    return `共 ${total} 条`;
  },
  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    this.setState({loading: true});
    ajax({
      url: window.APP.crmhomeUrl + '/goods/koubei/itemList.json',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          const data = result.data;
          const pagination = {...this.state.pagination};
          pagination.total = data.totalItems;
          pagination.current = data.pageNo;
          this.setState({
            loading: false,
            data: data.data,
            pagination,
          });
        } else {
          this.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },
  render() {
    const { data, pagination, loading } = this.state;
    return (
      <div>
        <div>
          <Table columns={this.columns}
            bordered
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={this.onTableChange}
            firstShow={!this.props.params}
            rowKey={(row, index) => index} />
        </div>
      </div>
    );
  },
});

export default EnterprisePerksTable;
