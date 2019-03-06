import React from 'react';
import { Switch, message, Icon } from 'antd';
import ajax from '../../../common/ajax';

const ProductRuleSettings = React.createClass({
  getInitialState() {
    return {
      payRuleStatus: false,
      errorMessage: false, // 如果是泛行业用户,则判断是否展示报错信息
    };
  },

  componentWillMount() {
    // 初始化规则设置
    this.fetch();
  },

  // 设置规则开或者关
  setPayItemRule(value) {
    ajax({
      url: '/goods/itempromo/managePayItemRule.json',
      method: 'post',
      type: 'json',
      data: {addUp: value},
      success: res => {
        if (res.status === 'succeed') {
          if (value === true) {
            this.setState({
              payRuleStatus: true,
            });
          } else if (value === false) {
            this.setState({
              payRuleStatus: false,
            });
          } else {
            message.error('设置规则失败', 3);
          }
        }
      },
    });
  },

  // 初始化规则设置
  fetch() {
    ajax({
      url: '/goods/itempromo/queryPayItemRule.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          if (res.containsUniversal === 'true') {
            this.setState({
              errorMessage: true,
            });
          }
          if (res.addUp === true) {
            this.setState({
              payRuleStatus: true,
            });
          } else if (res.addUp === false) {
            this.setState({
              payRuleStatus: false,
            });
          }
        } else {
          message.error('初始化规则失败', 3);
        }
      },
      error: () => {
        message.error('初始化规则失败', 3);
      },
    });
  },

  render() {
    const {payRuleStatus, errorMessage} = this.state;
    if (errorMessage) {// 优先判断是泛行业就展示报错信息
      return (
        <div style={{margin: '100px auto', width: '200px' }}>
          <Icon type="meh" style={{ fontSize: 50}} />
          <div style={{lineHeight: '50px', position: 'relative', float: 'right'}}>啊哦，该功能暂未开通</div>
        </div>
      );
    }
    return (
      <div>
        <h3 className="crm-productSettings-sub-title">
          <div className="crm-productSettings-sub-title-icon"></div>
          <span className="crm-productSettings-sub-title-text">商品规则配置</span>
          <div className="crm-productSettings-sub-title-line"></div>
        </h3>
        <div className="crm-productSettings-rule">
          <div className="crm-productSettings-rule-text">
            用户使用商品时，剩余金额可以享受商家优惠
          </div>
          <div className="crm-productSettings-rule-icon">
            <Switch onChange={this.setPayItemRule} checked={payRuleStatus} checkedChildren={'开'} unCheckedChildren={'关'} />
          </div>
        </div>
        <div>
          <p>【提示】：</p>
          <p>1. 商品：特指用户在线购买的套餐，比如“80元双人炸鸡套餐”。</p>
          <p>2. 商家优惠：指商家全场优惠券（含用户提前购买的代金券）和单品优惠券。</p>
        </div>
      </div>
    );
  },
});

export default ProductRuleSettings;
