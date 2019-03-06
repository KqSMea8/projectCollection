import React from 'react';
import { Form, Switch, Select, Checkbox } from 'antd';
import TreeModal from '../TreeModal';
import ajax from '../../../../common/ajax';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

class Location extends React.Component {
  render() {
    const { formItemLayout, locationProps } = this.props;
    return (
      <div data-trade>
        <FormItem { ...formItemLayout } label="设定顾客出现的地理位置：">
          <Switch { ...locationProps } checkedChildren="开" unCheckedChildren="关" />
        </FormItem>
      </div>
    );
  }
}

class ActivityTime extends React.Component {
  render() {
    const { formItemLayout, activityTimeProps } = this.props;
    return (
      <div data-activity-time>
        <FormItem { ...formItemLayout } label="出现时段：">
        <CheckboxGroup { ...activityTimeProps } options={['白天', '晚上', '工作日', '休息日']} />
        </FormItem>
      </div>
    );
  }
}

class ActivityLbs extends React.Component {
  render() {
    const { formItemLayout, activityShopTypeProps, label, onClick } = this.props;
    return (
      <div data-activity-lbs>
        <FormItem { ...formItemLayout } label="适用门店：">
          <Select { ...activityShopTypeProps } style={{ width: 150 }} placeholder="请选择">
            <Option value="city">按城市选</Option>
            <Option value="shop">按门店选</Option>
          </Select>
          <a href="#" onClick={e => {
            e.preventDefault();
            onClick();
          }}>{label}</a>
        </FormItem>
      </div>
    );
  }
}

class ActivityScope extends React.Component {
  render() {
    const { formItemLayout, activityScopeProps } = this.props;
    return (
      <div data-activity-time>
        <FormItem { ...formItemLayout } label="活动范围：">
          <Select { ...activityScopeProps } size="large" style={{ width: 300 }}
            placeholder="请选择">
            <Option value={1000}>附近1公里</Option>
            <Option value={2000}>附近2公里</Option>
            <Option value={3000}>附近3公里</Option>
          </Select>
        </FormItem>
      </div>
    );
  }
}

class GroupsAddLocation extends React.Component {
  static propTypes = {
    formItemLayout: React.PropTypes.object.isRequired,
    form: React.PropTypes.object.isRequired,
    initData: React.PropTypes.object.isRequired,
  }

  static defaultProps = {
    formItemLayout: {
      labelCol: { span: 7 },
      wrapperCol: { span: 12, offset: 1 },
    },
    initData: {},
  }

  state = {
    treeData: [],
    checkedSymbols: [],
    treeData2: [],
    checkedSymbols2: [],
    visible: false,
  }

  componentWillMount() {
    const { activityLbs = [], cityCodes = [] } = this.props.initData;
    const symbols = activityLbs;
    ajax({
      url: '/goods/itempromo/getShops.json',
      method: 'GET',
      type: 'json',
      success: data => {
        const { shopCountGroupByCityVO } = data;
        const promiseArray = shopCountGroupByCityVO.map(({ cityCode, cityName, shopCount }) =>
          new Promise(resolve => {
            if (cityCodes.includes(cityCode)) {
              this.loadChildren(cityCode).then(children => {
                resolve({ name: cityName, symbol: cityCode, children, count: shopCount });
              });
            } else {
              resolve({ name: cityName, symbol: cityCode, children: [], count: shopCount });
            }
          })
        );
        Promise.all(promiseArray).then(treeData => {
          this.shops = { treeData, checkedSymbols: symbols };
        });
      },
    });
    ajax({
      url: '/district.json?level=C',
      method: 'GET',
      type: 'json',
      success: data => {
        const { district } = data;
        const treeData = district.map(({ n: name, i: symbol, c: children }) => {
          return ({
            name,
            symbol,
            children: children.map(({ n: name2, i: symbol2 }) =>
              ({ name: name2, symbol: symbol2 })),
          });
        });
        this.cities = { treeData, checkedSymbols: symbols };
        this.setState(this.cities);
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { getFieldProps, setFieldsValue } = nextProps.form;
    const type = getFieldProps('activityShopType').value;
    if (this.shopType !== type) {
      if (type === 'city') {
        this.setState(this.cities);
      } else if (type === 'shop') {
        this.setState(this.shops);
      }
      setFieldsValue({ activityLbs: [] });
      this.shopType = type;
    }
  }

  cities = {}
  shops = {}
  shopType = 'city'

  loadChildren(symbol) {
    return new Promise(resolve => {
      ajax({
        url: '/goods/itempromo/getShopsByCity.json',
        method: 'GET',
        data: { cityCode: symbol },
        type: 'json',
        success: data => {
          const { shopComps } = data;
          const children = shopComps.map(({ shopName, shopId }) => ({
            name: shopName,
            symbol: shopId,
          }));
          resolve(children);
        },
      });
    });
  }

  render() {
    const { formItemLayout, form, initData } = this.props;
    const { getFieldProps, setFieldsValue } = form;
    const { treeData, checkedSymbols, visible } = this.state;
    const { activityTime, activityLbs, activityShop = 'city', activityScope } = initData;
    const activityTimeProps = getFieldProps('activityTime', { initialValue: activityTime || [] });
    const activityScopeProps = getFieldProps('activityScope', { initialValue: activityScope });
    const activityLbsProps = getFieldProps('activityLbs', { initialValue: activityLbs });
    const activityShopTypeProps = getFieldProps('activityShopType', { initialValue: activityShop });

    const locationProps = getFieldProps('location', {
      initialValue: !!activityLbs,
      valuePropName: 'checked',
    });
    const lbs = activityLbsProps.value;
    const shopType = getFieldProps('activityShopType').value;
    let label = '';
    if (shopType === 'city') {
      label = lbs && lbs.length > 0 ? `${lbs.length} 个城市` : '选择城市';
    } else if (shopType === 'shop') {
      label = lbs && lbs.length > 0 ? `${lbs.length} 家门店` : '选择门店';
    }
    const treeModalprops = {
      defaultTreeData: treeData,
      defaultCheckedSymbols: checkedSymbols,
      loadChildren: ::this.loadChildren,
      visible,
      modalProps: {
        title: shopType === 'city' ? '城市选择' : '门店选择',
        onOk: symbols => {
          this.setState({ visible: false });
          setFieldsValue({ activityLbs: symbols });
        },
        onCancel: () => this.setState({ visible: false }),
      },
    };
    return (
      <groups-add-location>
        <div><span>地理位置</span></div>
        <Location formItemLayout={formItemLayout} locationProps={locationProps} />
        {locationProps.checked && (
          <div>
            <ActivityTime formItemLayout={formItemLayout} activityTimeProps={activityTimeProps} />
            <ActivityLbs formItemLayout={formItemLayout}
              activityShopTypeProps={activityShopTypeProps} label={label}
              onClick={() => this.setState({ visible: true })} />
            <ActivityScope formItemLayout={formItemLayout}
              activityScopeProps={activityScopeProps} />
            {shopType === 'city' && treeData.length > 0 && <TreeModal { ...treeModalprops }/>}
            {shopType === 'shop' && treeData.length > 0 && <TreeModal { ...treeModalprops }/>}
            <input type="hidden" { ...getFieldProps('activityLbs') } />
          </div>
        )}
      </groups-add-location>
    );
  }
}

export default GroupsAddLocation;
