import React from 'react';
import {message, Button, Spin, Icon, Table} from 'antd';
import {SearchInput} from 'hermes-react';
import BatchTaskModal from '../../../shop/common/BatchTaskModal';
import ajax from '../../../../common/ajax';
import {getCategoryId} from '../../common/utils';
import {isFromKbServ, getMerchantId, kbScrollToTop} from '../../../../common/utils';

const ServiceInfo = React.createClass({
  getInitialState() {
    return {
      hasOpenedShops: false,
      loading: true,
      tableLoading: false,
      button: null,
      data: [],
      pagination: {
        showSizeChangeer: true,
        showQuickJumper: true,
        showTotal: (total) => `共${total}个记录`,
        current: 1,
        pageSize: 10,
        total: 0,
      },
      shopId: '',
      shopName: '',
      batchTaskModalVisible: false,
      categoryId: getCategoryId(),
    };
  },
  componentDidMount() {
    this.fetch();
  },
  componentWillReceiveProps() {
    if (this.state.categoryId !== getCategoryId()) {
      this.setState({
        categoryId: getCategoryId(),
      });
    }
  },
  componentDidUpdate(prevProps, prevState) {
    const {hasOpenedShops} = this.state;
    if (prevState.hasOpenedShops !== hasOpenedShops) {
      this.setButton();
    }
    if (prevState.categoryId !== getCategoryId()) {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    }
  },
  onSearch(value) {
    const isId = /^\d+$/.test(value);
    this.setState({
      shopId: isId ? value : '',
      shopName: !isId ? value : '',
    }, () => {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    });
  },
  onTableChange(pagination) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    this.fetch();
  },
  setButton() {
    const {hasOpenedShops} = this.state;
    let button = null;
    if (hasOpenedShops) {
      button = <Button style={{position: 'absolute', top: 0, right: 16, zIndex: 1}} type="primary" onClick={this.batchEdit}>批量修改</Button>;
    }
    if (window.location.hash.indexOf('/service') > -1) {
      this.setState({
        button,
      });
    }
  },
  getColumns() {
    const {goDetail, goEdit} = this;
    const columns = [{
      title: '门店ID',
      dataIndex: 'shopId',
    }, {
      title: '门店名称',
      dataIndex: 'shopName',
    }, {
      title: '特色标签',
      dataIndex: 'serviceList',
      render: text => text ? `${text.length}个标签` : '--',
    }, {
      title: '操作',
      width: 100,
      render(text, record) {
        return (<div>
          <a style={{marginRight: 10}} onClick={() => goDetail(record.shopId)}>查看</a>
          <a onClick={() => goEdit(record.shopId)}>修改</a>
        </div>);
      },
    }];
    return columns;
  },
  fetch() {
    const {pagination, shopId, shopName, categoryId} = this.state;
    const {current, pageSize} = pagination;
    this.setState({
      tableLoading: true,
    });
    const params = {
      categoryCode: categoryId,
      pageNum: current,
      pageSize,
      shopId,
      shopName,
    };
    ajax({
      url: '/shop/queryShopServiceList.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (data) => {
        if (data.status === 'succeed') {
          const result = data.result;
          result.shopServiceVO.forEach((v) => v.key = v.shopId);
          pagination.total = result.totalSize;
          this.setState({
            hasOpenedShops: !!result.totalSize && result.totalSize > 0,
            data: result.shopServiceVO,
            loading: false,
            tableLoading: false,
            pagination,
          });
        } else {
          message.error(data.resultMsg);
        }
      },
      error: (_, msg) => {
        message.error(msg);
      },
    });
  },
  goDetail(id) {
    kbScrollToTop();
    window.location.hash = '/decoration/' + getCategoryId() + '/service/detail/' + id;
  },
  goEdit(id) {
    kbScrollToTop();
    window.location.hash = '/decoration/' + getCategoryId() + '/service/edit/' + id;
  },
  batchEdit() {
    this.setState({
      batchTaskModalVisible: true,
    });
  },
  closeBatchModal() {
    this.setState({
      batchTaskModalVisible: false,
    });
  },
  render() {
    const {hasOpenedShops, loading, tableLoading, button, data, pagination, categoryId, shopId, shopName} = this.state;
    let content;
    if (!loading) {
      if (tableLoading || hasOpenedShops || shopId || shopName) {
        const kbParams = {
          isFromKbServ: isFromKbServ(),
          op_merchant_id: getMerchantId(),
        };
        content = (<div className="service-list">
          {button}
          <div className="content-head">
            <SearchInput placeholder="门店ID/门店名称" onSearch={this.onSearch} style={{ width: 230 }} />
          </div>
          <Table columns={this.getColumns()}
            dataSource={data}
            loading={tableLoading}
            pagination={pagination}
            onChange={this.onTableChange} />
            <BatchTaskModal
              batchTaskType="MODIFY_CONTENT"
              searchParams={{categoryId}}
              kbParams={kbParams}
              visible={this.state.batchTaskModalVisible}
              onFinish={this.closeBatchModal} />
        </div>);
      } else {
        content = (<div className="no-content">
          <p style={{paddingLeft: '80px'}}>
            <Icon style={{fontSize: 24, paddingRight: 5, verticalAlign: 'middle'}} type="meh" />
            <span>没有审核通过的门店，无法添加服务信息</span>
            <a href="/shop.htm#/shop" style={{position: 'relative', bottom: '-28px', left: '-251px'}}>查看我的门店</a>
          </p>
        </div>);
      }
    } else {
      content = (<Spin />);
    }
    return (<div style={{padding: '0 16px 32px'}}>
      {content}
    </div>);
  },
});

export default ServiceInfo;
