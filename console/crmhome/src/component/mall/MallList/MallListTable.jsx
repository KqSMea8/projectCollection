import React, {PropTypes} from 'react';
import ajax from '../../../common/ajax';
import Table from '../../../common/Table';
import RemoveShop from '../common/RemoveShop';
import ShapeShop from '../common/ShapeShop';
import {statusMap} from '../../shop/common/ShopStatusSelect';
import MapModel from '../../shop/ShopMap/MapModel';
import IsLocation from './IsLocation';
import {Modal, Button, message} from 'antd';


const Indoor = window.Indoor;

const MallListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    shopStatus: PropTypes.any,
    mallId: PropTypes.any,
  },

  getInitialState() {
    const columns = [
      {
        title: '门店名称/门店ID',
        dataIndex: 'shopName',
        width: 180,
        render: (t, r) => {
          return (
            <div>
              <p>{r.shopName}</p>
              <p>{r.shopId}</p>
            </div>);
        },
      },
      {
        title: '品牌名称',
        dataIndex: 'brandName',
        width: 120,
      },
      {
        title: '地址/联系方式',
        dataIndex: 'address',
        width: 120,
        render: (text, record) => {
          return [
            text,
            <br key={1}/>,
            record.mobile ? 'Tel：' + record.mobile : '',
          ];
        },
      },
      {
        title: '品类',
        dataIndex: 'category',
        width: 120,
        render: (c) => {
          const category = JSON.parse(c);
          return [category.category.name, category.subcategory.name, category.detailcategory.name].filter(r => r).join('-');
        },
      },
      {
        title: '门店状态',
        dataIndex: 'status',
        width: 80,
        render(text) {
          return statusMap[text] || text;
        },
      },
      {
        title: (<div style={{textAlign: 'center'}}>交易数据</div>),
        dataIndex: 'authStatus',
        width: 120,
        render: (text, r) => {
          let htmlTxt = <div style={{textAlign: 'center'}}>{text}</div>;
          if (text === '已授权') {
            htmlTxt = <div style={{textAlign: 'center'}}>{text}<br />{r.authType}</div>;
          }
          return text ? htmlTxt : '';
        },
      },
      {
        title: '门店定位',
        dataIndex: 'map',
        width: 120,
        render: (text, record) => {
          return (
            <IsLocation data={record} showModal={this.showModal}/>
          );
        },
      },
      {
        title: '操作',
        dataIndex: '',
        width: 120,
        render: (text, r) => {
          return (
            <div>
              <RemoveShop type="text" buttonText="移除" mallId={this.props.mallId} onEnd={this.refresh} deletMapShopId={this.deletMapShopId} selectedIds={[r.shopId]}/>
              {r.authStatus === '已授权' || r.authStatus === '确认中' ? null : <ShapeShop type="text" buttonText="| 申请数据" mallId={this.props.mallId} onEnd={this.refresh} deletMapShopId={this.deletMapShopId} selectedIds={[r.shopId]}/>}
            </div>
          );
        },
      },
    ];
    const currentPage = localStorage.getItem('current');
    return {
      columns,
      data: [],
      loading: true,
      selectedIds: [],
      visible: false,
      buildingIdList: [],
      modalDate: {},
      map: null,
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: Number(currentPage) || 1,
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
    this.setState({
      selectedIds: selectedRowKeys,
    });
  },

  getBuilding() {
    const self = this;
    ajax({
      url: window.APP.kbretailprod + '/gateway.htm?biz=mall.map&action=/mallBuilding/query',
      method: 'get',
      type: 'json',
      data: {
        data: JSON.stringify({'mallId': this.props.mallId}),
      },
      success: (res) => {
        this.setState({
          buildingIdList: res.buildingList,
        });

        const Dmap = self.Dmap = new Indoor.Map(self.refs.deleteMap, {
          key: '1c8441e2d9e4fe2ba6fbbeefc0c0179f',
          buildingId: 'B00155MS15',
        });

        self.setState({
          map: Dmap || self.Dmap,
        });
      },
    });
  },

  getShopdataAuth(data) {
    const self = this;
    const shopList = [];
    if (data.length > 0 && data) {
      data.map((item) => {
        shopList.push(item.shopId);
      });
      ajax({
        url: window.APP.kbretailprod + '/gateway.htm?biz=mall.dataauth&action=/dataauth/query',
        method: 'get',
        data: {
          data: JSON.stringify({'mallId': self.props.mallId, 'shopIds': shopList}),
        },
        type: 'json',
        success: (result) => {
          self.pullData(result.shopDataAuth);
        },
      });
    }
  },

  pullData(data) {
    const allData = this.state.data;
    allData.map((item) => {
      item.authStatus = data[item.shopId].status;
      item.authType = data[item.shopId].authType;
    });
    this.setState({
      data: allData,
    });
  },

  shopMapEdit() {
    const modalDate = this.state.modalDate;
    localStorage.removeItem('buildingId');
    const url = 'main.htm#/shop/map/' + modalDate[0].gaodeBuildId + '/' + modalDate[0].shopId;
    location.href = url;
  },

  showModal(data) {
    this.setState({
      modalDate: data,
      visible: true,
    });
  },

  handleCancel() {
    this.setState({
      visible: false,
    });
    localStorage.setItem('current', this.state.pagination.current);
    location.reload();
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
      mallId: this.props.mallId,
    };
    this.setState({
      loading: true,
    });
    const url = '/shop/querySurroundedShops.json';
    ajax({
      url,
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        result.data = result.data || {};
        const pagination = {...this.state.pagination};
        pagination.total = result.data.totalItems;
        localStorage.removeItem('current');
        this.getBuilding();
        this.getShopdataAuth(result.data.data);
        this.setState({
          loading: false,
          selectedIds: [],
          data: result.data.data || [],
          pagination,
        });
      },
    });
  },

  deletMapShopId(data) {
    const shopId = data.relateShopId.split(',');
    const self = this;
    if (data) {
      shopId.map((items) => {
        ajax({
          url: window.APP.kbretailprodUrl + '/gaodeMap.json?action=/shopRelation/query',
          method: 'get',
          type: 'json',
          data: {
            data: JSON.stringify({'shopId': items}),
          },
          withCredentials: true,
          success: (res) => {
            if (res.success === true) {
              const list = res.shopMapRelationList || [];
              list.map((item) => {
                const dataObj = {
                  oldAreaId: item.gaodeAreaId,
                  remarks: '空店',
                };
                ajax({
                  url: encodeURI(window.APP.kbretailprod + '/gaodeMap.json?action=/shopRelation/delete&data=' + JSON.stringify(dataObj)),
                  method: 'get',
                  type: 'json',
                  withCredentials: true,
                  success: (result) => {
                    if (result.success === true) {
                      self.state.map.EditService.dataCheck();
                      self.state.map.EditService.updateShop({'ft_name_cn': '空店', 'ft_sourceid': item.gaodeAreaId, 'ft_typecode': '000400', 'ft_isnew': true}, function fn(e) {
                        if ( e.msg === 'SUCCESS' ) {
                          self.refresh();
                        } else {
                          message.error('修改失败');
                        }
                      });
                    } else {
                      message.error( result.errorMsg || '操作失败');
                    }
                  },
                });
              });
            } else {
              message.error(res.errorMsg || '系统繁忙，请稍候');
            }
          },
        });
      });
    }
  },
  render() {
    const {loading, data, pagination, selectedIds, buildingIdList, visible, modalDate, columns} = this.state;
    this.rowSelection = {
      selectedRowKeys: selectedIds,
      onChange: this.onSelectChange,
    };
    const buttonArea = (
      !loading && data && data.length > 0 && (<div>
          <span style={{marginRight: 12}}>已选({selectedIds.length})</span>
          <RemoveShop type="button" buttonText="批量移除" mallId={this.props.mallId} onEnd={this.refresh} deletMapShopId={this.deletMapShopId} selectedIds={selectedIds}/>
          <ShapeShop type="button" buttonText="申请数据" mallId={this.props.mallId} onEnd={this.refresh} deletMapShopId={this.deletMapShopId} selectedIds={selectedIds}/>
        </div>
      )
    );
    return (
      <div>
        {buttonArea && <div style={{marginBottom: 10}}>{buttonArea}</div>}
        <Table columns={columns}
          rowKey={r => r.shopId}
          rowSelection={this.rowSelection}
          loading={loading}
          dataSource={data}
          pagination={pagination}
          firstShow={!this.props.params}
          onChange={this.onTableChange} />
        {buttonArea && <div style={{marginTop: -44}}>{buttonArea}</div>}
        <Modal title="室内定位" visible={visible} onCancel={this.handleCancel} footer={null} width={800}>
          <Button type="primary" style={{position: 'absolute', right: '50px', top: '8px'}} onClick={this.shopMapEdit}>修改</Button>
          <MapModel buildingIdList ={buildingIdList} data={modalDate}/>
        </Modal>
        <div ref="deleteMap" style={{display: 'none'}}></div>
      </div>
    );
  },
});

export default MallListTable;
