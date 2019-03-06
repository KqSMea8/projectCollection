import React from 'react';
import {Spin, message} from 'antd';
import ajax from '../../../common/ajax';
import ErrorPage from './ErrorPage';
import OrderList from './OrderList';
import NoInfo from './NoInfo';

const Order = React.createClass({
  getInitialState() {
    return {
      list: [],
      error: null,
      loading: true,
      link: null,
    };
  },

  componentDidMount() {
    const merchant = document.getElementById('J_crmhome_merchantId');
    const isKbInput = document.getElementById('J_isFromKbServ');
    const isParentFrame = isKbInput && isKbInput.value === 'true';
    ajax({
      url: merchant && merchant.value ? `/goods/commodityList.json.kb?op_merchant_id=${merchant.value}` : '/goods/commodityList.json',
      success: (data = {}) => {
        if (isParentFrame && !data.result || !data.result.commodityList || !data.result.commodityList.length) {
          message.error('该商户还未订购该应用， 请联系商户去服务市场订购商品管理应用');
        }
        this.setState({
          link: data.result && data.result.appStoreServer ? `${data.result.appStoreServer}/commodity/onlineCommodity.htm?frontCategoryName=%E5%95%86%E5%93%81%E7%AE%A1%E7%90%86` : null,
          list: data.result ? data.result.commodityList : [],
          loading: false,
        });
      },
      error: (result) => {
        this.setState({
          error: (result && result.resultMsg) || '访问出错',
          loading: false,
        });
      },
    });
  },

  render() {
    const {list, loading, error, link} = this.state;
    const isKbInput = document.getElementById('J_isFromKbServ');
    const isParentFrame = isKbInput && isKbInput.value === 'true';
    return (<div>
      {isParentFrame && /\goods\/goodsservice/.test(window.parent.location.hash) ? null : <h2 className="kb-page-title">商品服务</h2>}
      {loading ? <Spin /> : <div> {
        error ? <ErrorPage desc={error} /> : <div>{list && list.length ? <OrderList list={list} location={this.props.location} /> : <NoInfo link={link}/>
        } </div>
      }
      </div>}
      </div>);
  },
});

export default Order;
