import { Table, Modal, message, Tooltip, Icon, Button } from 'antd';
import ajax from 'Utility/ajax';
import React, { PropTypes } from 'react';
import Operation from '../common/OperationForCatering';
import { appendOwnerUrlIfDev } from '../../../common/utils';
import STATUS_ENUM from './DisplayStatusMap';
// import { find } from 'lodash';

const APP_COVERAGE_TOO_LOW_TIP = (
  <Tooltip placement="top" title="适用门店 App 覆盖率不足 50%">
    <Icon type="exclamation-circle" style={{ color: '#efce93', marginLeft: '5px' }} />
  </Tooltip>
);

function grayColorRender(renderFunc) {
  return (...args) => {
    let rtn = renderFunc(...args);
    if (args[1] && args[1].editFlag === -1) {
      rtn = <span style={{color: '#999999'}}>{rtn}</span>;
    }
    return rtn;
  };
}

function defaultRender(text) {
  return text;
}

export default class WaitingShelveTable extends React.Component {
  static propTypes = {
    isCatering: PropTypes.string,
    status: PropTypes.string,
    partnerId: PropTypes.string,
    activeKey: PropTypes.string,
  }
  static contextTypes = {
    location: PropTypes.any,
  }
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '活动名称',
        width: 250,
        dataIndex: 'itemTitle',
        render: grayColorRender(defaultRender),
      },
      {
        title: '优惠力度',
        width: 200,
        dataIndex: 'priceRule',
        render: grayColorRender(defaultRender),
      },
      {
        title: '券类型',
        width: 180,
        render: grayColorRender((text) => {
          let type = '';
          const itemType = text.itemType;
          if (itemType === 'ITEM') {
            type = '商品';
          } else if (itemType === 'MANJIAN') {
            type = '全场每满减';
          } else if (itemType === 'VOUCHER') {
            type = '全场代金券';
          } else if (itemType === 'RATE') {
            type = '全场折扣';
          } else {
            type = '-';
          }
          return <span>{type}</span>;
        }),
      },
      {
        title: '活动状态',
        width: 180,
        render: grayColorRender((text, record) => {
          let statusColor = '';
          const status = STATUS_ENUM[text.itemStatus] || '-';
          if (text.itemStatus === 'INIT' || text.itemStatus === 'PENDING') {
            statusColor = <span style={{ color: '#FF9900' }}>{status}</span>;
          } else if (text.itemStatus === 'RETURNED' || text.itemStatus === 'ONLINE-RETURN' || text.itemStatus === 'FAILED_ONLINE') {
            statusColor = (<span style={{ color: '#FF0000' }}>{status}{text.rejectReason && <Tooltip placement="top" title={text.rejectReason}>
                      <Icon type="exclamation-circle" style={{ color: '#efce93', marginLeft: '5px' }} />
                      </Tooltip>}</span>);
          } else {
            statusColor = <span>{status}</span>;
          }

          return <p>{statusColor}{record.editFlag === -1 && APP_COVERAGE_TOO_LOW_TIP}</p>;
        }),
      },
      {
        title: '最后操作人',
        width: 180,
        render: grayColorRender((text, record) => {
          return (<span>{record.lastOperatorName ? record.lastOperatorName : '-'}</span>);
        }),
      },
      {
        title: '操作',
        width: 200,
        key: 'action',
        render: grayColorRender((text, record) => {
          return (<Operation record={record} modifyItem={this.submitItem} partnerId={this.props.partnerId} />);
        }),
      }
    ];
    this.state = {
      data: [],
      pagination: {
        // showSizeChanger: true,
        showQuickJumper: false,
        pageSize: 10,
        current: 1,
      },
      loading: false,
    };
  }
  componentDidMount() {
    this.refresh();
  }
  componentDidUpdate(prevProps, prevState, prevCtx) {
    // 若接口失败，要允许重复请求
    if (this.context.location.key !== prevCtx.location.key && this.props.activeKey === 'stayputaway') {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    }
  }
  onTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
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
  }
  refresh() {
    const { pageSize, current } = this.state.pagination;
    this.fetch({
      pageSize,
      pageNo: current,
    });
  }
  fetch(pageParams = { pageNo: 1, pageSize: 10 }) {
    if (!this.props.partnerId) return;
    const params = {
      itemStatus: this.props.status,
      partnerId: this.props.partnerId,
      ...pageParams
    };
    this.setState({ loading: true });
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json?mappingValue=kbcateringprod.pageQueryNotShelvedItemList&domain=KOUBEI'),
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.data.success && result.data.success === true) {
          const pagination = { ...this.state.pagination };
          pagination.total = result.data.totalSize;
          this.setState({
            loading: false,
            data: result.data.data || [],
            pagination,
          });
        } else if (result.data.success === false) {
          this.setState({
            loading: false,
            data: [],
          });
          if (result.data.resultMessage === 'NO_PERMISSION') {
            message.error('暂无权限', 2);
          } else {
            message.error('系统异常', 2);
          }
        }
      },
      error: (err) => {
        this.setState({ loading: false });
        message.error(err && err.resultMsg || '网络连接异常', 2);
      },
    }).catch(() => {
      this.setState({
        loading: false,
        data: []
      });
    });
  }
  submitItem = (record) => {
    Modal.confirm({
      title: '是否确认上架已选择的商品',
      content: <p><span>提交成功后，需等待商户确认</span><br /><span>也可以主动联系商户进行确认，加快商品上架时间。</span></p>,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        ajax({
          url: appendOwnerUrlIfDev(window.APP.crmhomeUrl + '/goods/koubei/submitMovehome.json'),
          method: 'post',
          data: {
            op_merchant_id: this.props.partnerId,
            leadsId: record.leadsId,
            type: record.itemType,
          },
          type: 'json',
          success: (result) => {
            this.setState({ loading: false });
            if (result && result.status === 'succeed') {
              message.success('提交成功，请等待商户确认');
              this.refresh();
            } else {
              message.error(result && result.resultMsg || '系统异常', 3);
            }
          },
          error: (err) => {
            message.error(err && err.resultMsg || '系统异常', 3);
          },
        });
      },
    });
  }
  render() {
    const { data, pagination, loading } = this.state;
    // const hasAlignedItem = find(data, (item) => {
    //   return item.isAligned === 1;
    // });
    this.columns[0] = {
      title: <p style={{paddingLeft: 100}}>活动名称<span style={{color: '#ccc'}}> | </span>ID</p>,
      dataIndex: 'itemTitle',
      width: 250,
      render: grayColorRender((text, record) => {
        return (<div style={{position: 'relative'}}>
            <div className="buttons">
                {/* {record.isAligned === 1 ? <Tooltip placement="top" title="Leads已对齐活动，异动监控中"><a href=" javascript:; "><Button className="Aligned" size="small" type="primary">已对齐</Button></a></Tooltip> : ''} */}
                {record.huaihaiTop === true ? <Button className="Huaihai" size="small" type="primary">淮海头部</Button> : ''}
                {/* {record.huaihaiTop !== true && record.newHuaihai === true ? <Button className="Huaihai" size="small" type="primary">淮海</Button> : ''} */}
            </div>
            <span className="text">{text}<br />{record.leadsId}</span>
        </div>);
      })
    };
    return (
      <div className="activity-table notshelved-catering-table-wrapper">
        <div>
          <Table columns={this.columns}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={this.onTableChange}
            rowKey={record => record.leadsId}
          />
        </div>
      </div>
    );
  }
}
