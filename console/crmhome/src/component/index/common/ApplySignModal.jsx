import React, {PropTypes} from 'react';
import ajax from '../../../common/ajax';
import {Form, Modal, Checkbox, message, Alert, Button} from 'antd';
import {getMerchantId} from '../../../common/utils';

const FormItem = Form.Item;


/**
 * 首页 - 消息 - 券购买签约弹框
 刘丹
 */

const ApplySignModal = React.createClass({

  propTypes: {
    merchantName: PropTypes.string,
    handleCancel: PropTypes.func,
    // confirmOrderAgree: PropTypes.func,   // 一键搬家活动商品上架
  },

  getInitialState() {
    return {
      hasSigned: true,// false代表未签约
      rate: 0.55,// 默认费率
      checked: true,// 复选框默认选中
    };
  },

  componentWillMount() {
    const merchantId = getMerchantId();
    ajax({
      url: '/goods/itempromo/signCheck.json?op_merchant_id=' + merchantId,
      type: 'json',
      data: {},
      success: (res) => {
        if (res && res.status === 'succeed') {
          if (res.data && res.data.hasSigned === false) {// 未签约
            this.setState({
              hasSigned: false,
              checked: false,
            });
          } else {// 已签约
            this.setState({
              hasSigned: true,
              checked: true,
            });
          }
          this.setState({rate: res.data.rate});
        } else {
          message.error('签约检查异常');
        }
      },
      error: (error) => {
        message.warning(error.resultMsg || '签约检查异常');
      },
    });
  },

  onOk() {
    if (this.state.hasSigned) {
      this.props.handleCancel();
      return;
    }
    // 请勾选协议
    if (!this.state.checked) {
      Modal.error({
        title: '请先同意协议并勾选点击协议标题',
        content: '可下载阅读协议全文',
      });
    } else {
      ajax({
        url: '/goods/itempromo/sign.json',
        method: 'post',
        type: 'json',
        data: {},
        success: (sign) => {
          if (sign && sign.status === 'succeed') {
            this.props.handleCancel();
            message.info('签约成功');
            // if (this.props.confirmOrderAgree) {
            //   this.props.confirmOrderAgree();  // 一键搬家 活动商品上架
            // }
          } else {
            this.props.handleCancel();
            message.error(sign.resultMsg || '签约失败');
          }
        },
        error: (error) => {
          message.warning(error.resultMsg);
          this.props.handleCancel();
        },
      });
    }
  },

  onChangeCheckbox(e) {
    this.setState({
      checked: e.target.checked,
    });
  },

  render() {
    const {rate, hasSigned, checked} = this.state;
    const rateTxt = `${rate}%`;
    const okText = hasSigned ? '知道了' : '立即开通';
    const footerBtn = [
      <Button key="submit" type="primary" size="large" onClick={this.onOk}>
        {okText}
      </Button>,
    ];
    // 一键搬家泛行业
    // if (this.props.confirmOrderAgree) {
    //   okText = '立即开通服务并确认上架';
    //   footerBtn = [
    //     <Button key="submit" type="primary" size="large" disabled={checked ? false : true} onClick={this.onOk}>
    //       立即开通服务并确认上架
    //     </Button>,
    //     <Button size="large" onClick={this.props.handleCancel}>
    //       取消
    //     </Button>,
    //   ];
    // }
    const signUrl = 'https://render.alipay.com/p/f/fd-iuid3m48/index.html';
    const alertMsg = `${this.props.merchantName}提醒你开通在线购买服务，请了解并开通。`;
    return (
      <Modal title="开通在线购买服务"
        width={700}
        onCancel={this.props.handleCancel}
        footer={footerBtn}
        visible>
       <FormItem>
       <div className="fn-ml15 fn-mr30">
        {
          hasSigned ?
          <Alert message="你已开通在线购买服务，请看下方签约信息" type="success" showIcon /> :
          <Alert message={alertMsg} type="info" showIcon />
        }
        </div>
        <div className="itempromo-new-form-padding">
          <h3 className="itempromo-new-form-subtitle" style={{margin: '15px 0 0 0'}}><span>签约规则</span></h3>
        </div>
        <div className="ft-orange fn-ml30">在线购买服务必须为商户主账号签约。</div>
        <div className="itempromo-new-form-padding">
          <h3 className="itempromo-new-form-subtitle" style={{margin: '15px 0 0 0'}}><span>服务规则</span></h3>
        </div>
        <div className="fn-ml30">商户在开通“在线购买”服务后才能参加“在线购买商品／服务”相关活动。</div>
        <div className="fn-ml30" style={{color: 'gray'}}>开通“在线购买”服务后才能参加“在线购买商品/服务”相关的活动。</div>
        <div className="fn-ml30" style={{color: 'gray'}}>具体参加活动的商户范围以口碑实际开放的为准。</div>
        <div className="itempromo-new-form-padding">
          <h3 className="itempromo-new-form-subtitle" style={{margin: '15px 0 0 0'}}><span>费率收取</span></h3>
        </div>
        <div className="fn-ml30">开通成功后，口碑将按照 <span className="ft-orange">{rateTxt}</span> 的费率收取服务费（信用卡渠道除外，需另外开通）。</div>
        <div className="fn-ml15 fn-mt15">
          <Checkbox
            checked={checked}
            disabled={hasSigned}
            onChange={this.onChangeCheckbox}>
            阅读并同意<a href={signUrl} target="_blank">《在线购买服务商户协议》</a>
          </Checkbox>
        </div>
      </FormItem>
      </Modal>
    );
  },
});

export default ApplySignModal;
