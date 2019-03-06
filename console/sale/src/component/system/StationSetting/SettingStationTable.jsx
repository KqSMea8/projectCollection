import React, {PropTypes} from 'react';
import {Table} from 'antd';
import DetailAction from './DetailAction';
import DeleteAction from './DeleteAction';
import ajax from 'Utility/ajax';

const SettingStationTable = React.createClass({
  propTypes: {
    onJobsChange: PropTypes.func,
    params: PropTypes.object,
  },

  getInitialState() {
    this.columns = [{
      title: '岗位名',
      dataIndex: 'jobName',
      width: 120,
    }, {
      title: '业务约束',
      dataIndex: 'configs',
      width: 600,
      render: (text) => {
        const str = text.join('、');
        return <div className="ft-ellipsis" style={{width: 600}}>{str}</div>;
      },
    }, {
      title: '操作',
      width: 200,
      render: (_, r) => {
        return (<div>
          <DetailAction data={r}>
            <a>查看</a>
          </DetailAction>
          <span className="ft-bar">|</span>
          <a onClick={this.onJobsChange.bind(this, r)}>修改</a>
          <span className="ft-bar">|</span>
          <DeleteAction data={r} onRefresh={this.refresh}>
            <a>删除</a>
          </DeleteAction>
        </div>);
      },
    }];

    return {
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        current: 1,
      },
      loading: false,
    };
  },

  componentDidMount() {
    this.refresh();
  },

  onJobsChange(rows) {
    this.props.onJobsChange(rows);
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

  refresh(params) {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageNum: current,
      pageSize,
      ...params,
    });
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };

    this.setState({loading: true});
    ajax({
      url: '/manage/queryJobConfig.json',
      // url: 'http://local.alipay.net:8982/manage/queryJobConfig.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = {...this.state.pagination};
        pagination.total = result.total;

        this.setState({
          loading: false,
          data: result.data,
          pagination,
        });
      },
    });
  },

  render() {
    const { data, pagination, loading } = this.state;
    return (<Table columns={this.columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               onChange={this.onTableChange}/>);
  },
});

export default SettingStationTable;
