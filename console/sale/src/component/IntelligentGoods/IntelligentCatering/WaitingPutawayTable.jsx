import React, { PropTypes } from 'react';
import { Table, Button, message, Modal, Icon, Tooltip } from 'antd';
import ajax from 'Utility/ajax';
import Operation from '../common/Operation';
import { number2DateTime } from '../../../common/dateUtils';
import { appendOwnerUrlIfDev } from '../../../common/utils';
import { cateringChangeStatusMap, getCateringChangeStatus } from '../common/utils';
import ChangeInfoModal from './ChangeInfoModal';
import STATUS_ENUM from './DisplayStatusMap';
// import { find } from 'lodash';

class WaitingPutawayTable extends React.Component {
  static propTypes = {
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
        title: '优惠活动',
        dataIndex: 'itemTitle',
        width: 250,
        render: (text, record) => {
          return (<div className="item-title" style={{position: 'relative'}}>
            <div className="buttons">
                {record.isAligned === 1 ? <Tooltip placement="top" title="Leads已对齐活动，异动监控中"><a href=" javascript:; "><Button className="Aligned" size="small" type="primary">已对齐</Button></a></Tooltip> : ''}
                {record.newHuaihai === true ? <Button className="Huaihai" size="small" type="primary">淮海</Button> : '' }
            </div>
            <span className="text">{text}</span>
          </div>);
        }
      },
      {
        title: '优惠力度',
        width: '15%',
        dataIndex: 'priceRule',
        render: (text, record) => {
          let content = <p>{record.priceRule || '-'}</p>;
          if (record.changePriceRule) {
            content = <div><p>{record.priceRule || '-'}</p><p className={cateringChangeStatusMap[getCateringChangeStatus(record.operationMap)] || 'color-orange'}>{record.changePriceRule}</p></div>;
          }
          return content;
        }
      },
      {
        title: '适用门店',
        width: 150,
        dataIndex: 'shopCount',
        render: (text, record) => {
          let content = <p>{record.shopCount || '-'}</p>;
          if (record.changeShopCount) {
            content = <p><p>{record.shopCount || '-'}</p><p className={cateringChangeStatusMap[getCateringChangeStatus(record.operationMap)] || 'color-orange'}>异动：{record.changeShopCount}</p></p>;
          }
          return content;
        }
      },
      {
        title: '剩余库存',
        width: 105,
        dataIndex: 'remainingStock'
      },
      {
        title: '活动有效期',
        width: '15%',
        render: (text) => {
          return (text.itemStartTime > 0 || text.itemStartTime > 0) && <span><span>{number2DateTime(text.itemStartTime)} ~ </span><br /><span>{number2DateTime(text.itemStopTime)}</span></span>;
        }
      },
      {
        title: '券类型',
        width: '10%',
        render: (text) => {
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
        }
      },
      {
        title: '活动状态',
        width: 150,
        render: (text) => {
          const status = STATUS_ENUM[text.displayStatus] || '-';
          let statusColor = '';
          if (text.displayStatus === 'ONLINE-RETURN') {
            statusColor = (
              <span style={{ color: '#FF0000' }}>{status}{text.rejectReason && <Tooltip placement="top" title={text.rejectReason}>
                <Icon type="exclamation-circle" style={{ color: '#efce93', marginLeft: '5px' }} />
              </Tooltip>}</span>
            );
          } else {
            statusColor = <span>{status}</span>;
          }
          return <p>{statusColor}</p>;
        }
      },
      {
        title: '操作',
        width: 180,
        render: (text, record) => {
          return (<Operation record={record} modifyItem={this.submitItem} partnerId={this.props.partnerId} handleChange={this.handleChange} handleOnline={this.showConfirmOnlineModal}/>);
        }
      }
    ];
    this.state = {
      data: [],
      selectedRows: [],
      pagination: {
        // showSizeChanger: true,
        showQuickJumper: false,
        pageSize: 10,
        current: 1,
      },
      changeShopListPagination: {
        pageSize: 10,
        current: 1,
        total: 0,
      },
      loading: false,
      currentChangeInfo: {},
      changeInfoModalVisible: false,
      submitChangeInfoing: false,
      currentPriceChangeInfo: {},
      currentChangeShopList: [],
      currentShopNumBefore: undefined,
      currentShopNumAfter: undefined,
      currentRecord: {},
    };
  }
  componentDidMount() {
    if (!!this.props.partnerId) {
      this.refresh();
    }
  }
  componentDidUpdate(prevProps, prevState, prevCtx) {
    if (this.context.location.key !== prevCtx.location.key && this.props.activeKey === 'putaway' && !!this.props.partnerId) {
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
  fetch(pageParams = {}) {
    const params = {
      itemStatus: this.props.status,
      partnerId: this.props.partnerId,
      ...pageParams,
    };
    this.setState({ loading: true });
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json?mappingValue=kbcateringprod.pageQueryShelvedItemList'),
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status === 'succeed' && result.data) {
          const pagination = { ...this.state.pagination };
          pagination.total = result.data.totalSize;
          this.setState({
            loading: false,
            data: result.data.data || [],
            pagination,
          });
        } else {
          this.setState({
            loading: false,
            data: [],
          });
          if (result.data && result.data.resultMessage === 'NO_PERMISSION') {
            message.error('暂无权限', 2);
          } else {
            message.error('系统异常', 2);
          }
        }
      },
      error: (err) => {
        message.error(err.errorMsg || '系统异常', 3);
        this.setState({ loading: false });
      },
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
  showConfirmOnlineModal = (record) => {
    Modal.confirm({
      title: '确认上架该商品？',
      content: '',
      onOk: (close) => {close(); this.handleOnline(record);},
    });
  }

  handleOnline = (record) => {
    const { bizId: sequenceId, itemId = undefined } = record;
    this.setState({
      loading: true,
    });
    ajax({
      url: `${window.APP.crmhomeUrl}/goods/caterItem/onlineItem.json`,
      // url: 'http://pickpost.alipay.net/mock/kbcateringprod/goods/caterItem/onlineItem.json',
      method: 'post',
      data: {
        op_merchant_id: this.props.partnerId,
        sequenceId,
        itemId,
      },
      type: 'json',
      success: (result) => {
        if (result && result.status === 'succeed') {
          message.success('上架成功', 3);
          this.setState({
            loading: false,
          });
          this.refresh();
        } else {
          message.error((result && result.resultMsg) || '上架失败，请稍后重试', 3);
          this.setState({ loading: false });
        }
      },
      error: (result) => {
        message.error((result && result.resultMsg) || '上架失败，请稍后重试', 3);
        this.setState({ loading: false });
      },
    });
  }
  handleChange = (record, actionType) => {
    this.setState({
      loading: true,
      currentRecord: record,
      changeActionType: actionType,
      currentChangeShopList: [],
      currentPriceChangeInfo: {},
      currentShopNumBefore: undefined,
      currentShopNumAfter: undefined,
    });
    this.queryPriceChangeInfo(record, actionType);
    this.queryShopChangeInfo(record, actionType, {
      pageSize: 10,
      current: 1,
      total: 0,
    });
  }
  queryPriceChangeInfo(record, actionType) {
    const { leadsId } = record;
    const { partnerId } = this.props;
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json?mappingValue=kbcateringprod.priceChangeInfoQuery'),
      // url: 'http://pickpost.alipay.net/mock/kbcateringprod/proxy2.json?mappingValue=kbcateringprod.changeInfoQuery&pageSize=6',
      method: 'get',
      data: {
        leadsId,
        partnerId,
        operationType: actionType === 'check' ? 'QUERY_CHANGE' : 'CHANGE',
      },
      type: 'json',
      success: (result) => {
        if (result && result.status === 'succeed' && result.data && result.data.data) {
          this.setState({
            loading: false,
            changeInfoModalVisible: true,
            currentPriceChangeInfo: result.data.data || {},
          });
        } else {
          // message.error('请求价格异动信息失败，请稍后重试', 3);
          this.setState({ loading: false });
        }
      },
      error: (err) => {
        message.error(err.errorMsg || '请求价格异动信息失败', 3);
        this.setState({ loading: false });
      },
    });
  }
  queryShopChangeInfo(record, actionType, pagination) {
    const { leadsId } = record;
    const { partnerId } = this.props;
    this.setState({ changeShopListLoading: true });
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json?mappingValue=kbcateringprod.shopChangeInfoQuery'),
      // url: 'http://pickpost.alipay.net/mock/kbcateringprod/proxy5.json?mappingValue=kbcateringprod.shopChangeInfoQuery',
      method: 'get',
      data: {
        leadsId,
        partnerId,
        operationType: actionType === 'check' ? 'QUERY_CHANGE' : 'CHANGE',
        pageSize: pagination.pageSize,
        pageNo: pagination.current,
      },
      type: 'json',
      success: (result) => {
        if (result && result.status === 'succeed' && result.data && result.data.data) {
          const { changeShopList, shopNumBefore, shopNumAfter } = result.data.data || {};
          const totalSize = shopNumAfter && shopNumBefore ? shopNumAfter - shopNumBefore : 0;
          this.setState({
            loading: false,
            changeShopListLoading: false,
            changeInfoModalVisible: true,
            currentChangeShopList: changeShopList || [],
            currentShopNumBefore: shopNumBefore,
            currentShopNumAfter: shopNumAfter,
            changeShopListPagination: {
              ...pagination,
              total: totalSize,
            }
          });
        } else {
          // message.error('请求门店异动信息失败，请稍后重试', 3);
          this.setState({ loading: false, changeShopListLoading: false, });
        }
      },
      error: (err) => {
        message.error(err.errorMsg || '请求门店异动信息失败', 3);
        this.setState({ loading: false, changeShopListLoading: false, });
      },
    });
  }
  shopTableChange = (pagination) => {
    const { currentRecord, changeActionType } = this.state;
    this.queryShopChangeInfo(currentRecord, changeActionType, pagination);
  }
  submitChangeInfo = () => {
    const { leadsId, displayStatus, itemType } = this.state.currentRecord;
    const { partnerId } = this.props;
    this.setState({ submitChangeInfoing: true });
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json?mappingValue=kbcateringprod.changeInfoSubmit'),
      // url: 'http://pickpost.alipay.net/mock/kbcateringprod/proxy3.json?mappingValue=kbcateringprod.changeInfoSubmit',
      method: 'post',
      data: {
        type: itemType,
        leadsId,
        partnerId,
        displayStatus,
      },
      type: 'json',
      success: (result) => {
        if (result) {
          if (result.status === 'succeed') {
            message.success('确认异动成功');
            this.setState({
              submitChangeInfoing: false,
              changeInfoModalVisible: false,
            });
            this.refresh();
          } else {
            if (result.resultCode === 'SELECTED_CANNOT_MODIFY' && itemType === 'ITEM') {
              Modal.warning({
                title: result.resultMessage || '该商品已参与平台活动，暂不支持修改。',
                content: <div>
                  <p>如需修改，请先将商品退出平台，再进行操作</p>
                </div>,
                okText: '知道了',
              });
            } else {
              message.error(result.resultMessage || '确认失败，请稍后重试', 3);
            }
            this.setState({
              submitChangeInfoing: false,
            });
          }
        } else {
          message.error('确认失败，请稍后重试', 3);
          this.setState({
            submitChangeInfoing: false,
          });
        }
      },
      error: (err) => {
        message.error(err && err.resultMsg || '系统异常', 3);
        this.setState({ submitChangeInfoing: false });
      },
    });
  }
  render() {
    const { data, pagination, loading, changeInfoModalVisible, submitChangeInfoing,
      changeShopListPagination, currentChangeShopList, currentPriceChangeInfo,
      changeActionType, currentShopNumBefore, currentShopNumAfter, changeShopListLoading, currentRecord } = this.state;
    // const hasHuaihaiTop = find(data, (item) => {
    //   return item.isAligned === 1;
    // });
    this.columns[0] = {
      title: <p style={{paddingLeft: 100}}>优惠活动</p>,
      dataIndex: 'itemTitle',
      width: 250,
      render: (text, record) => {
        return (<div className="item-title" style={{position: 'relative'}}>
          <div className="buttons">
            {/* {record.isAligned === 1 ? <Tooltip placement="top" title="Leads已对齐活动，异动监控中"><a href=" javascript:; "><Button className="Aligned" size="small" type="primary">已对齐</Button></a></Tooltip> : ''} */}
            {record.huaihaiTop === true ? <Button className="Huaihai" size="small" type="primary">淮海头部</Button> : ''}
            {/* {record.huaihaiTop !== true && record.newHuaihai === true ? <Button className="Huaihai" size="small" type="primary">淮海</Button> : ''} */}
          </div>
          <span className="text">{text}</span>
        </div>);
      }
    };
    const changeInfo = {
      changeShopList: currentChangeShopList,
      priceChangeInfo: currentPriceChangeInfo,
      actionType: changeActionType,
      shopNumBefore: currentShopNumBefore,
      shopNumAfter: currentShopNumAfter,
    };
    return (
      <div className="activity-table shelved-catering-table-wrapper">
        <div>
          <Table columns={this.columns}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={this.onTableChange}
            firstShow={!this.props.params}
            rowKey={record => record.leadsId} />
        </div>
        <ChangeInfoModal
          visible={changeInfoModalVisible}
          submitChangeInfoing={submitChangeInfoing}
          pagination={changeShopListPagination}
          tableChange={this.shopTableChange}
          onOk={this.submitChangeInfo}
          changeInfo={changeInfo}
          record={currentRecord}
          changeShopListLoading={changeShopListLoading}
          onCancel={() => {
            this.setState({
              changeInfoModalVisible: false,
            });
          }}
        />
      </div>
    );
  }
}

export default WaitingPutawayTable;
