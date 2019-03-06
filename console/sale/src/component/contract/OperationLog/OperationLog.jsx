import React, { PropTypes } from 'react';
import ajax from 'Utility/ajax';
import { Tabs, Table, message } from 'antd';
const TabPane = Tabs.TabPane;
import {format, formatTime} from '../../../common/dateUtils';
import { logContrastFilterList } from '../../../common/OperationLogMap';

const OperationLog = React.createClass({
  propTypes: {
    location: PropTypes.object,
  },
  getInitialState() {
    const columns = [
      {
        title: '日志编号',
        dataIndex: 'orderId',
        width: 210,
      },
      {
        title: '操作人',
        dataIndex: 'operatorName',
        width: 150,
        render(text, record) {
          if (!text) {
            return '';
          }
          return text + (record.opNickName ? '(' + record.opNickName + ')' : '');
        },
      },
      {
        title: '操作时间',
        dataIndex: 'operatorDateTime',
        width: 150,
        render(text) {
          return format(new Date(text)) + ' ' + formatTime(new Date(text));
        },
      },
      {
        title: '操作类型',
        dataIndex: 'operatorType',
        width: 100,
        render(text) {
          let customText = text;
          logContrastFilterList.map((el) => {
            if (el.value === text) {
              customText = el.text;
            }
          });
          return customText;
        },
        filters: logContrastFilterList,
      },
      {
        title: '操作结果',
        dataIndex: 'operatorResult',
        width: 100,
      },
      {
        title: '操作来源',
        dataIndex: 'bizSource',
        width: 100,
      },
      {
        title: '附件',
        dataIndex: 'attachmentUrl',
        width: 100,
        render(url, record) {
          return url ? (<a href={'/isale/contract/downloadAttachment.htm?attachmentUrl=' + encodeURIComponent(url) + '&attachmentName=' + encodeURIComponent(record.attachmentName)} target="_blank">下载附件</a>) : null;
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 200,
      },
    ];
    return {
      columns,
      data: [],
      loading: true,
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        current: 1,
      },
    };
  },
  componentDidMount() {
    this.refresh();
  },
  onTableChange(pagination, filters) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
      operatorTypes: filters && filters.operatorType && filters.operatorType.join(','),
    };
    this.fetch(params);
  },
  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    });
  },
  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.location.query,
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: '/isale/contract/bizOrderList.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          const pagination = {...this.state.pagination};
          const {data} = result;
          pagination.total = result.totalCount;
          this.setState({
            data,
            pagination,
          });
        } else {
          this.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
      complete: () => {
        this.setState({
          loading: false,
        });
      },
    });
  },
  render() {
    const { data, columns, pagination, loading } = this.state;
    return (
      <div className="kb-tabs-main" style={{position: 'relative'}}>
        <Tabs
          defaultActiveKey="logs"
        >
          <TabPane tab="修改日志" key="logs">
            <div style={{padding: 16}}>
              <Table
                columns={columns}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={this.onTableChange}
                bordered />
            </div>
          </TabPane>
        </Tabs>
      </div>);
  },
});

export default OperationLog;
