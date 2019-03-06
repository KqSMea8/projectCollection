import { Table, message, Tag } from 'antd';
import ajax from 'Utility/ajax';
import React, {PropTypes} from 'react';
import MoreAction from './MoreAction';
import {typeMap, statusMap, typeMapAdd, type2HashMap, type2HashMapAdd,
  ticketDisplayModeMap, type2HashMapAddV2, typeMapAddV2} from '../common/GoodsConfig';
import {format, formatTime} from '../../../common/dateUtils';

const GoodsListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    isSaleStage: PropTypes.bool,
    isV2: PropTypes.bool,
  },

  getInitialState() {
    const me = this;
    this.columns = [this.props.isV2 ? {
      title: '类型',
      dataIndex: 'typeDisplay',
      width: 120,
      render: (text) => {
        return typeMapAddV2[text];
      }
    } : {
      title: '类型',
      dataIndex: 'typeDisplay',
      width: 120,
      render: (text, record) => {
        if (text === 'CASH') {
          if (record.cashType === 'CASH_MONEY') {
            return '单品优惠 - 代金券';
          } else if (record.cashType === 'CASH_REDUCETO') {
            return '单品优惠 - 换购券';
          }
        } else if (text === 'SINGLE_DISCOUNT') {
          return '单品优惠 - 折扣';
        }
        return (me.props.isSaleStage ? typeMap[text] : typeMapAdd[text]) || text;
      },
    }, {
      title: `${me.props.isV2 ? '商品' : '优惠'}ID`,
      dataIndex: 'itemId',
      width: 120,
    }, {
      title: `${me.props.isV2 ? '商品' : '优惠'}名称`,
      dataIndex: 'subject',
      width: 120,
    }, {
      title: '商户名称',
      dataIndex: 'partnerName',
      width: 120,
    }, this.props.isV2 ? {
      title: '核销方式',
      dataIndex: 'settleMode',
      width: 120,
      render(t) {
        return ticketDisplayModeMap[t];
      },
    } : {
      title: '使用方式',
      dataIndex: 'useMode',
      width: 90,
      render(text, record) {
        let useStyle = '';
        if (record.typeDisplay === 'TRADE_VOUCHER' || record.typeDisplay === 'BUY_VOUCHER') {
          useStyle = '先购买再使用';
        } else if (record.useMode === '0') {
          useStyle = '需要用户领取';
        } else {
          useStyle = '无需用户领取';
        }
        return useStyle;
      },
    }, {
      title: '创建时间',
      dataIndex: 'gmtCreateMills',
      width: 80,
      render(text) {
        return format(new Date(text)) + ' ' + formatTime(new Date(text));
      },
    }, {
      title: me.props.isV2 ? '已购买/剩余库存' : '已(发)领/库存',
      dataIndex: 'salesQuantity',
      width: 100,
      render(text, record) {
        if (!me.props.isV2) {
          return text + '/' + record.totalInventory;
        }
        let inventory = +record.totalInventory - (+text);
        if (isNaN(inventory) || inventory < 0) {
          inventory = '0';
        }
        return `${text}/${inventory}`;
      },
    }, {
      title: '状态',
      dataIndex: 'statusDisplay',
      width: 90,
      render(text, record) {
        let msg;
        if (statusMap[text]) {
          msg = [statusMap[text].substr(0, 3), record.visibility === 'WHITELIST' ? <span style={{marginLeft: '5px'}}><Tag color="yellow">测</Tag></span> : '', <br/>, statusMap[text].substr(3)];
        } else {
          msg = text;
        }
        if (me.props.isV2 && text === 'PAUSE') {  // v2 特殊展示逻辑
          msg = '已下架（暂停售卖）';
        } else if (me.props.isV2 && text === 'INVALID') {
          msg = '已删除';
        }
        return msg;
      },
    }, {
      title: '当前参与的活动',
      dataIndex: 'activityNames',
      width: 120,
      render(text) {
        return text.length === 0 ? '-' : text.map((item, index) => {
          return (<div key={index}>{item}{index !== text.length - 1 ? '、' : null}</div>);
        });
      },
    }, this.props.isV2 ? {
      title: '操作',
      width: 100,
      render: (text, record) => {
        const params = {
          itemId: record.itemId,
          opMerchantId: record.partnerId,
          allowPause: record.allowPause,
          allowResume: record.allowResume,
          allowModify: record.allowModify,
          allowModifyVisibility: record.allowModifyVisibility,
          allowOffLine: record.allowOffLine,
          callback: this.refresh,
          statusDisplay: record.statusDisplay,
          type: record.typeDisplay,
        };
        return (<div>
          <a href={'#' + type2HashMapAddV2[record.typeDisplay] + record.itemId + '?v2=true'} target = "_blank">查看</a>
          {
            record.typeDisplay !== 'TRADE_VOUCHER' && <MoreAction params={params}/>
          }
          </div>
        );
      },
    } : {
      title: '操作',
      width: 100,
      render: (text, record) => {
        const params = {
          itemId: record.itemId,
          opMerchantId: record.partnerId,
          allowPause: record.allowPause,
          allowResume: record.allowResume,
          allowModify: record.allowModify,
          allowModifyVisibility: record.allowModifyVisibility,
          allowOffLine: record.allowOffLine,
          callback: this.refresh,
          statusDisplay: record.statusDisplay,
          type: record.typeDisplay,
        };
        return (<div>
        {
          this.props.isSaleStage ? <a href={'#' + type2HashMap[record.typeDisplay] + record.itemId} target = "_blank">查看</a> :
          <a href={'#' + type2HashMapAdd[record.typeDisplay] + record.itemId} target = "_blank">查看</a>
        }
        {
          record.typeDisplay !== 'TRADE_VOUCHER' && <MoreAction params={params}/>
        }
        </div>);
      },
    }];

    return {
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        showTotal: this.showTotal,
        current: 1,
      },
      loading: false,
    };
  },

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.refresh();
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
  refresh(update) {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: update ? current : 1,
    });
  },
  showTotal(total) {
    return `共 ${total} 条`;
  },
  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    this.setState({loading: true});
    let url = window.APP.crmhomeUrl;
    if (this.props.isV2) {
      url += '/goods/koubei/itemListForSaleBuy.json';
    } else if (this.props.isSaleStage) {
      url += '/goods/koubei/itemListForSaleNotBuy.json';
    } else {
      url += '/goods/koubei/itemList.json';
    }
    ajax({
      url,
      method: 'POST',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          const data = result.data;
          const pagination = {...this.state.pagination};
          pagination.total = data.totalItems;
          pagination.current = data.pageNo;
          this.setState({
            loading: false,
            data: data.data,
            pagination,
          });
        } else {
          this.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },

  render() {
    const { data, pagination, loading } = this.state;
    return (
      <div>
        <div>
          <Table columns={this.columns}
                 dataSource={data}
                 pagination={pagination}
                 loading={loading}
                 onChange={this.onTableChange}
                 firstShow={!this.props.params}
                 rowKey={(row, index) => index}/>
        </div>
      </div>
    );
  },
});

export default GoodsListTable;
