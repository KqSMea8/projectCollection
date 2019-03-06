import { Table, Button, Modal, Tooltip, Icon } from 'antd';
import QRCode from 'qrcode.react';
import ajax from 'Utility/ajax';
import React from 'react';
import Action from './Action';
import SelectCommodityModal from './SelectCommodityModal';
import {getQueryFromURL} from '../../../common/utils';

class WaitingShelveTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        render: (text, record) => {
          return (<div className="buttons">
            {record.extInfo && (record.extInfo.huaihaiTop === true) ? <Button className="Huaihai" size="small" type="primary">淮海头部</Button> : ''}
          </div>);
        }
      },
      {
        title: '商品名称',
        dataIndex: 'subject'
      },
      {
        title: '原价｜优惠价',
        width: 150,
        render: (text, record) => {
          return (record.oriPrice || '-') + ' | ' + (record.price || '-');
        },
      },
      {
        title: '库存',
        width: 95,
        dataIndex: 'inventory'
      },
      {
        title: '商品有效期',
        width: 200,
        dataIndex: 'validDays',
        render: (text) => {
          return text ? '购买后' + text + '天有效' : '-';
        }
      },
      {
        title: '商品状态',
        width: 120,
        dataIndex: 'viewStatusName',
        render: (text, record) => {
          let content = text;
          if (record.viewStatus === 'INIT') {
            content = <span className="color-orange">{text}</span>;
          } else if (record.viewStatus === 'REJECTED') {
            content = (<span className="color-red">
                          {text}{record.memo && <Tooltip placement="top" title={record.memo}><Icon type="exclamation-circle" style={{ color: '#efce93', marginLeft: '5px' }} /></Tooltip>}
                        </span>);
          } else if (record.viewStatus === 'ON_SHELVES') {
            content = (<span>
              {text}<Tooltip placement="top" title="当前商品状态请到ISV后台查看"><Icon type="exclamation-circle" style={{ color: '#2db7f5', marginLeft: '5px' }} /></Tooltip>
            </span>);
          }
          return content;
        }
      },
      {
        title: '操作',
        width: 200,
        render: (text, record) => {
          return (<Action partnerName={this.partnerName} record={record} modifyItem={this.modifyItem} />);
        }
      }
    ];
    this.state = {
      data: [],
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: false,
        pageSize: 10,
        current: 1,
        pageSizeOptions: ['10', '20'],
      },
      loading: false,
      selectCommodityModalVisible: false,
      commodityList: [],
      commodityModalRecords: [],
      qrCodeVisible: false,
      selectedCommodity: null,
    };
  }
  componentWillMount() {
    this.partnerName = getQueryFromURL(this.props.location.search).partnerName || '';
  }
  componentWillReceiveProps() {
    this.partnerName = getQueryFromURL(this.props.location.search).partnerName || '';
  }
  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.refresh();
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
  refresh(update) {
    const { pageSize, current } = this.state.pagination;
    this.fetch({
      pageSize,
      pageNo: update ? current : 1,
    });
  }
  fetch(pageParams = {}) {
    const params = {
      ...this.props.params,
      ...pageParams
    };
    if (params.partnerId) {
      this.setState({ loading: true, selectedRowKeys: [], selectedRow: []});
      ajax({
        // url: window.APP.crmhomeUrl + '/item/leads/queryItemLeadsByPartnerId.json',
        url: window.APP.kbservindustryprodUrl + '/item/leads/queryItemLeadsByPartnerId.json',
        method: 'post',
        data: params,
        type: 'json',
        success: (result) => {
          if (result && result.status === 'succeed') {
            const pagination = { ...this.state.pagination };
            pagination.total = result.page.totalSize;
            pagination.current = result.page.currentPage;
            this.setState({
              loading: false,
              data: result.data,
              pagination,
            });
          }
        }
      }).catch(() => {
        this.setState({
          loading: false,
          data: []
        });
      });
    }
  }
  modifyItem = (record, modifyData) => {
    if (modifyData.viewStatus === 'UNDER_REVIEW') {
      this.fetchPurchasedCommodity()
          .then((list) => this.showSelectCommodityModal(list, [record]));
    }
  }
  fetchPurchasedCommodity() {
    return new Promise((resolve) => {
      this.setState({ loading: true });
      ajax({
        // url: window.APP.crmhomeUrl + '/queryCommodityPurchased.json',
        url: window.APP.kbservindustryprodUrl + '/item/leads/queryCommodityPurchased.json',
        method: 'get',
        data: {
          partnerId: this.props.params.partnerId
        },
        type: 'json',
        success: (result) => {
          this.setState({ loading: false });
          if (result && result.status === 'succeed') {
            resolve(result.data);
          }
        }
      }).catch(() => {
        this.setState({
          loading: false
        });
      });
    });
  }
  showSelectCommodityModal(list, records) {
    console.log(list);
    if (list && list.length) {
      this.setState({
        selectCommodityModalVisible: true,
        commodityList: list,
        commodityModalRecords: records
      });
    } else {
      this.setState({
        qrCodeVisible: true
      });
    }
  }
  clickBatchApplyBtn = () => {
    this.batchApplyLeadsOnSale(this.state.selectedRows);
  }
  batchApplyLeadsOnSale = (records) => {
    this.fetchPurchasedCommodity()
    .then((list) => this.showSelectCommodityModal(list, records));
  }
  requestBatchApplyLeadsOnSale(selectedCommodity) {
    const { commodityModalRecords } = this.state;
    const params = {
      leadsIds: commodityModalRecords.map((record) => record.leadsId),
      partnerId: this.props.params.partnerId,
      commodityId: selectedCommodity.commodityId
    };
    this.setState({ loading: true });
    ajax({
      url: window.APP.kbservindustryprodUrl + '/item/leads/batchApplyItemLeadsOnSale.json',
      // url: 'http://kbservindustryprod-d5098.alipay.net/item/leads/batchApplyItemLeadsOnSale.json',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        this.setState({ loading: false });
        if (result && result.status === 'succeed') {
          this.setState({
            selectCommodityModalVisible: false,
            selectedCommodity: null,
          });
          Modal.success({
            title: '提交成功，请等待商户确认。',
            content: '您可以主动联系商户进行确认，并加快商品上架时间。',
            onOk: () => {
              this.refresh();
            }
          });
        }
      }
    }).catch(() => {
      this.setState({
        loading: false
      });
    });
  }
  handleSelectCommodityModalOk = (selectedCommodity) => {
    this.requestBatchApplyLeadsOnSale(selectedCommodity);
  }
  handleSelectCommodityModalCancel = () => {
    this.setState({
      selectCommodityModalVisible: false,
      selectedCommodity: null
    });
  }
  handleQrcodeModalOk = () => {
    this.setState({
      qrCodeVisible: false
    });
  }
  handleQrcodeModalCancel = () => {
    this.setState({
      qrCodeVisible: false
    });
  }
  handleSelectedCommodityChange = (selectedCommodity) => {
    this.setState({ selectedCommodity });
  }
  rowSelectionChange(selectedRowKeys, selectedRows) {
    this.setState({
      selectedRows,
      selectedRowKeys
    });
  }
  render() {
    const { data, pagination, loading, selectCommodityModalVisible,
      commodityList, qrCodeVisible, selectedCommodity, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (_selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys: _selectedRowKeys
        });
      },
      getCheckboxProps(record) {
        return {
          disabled: record.viewStatus === 'INIT' || record.viewStatus === 'UNDER_REVIEW' || record.viewStatus === 'ON_SHELVES'
        };
      }
    };
    return (
      <div className="activity-table">
        <div>
          <Table columns={this.columns}
            rowSelection={rowSelection}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={this.onTableChange}
            firstShow={!this.props.params}
            rowKey={record => record.leadsId} />
        </div>
        <Button type="primary" onClick={this.clickBatchApplyBtn} className="batchapplyleadsonsale-btn" disabled={selectedRowKeys.length === 0}>批量提交上架</Button>
        <SelectCommodityModal visible={selectCommodityModalVisible} selectedCommodity={selectedCommodity} list={commodityList} onOk={this.handleSelectCommodityModalOk} onCancel={this.handleSelectCommodityModalCancel} onChange={this.handleSelectedCommodityChange} loading={loading} />
        <Modal
          className="selectcommodity-qrcode-modal"
          visible={qrCodeVisible}
          title="选择应用"
          onOk={this.handleQrcodeModalOk}
          onCancel={this.handleQrcodeModalCancel}
          footer={[
            <Button key="submit" type="primary" size="large" onClick={this.handleQrcodeModalOk}>
              知道了
            </Button>,
          ]}>
          <p className="title"><Icon type="info-circle" style={{ color: '#1F90E6', marginRight: '10px' }} />商户未订购可用的商品管理服务</p>
          <p>您可以打开“钉钉－扫一扫”，扫描下方二维码，</p>
          <p>为商户订购商品管理服务，并在手机中完成剩余操作。</p>
          {this.partnerName ? <QRCode size={128} value={`https://render.alipay.com/p/h5/IntelligentProd-dingtalk/www/index.html#/goodslist?pid=${this.props.params.partnerId}&merchantName=${encodeURIComponent(this.partnerName)}`} />
            :
            <img src="https://zos.alipayobjects.com/rmsportal/hQNpPekyfwMWrwIvyKyV.png" />
          }
        </Modal>
      </div>
    );
  }
}

export default WaitingShelveTable;
