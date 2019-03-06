import React, {PropTypes} from 'react';
import {Form, Radio, Modal} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const PayType = React.createClass({
  propTypes: {
    form: PropTypes.object,
    defaultData: PropTypes.object,
  },

  getInitialState() {
    return {
      visible: false,
      type: 'online_pay',
    };
  },

  show(type, e) {
    e.preventDefault();
    this.setState({
      type,
      visible: true,
    });
  },

  hide() {
    this.setState({
      visible: false,
    });
  },

  render() {
    const {visible, type} = this.state;
    const {getFieldProps} = this.props.form;
    return (<div>
      <FormItem
        label="默认收款方式："
        required
        labelCol={{span: 4}}
        wrapperCol={{span: 14}}>
        <RadioGroup {...getFieldProps('payType', {initialValue: this.props.defaultData.payType})}>
          <Radio value="online_pay">顾客<a href="#" onClick={this.show.bind(this, 'online_pay')}>自助买单</a></Radio>
          <Radio value="code_scanned_pay">商家<a href="#" onClick={this.show.bind(this, 'code_scanned_pay')}>扫码买单</a></Radio>
        </RadioGroup>
      </FormItem>
      <Modal width={720} title={type === 'online_pay' ? '顾客自助买单' : 'pos机/扫码枪收款'}
        visible={visible}
        footer=""
        onCancel={this.hide}>
        {
          type === 'online_pay' && (
            <div className="kb-shop-pay-type-box">
              <div className="img-con">
                <img src="https://os.alipayobjects.com/rmsportal/qWzGqWOEjzyAPUd.png" alt=""/>
              </div>
              <div className="info-con">
                <h3>顾客自助买单</h3>
                <p>用户通过手机支付宝扫门店二维码或者通过口碑商家页面点击去买单，自主输入付款金额进行付款，商家可以下载商户APP确认收款信息 <a href="#">查看商户APP</a></p>
                <h4>优点：</h4>
                <ul>
                  <li>A、无需机具配置即可轻松实现收款</li>
                  <li>B、用户自助付款，节省收银人力成本</li>
                </ul>
                <h4>不建议使用场景：</h4>
                <ul>
                  <li>A、需要打印小票用于对账</li>
                  <li>B、已与口碑完成系统对接，使用扫描枪进行收款</li>
                </ul>
              </div>
            </div>
          )
        }
        {
          type === 'code_scanned_pay' && (
            <div className="kb-shop-pay-type-box">
              <div className="img-con">
                <img src="https://os.alipayobjects.com/rmsportal/SxWovJHljDkLbGU.png" alt=""/>
              </div>
              <div className="info-con">
                <h3>商家扫码收款</h3>
                <p>商户通过收款pos机或扫描枪，扫用户手机支付宝付款二维码进行收款</p>
                <h4>优点：</h4>
                <ul>
                  <li>A、有小票、机具终端号等账务核对工具</li>
                  <li>B、通过与支付宝系统打通，可以实现单商品（套餐）的个性化营销</li>
                </ul>
                <h4>不建议使用场景：</h4>
                <ul>
                  <li>A、未与支付宝打通收银系统</li>
                  <li>B、未铺设收款POS机具</li>
                </ul>
              </div>
            </div>
          )
        }
      </Modal>
    </div>);
  },
});

export default PayType;
