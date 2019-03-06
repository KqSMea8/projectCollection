import React from 'react';
import ajax from 'Utility/ajax';
import {Modal, Button, Table, message} from 'antd';
import {number2DateTime} from '../../common/dateUtils';

const ShowSKUDetails = React.createClass({

  getInitialState() {
    this.columns = [
      {
        title: '编号',
        dataIndex: 'activitySource',
        key: 'activitySource',
      }, {
        title: '门店名称',
        dataIndex: 'shopName',
        key: 'shopName',
      }, {
        title: '门店ID',
        dataIndex: 'shopId',
        key: 'shopId',
      }, {
        title: '外部门店编号',
        dataIndex: 'outerShopId',
        key: 'outerShopId',
      }, {
        title: '业态',
        dataIndex: 'shopIndustry',
        key: 'shopIndustry',
      }, {
        title: '归属大区',
        dataIndex: 'shopArea',
        key: 'shopArea',
      }, {
        title: '券SKU总数量',
        dataIndex: 'skuCount',
        key: 'skuCount',
      }, {
        title: '已回传SKU',
        dataIndex: 'skuBackCount',
        key: 'skuBackCount',
      }, {
        title: '未回传SKU',
        dataIndex: 'skuNotBackCount',
        key: 'skuNotBackCount',
      }, {
        title: 'SKU回传比例',
        dataIndex: 'backRatio',
        key: 'backRatio',
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
      loading: false,
      data: {},
    };
  },

  componentDidMount() {
    this.getData({
      pageNo: 1,
      pageSize: 10,
    });
  },

  onTableChange(pagination) {
    this.getData({
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    });
    this.setState({pagination});
  },

  getData(pageParams) {
    const params = {
      ...pageParams,
      voucherId: this.props.voucherId,
      partnerId: this.props.partnerId,
    };
    this.setState({loading: true});
    ajax({
      url: window.APP.kbretailprodUrl + '/voucherSkuCheckKb.json',
      method: 'get',
      data: {
        biz: 'supermarket.skucheck',
        action: '/skuCheck/shopSkuCheckKb',
        data: JSON.stringify(params),
      },
      success: (res) => {
        if (res.success) {
          const pagination = {...this.state.pagination};
          pagination.total = res.totalNum;
          this.setState({
            loading: false,
            data: res,
            pagination,
          });
        } else {
          this.setState({
            loading: false,
            data: {},
          });
          message.error(res.errorMsg);
        }
      },
      error: (res) => {
        this.setState({
          loading: false,
          data: {},
        }, () => {
          message.error(res.errorMsg);
        });
      },
    });
  },

  downloadSku() {
    const datas = {
      voucherId: this.props.voucherId,
      partnerId: this.props.partnerId,
    };
    window.location = `${window.APP.kbretailprodUrl}/downloadSkuCheckKb.htm?biz=supermarket.skucheck&action=/skuCheck/shopSkuKbExcel&data=${JSON.stringify(datas)}`;
  },

  closeModal() {
    this.props.closeModal();
  },

  render() {
    const {visible} = this.props;
    const {pagination, loading, data} = this.state;
    const {current, pageSize} = this.state.pagination;
    const {voucherInfo} = data || {};
    const time = number2DateTime(new Date(data.updateTime));
    if (data.shopSkuCheckList) {
      data.shopSkuCheckList.map((item, i) => {
        item.activitySource = (current - 1) * pageSize + i + 1;
      });
    }
    // let loadingDiv = (
    //   <div style={{width: '100%', height: 300}}>
    //     <div style={{fontSize: 50, float: 'left', margin: '100px 0 0 463px'}}>
    //       <Icon type="loading"/>
    //     </div>
    //   </div>
    // );
    return (
      <div style={{position: 'relative'}}>

        <Modal
          title="商户单品SKU回传验证"
          width="1000px"
          visible={visible}
          onOk={this.closeModal}
          onCancel={this.closeModal}>

          {
            data.success && voucherInfo &&
              [(<div style={{fontSize: 14, fontWeight: 900, marginBottom: 10}}>
              <p>商户名称：{voucherInfo.partnerName}</p>
              <p>商户ID：{voucherInfo.partnerId}</p>
              <p>券名称：{voucherInfo.voucherName}</p>
              <p>券ID：{voucherInfo.voucherId}</p>
            </div>),
              (<p style={{marginBottom: 5}}>截止至{time}，验证结果如下：</p>),
              (<Button type="primary" style={{position: 'absolute', right: 17, top: 150}} onClick={this.downloadSku}>下载验证详单</Button>),
              ]
          }

          <Table
            columns={this.columns}
            dataSource={data.shopSkuCheckList}
            pagination={pagination}
            loading={loading}
            onChange={this.onTableChange}
            rowKey={ r => r.activitySource}/>
        </Modal>
      </div>
    );
  },
});

export default ShowSKUDetails;

