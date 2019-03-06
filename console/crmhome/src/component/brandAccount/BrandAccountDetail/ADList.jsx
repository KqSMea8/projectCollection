/* eslint no-unused-vars:0 */
import React from 'react';
import { Button, Spin, Table, Popconfirm, Dropdown, Menu, Icon } from 'antd';
import fetch from '@alipay/kb-fetch';
import OpenAddADModal from './OpenAddADModal';
import NoDataEffect from './NoDataEffect';
import './ADList.less';

export default class extends React.Component {

  static propTypes = {
    brandShopId: React.PropTypes.string,
    brandId: React.PropTypes.string,
    updateNumber: React.PropTypes.func,
  };

  state = {
    loading: true,
    data: [],
  };

  componentDidMount() {
    this.reloadList();
  }

  columns = [{
    title: '排序',
    dataIndex: '',
    width: 40,
    render: (text, r, index) => {
      return <div style={{ textAlign: 'center' }}>{index + 1}</div>;
    },
  }, {
    title: '商品图片',
    dataIndex: 'imageUrl',
    width: 120,
    render: (text) => {
      return (<div className="ad_banner_img">
        <img src={text} alt="" />
      </div>);
    },
  }, {
    title: '活动时间',
    dataIndex: '',
    width: 160,
    render: (text, record) => {
      return `${record.startTime} 至 ${record.endTime}`;
    },
  }, {
    title: '跳转链接',
    dataIndex: 'advertUrlName',
    width: 120,
    render: (text) => {
      return <span style={{color: '#2db7f5'}}>{text}</span>;
    },
  }, {
    title: '操作',
    dataIndex: '',
    width: 100,
    render: (text, record, index) => {
      const menus = [(<Menu.Item key="delete">
        <Popconfirm title="确定删除吗" onConfirm={this.deleteItem.bind(this, record)}>
          <a>删除</a>
        </Popconfirm>
      </Menu.Item>)];
      if (index !== 0) {
        menus.push(<Menu.Item key="top">
          <a onClick={this.topItem.bind(this, record)}>置顶</a>
        </Menu.Item>);
      }
      return (<div style={{ textAlign: 'center' }}>
        <OpenAddADModal modifyData={record} onSuccess={this.reloadList.bind(this)}
          brandShopId={this.props.brandShopId} brandId={this.props.brandId}>
          <a style={{ paddingRight: 4 }}>修改</a>
        </OpenAddADModal>
        <Dropdown
          trigger={['click']}
          overlay={<Menu>{menus}</Menu>}>
          <a className="ant-dropdown-link" href="#">
            | 更多 <Icon type="down" />
          </a>
        </Dropdown>
      </div>);
    },
  }];

  deleteItem(item) {
    fetch({
      url: 'kbshopdecorate.advertManagerWrapperService.offlineByAdvertId',
      param: {
        advertId: item.advertId,
      },
    }).then(() => {
      this.reloadList();
    });
  }

  topItem(item) {
    fetch({
      url: 'kbshopdecorate.advertManagerWrapperService.update',
      param: {
        advertId: item.advertId,
        upTime: true,
      },
    }).then(() => {
      this.reloadList();
    });
  }

  reloadList() {
    this.setState({ loading: true });
    fetch({
      url: 'kbshopdecorate.advertManagerWrapperService.queryByShopId',
      param: {
        brandShopId: this.props.brandShopId,
        shopId: this.props.brandShopId,
      },
    }).then(result => {
      this.setState({
        loading: false,
        data: result.data,
      });
      this.props.updateNumber(result.data.length); // 更新广告数量的展示
    });
  }

  render() {
    const {brandShopId, brandId} = this.props;
    const { loading, data } = this.state;
    if (loading) {
      return <div style={{ textAlign: 'center', marginTop: 80 }}><Spin /></div>;
    }
    return (<div className="brand-account-detail-tab-ad-list">
      <div className="head-text">
        <span className="gray-text">口碑app和支付宝口碑tab中的品牌页，广告排序与下列表格一致</span>
        <OpenAddADModal onSuccess={this.reloadList.bind(this)} brandShopId={brandShopId} brandId={brandId} cantAdd={data.length >= 4}>
          <Button type="primary">添加广告</Button>
        </OpenAddADModal>
      </div>
      {!data.length ? <NoDataEffect name="广告" /> : (<Table
        pagination={false}
        columns={this.columns}
        dataSource={data}
        rowKey={r => r.advertId}
        bordered
      />)}
    </div>);
  }
}
