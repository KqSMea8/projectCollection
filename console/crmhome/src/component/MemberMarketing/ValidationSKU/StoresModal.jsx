import React from 'react';
import {Table, Spin, message} from 'antd';
import {dateFormat} from '../../../common/dateUtils';
import ajax from '../../../common/ajax';

const StoresModal = React.createClass({

  getInitialState() {
    this.columns = [{
      title: '编号',
      dataIndex: 'rowKey',
      render: (text) => {
        const {current, pageSize} = this.state.pagination;
        return (<div>{(current - 1) * pageSize + text}</div>);
      },
    }, {
      title: '门店名称',
      dataIndex: 'shopName',
    }, {
      title: '门店ID',
      dataIndex: 'shopId',
    }, {
      title: '券SKU总数量',
      dataIndex: 'skuCount',
    }, {
      title: '已回传SKU',
      dataIndex: 'skuBackCount',
    }, {
      title: '未回传SKU',
      dataIndex: 'skuNotBackCount',
    }, {
      title: 'SKU回传比例',
      dataIndex: 'backRatio',
    }];

    return {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
      loading: true,
      data: {},
    };
  },

  componentDidMount() {
    this.getData({});
  },

  onTableChange(pagination) {
    this.getData({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
    this.setState({pagination});
  },

  getData(pageParams) {
    const datas = {
      pageNo: pageParams.current || 1,
      pageSize: pageParams.pageSize || 10,
      voucherId: this.props.voucherId,
    };
    this.setState({loading: true});
    ajax({
      url: window.APP.kbretailprod + '/gateway.htm',
      method: 'get',
      data: {
        biz: 'supermarket.skucheck',
        action: '/skuCheck/shopSkuCheck',
        data: JSON.stringify(datas),
      },
      type: 'json',
      success: (res) => {
        if (res.success) {
          const pagination = {...this.state.pagination};
          pagination.total = res.totalNum;
          this.setState({
            loading: false,
            data: res,
            pagination,
          });
          this.props.setVoucherInfo(res.voucherInfo);
        } else {
          message.error(res.errorMsg);
        }
      },
      error: () => {
        this.setState({
          loading: false,
          data: [],
        }, (res) => {
          message.error(res.errorMsg || '请求数据失败');
        });
      },
    });
  },

  render() {
    const {loading, data, pagination} = this.state;
    const shopSkuCheckLists = data.shopSkuCheckList && data.shopSkuCheckList.map((i, k) => {i.rowKey = k + 1; return i;}) || [];
    const totalData = data.voucherInfo || {haveValue: true};
    return (
      <div style={{marginTop: 20}}>
        {
          !totalData.haveValue &&
          <div style={{fontSize: 14, fontWeight: 900}}>
            <p>商户名称：{totalData.partnerName}</p>
            <p >商户ID：{totalData.partnerId}</p>
            <p >券名称：{totalData.voucherName}</p>
            <p>券ID：{totalData.voucherId}</p>
          </div>
        }

        {
          data.updateTime &&
          <p style={{ margin: '10px 0' }}>截止至{dateFormat(new Date(data.updateTime), 'yyyy')}年{dateFormat(new Date(data.updateTime), 'MM')}月{dateFormat(new Date(data.updateTime), 'dd')}日{dateFormat(new Date(data.updateTime), 'hh:mm')}，验证结果如下：</p>
        }

        {shopSkuCheckLists && shopSkuCheckLists.length > 0 &&
        <Table bordered
               columns={this.columns}
               dataSource={shopSkuCheckLists}
               pagination={pagination}
               loading={loading}
               onChange={this.onTableChange}
               rewKey={record => record.title}
        /> || <div style={{width: '100%', height: '60px', textAlign: 'center'}}><Spin /></div>}
      </div>

    );
  },
});

export default StoresModal;
