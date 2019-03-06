import React, {PropTypes} from 'react';
import { Table, Button, Cascader, message, Popover } from 'antd';
import ajax from '@alipay/kb-framework/framework/ajax';
import TableActions from './common/TableActions';
import MoreActions from './common/MoreActions';
import CreatTaskModal from './CreatTaskModal';
import TaskDetail from './TaskDetail';
import permission from '@alipay/kb-framework/framework/permission';
import 'hermes-react/components/style/common.less';
import './CityTaskManagement.less';

const CityTaskManagement = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },

  mixins: [TableActions],

  getDefaultProps() {
    return {
      emptyFirst: true, // 进入页面先不fetch
    };
  },

  getInitialState() {
    this.columns = [{
      title: '任务名称',
      dataIndex: 'taskName',
      width: 180,
      render: (_, r) => {
        return (<Popover placement="bottom" title="任务效果" content={<TaskDetail row={r}/>} trigger="click">
          <a>{r.taskName}</a>
        </Popover>);
      },
    }, {
      title: '任务描述',
      dataIndex: 'desc',
      width: 180,
    }, {
      title: '任务小贴士',
      width: 180,
      render: (_, r) => {
        const url = `${window.APP.kbsalesUrl}/showImage.json?ossFileKey=${r.tipsFileKey}`;
        return r.tipsFileKey ? <a target="_blank" href={url}><img width="40" height="40" src={url} /></a> : null;
      },
    }, {
      title: '截止时间',
      dataIndex: 'endTime',
      width: 180,
    }, {
      title: '创建人',
      width: 180,
      render: (_, r) => `${r.realName}（${r.nickName}）`,
    }, {
      title: '状态',
      width: 120,
      dataIndex: 'status',
      render: (_, r) => {
        const todoTaskStatusMap = {
          'INIT': (<span style={{ color: 'rgb(245, 106, 0)'}}>生成中</span>),
          'FAIL': '生成失败',
          'PROCESS': '执行中',
          'FINISH': '已截止',
          'END': '已终止',
          'PARTFAIL': '执行中（部分失败）',
        };
        return todoTaskStatusMap[r.status];
      },
    }, {
      title: '操作',
      width: 120,
      render: (_, r) => {
        let actions = []; // 状态：生成中
        if (r.status === 'FAIL') { // 状态：生成失败
          actions = ['MODIFY', 'DOWNLOAD_FAIL_REASON', 'DELETE']; // 对应操作： 修改、下载失败原因、删除
        } else if (r.status === 'PROCESS') { // 状态：执行中
          if (r.groupId) actions = ['DOWNLOAD_TASK_CONDITION']; // 来自全国任务的，只允许下载任务情况
          else actions = ['MODIFY', 'DOWNLOAD_TASK_CONDITION', 'END_TASK']; // 对应操作： 修改、下载任务情况、终止任务
        } else if (r.status === 'FINISH') { // 状态：已截止
          actions = ['DOWNLOAD_TASK_CONDITION']; // 对应操作：下载任务情况
        } else if (r.status === 'END') { // 状态：已终止
          actions = ['DOWNLOAD_TASK_CONDITION', 'DELETE']; // 对应操作： 下载任务情况、删除
        } else if (r.status === 'PARTFAIL') { // 状态：部分失败
          if (r.groupId) actions = ['DOWNLOAD_TASK_CONDITION']; // 来自全国任务的，只允许下载任务情况
          else actions = ['MODIFY', 'DOWNLOAD_FAIL_REASON', 'DOWNLOAD_TASK_CONDITION', 'END_TASK']; // 对应操作： 修改、下载失败原因、下载任务情况、终止任务
        }
        return <MoreActions row={r} actions={actions} onRefresh={this.fetch} showModal={this.showModal}/>;
      },
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
    if (!this.props.emptyFirst) {
      const {current, pageSize} = {...this.state.pagination};
      this.onTableChange({
        current,
        pageSize,
      });
    }

    // 获取区域城市信息
    this.queryCities();
  },

  onCitySelect(cityCode) {
    const pager = {...this.state.pagination};
    pager.current = 1;
    this.setState({
      cityCode,
      pagination: pager
    }, () => {
      const { pageSize, current: pageNum } = this.state.pagination;
      this.fetch({
        pageSize,
        pageNum,
      });
    });
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
    ajax({
      url: window.APP.kbsalesUrl + '/queryManagedCityList.json',
      method: 'GET',
      type: 'json',
      success: (res) => {
        if (res && res.status === 'succeed') {
          this.loop(res.data);
          const initialCity = res.data && [res.data[0].value, res.data[0].children[0].value];
          this.setState({
            cities: res.data,
            cityCode: initialCity,
          }, () => this.fetch());
        }
      },
      error: (res) => {
        if (res && res.status === 'failed') {
          message.error(res.msg);
        }
        this.setState({
          loading: false,
          data: [],
        });
      },
    });
  },

  showModal(action, row) {
    this.setState({
      action,
      row,
      showModal: true,
    });
  },

  hideModal() {
    this.setState({ showModal: false });
  },

  fetch(pageParams = {}, isOnRefresh) {
    const params = {
      ...pageParams,
      cityCode: this.state.cityCode && this.state.cityCode[1],
    };

    this.setState({ loading: true });

    // 刷新列表时重置分页为第一页
    const pager = { ...this.state.pagination };
    if (isOnRefresh) {
      pager.current = 1;
      this.setState({pagination: pager});
    }

    ajax({
      url: window.APP.kbsalesUrl + '/shop/businessTaskList.json',
      method: 'GET',
      data: params,
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
    const {data, pagination, loading, showModal, action, cities, row, cityCode} = this.state;
    const locale = {};
    if (this.state.cityCode) {
      locale.emptyText = '搜不到结果，换下其他搜索条件吧~';
    } else {
      locale.emptyText = '暂无数据，请输入查询条件搜索';
    }

    return (
      <div id="Page-TaskManagement">
        {!!permission('BUSINESS_TASK_MANAGER') ? <div style={{
          position: 'absolute',
          top: -45,
          right: 20,
        }}>
          <Button
            type="primary"
            onClick={this.showModal.bind(this, 'NEW', {})}
          >创建城市任务</Button>
        </div> : null}
        <CreatTaskModal
          visible={showModal}
          action={action}
          row={row}
          onHideModal={this.hideModal}
          cities={cities}
          onRefresh={this.fetch}
          cityCode={cityCode}
        />
        <div style={{marginBottom: 20}}>
          区域：
          <Cascader
            style={{ marginTop: '-1px', width: 240 }}
            expandTrigger="hover"
            value={cityCode}
            options={cities}
            onChange={this.onCitySelect}
          />
        </div>
        <Table
          columns={this.columns}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          locale={locale}
          onChange={this.onTableChange}
          rowKey={r => r.taskId}
        />
      </div>
    );
  },
});

export default CityTaskManagement;
