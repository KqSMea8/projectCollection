import React, {PropTypes} from 'react';
import ajax from '../../../common/ajax';
import {statusMap} from '../common/ShopStatusSelect';
import Table from '../../../common/Table';
import Qrcode from '../common/Qrcode';
import QrcodeDownload from '../common/QrcodeDownload';
import {remoteLog} from '../common/utils';
import {checkIsCancelShop} from '../common/CancelShop';
import {message, Popover} from 'antd';

const MyShopListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    const columns = [
      {
        title: window.APP.roleType === 'MALL_MERCHANT' ? '门店名称/门店ID/二维码' : '门店名称/门店ID/二维码/所属综合体',
        dataIndex: 'shopName',
        width: 300,
        render(text, record) {
          const content = (
            <div>
              <div>此提交的门店无门店营业执照等证件信息，仅供门店使用一体机可</div>
              <div>做相应的设备基础配置（如菜品管理、人员管理等）</div>
              <div style={{color: 'black', fontSize: '15px', marginTop: '10px'}}>立即升级获得更多服务：</div>
              <div style={{color: 'black'}}>1.亿级流量</div>
              <div style={{marginBottom: '15px'}}>支付宝app、口碑app平台上展出店铺和商品</div>
              <div style={{color: 'black'}}>2.会员营销</div>
              <div style={{marginBottom: '15px'}}>大数据精准触达目标用户提高客单价、复购率等</div>
              <div style={{color: 'black'}}>3.生态服务</div>
              <div style={{marginBottom: '15px'}}>携手运营服务商和生态服务者，提供支付接入、营销等系列服务</div>
              <div style={{color: 'black'}}>4.运营指导</div>
              <div>60个地级市近千万名小二，365天提供政策咨询，运营指导等服务</div>
            </div>
            );
          return (<div>
            <Qrcode id={record.shopId} shopName={text} shopType={record.shopType} partnerId={record.merchantPid} style={{display: 'inline-block', verticalAlign: 'top'}}/>
            <div style={{display: 'inline-block', verticalAlign: 'top', marginLeft: 20}}>
              {text}
              {
                record.posShop === '1' &&
                <Popover content={content} title="待升级">
                  <span style={{color: 'white', background: '#F56A00', padding: '3px', marginLeft: '5px', borderRadius: '5px'}}>待升级</span>
                </Popover>
              }<br/>
              {record.shopId}<br/>
              <span style={{color: '#ff650c'}}>{record.mallName || ''}</span>
            </div>
          </div>);
        },
      },
      {
        title: '地址/联系方式',
        dataIndex: 'address',
        width: 300,
        render(text, record) {
          const address = [record.provinceName, record.cityName, record.districtName].filter(r => r).join('-') + ' ' + text;
          const tel = 'Tel：' + record.mobile;
          return (<div>
            <div>{address}</div>
            {tel}
          </div>);
        },
      },
      {
        title: '门店状态',
        dataIndex: 'status',
        width: 150,
        render(text) {
          return statusMap[text] || text;
        },
      },
      {
        title: '操作',
        dataIndex: '',
        width: 150,
        render: (text, record) => {
          if (record.posShop === '1') {
            return (<a onClick={this.gotoUpgrade.bind(this, record.shopId)}>免费升级</a>);
          }
          if (record.shopType === 'MALL') {
            return (<span>
              <a href={'#/mall/detail/' + record.shopId} target="_blank">查看</a>
              <span className="ant-divider"></span>
              <a href={'#/mall/list/' + record.shopId} target="_blank">管理</a>
            </span>);
          }
          return (<span>
            <a href="#" onClick={this.gotoDetail.bind(this, record.shopId)}>查看</a>
            {record.status === 'OPEN' && <span className="ant-divider"></span>}
            {record.status === 'OPEN' && <a onClick={checkIsCancelShop.bind(this, record.shopId, 'shop', this.gotoEdit, this.refresh)}>修改</a>}
          </span>);
        },
      },
    ];
    return {
      columns,
      data: [],
      loading: true,
      selectedIds: [],
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

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
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

  onSelectChange(selectedRowKeys) {
    if (selectedRowKeys.length > 100) {
      return message.info('最多可选100条数据');
    }
    this.setState({
      selectedIds: selectedRowKeys,
    });
  },

  gotoDetail(shopId, e) {
    e.preventDefault();
    remoteLog('SHOP_MY_DETAIL');
    window.open('#/shop/detail/' + shopId);
  },

  gotoEdit(shopId) {
    remoteLog('SHOP_MY_EDIT');
    location.href = '?mode=modify#/shop/edit/' + shopId;
  },

  gotoUpgrade(shopId) {
    location.href = '?mode=modify#/shop/edit/' + shopId + '/upgrade';
  },

  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    });
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    params.shopExtInfos = 'BIZ_CHANNEL=ALL'; // shopExtInfos = 'BIZ_CHANNEL=ALL' 表示结果包含简易门店
    this.setState({
      loading: true,
    });

    ajax({
      url: '/shop/crm/myShops.json',
      method: 'get',
      type: 'json',
      data: params,
      success: (response) => {
        const data = response.data || {};
        const pagination = {...this.state.pagination};
        pagination.total = data.totalItems;
        this.setState({
          loading: false,
          data: data.data || [],
          pagination,
        });
      },
    });
  },

  render() {
    const {loading, data, pagination, selectedIds, columns} = this.state;
    let buttonArea = null;
    if (window.APP.roleType !== 'MALL_MERCHANT') {
      this.rowSelection = {
        selectedRowKeys: selectedIds,
        onChange: this.onSelectChange,
      };
      buttonArea = (
        !loading && data && data.length > 0 && (<div>
            <span style={{marginRight: 12}}>已选({selectedIds.length})</span>
            <QrcodeDownload buttonType="primary" selectedIds={selectedIds} />
          </div>
        )
      );
    }

    return (
      <div>
        {window.APP.roleType === 'MALL_MERCHANT' ? (
          <div>
            <Table columns={columns}
              rowKey={r => r.shopId}
              dataSource={data}
              loading={loading}
              pagination={pagination}
              firstShow={!this.props.params}
              bordered
              onChange={this.onTableChange} />
          </div>
        ) : (
          <div>
            {buttonArea && <div style={{marginBottom: 10}}>{buttonArea}</div>}
              <Table columns={columns}
              rowKey={r => r.shopId}
              rowSelection={this.rowSelection}
              dataSource={data}
              loading={loading}
              pagination={pagination}
              firstShow={!this.props.params}
              bordered
              onChange={this.onTableChange} />
            {buttonArea && <div style={{marginTop: -44}}>{buttonArea}</div>}
          </div>
        )}
      </div>
    );
  },
});
export default MyShopListTable;
