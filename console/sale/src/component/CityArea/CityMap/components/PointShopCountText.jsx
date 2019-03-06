import React from 'react';
import ajax from 'Utility/ajax';
import BizTypeChoose from './BizTypeChoose';
import PointChoose from './PointChoose';

export default class PointShopCountText extends React.Component {

  static propTypes = {
    cityCode: React.PropTypes.string,
    bizType: React.PropTypes.string,
    category: React.PropTypes.string,
    pointChooseValue: React.PropTypes.array,
    positions: React.PropTypes.array,
    filterShopType: React.PropTypes.string,
  };

  state = {};

  componentDidMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    const { cityCode, bizType, category, pointChooseValue, positions, filterShopType } = this.props;
    if (nextProps.cityCode !== cityCode || nextProps.bizType !== bizType || nextProps.category !== category
      || nextProps.pointChooseValue !== pointChooseValue || nextProps.positions !== positions
      || nextProps.filterShopType !== filterShopType) {
      this.loadData(nextProps);
    }
  }

  loadData(props = this.props) {
    const loadingLock = this.loadingLock = Math.random();
    this.setState({
      searchTotalCount: null,
    }, () => {
      const { cityCode, bizType, category, pointChooseValue, positions, filterShopType } = props;
      const shopType = BizTypeChoose.parseShopTypeFromBizTypeValue(bizType);
      if (filterShopType && shopType.indexOf(filterShopType) === -1) {
        this.setState({ searchTotalCount: 0 });
        return;
      }
      if (filterShopType === 'LEADS' && pointChooseValue && pointChooseValue.length) { // pointChooseValue 全是门店的指标，有的时候为0
        this.setState({ searchTotalCount: 0 });
        return;
      }
      ajax({
        url: `${window.APP.crmhomeUrl}/shop/koubei/territory/queryCityShopLeadsQuotaCount.json`,
        method: 'get',
        type: 'json',
        data: {
          businessType: BizTypeChoose.parseCodeBizTypeFromBizTypeValue(bizType),
          param: JSON.stringify({
            cityCode: cityCode,
            shopType: filterShopType || shopType,
            category: category,
            positions: positions,
          }),
          ...PointChoose.parseRequestParamFromValue(pointChooseValue),
        },
        success: (res) => {
          if (loadingLock !== this.loadingLock) return;
          if (!res) return;
          if (res.status && res.status === 'succeed') {
            this.setState({
              searchTotalCount: res.data,
            });
          }
        },
      });
    });
  }

  render() {
    return <span>{this.state.searchTotalCount === null ? '-' : this.state.searchTotalCount}</span>;
  }
}
