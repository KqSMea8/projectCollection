import { Table, message, Modal, Button } from 'antd';
import ajax from '@alipay/kb-framework/framework/ajax';
import React from 'react';
import ShelvedAction from './ShelvedAction';
import TransactionModal from './TransactionModal';
import { getQueryFromURL } from '../../../common/utils';
import { getGenericChangeStatus} from '../common/utils';

const classNameMap = {
  'INIT': 'color-orange',
  'WAIT_TO_AUDIT': 'color-gray',
};
const showChangeStatuses = Object.keys(classNameMap);

class ShelvedTable extends React.Component {
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
        title: '原价',
        width: 100,
        render: (text, record) => {
          return record.oriPrice || '-';
        },
      },
      {
        title: '优惠价',
        width: 140,
        render: (text, record) => {
          let content = <p>{record.price || '-'}</p>;
          const changeStatus = getGenericChangeStatus(record.changeBrief);
          if (showChangeStatuses.indexOf(record.viewStatus) > -1 && changeStatus.priceChanged) {
            content = <p><p>{record.price || '-'}</p><p className={classNameMap[record.viewStatus]}>异动:更新为{record.changeBrief.priceCurrent}元</p></p>;
          }
          return content;
        },
      },
      {
        title: '适用门店',
        width: 150,
        render: (text, record) => {
          let content = <p>{`${record.saleShopCount}家门店`}</p>;
          const changeStatus = getGenericChangeStatus(record.changeBrief);
          if (showChangeStatuses.indexOf(record.viewStatus) > -1 && changeStatus.shopChanged) {
            content = <p><p>{`${record.saleShopCount}家门店`}</p><p className={classNameMap[record.viewStatus]}>异动:新增{record.changeBrief.shopRecentIncreaseCount}家</p></p>;
          }
          return content;
        },
      },
      {
        title: '库存',
        width: 95,
        dataIndex: 'inventory'
      },
      {
        title: '商品有效期',
        width: 150,
        dataIndex: 'validDays',
        render: (text) => {
          return text ? '购买后' + text + '天有效' : '-';
        }
      },
      {
        title: '异动状态',
        width: 110,
        dataIndex: 'viewStatusName'
      },
      {
        title: '操作',
        width: 150,
        render: (text, record) => {
          return (<ShelvedAction partnerName={this.partnerName} handleTransaction={this.handleTransaction} record={record} />);
        }
      }
    ];
    this.state = {
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: false,
        pageSize: 10,
        current: 1,
        pageSizeOptions: ['10', '20'],
      },
      loading: false,
      selectCommodityModalVisible: false,
      transactionModalVisible: false,
      selectedRecord: {}
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
      this.setState({ loading: true });
      ajax({
        url: window.APP.kbservindustryprodUrl + '/item/leads/queryItemsByPartnerId.json',
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
  handleTransaction = (record) => {
    if (record.itemLocked === true) {
      Modal.confirm({
        title: '该商品已在活动中',
        content: '如要处理异动修改，请及时联系商户退出平台活动后，商户才能确认修改内容。',
        okText: '继续处理',
        onOk: (close) => {
          close();
          this.setState({
            transactionModalVisible: true,
            selectedRecord: record
          });
        }
      });
    } else {
      this.setState({
        transactionModalVisible: true,
        selectedRecord: record
      });
    }
  }
  handleTransactionModalOk = () => {
    const { itemId, changeBrief = {} } = this.state.selectedRecord;
    const { priceLastChangeDate, shopLastChangeDate, priceCurrent, shopCompletedChangeDate } = changeBrief;
    const data = {
      partnerId: this.props.params.partnerId,
      itemId,
    };
    const changeStatus = getGenericChangeStatus(changeBrief);
    if (changeStatus.priceChangeShouldSubmit) {
      data.priceLastChangeDate = priceLastChangeDate;
      data.priceCurrent = priceCurrent;
    }
    if (changeStatus.shopChangeShouldSubmit) {
      data.shopLastChangeDate = shopLastChangeDate;
      data.shopCompletedChangeDate = shopCompletedChangeDate;
    }
    this.setState({ applyItemChanging: true });
    ajax({
      url: window.APP.kbservindustryprodUrl + '/item/leads/change/applyItemLeadsChange.json',
      method: 'post',
      data: data,
      type: 'json',
      success: (result) => {
        this.setState({
          applyItemChanging: false
        });
        if (result && result.status === 'succeed') {
          this.setState({
            transactionModalVisible: false
          });
          if (result.data && result.data.desc) {
            Modal.warning({
              title: result.data.desc,
              okText: '知道了',
            });
          } else {
            message.success('异动处理成功', 1);
          }
          this.refresh();
        } else {
          message.error((result && result.data && result.data.desc) || '异动处理失败', 1);
        }
      }
    }).catch(() => {
      this.setState({
        applyItemChanging: false
      });
    });
  }
  handleTransactionModalCancel = () => {
    this.setState({
      transactionModalVisible: false
    });
  }
  render() {
    const { data, pagination, loading, transactionModalVisible,
      selectedRecord, applyItemChanging } = this.state;
    return (
      <div className="activity-table">
        <div>
          <Table columns={this.columns}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={this.onTableChange}
            rowKey={record => record.itemId} />
        </div>
        {transactionModalVisible ? <TransactionModal
          visible={transactionModalVisible}
          data={selectedRecord}
          onOk={this.handleTransactionModalOk}
          onCancel={this.handleTransactionModalCancel}
          loading={applyItemChanging}
        /> : null}
      </div>
    );
  }
}

export default ShelvedTable;
