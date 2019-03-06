import React, {Component, PropTypes} from 'react';
import { Table, Spin, message } from 'antd';
import ajax from '../../../common/ajax';
import { dateFormat } from '../../../common/dateUtils';
import { getUriParam } from '../../../common/utils';
import Content from './content';
import './GoodKouBei.less';

const defaultPageSize = 50;
const entryStatusMapping = {
  nominated: '1',
  needImprove: '0',
};
const getYesterday = () => {
  const result = new Date();
  result.setDate(result.getDate() - 1); // 对 9/1 setDate(0) 会正确的得到 8/31
  return result;
};

class GoodKouBei extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shopList: [],
      shopListLoading: true,
      shopStatLoading: true,
      entryCount: 0,
      imperfectCount: 0,
      pageNum: 1,
      pageSize: defaultPageSize,
      total: 0,
    };
    this.onPageChange = this.onPageChange.bind(this);
    this.fetchShopList = this.fetchShopList.bind(this);
    this.fetchShopStat = this.fetchShopStat.bind(this);
  }

  componentWillMount() {
    const pageSizeParam = getUriParam('pageSize');
    if (pageSizeParam !== null && /^\d+$/.test(pageSizeParam)) {
      this.setState({ pageSize: +pageSizeParam });
    }
    setTimeout(() => {
      this.fetchShopList();
      this.fetchShopStat();
    });
  }

  onPageChange(current) {
    this.setState({ pageNum: current }, this.fetchShopList);
  }

  fetchShopStat() {
    this.setState({ shopStatLoading: true });
    ajax({
      url: '/promo/activity/shopCount.json',
      method: 'get',
    }).then(result => {
      if (result.status !== 'success') {
        throw new Error(result.resultMsg || '加载数据失败');
      }
      if (result.data === undefined) {
        throw new Error('数据格式错误');
      }
      const { data: { entryCount, imperfectCount } } = result;
      this.setState({
        shopStatLoading: false,
        entryCount,
        imperfectCount,
      });
    }).catch(reason => {
      message.error(reason.message || '网络请求出错');
    });
  }

  fetchShopList() {
    const { pageNum, pageSize } = this.state;
    this.setState({ shopListLoading: true });
    ajax({
      url: '/promo/activity/shopListQuery.json',
      method: 'get',
      data: { pageNum, pageSize },
    }).then(result => {
      if (result.status !== 'success') {
        throw new Error(result.resultMsg || '加载数据失败');
      }
      if (result.data === undefined || result.data.data === undefined) {
        throw new Error('数据格式错误');
      }
      const { data } = result;
      this.setState({
        shopListLoading: false,
        shopList: data.data,
        total: data.totalItems,
      });
    }).catch(reason => {
      message.error(reason.message || '网络请求出错');
    });
  }

  render() {
    const { entryCount, imperfectCount, shopList, shopListLoading, shopStatLoading, total, pageSize } = this.state;
    const toDateString = dateFormat(this.props.toDate, 'MM月dd日');
    const columns = [{
      title: '店铺名称',
      dataIndex: 'shopName',
    }, {
      title: '店铺质量分',
      dataIndex: 'shopScore',
      width: 128,
      render: (text, record) => {
        if (record.qualitytag === entryStatusMapping.nominated) {
          return record.shopScore;
        }
        return <a href={`/shop.htm#/shop/quality-score/${record.shopId}`} target="_blank">{record.shopScore}</a>;
      },
    }, {
      title: '优质评价分',
      dataIndex: 'cmtScore',
      width: 128,
    }, {
      title: '是否入围',
      dataIndex: 'qualitytag',
      width: 103,
      render: (text, record) => {
        if (record.qualitytag === entryStatusMapping.nominated) {
          return '入围';
        }
        return <a href={`/shop.htm#/shop/quality-score/${record.shopId}`} target="_blank">去完善 <span className="arrow" /></a>;
      },
    }];
    const pagination = {
      total,
      pageSize,
      onChange: this.onPageChange,
    };
    const moreThanOnePage = total > pageSize;
    const emptyResult = shopList.length === 0;
    const emptyStat = (entryCount <= 0) && (imperfectCount <= 0);
    const statNotes = [
      (entryCount > 0) && `${entryCount}家店铺已入围`,
      (imperfectCount > 0) && `${imperfectCount}家门店需完善`,
    ].filter(_ => _).join('，');
    return (
      <div className="good_koubei">
        <Content />
        <div className="dashboard">
          <div className="split-line-title">截至{toDateString}</div>
          {shopStatLoading && <div style={{ textAlign: 'center' }}><Spin /></div>}
          {!shopStatLoading && !(emptyResult && emptyStat) && (<div>
            {statNotes && <h3>{statNotes}</h3>}
            <p className="notes">注：店铺质量分会在次日生效，请在完善信息后查看是否入围</p>
          </div>)}
          {!shopStatLoading && emptyResult && emptyStat && <p className="notes">您暂时没有可参加活动的门店</p>}
          {!emptyResult && <Table className="shop_list"
            dataSource={shopList}
            columns={columns}
            pagination={moreThanOnePage && pagination}
            loading={shopListLoading}
            rowKey={record => record.shopId} />}
        </div>
      </div>
    );
  }
}

GoodKouBei.propTypes = {
  toDate: PropTypes.instanceOf(Date),
};

GoodKouBei.defaultProps = {
  toDate: getYesterday(),
};

export default GoodKouBei;
