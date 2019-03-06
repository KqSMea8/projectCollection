import React, {PropTypes} from 'react';
import {message, Popover} from 'antd';
import moment from 'moment';
import permission from '@alipay/kb-framework/framework/permission';

import Table from '../../../common/Table';
import ajax from 'Utility/ajax';
import MaterialAcceptanceTaskTransferModal from './MaterialAcceptanceTaskTransferModal';
import {appendOwnerUrlIfDev} from '../../../common/utils';
import MaterialAcceptanceCheckLabel from './MaterialAcceptanceCheckLabel';
import {format, formatTime} from '../../../common/dateUtils';
import './style.less';

const MaterialAcceptanceTable = React.createClass({
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

  onSelectChange(selectedRowKeys) {
    this.setState({
      selectedIds: selectedRowKeys,
    });
  },

  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
      paveStartDate: format(moment().add(-3, 'months').toDate()),
      paveEndDate: format(moment().toDate()),
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

  reload() {
    location.reload();
  },

  render() {
    const refresh = this.refresh;
    const {loading, data, pagination, selectedIds} = this.state;
    this.rowSelection = {
      selectedRowKeys: selectedIds,
      onChange: this.onSelectChange,
      getCheckboxProps(record) {
        return {
          disabled: !(record.statusName === '待线上审核'),
        };
      },
    };

    const buttonArea = (
        !loading && data && data.length > 0 && (<div>
              <span style={{marginRight: 12}}>已选({selectedIds.length})</span>
              <MaterialAcceptanceTaskTransferModal callbackParent={this.reload} ids={selectedIds}/>
            </div>
        )
    );

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
        render(name, record) {
          return (
            <div>
              {record.shopKA && <span className="ka-label">{record.shopKA.toUpperCase()}</span>}
              <span>{name}</span>
            </div>
          );
        }
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
        render(text, record) {
          if (text === '活动物料') {
            return (
              <div>
                <p>{text}</p>
                <p>{record.activeName}</p>
              </div>
            );
          }
          return text;
        }
      }, {
        title: '验收人',
        width: 95,
        dataIndex: 'auditOperatorName',
      }, {
        title: '验收状态/类型',
        width: 95,
        dataIndex: '',
        render(text, record) {
          let checkTypeTxt = '';
          switch (record.checkType) {
          case 'MACHINE': {
            checkTypeTxt = '机器审核';
            break;
          }
          case 'MANUAL': {
            checkTypeTxt = '人工审核';
            break;
          }
          case 'MACHINE_MANUAL': {
            checkTypeTxt = '组合审核';
            break;
          }
          default: {
            checkTypeTxt = '';
            break;
          }
          }
          return (<span>
            <div>{record.statusName}</div>
            <div>{checkTypeTxt}</div>
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
        title: '图片渠道',
        width: 95,
        dataIndex: 'channel',
        render(text) {
          let channelTxt = '';
          switch (text) {
          case 'DINGDING': {
            channelTxt = '集团钉钉客户端';
            break;
          }
          case 'MERCHANT_APP': {
            channelTxt = '口碑掌柜';
            break;
          }
          case 'PC': {
            channelTxt = '销售工作台';
            break;
          }
          default: {
            channelTxt = '销售工作台';
            break;
          }
          }
          return channelTxt;
        },
      }, {
        title: '操作',
        width: 95,
        dataIndex: '',
        render(text, record) {
          return (<span>
            <MaterialAcceptanceCheckLabel updateTableData={refresh} checkType={record.checkType} checkEnable={record.checkEnable} id={record.stuffCheckId} showText/>
            {(record.checkEnable === '1') && (record.detailEnable === '1') && <span className="ant-divider"></span>}
            {(record.detailEnable === '1') && <a href={'#/material/detail/' + record.stuffCheckId } target="_blank">详情</a>}
          </span>);
        },
      }];

    return (
        <div>
          {buttonArea && <div style={{marginBottom: 10}}>{buttonArea}</div>}
          <Table columns={columns}
                 rowKey={r => r.stuffCheckId}
                 rowSelection={this.rowSelection}
                 dataSource={data}
                 loading={loading}
                 pagination={pagination}
                 firstShow={!this.props.params}
                 onChange={this.onTableChange} />
          {buttonArea && <div style={{marginTop: -44}}>{buttonArea}</div>}
        </div>
    );
  },
});

export default MaterialAcceptanceTable;
