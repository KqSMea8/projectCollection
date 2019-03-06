import React, { Component, PropTypes } from 'react';
import RecordTable from './RecordTable';
import FilterForm from './FilterForm';
import ajax from 'Utility/ajax';
import { trimParams } from '../../common/utils';
import { API_STATUS, CODE_STATUS } from '../../common/enums';
import { appendOwnerUrlIfDev } from '../../../../../common/utils';
import MaterialRequireAlert from '../../common/MaterialRequireAlert';
import { downloadCodeUrl } from '../utils';

/**
 * 轮询按照如下的流程进行：
 * 时间线:   |-[等待轮询间隔]-> 发出请求 -[等待请求返回]-> 更新轮询间隔 - [等待轮询间隔] -> 发出请求 -> ...
 * action: tmr................req......................tmr.........................req.........
 * （action 表示 pollingAction[id] 中存的值，其中 tmr 代表 setTimeout handler, req 代表 ajax 请求的 Promise 对象）
 * 因为 ajax 请求无法取消，需要借助 pollingStopped 来指示轮询停止
 */
const pollingActions = {};
const pollingStopped = {};
/**
 * 轮询时间控制：每一个 id，数据加载之后等待 3000毫秒发起第一次轮询请求，然后等待 4000毫秒发起第二次请求，以此类推
 */
const pollingInterval = {};
const initialInterval = 3000;  // 起始请求间隔，ms
const intervalStep = 1000;  // 每次轮询请求之后增加的间隔时长，ms

class ApplyRecord extends Component {
  static propTypes = {
    visible: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.transform = this.transform.bind(this);
  }

  state = {
    records: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      total: 0,
    },
    filter: {},
    statuses: {},  // 不直接使用 record.status, 而用 this.state.statuses[record.id] 来获取最新状态
    fileUrls: {},
  }

  componentDidMount() {
    this.fetchTableRecord();
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.visible && this.props.visible) {
      console.log(`[${new Date()}] tab switch, stop polling`);
      this.stopPolling();
    } else if (nextProps.visible && !this.props.visible) {
      console.log(`[${new Date()}] tab switch, restart polling`);
      this.startPolling();
    }
  }

  componentWillUnmount() {
    this.stopPolling();
  }

  onDownCode(url) {
    window.open(url);
  }

  onDownCodeUrl(batchId, bindScene) {
    downloadCodeUrl({ batchId, bindScene });
  }

  setStatusAtId({ id, status }) {
    const { statuses } = this.state;
    statuses[id] = status;
    this.setState({ statuses });
  }

  setFileUrlAtId({ id, fileUrl }) {
    const { fileUrls } = this.state;
    fileUrls[id] = fileUrl;
    this.setState({ fileUrls });
  }

  handleTableChange(pagination) {
    this.setState({
      pagination,
    }, this.fetchTableRecord);
  }

  handleSubmitFilter(filter) {
    this.setState({
      filter,
      pagination: {
        ...this.state.pagination,
        current: 1,
      },
    }, this.fetchTableRecord);
  }

  fetchTableRecord() {
    this.setState({
      loading: true,
    });
    this.stopPolling();
    const params = {
      mappingValue: 'kbasset.pageQueryKBCodeBatch',
      ...this.state.filter,
      pageNum: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
    };
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: trimParams(params),
      type: 'json',
    }).then(res => {
      this.setState({
        loading: false,
      });
      if (res && res.status === API_STATUS.SUCCEED) {
        const records = res.data.data;
        this.setState({
          records,
          pagination: {
            ...this.state.pagination,
            total: res.data.totalSize,
          },
        });
        records.forEach(record => {
          const { id, status, fileUrl } = record;
          this.setStatusAtId({ id, status });
          this.setFileUrlAtId({ id, fileUrl });
          if (status !== CODE_STATUS.COMPLETED) {
            // 已完成状态的记录不再轮询
            this.schedule(id);
          }
        });
      }
    }).catch(() => {
      this.setState({
        records: [],
        loading: false,
      });
    });
  }

  startPolling() {
    const { statuses } = this.state;
    Object.keys(statuses).forEach(id => {
      if (statuses[id] !== CODE_STATUS.COMPLETED) {
        pollingStopped[id] = false;
        if (!pollingActions[id]) {
          this.schedule(id);
        }
      }
    });
  }

  stopPolling() {
    Object.keys(pollingActions).forEach(id => {
      if (pollingActions[id] && pollingActions[id].then) {
        pollingStopped[id] = true;
        console.log(`[${new Date()}] id: ${id}, current request stopped`);
      } else if (typeof pollingActions[id] === 'number') {
        clearTimeout(pollingActions[id]);
        pollingActions[id] = null;
        console.log(`[${new Date()}] id: ${id}, next schedule cancelled`);
      } else {
        console.log(pollingActions[id]);
      }
      pollingInterval[id] = 0;
    });
  }

  /**
   * 添加一次计划的轮询
   */
  schedule(id) {
    if (pollingStopped[id]) {
      console.log(`[${new Date()}] id: ${id}, current schedule stopped`);
      pollingActions[id] = null;
      return;
    }
    // 更新下一次轮询时间间隔
    const pi = pollingInterval[id];
    pollingInterval[id] = pi ? pi + intervalStep : initialInterval;
    console.log(`[${new Date()}] id: ${id}, next poll request in ${pollingInterval[id]}ms`);
    pollingActions[id] = setTimeout(() => {
      this.request(id);
    }, pollingInterval[id]);
  }

  /**
   * 发起一次轮询请求
   */
  request(id) {
    console.log(`[${new Date()}] id: ${id}, about to issue request`);
    pollingActions[id] = ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      type: 'json',
      data: {
        mappingValue: 'kbasset.loopQueryKBCodeBatch',
        batchId: id,
      },
      error: () => this.schedule(id),  // 阻止默认的报错
    }).then((result) => {
      if (result.status === API_STATUS.SUCCEED && result.data) {
        pollingActions[id] = null;
        pollingInterval[id] = 0;
        this.setStatusAtId({ id, status: CODE_STATUS.COMPLETED });
        this.setFileUrlAtId({ id, fileUrl: result.data });
      } else {
        this.schedule(id);
      }
    });
  }

  transform(records) {
    return records.map(record => {
      const { id } = record;
      const fileUrl = this.state.fileUrls[id];
      const status = this.state.statuses[id];
      return {
        ...record,
        status,
        fileUrl,
      };
    });
  }

  render() {
    const { records, loading, pagination } = this.state;
    return (
      <div>
        <MaterialRequireAlert />
        <FilterForm onSubmit={this.handleSubmitFilter}/>
        <RecordTable
          data={this.transform(records)}
          loading={loading}
          pagination={pagination}
          onChange={this.handleTableChange}
          onDownCode={this.onDownCode}
          onDownCodeUrl={this.onDownCodeUrl}
        />
      </div>
    );
  }
}

export default ApplyRecord;
