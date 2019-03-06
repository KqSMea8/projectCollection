import React, { PropTypes } from 'react';
import { message, Spin, Modal, Table, Dropdown, Icon, Menu, Tag } from 'antd';
import NoDataEffect from './NoDataEffect';
import AddGoodsModal from './AddGoodsModal';
import fetch from '@alipay/kb-fetch';
import { getImageById } from '../../../common/utils';

const greyImg = 'https://gw.alipayobjects.com/zos/rmsportal/LbKuRAGokvUOxBHgBHAa.png';
export function formattingData(arr) {
  if (arr && Array.isArray(arr)) {
    return arr.map(item => {
      return {
        ...item,
        id: item.itemId,
      };
    });
  }
  return [];
}
const confirm = Modal.confirm;
class GoodsList extends React.Component {
  static propTypes = {
    shopId: PropTypes.string,
    brandId: PropTypes.string,
    updateNumber: PropTypes.func,
  };
  state = {
    data: [],
    loading: false,
    pagination: {
      showSizeChanger: true,
      pageSize: 10,
      total: 0,
      current: 1,
    },
  };

  componentDidMount() {
    this.fetchList({ page: 1, itemsPerPage: 10 });
  }


  onChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    this.fetchList({
      page: pagination.current,
      itemsPerPage: pagination.pageSize,
    });
  }

  columns = [{
    title: '商品图片',
    dataIndex: 'logo',
    width: 100,
    render: (text) => {
      return text && (<div style={{ textAlign: 'center' }}>
        <img src={getImageById(text)} width="100" onError={e => e.target.src !== greyImg && (e.target.src = greyImg)} />
      </div>);
    },
  }, {
    title: '商品名称',
    dataIndex: 'itemName',
    width: 120,
    render: (text, r) => {
      return (<div className="goods-item-name">
        <div className="goods-text" >{text}</div>
        {r.topTime && r.topTime !== '0' && <Tag className="goods-tag" color="red">已置顶</Tag>}
      </div>);
    },
  }, {
    title: '价格',
    dataIndex: 'price',
    width: 60,
  }, {
    title: '原价',
    dataIndex: 'originalPrice',
    width: 60,
  }, {
    title: '活动时间',
    dataIndex: 'releaseTime',
    width: 300,
    render: (text, r) => {
      return (<div>
        <div>{`发放时间：${text}`}</div>
        <div>{`有效时间：${r.startTime}到${r.endTime}`}</div>
      </div>);
    },
  }, {
    title: '操作',
    dataIndex: 'itemId',
    width: 100,
    render: (text, r) => {
      return (
        <div style={{ textAlign: 'center' }}>
          <a href={`#/catering/detail?itemId=${text}`} style={{ paddingRight: 4 }}>查看</a>
          <Dropdown
            overlay={<Menu>
              <Menu.Item key="delete">
                <a onClick={this.handleDelete(text)}>移出</a>
              </Menu.Item>
              {r.topTime === '0' ? <Menu.Item key="top">
                <a onClick={this.handleTop(text)}>置顶</a>
              </Menu.Item> :
                <Menu.Item key="unTop">
                  <a onClick={this.handleUnTop(text)}>取消置顶</a>
                </Menu.Item>}
            </Menu>}
            trigger={['click']}>
            <a className="ant-dropdown-link" href="#">
              | 更多 <Icon type="down" />
            </a>
          </Dropdown>
        </div>
      );
    },
  }];

  // 加载商品list
  fetchList = (pageParams = {}, waitDelay) => {
    const param = {
      ...pageParams,
      brandShopId: this.props.shopId,
    };
    if (!pageParams.itemsPerPage) {
      param.itemsPerPage = this.state.pagination.pageSize;
    }
    this.setState({ loading: true });
    setTimeout(() => {
      fetch({
        url: 'kbshopdecorate.brandItemQueryWrapperService.pageQueryItemByBrandShopId',
        param,
      }).then(result => {
        this.props.updateNumber(result.data.totalItems);
        const pagination = { ...this.state.pagination };
        pagination.total = result.data.totalItems;
        pagination.current = result.data.pageNum;
        pagination.pageSize = result.data.pageSize;
        this.setState({
          loading: false,
          data: result.data.dataList,
          pagination,
        });
      }).catch(err => {
        this.setState({
          loading: false,
          data: [],
        });
        message.error(err && err.resultMsg || '系统错误');
      });
    }, waitDelay ? 5000 : 0); // waitDelay 因为列表走的搜索，搜索的数据有延迟3-5s，需要前端主动 delay
  }

  // 移除商品*刷新列表
  handleDelete = (itemId) => () => {
    confirm({
      title: '你是否确认移出吗？',
      content: '仅不在当前品牌号中展示，如需彻底下架，请移步到“商家中心-商品管理”中操作',
      onOk: () => {
        fetch({
          url: 'kbshopdecorate.brandItemManageWrapperService.batchRemoveBrandItem',
          param: {
            brandShopId: this.props.shopId,
            itemIds: [itemId],
          },
        }).then(() => {
          this.fetchList({ page: 1 }, true);
          message.success('已移出');
        });
      },
    });
  }

  // 置顶商品*刷新列表
  handleTop = (itemId) => () => {
    fetch({
      url: 'kbshopdecorate.brandItemManageWrapperService.top',
      param: {
        brandShopId: this.props.shopId,
        itemId,
      },
    }).then(() => {
      this.fetchList({ page: 1 }, true);
      message.success('已置顶');
    });
  }
  // 取消置顶*刷新列表
  handleUnTop = (itemId) => () => {
    fetch({
      url: 'kbshopdecorate.brandItemManageWrapperService.unTop',
      param: {
        brandShopId: this.props.shopId,
        itemId,
      },
    }).then(() => {
      this.fetchList({ page: 1 }, true);
      message.success('已取消置顶');
    });
  }
  // 选择添加商品*刷新列表
  selectGoods = (itemIds) => {
    fetch({
      url: 'kbshopdecorate.brandItemManageWrapperService.batchAddBrandItem',
      param: {
        brandShopId: this.props.shopId,
        itemIds,
      },
    }).then(() => {
      this.fetchList({ page: 1 }, true);
      message.success('已添加商品');
    });
  }

  // 获取候选商品列表
  fetchGoodsList = () => fetch({
    url: 'kbshopdecorate.brandItemQueryWrapperService.queryItemByBrandId',
    param: {
      brandShopId: this.props.shopId,
      brandId: this.props.brandId,
    },
  }).then(result => formattingData(result.data.dataList));

  render() {
    const { data, loading, pagination } = this.state;
    if (loading) {
      return <div style={{ textAlign: 'center', marginTop: 80 }}><Spin /></div>;
    }
    return (
      <div>
        <AddGoodsModal selectGoods={this.selectGoods} fetchGoodsList={this.fetchGoodsList} />
        {!!data.length ? <Table
          columns={this.columns}
          dataSource={data}
          rowKey={r => r.itemId}
          pagination={pagination}
          onChange={this.onChange}
          bordered
        /> : <NoDataEffect name="商品" />}
      </div>
    );
  }
}

export default GoodsList;
