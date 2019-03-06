import React, {PropTypes} from 'react';
import {message, Popover} from 'antd';
import Table from '../../../common/Table';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import {appendOwnerUrlIfDev} from '../../../common/utils';
import {format, formatTime} from '../../../common/dateUtils';

const PurchaseStorageTable = React.createClass({
  propTypes: {
    params: PropTypes.any,
  },
  getInitialState() {
    return {
      showModal: false,
      data: [],
      loading: true,
      selectedIds: [],
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
    };
  },

  componentWillMount() {
    this.refresh();
  },

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
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
      ...this.props.params,
    };
    this.setState({
      loading: true,
    });
    if (permission('STUFF_CHECK_INFO_QUERY')) {
      ajax({
        url: appendOwnerUrlIfDev('/sale/asset/stuffCheckList.json'),
        method: 'get',
        data: params,
        type: 'json',
        success: (result) => {
          if (result.status === 'succeed') {
            result.data = result.stuffCheckVOs || {};
            const pagination = {...this.state.pagination};
            pagination.total = result.totalItems;
            this.setState({
              loading: false,
              data: result.data || [],
              pagination,
            });
          } else {
            if (result.resultMsg) {
              message.error(result.resultMsg, 3);
            }
          }
        },
        error: () => {
          const pagination = {...this.state.pagination};
          pagination.total = 0;
          this.setState({
            loading: false,
            data: [],
            pagination,
          });
        },
      });
    } else {
      message.error('您没有权限操作！', 3);
    }
  },

  render() {
    const {loading, data, pagination } = this.state;
    const columns = [
      {
        title: '验收ID',
        width: 95,
        dataIndex: 'stuffCheckId',
      }, {
        title: '城市',
        width: 95,
        dataIndex: 'cityName',
      }, {
        title: '验收对象',
        width: 95,
        dataIndex: 'targetName',
      }, {
        title: '铺设人&时间',
        width: 95,
        dataIndex: 'paveCreatorName',
        render(text, r) {
          return [text, <br/>, format(new Date(r.paveTime)), <span>&nbsp;</span>, formatTime(new Date(r.paveTime))];
        },
      }, {
        title: '物料属性',
        width: 95,
        dataIndex: 'stuffTypeName',
      }, {
        title: '验收人',
        width: 95,
        dataIndex: 'auditOperatorName',
      }, {
        title: '验收状态',
        width: 95,
        dataIndex: '',
        render(text, record) {
          return (<span>
            <div>{record.statusName}</div>
            {!(record.statusName === '待线上审核') &&
            <div>
              <Popover content=
              {<div>
                  <p>原因：{record.checkReason}</p>
                  <p>{record.checkMemo && ['备注：', record.checkMemo]}</p>
                </div>
              } title="原因" trigger="hover">
              <a>查看原因</a>
              </Popover>
            </div>}
          </span>);
        },
      }, {
        title: '物料图片',
        width: 95,
        dataIndex: 'stuffImgCount',
        render(text) {
          return <a>{text}张</a>;
        },
      }, {
        title: '操作',
        width: 95,
        dataIndex: '',
        render(text, record) {
          return (<span>
            {(record.checkEnable === '1') && (record.detailEnable === '1') && <span className="ant-divider"></span>}
            {(record.detailEnable === '1') && <a href={'#/material/detail/' + record.stuffCheckId } target="_blank">详情</a>}
          </span>);
        },
      }];

    return (
        <div>
          <Table columns={columns}
                 rowKey={r => r.stuffCheckId}
                 dataSource={data}
                 loading={loading}
                 expandedRowRender
                 pagination={pagination}
                 firstShow={!this.props.params}
                 onChange={this.onTableChange} />
        </div>
    );
  },
});

export default PurchaseStorageTable;
