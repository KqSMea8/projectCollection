import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Cascader, message } from 'antd';
import { getAreaWithAll } from '../shop/common/AreaCategory/getArea';
import fetch from '@alipay/kb-fetch';
import { keepSession } from '../../common/utils';
import './index.less';

const FormItem = Form.Item;
class KaContract extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      loading: false,
      cityName: null,
    };
  }

  componentWillMount() {
    this.setState({
      loading: true,
    });
    getAreaWithAll().then((response) => {
      const areas = response.areas;
      if (areas) {
        this.setState({
          areas: this.loop(areas, 1),
          loading: false,
        });
      }
    });
    keepSession();
  }

  onChange = (value, option) => {
    this.setState({
      cityName: option && option[1].label,
    });
  }

  loop = (tree, level) => {
    if (tree) {
      return tree.map((t)=> {
        const t2 = {...t};
        if (t2.children && t2.children.length > 0) {
          t2.children.shift({
            label: '全部',
            value: 'ALL',
          });
          if (level === 2) {
            delete t2.children;
          }
          t2.children = t2.children && this.loop(t2.children, level + 1);
        }
        return t2;
      });
    }
    return tree;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const param = {
          signCode: 'kajointbusinessplan',
          extInfo: {
            bdName: values.bdName,
            cityName: this.state.cityName,
            cityCode: values.cities && values.cities[1],
            agreementMail: values.agreementMail,
          },
        };
        this.setState({ submitting: true });
        fetch({
          url: 'kbsales.kbMerchantSignFacade.simpleSign',
          param,
        }).then(() => {
          this.setState({ submitting: false });
          message.success('协议已发送至您的邮箱');
          this.props.form.resetFields();
        }).catch(({res}) => {
          if (res) {
            message.error(res.resultMsg);
          }
          this.setState({ submitting: false });
        });
      }
    });
  }

  render() {
    const form = this.props.form;
    const { getFieldProps } = form;
    const { submitting } = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
    };
    const emailProps = getFieldProps('agreementMail', {
      validate: [{
        rules: [
          { required: true, message: '请输入邮箱地址' },
          { type: 'email', message: '请输入正确的邮箱地址' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    });
    return (
      <div>
        <div className="app-detail-header">商户联合生意计划</div>
        <div>
          <Form style={{ paddingTop: 10 }} form={form} horizontal onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="门店所在城市"
            >
            <Cascader
              expandTrigger="hover"
              style={{width: '100%'}}
              placeholder={this.state.loading ? '加载中…' : '请选择'}
              disabled={this.state.loading}
              options={this.state.areas}
              {...getFieldProps('cities', {
                rules: [{ required: true, message: '请选择门店所在城市' }],
                onChange: this.onChange,
              })}
            />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="邮箱"
              hasFeedback
            >
              <Input {...emailProps} type="email" placeholder="用于接收协议"/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="花名"
              style={{ paddingBottom: 24, borderBottom: '1px solid #e4e4e4' }}
            >
              <Input
                placeholder="请填写与您对接的口碑小二花名"
                {...getFieldProps('bdName', {rules: [
                  { required: true, message: '请输入花名' },
                  { max: 50, message: '花名最多50字'},
                ]})}
              />
            </FormItem>
            <FormItem>
              <div className="contract-content">
                <h3 style={{ textAlign: 'center' }}>0 费率联合生意计划 补充协议</h3>
                <div>甲方与乙方一、乙方二于签订了《口碑商户服务协议》(以下简称“原协议”)。现经三 方友好协商,对原协议部分内容调整达成如下一致:</div>
                <div>一、 为了帮助商户更加快速开展 O2O 业务,并大力推广乙方的口碑服务,乙方开展针 对口碑商户的优惠激励活动。</div>
                <div>二、 只要符合以下条件一全部内容及条件二中任一内容,确认签署本补充协议后,即可 申请零费率,申请生效之日起到 2018 年 6 月 30 日期间甲方的餐饮门店使用支付宝 当面付服务所产生的交易,享受 0 费率的优惠激励。具体条件如下:</div>
                <div>条件一:</div>
                <div>1.2018 年 1 月 1 日至 2018 年 6 月 30 日期间,甲方按照乙方要求在所属餐饮门店铺 设口碑和/或支付宝的物料。</div>
                <div>2.2018 年 1 月 1 日至 2018 年 6 月 30 日期间,甲方落地支付宝扫码领红包活动,包 括但不限于在收银台铺设扫码领红包活动物料、收银员绑定扫码领红包活动二维码、向用户 推荐扫码领取支付宝红包等与扫码领红包活动相关的事项。</div>
                <div>条件二:</div>
                <div>1. 甲方在 2018 年 1 月 1 日-2018 年 6 月 30 日期间将支付宝作为甲方所有门店唯一 的第三方支付机构合作伙伴,不与其他第三方支付机构合作。即甲方用户在甲方门店进行消 费时,如用户选择移动终端方式来完成支付的,甲方只向甲方用户提供并展示支付宝服务, 如甲方对其他第三方支付机构定义有疑问的,甲乙双方可通过邮件方式进行确认。或者在此 期间甲方所有门店将口碑(含开放平台)提供扫码点菜服务作为唯一服务插件,不与其他服 务机构合作。</div>
                <div>2. 甲方在 2018 年 1 月 1 日-2018 年 6 月 30 日期间,在口碑平台开展的优惠活动的 优惠力度不低于甲方在其他团购平台开展的任何形式优惠活动的优惠力度。且至少使用以下 产品中的一种:甲方使用口碑(含开放平台)提供的扫码点菜、码上付、预订产品。</div>
                <div>三、 如甲方存在以下行为,乙方有权要求甲方终止向甲方提供 0 费率的激励优惠,并 从甲方违约之日起按照本协议约定费率向甲方收取服务费;对于违约之前产生的交易 流量,乙方亦有权按照约定费率减去优惠费率后的费率向甲方补充收取服务费:</div>
                <div>1、 甲方违反本补充协议第二条的约定,乙方有权要求甲方在三个工作日内立即纠正, 如甲方逾期未纠正;</div>
                <div>2、 乙方有合理理由怀疑甲方使用当面付服务存在作弊、虚假交易、套取乙方及其关 联公司营销资源等异常行为的。</div>
                <div>四、 原协议约定的约定费率为:0.6%(2018 年 1 月 1 日-2018 年 6 月 30 日期间的优 惠费率为 0.55%)。</div>
                <div>五、 甲方理解并同意,只有甲方名下的餐饮门店方可享受 0 费率优惠;如甲方名下有 除餐饮门店以外的其他门店,则其他门店使用支付宝当面付服务所产生的交易不能享 受 0 费率优惠。</div>
                <div>六、 其他</div>
                <div>1、 本补充协议与原协议具有同等法律效力。原协议内容与本补充协议有冲突的,以本补充 协议为准。</div>
                <div>2、 本补充协议自双方盖章之日起生效,有效期与原协议有效期保持一致。如甲方通过乙方 及乙方关联公司平台点击确认的方式来确认本补充协议的,则从甲方在线确认之日起生 效。</div>
                <div>3、 本补充协议一式四份,双方各执两份,具有同等法律效力。</div>
              </div>
            </FormItem>
            <FormItem style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit" loading={submitting}>立即确认</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
export default Form.create()(KaContract);
