import React, {PropTypes} from 'react';
import {Modal, Alert, Table, message} from 'antd';
import {format, formatTimeHm} from '../../../common/dateUtils';
import {times} from '../../../common/utils';
import ajax from 'Utility/ajax';

// const RateType = {
//   CREATE_SHOP_RATE: '创建门店价格',
//   MODIFY_SHOP_RATE: '修改门店价格',
//   INVALID_SHOP_RATE: '失效门店价格',
// };
const RateListModal = React.createClass({
  propTypes: {
    rateInfo: PropTypes.object,
  },

  getInitialState() {
    return {
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        simple: true,
        current: 1,
      },
      visible: false,
    };
  },
  componentWillMount() {
    this.refresh();
  },
  onTableChange(pagination) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    this.fetch(pager);
  },
  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
    };
    this.setState({
      loading: true,
    });
    params.shopId = this.props.shopId;
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/queryRateOrder.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          this.setState({
            RateList: result.data.data,
            loading: false,
          });
        }
      },
      error: (result) => {
        this.setState({
          loading: false,
        });
        message.error(result);
      },
    });
  },
  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    });
  },
  showRateList() {
    this.setState({
      visible: true,
    });
  },
  cancelRateListModal() {
    this.setState({
      visible: false,
    });
  },
  /*
* 当前费率文案展示方式
* 如果有 nextRate （下期费率），则展示当前费率+多久恢复到下期费率
* 如果没有 nextRate，则直接展示当前费率
*/
  renderRateText(rateInfo) {
    if (!rateInfo || !rateInfo.currentRate) {
      return '--';
    }
    const currentRate = rateInfo.currentRate && times(rateInfo.currentRate, 100);
    const nextRate = rateInfo.nextRate && times(rateInfo.nextRate, 100);
    const currentRateExpiredDate = rateInfo.currentRateExpiredDate && format(new Date(rateInfo.currentRateExpiredDate));
    if (nextRate) {
      return `${currentRate}% (${currentRateExpiredDate}后恢复为${nextRate}%)`;
    }
    return `${currentRate}%`;
  },

  render() {
    const { pagination, loading } = this.state;
    const rateInfo = this.props.rateInfo || {};
    const RateList = this.state.RateList || [];
    const columns = [
      {
        dataIndex: 'createTime',
        render(time) {
          return time ? (<span>{format(new Date(time))} {formatTimeHm(new Date(time))}</span>) : '';
        },
      },
      {
        dataIndex: 'opName',
      },
      {
        dataIndex: 'action',
        render(v) {
          if (v === 'INVALID_SHOP_RATE') {
            return (<p>修改费率为</p>);
          } else if (v === 'MODIFY_SHOP_RATE') {
            return (<p>修改费率为</p>);
          } else if (v === 'CREATE_SHOP_RATE') {
            return (<p>创建费率为</p>);
          }
        },
      },
      {
        dataIndex: 'rate',
        render(rate, r) {
          if (r.action === 'INVALID_SHOP_RATE') {
            return (<p>失效状态</p>);
          }
          const text = rate ? times(rate, 100) + '%' : '';
          return (<p>{text}</p>);
        },
      },
    ];
    return (<div>
      <Modal footer={null}
        title="门店费率"
        visible={this.state.visible}
        onCancel={this.cancelRateListModal}>
        <div style={{width: 500}}>
          <Alert style={{marginTop: '15px', marginBottom: '15px'}} message="费率: 指开店成功后，口碑在每笔交易中向商户收取的服务费." type="info" showIcon />
          <Table className="kb-shop-list-table"
            columns={columns}
            showHeader={false}
            dataSource={RateList}
            rowKey={r => r.orderId}
            size="small"
            loading={loading}
            pagination={pagination}
            onChange={this.onTableChange} />
        </div>
      </Modal>
      <a onClick={this.showRateList}>{this.renderRateText(rateInfo)}</a>
    </div>);
  },
});

export default RateListModal;
