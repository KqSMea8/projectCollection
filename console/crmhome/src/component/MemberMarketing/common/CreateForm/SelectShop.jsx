import React, {PropTypes} from 'react';
import { Form, Input, message } from 'antd';
import classnames from 'classnames';
import ajax from '../../../../common/ajax';
import TreeModal from '../TreeModal';

const FormItem = Form.Item;

/*
  表单字段 － 选择门店
*/

class SelectShop extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    layout: PropTypes.object,
    actionType: PropTypes.string,
    initData: PropTypes.object,
  };

  static defaultProps = {
    initData: {},
  };

  state= {
    treeData: [],
    checkedSymbols: [],
    visible: false,
  };

  componentWillMount() {
    // 创建页面
    if (this.props.actionType === 'create') {
      ajax({
        // url: 'http://crmhome.stable.alipay.net/goods/itempromo/getShops.json',
        url: '/goods/itempromo/getShops.json',
        method: 'GET',
        type: 'json',
        success: (res) => {
          if (res && res.shopCountGroupByCityVO) {
            const treeData = res.shopCountGroupByCityVO.map(({ cityCode, cityName, shopCount }) => ({
              name: cityName,
              count: shopCount,
              symbol: cityCode,
              children: [],
            }));

            this.setState({ treeData });
          } else {
            message.error(res.resultMsg || '获取门店列表失败');
          }
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const self = this;
    const { initData, actionType } = nextProps;

    // 编辑页面
    if (actionType === 'edit') {
      if (!this.props.initData.shopIds && initData.shopIds) {
        ajax({
          // url: 'http://crmhome.stable.alipay.net/goods/itempromo/getShops.json',
          url: '/goods/itempromo/getShops.json',
          method: 'GET',
          type: 'json',
          success: (res) => {
            if (res && res.shopCountGroupByCityVO) {
              const { shopsCitys, shopIds } = initData;
              const checkedCitys = [];

              shopsCitys.map(city => {
                checkedCitys.push(city.cityCode);
              });

              const promiseArr = res.shopCountGroupByCityVO.map(({ cityCode, cityName, shopCount }) => {
                return new Promise((resolve) => {
                  if (checkedCitys.indexOf(cityCode) !== -1) {
                    ajax({
                      // url: 'http://crmhome.stable.alipay.net/goods/itempromo/getShopsByCity.json',
                      url: '/goods/itempromo/getShopsByCity.json',
                      method: 'GET',
                      type: 'json',
                      data: {
                        cityCode: cityCode,
                      },
                      success: (data) => {
                        if (data && data.shopComps) {
                          const children = data.shopComps.map(({ shopName, shopId }) => ({
                            name: shopName,
                            symbol: shopId,
                            disabled: shopIds.indexOf(shopId) !== -1,
                          }));

                          resolve({
                            name: cityName,
                            count: shopCount,
                            symbol: cityCode,
                            children: children,
                          });
                        } else {
                          message.error(data.resultMsg || '获取门店失败');
                        }
                      },
                    });
                  } else {
                    resolve({
                      name: cityName,
                      count: shopCount,
                      symbol: cityCode,
                      children: [],
                    });
                  }
                });
              });

              Promise.all(promiseArr).then(treeData => {
                self.setState({
                  treeData,
                  checkedSymbols: shopIds || [],
                });
              });
            }
          },
        });
      }
    }
  }

  setShopIds(symbols) {
    this.setState({
      checkedSymbols: symbols,
      visible: false,
    });

    this.props.form.setFieldsValue({
      'shopIds': symbols,
    });
  }

  loadChildren(symbol) {
    return new Promise((resolve) => {
      ajax({
        // url: 'http://crmhome.stable.alipay.net/goods/itempromo/getShopsByCity.json',
        url: '/goods/itempromo/getShopsByCity.json',
        method: 'GET',
        type: 'json',
        data: {
          cityCode: symbol,
        },
        success: (res) => {
          if (res && res.shopComps) {
            const children = res.shopComps.map(({ shopName, shopId }) => ({
              name: shopName,
              symbol: shopId,
            }));
            resolve(children);
          } else {
            message.error(res.resultMsg || '获取门店列表失败');
          }
        },
      });
    });
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { treeData, checkedSymbols, visible } = this.state;
    const { initData } = this.props;
    const treeProps = {
      defaultTreeData: treeData,
      defaultCheckedSymbols: checkedSymbols,
      loadChildren: ::this.loadChildren,
      visible,
      modalProps: {
        title: '门店选择',
        onOk: symbols => this.setShopIds(symbols),
        onCancel: () => this.setState({ visible: false }),
      },
    };
    const label = checkedSymbols.length ? `${checkedSymbols.length}家门店` : '';
    return (
      <FormItem
        {...this.props.layout}
        required
        label="券适用门店："
        help={getFieldError('shopIds')}
        validateStatus={
        classnames({
          error: !!getFieldError('shopIds'),
        })}>
        <span style={{ marginRight: 5 }}>{label}</span>
        <a href="#" onClick={e => {
          e.preventDefault();
          this.setState({ visible: true });
        }}>{checkedSymbols.length ? '新增门店' : '选择门店'}</a>
        {treeData.length > 0 && <TreeModal { ...treeProps } />}
        <Input type="hidden" {...getFieldProps('shopIds', {
          rules: [
            { required: true, type: 'array', message: '请选择门店' },
          ],
          initialValue: initData.shopIds || [],
        })} />
      </FormItem>
    );
  }
}

export default SelectShop;
