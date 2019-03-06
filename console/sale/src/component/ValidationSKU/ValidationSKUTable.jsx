import React from 'react';
import {Table, Dropdown, Menu, Icon, message} from 'antd';
import ajax from 'Utility/ajax';
import ShowSKUDetails from './ShowSKUDetails';
const MenuItem = Menu.Item;

const ValidationSKUTable = React.createClass({

  getInitialState() {
    this.columns = [
      {
        title: '商户PID',
        width: 180,
        dataIndex: 'partnerId',
        key: 'partnerId',
      }, {
        title: '商户名称',
        dataIndex: 'partnerName',
        key: 'partnerName',
        width: 140,
      }, {
        title: '商户分层',
        width: 140,
        dataIndex: 'partnerLevel',
        key: 'partnerLevel',
      }, {
        title: '归属大区',
        width: 90,
        dataIndex: 'partnerArea',
        key: 'partnerArea',
      }, {
        title: '券时间',
        width: 140,
        dataIndex: 'voucherDuring',
        key: 'voucherDuring',
      }, {
        title: '券名称',
        dataIndex: 'voucherName',
        key: 'voucherName',
        width: 100,
      }, {
        title: '券ID',
        dataIndex: 'voucherId',
        key: 'voucherId',
        width: 240,
      }, {
        title: '券状态',
        dataIndex: 'voucherStatus',
        key: 'voucherStatus',
        width: 80,
      }, {
        title: '券适用门店数',
        dataIndex: 'shopCount',
        key: 'shopCount',
        width: 120,
      }, {
        title: '券SKU总数量',
        dataIndex: 'skuCount',
        key: 'skuCount',
        width: 100,
      }, {
        title: '已回传SKU',
        dataIndex: 'skuBackCount',
        key: 'skuBackCount',
        width: 100,
      }, {
        title: '未回传SKU',
        dataIndex: 'skuNotBackCount',
        key: 'skuNotBackCount',
        width: 100,
      }, {
        title: 'SKU回传比例',
        dataIndex: 'backRatio',
        key: 'backRatio',
        width: 120,
      }, {
        title: '归属BD',
        dataIndex: 'partnerBD',
        key: 'partnerBD',
        width: 80,

      }, {
        title: '操作',
        width: 240,
        fixed: 'right',
        render: (r) => {
          return (<div>
            <a onClick={() => this.showModal(r.partnerId, r.voucherId)}>按门店查看</a>  |

            <Dropdown overlay={
              <Menu>
                <MenuItem><a onClick={() => this.onPartnerIdDownload(r.partnerId)}>按商户下载详单</a></MenuItem>
                <MenuItem><a onClick={() => this.onDownload(r.partnerId, r.voucherId)}>按活动下载详单</a></MenuItem>
              </Menu>
            }>
              <a className="ant-dropdown-link">下载<Icon type="down" style={{marginRight: 8, fontSize: 10}}/></a>
            </Dropdown>
          </div>);
        },
      }
    ];
    return {
      type: '',
      visible: false,
      data: [],
      isAllowModifyShop: false,
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
      partnerId: '',
      voucherId: '',
    };
  },

  componentDidMount() {
    this.fetch({
      pageNo: 1,
      pageSize: 10,
    });
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
    this.fetch({
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    });
    this.setState({pagination});
  },

  onDownload(partnerId, voucherId) {
    const params = {
      partnerId,
      voucherId,
    };
    window.location = `${window.APP.kbretailprodUrl}/downloadSkuCheckKb.htm?biz=supermarket.skucheck&action=/skuCheck/voucherSkuSingleKbExcel&data=${JSON.stringify(params)}`;
  },

  onPartnerIdDownload(partnerId) {
    const params = {
      partnerId,
    };
    window.location = `${window.APP.kbretailprodUrl}/downloadSkuCheckKb.htm?biz=supermarket.skucheck&action=/skuCheck/voucherSkuAllKbExcel&data=${JSON.stringify(params)}`;
  },

  fetch(pageParams) {
    const params = {
      ...this.props.params,
      ...pageParams,
    };
    this.setState({loading: true});
    ajax({
      url: window.APP.kbretailprodUrl + '/voucherSkuCheckKb.json',
      // url: 'http://kbretailprod-d2240.alipay.net/voucherSkuCheckKb.json',
      method: 'get',
      data: {
        biz: 'supermarket.skucheck',
        action: '/skuCheck/voucherSkuCheckKb',
        data: JSON.stringify(params),
      },
      type: 'json',
      success: (res) => {
        if (res.success) {
          const pagination = {...this.state.pagination};
          pagination.total = res.totalNum;
          this.setState({
            loading: false,
            data: res.voucherSkuCheckList,
            pagination,
          });
        } else {
          this.setState({
            loading: false,
            data: [],
          });
          message.error(res.errorMsg);
        }
      },
      error: (res) => {
        this.setState({
          loading: false,
          data: [],
        }, () => {
          message.error(res.errorMsg);
        });
      },
    });
  },

  closeModal() {
    this.setState({
      visible: false,
      partnerId: '',
      voucherId: '',
    });
  },

  showModal(partnerId, voucherId) {
    this.setState({
      visible: true,
      partnerId,
      voucherId,
    });
  },

  render() {
    const {pagination, loading, visible, data, voucherId, partnerId} = this.state;

    return (
      <div style={{marginTop: 20}}>
        <Table bordered
               columns={this.columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               onChange={this.onTableChange}
               scroll={{x: 1960}}
        />
        {
          visible && <ShowSKUDetails visible={visible} closeModal={this.closeModal} voucherId={voucherId} partnerId={partnerId}/>
        }
      </div>

    );
  },
});

export default ValidationSKUTable;
