import React from 'react';
import { Alert } from 'antd';
import BrandItem from './BrandItem';
import fetch from '@alipay/kb-fetch';

class BrandAccountList extends React.Component {
  state = {
    data: [],
  };
  componentDidMount() {
    fetch({
      url: 'kbshopdecorate.brandShopQueryWrapperService.batchQueryBrandShop',
      param: {},
    }).then(resp => {
      this.setState({
        data: resp.data,
      });
    });
  }
  render() {
    const { data } = this.state;
    return (
      <div>
        <h2 className="kb-page-title">品牌号</h2>
        <div className="kb-detail-main">
          <Alert showIcon message="如需增加新的品牌，请联系口碑BD或者运营小二操作" type="info" />
          <div>
            {(data || []).map((item, i) =>
              <BrandItem key={i} itemDate={item} history={this.props.history} />)}
          </div>
        </div>
      </div>
    );
  }
}

export default BrandAccountList;
