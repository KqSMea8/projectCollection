import React, { PropTypes } from 'react';
import { Spin, Select, Cascader } from 'antd';
import ajax from '../../../common/ajax';
const Option = Select.Option;

const RetailersActivityView = React.createClass({
  propTypes: {
    value: PropTypes.object,
    onChange: PropTypes.func,
  },

  getInitialState() {
    const value = this.props.value || {};
    const { shopId, cityCode } = value;
    return {
      cityCode,
      shopId,
      shops: null,
      citys: null,
      provinceCode: undefined,
    };
  },

  componentDidMount() {
    const { cityCode: initCityCode, shopId: initShopId } = this.state;
    ajax({
      // url: "http://localhost/index.php",
      url: '/promo/conponsVerify/shopsQuery.json',
      method: 'get',
      success: (res = {}) => {
        const { shopCountGroupByCityVO } = res;
        if (shopCountGroupByCityVO && shopCountGroupByCityVO.length) {
          const shops = {};
          // 整理shops数据
          shopCountGroupByCityVO.forEach(city => {
            shops[city.cityCode] = city.shops;
          });
          // 整理省市数据
          const provinces = this.adapterProvince(shopCountGroupByCityVO);
          // 只有一条数据
          if (shopCountGroupByCityVO.length === 1) {
            const { cityCode, provinceName } = shopCountGroupByCityVO[0];
            this.state.provinceCode = [provinceName, cityCode];
            this.state.cityCode = cityCode;
            if (shops[cityCode].length === 1) {
              this.state.shopId = shops[cityCode][0].shopId;
            }
            const initShop = shops[cityCode].find(item => item.shopId === initShopId);
            if (initShop) {
              this.state.shopId = initShopId;
            }
          }

          // 从props中取出默认值
          const initCity = shopCountGroupByCityVO.find(city => city.cityCode === initCityCode);
          if (initCity) {
            this.state.provinceCode = [initCity.provinceName, initCityCode];
          }
          this.setState(
            {
              shops,
              citys: Object.keys(provinces).map(code => provinces[code]),
            },
            () => {
              const { shopId, cityCode } = this.state;
              if ((!(shops[cityCode] && shops[cityCode].length) || !shopId) && cityCode) {
                // 如果城市只有一个，且shop需要异步调用
                this.getShops(cityCode, initShopId);
                this.props.onChange({ cityCode });
              } else if (shopId && cityCode) {
                // 如果城市只有一个，且门店也只有一个同步的。
                this.props.onChange({ shopId, cityCode });
              }
            }
          );
        } else {
          this.setState({
            citys: [],
            shops: [],
          });
        }
      },
    });
  },

  getShops(cityCode, initShopId) {
    const { shops } = this.state;
    ajax({
      url: '/promo/conponsVerify/getShopsByCityForNewCamp.json',
      method: 'get',
      data: { cityCode },
      success: res => {
        if (res.shopComps) {
          shops[cityCode] = res.shopComps;
          // 只有一条数据
          if (shops[cityCode].length === 1) {
            const shopId = shops[cityCode][0].shopId;
            this.state.shopId = shopId;
            this.props.onChange({ shopId, cityCode });
          }
          // 初始化调用接口
          if (
            initShopId &&
            shops[cityCode] &&
            shops[cityCode].find(city => city.shopId === initShopId)
          ) {
            this.state.shopId = initShopId;
            this.props.onChange({ shopId: initShopId, cityCode });
          }
          this.setState({ shops });
        }
      },
    });
  },

  adapterProvince(citys) {
    const provinces = {};
    citys.forEach(city => {
      const { provinceCode, cityCode, cityName, provinceName } = city;
      const province = provinces[provinceCode];
      const provinceInfo = { label: cityName, value: cityCode };
      if (province && province.children) {
        provinces[provinceCode].children.push(provinceInfo);
      } else {
        provinces[provinceCode] = {
          label: provinceName,
          value: provinceName,
          children: [provinceInfo],
        };
      }
    });
    return provinces;
  },

  handleChange({ provinceCode, shopId }) {
    const cityCode = provinceCode && provinceCode[1];
    const {
      cityCode: stateCityCode,
      shopId: stateShopId,
      shops,
      provinceCode: province,
    } = this.state;
    const newProvince = provinceCode || province;
    const newCityCode = cityCode || stateCityCode;
    const newShopId = newCityCode !== stateCityCode ? undefined : shopId || stateShopId;

    this.setState({
      shopId: newShopId,
      cityCode: newCityCode,
      provinceCode: newProvince,
    });
    if (newCityCode && !shops[newCityCode].length) {
      this.getShops(newCityCode);
    }
    this.props.onChange({ cityCode: newCityCode, shopId: newShopId });
  },

  render() {
    const { cityCode, shops, citys, shopId, provinceCode } = this.state;
    if (!shops && !citys) {
      return <Spin />;
    }
    return (
      <div>
        <Cascader
          allowClear
          options={citys}
          style={{ width: 150, marginRight: 5 }}
          value={provinceCode}
          placeholder="省/市"
          onChange={code => {
            if (!code || !code.length) {
              this.setState(
                { provinceCode: undefined, cityCode: undefined, shopId: undefined },
                () => {
                  this.handleChange({ provinceCode: undefined, shopId: undefined });
                }
              );
            } else {
              this.handleChange({ provinceCode: code });
            }
          }}
        />
        <Select
          allowClear
          style={{ width: 280 }}
          disabled={!cityCode}
          placeholder="请选择门店"
          value={
            shopId && shops[cityCode].find(shop => shop.shopId === shopId) ? shopId : undefined
          }
          onChange={id => {
            if (!id) {
              this.setState({ shopId: undefined }, () => {
                this.handleChange({ shopId: undefined });
              });
            } else {
              this.handleChange({ shopId: id });
            }
          }}
        >
          {shops[cityCode] &&
            shops[cityCode].map((shop, i) => {
              return (
                <Option value={shop.shopId} key={`${shop.shopId}${i}`}>
                  {shop.shopName}
                </Option>
              );
            })}
        </Select>
      </div>
    );
  },
});

export default RetailersActivityView;
