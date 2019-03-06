import React, {PropTypes} from 'react';
import {Popover, Alert, Table, message} from 'antd';
import {format, dateFormat} from '../../../common/dateUtils';
import {accMul} from '../../../common/utils';
import ajax from '../../../common/ajax';

const RatePopover = React.createClass({
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
        current: 1,
      },
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
      url: '/shop/crm/queryRateOrder.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          this.setState({
            RateList: result.data.data,
            loading: false,
          });
        } else {
          this.setState({
            loading: false,
          });
          message.error(result);
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

  /*
   * 当前费率文案展示方式
   * 如果有 nextRate （下期费率），则展示当前费率+多久恢复到下期费率
   * 如果没有 nextRate，则直接展示当前费率
   */
  renderRateText(rateInfo) {
    if (!rateInfo || !rateInfo.currentRate) {
      return '--';
    }

    const currentRate = rateInfo.currentRate && accMul(rateInfo.currentRate, 100);
    const nextRate = rateInfo.nextRate && accMul(rateInfo.nextRate, 100);
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
          return time ? dateFormat(new Date(time)) : '';
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
          const text = rate ? accMul(rate, 100) + '%' : '';
          return (<p>{text}</p>);
        },
      },
    ];

    return (<div>
      <Popover content={<div style={{width: 500}}>
        <Alert style={{marginTop: '15px', marginBottom: '15px'}} message="费率: 指开店成功后，口碑在每笔交易中向商户收取的服务费." type="info" showIcon />
        <Table className="kb-shop-list-table"
          showHeader={false}
          columns={columns}
          dataSource={RateList}
          rowKey={r => r.orderId}
          size="small"
          loading={loading}
          pagination={pagination}
          onChange={this.onTableChange} />
      </div>} trigger="hover">
      <a>{ this.renderRateText(rateInfo) }</a>
    </Popover>
    </div>);
  },
});

export default RatePopover;
