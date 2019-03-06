import React, {PropTypes} from 'react';
import { Table, Button, message } from 'antd';
import ajax from '@alipay/kb-framework/framework/ajax';
import TableActions from './common/TableActions';
import CreatTaskModal from './CreatTaskModal';
import TaskStatistics from './TaskStatistics';
import permission from '@alipay/kb-framework/framework/permission';
import 'hermes-react/components/style/common.less';
import './CountryTaskManagement.less';

const CountryTaskManagement = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },

  mixins: [TableActions],

  getInitialState() {
    this.columns = [{
      title: '任务名称',
      dataIndex: 'taskGroupName',
      key: 'taskGroupName',
      width: 180,
    }, {
      title: '任务描述',
      dataIndex: 'desc',
      key: 'desc',
      width: 360,
    }, {
      title: '任务小贴士',
      key: 'tips',
      width: 90,
      render: (_, r) => {
        const url = `${window.APP.kbsalesUrl}/showImage.json?ossFileKey=${r.tipsFileKey}`;
        return r.tipsFileKey ? <a target="_blank" href={url}><img width="40" height="40" src={url} /></a> : null;
      },
    }, {
      title: '截止时间',
      dataIndex: 'finishTime',
      key: 'finishTime',
      width: 180,
    }, {
      title: '创建人',
      key: 'name',
      width: 180,
      render: (_, r) => `${r.realName}（${r.nickName}）`,
    }];

    return {
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
      loading: false,
      cityCode: undefined,
      showModal: false,
      action: 'NEW',
      cities: [],
      row: {},
    };
  },

  componentDidMount() {
    // 获取区域城市信息
    this.queryCities();
  },

  loop(data) {
    data.forEach((item)=> {
      item.value = item.i;
      item.label = item.n;
      if (item.c.length !== 0) {
        item.children = item.c;
        this.loop(item.c);
      }
    });
  },

  queryCities() {
    this.setState({ loading: true });
    ajax({
      url: window.APP.kbsalesUrl + '/queryManagedCityList.json',
      method: 'GET',
      type: 'json',
      success: (res) => {
        if (res && res.status === 'succeed') {
          this.loop(res.data);
          const initialCity = '全国';
          this.setState({
            cities: res.data,
            cityCode: initialCity,
          }, () => {
            const {current, pageSize} = {...this.state.pagination};
            this.onTableChange({
              current,
              pageSize,
            });
          });
        }
      },
      error: (res) => {
        if (res && res.status === 'failed') {
          message.error(res.msg);
        }
      },
    });
  },

  showModal(action, row) {
    const { cities } = this.state;
    let cityCode;
    if (!cities) return;
    if (action === 'NEW') {
      cityCode = ['000000'];
      if (cities[0].value !== '000000') {
        cities.unshift({
          label: '全国',
          value: '000000',
          children: [{label: '全国', value: '000000'}],
        });
      }
    }
    if (action === 'EDIT') {
      const cityObj = cities.filter(v => v.children.filter(vv => vv.value === row.cityCode).length >= 1)[0];
      if (!cityObj) cityCode = [row.cityCode];
      else cityCode = [cityObj.value, row.cityCode];
    }
    this.setState({
      action,
      row,
      cityCode,
      showModal: true,
    });
  },

  hideModal() {
    this.setState({ showModal: false });
  },

  fetch(pageParams = {}, isOnRefresh) {
    this.setState({ loading: true });

    // 刷新列表时重置分页为第一页
    const pager = { ...this.state.pagination };
    if (isOnRefresh) {
      pager.current = 1;
      this.setState({pagination: pager});
    }

    ajax({
      url: window.APP.kbsalesUrl + '/shop/businessTaskGroupList.json',
      method: 'GET',
      data: pageParams,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const pagination = { ...this.state.pagination };
          pagination.total = res.data.totalCount;
          this.setState({
            loading: false,
            data: res.data.businessTaskList,
            pagination,
          });
        } else {
          this.setState({
            loading: false,
            data: [],
          });
        }
      },
      error: () => {
        this.setState({
          loading: false,
          data: [],
        });
      },
    });
  },

  render() {
    const {data, pagination, loading, showModal, action, row, cities, cityCode} = this.state;
    const locale = {
      emptyText: '暂无数据'
    };

    return (
      <div id="Page-TaskManagement">
        {!!permission('BUSINESS_TASK_GROUP_MANAGER') ? <div style={{
          position: 'absolute',
          top: -45,
          right: 20,
        }}>
          <Button
            type="primary"
            onClick={this.showModal.bind(this, 'NEW', {})}
          >创建全国任务</Button>
        </div> : null}
        <CreatTaskModal
          isCountryTask
          visible={showModal}
          action={action}
          row={row}
          onHideModal={this.hideModal}
          cities={cities}
          onRefresh={this.fetch}
          cityCode={cityCode}
        />
        <Table
          columns={this.columns}
          dataSource={data}
          pagination={pagination}
          expandedRowRender={(record) => <TaskStatistics groupId={record.taskGroupId} showModal={this.showModal} />}
          loading={loading}
          locale={locale}
          onChange={this.onTableChange}
          rowKey={r => r.taskGroupId}
        />
      </div>
    );
  },
});

export default CountryTaskManagement;
