import React, { PropTypes } from 'react';
import { Form, Modal, Checkbox, Alert, Button } from 'antd';
// import ajax from '../../../common/ajax';
// import { getMerchantId } from '../../../common/utils';

const FormItem = Form.Item;
/**
 * 泛行业专用
 */
export default class ApplySignModal extends React.Component {
  static propTypes = {
    merchantName: PropTypes.string,
    handleCancel: PropTypes.func,
    confirmOrderAgree: PropTypes.func,   // 一键搬家活动商品上架
    onlineTradePayRate: PropTypes.string,
    isCatering: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    okText: PropTypes.string,
  };

  static defaultProps = {
    defaultChecked: true,
    okText: '立即开通服务并确认上架',
  };

  constructor(props) {
    super(props);
    this.state = {
      rate: 0.55,// 默认费率
      checked: props.defaultChecked,// 复选框默认选中
    };
  }

  componentWillMount() {
  }

  onOk = () => {
    // 请勾选协议
    if (!this.state.checked) {
      Modal.error({
        title: '请先同意协议并勾选点击协议标题',
        content: '可下载阅读协议全文',
      });
    } else {
      this.props.confirmOrderAgree();
    }
  }

  onChangeCheckbox = (e) => {
    this.setState({
      checked: e.target.checked,
    });
  }

  render() {
    const { rate, checked } = this.state;
    const rateTxt = this.props.onlineTradePayRate ? `${this.props.onlineTradePayRate}%` : `${rate}%`;
    // 一键搬家泛行业
    const footerBtn = [
      <Button key="submit" type="primary" size="large" disabled={checked ? false : true} onClick={this.onOk}>
        {this.props.okText}
      </Button>,
      <Button size="large" onClick={this.props.handleCancel}>
        取消
      </Button>,
    ];
    const signUrl = 'https://render.alipay.com/p/f/fd-iuid3m48/index.html';
    let alertMsg = '';
    if (this.props.isCatering) {
      alertMsg = '商品确认上架前，请先签约在线购买服务协议';
    } else {
      alertMsg = `${this.props.merchantName}提醒你开通在线购买服务，请了解并开通。`;
    }
    const styles = window !== window.top ? {
      top: window.top.scrollY,
    } : undefined;
    return (
      <Modal title="开通在线购买服务"
        width={700}
        onCancel={this.props.handleCancel}
        footer={footerBtn}
        visible
        style={styles}
      >
        <FormItem>
          <div className="fn-ml15 fn-mr30">
            <Alert message={alertMsg} type="info" showIcon />
          </div>
          <div className="itempromo-new-form-padding">
            <h3 className="itempromo-new-form-subtitle" style={{ margin: '15px 0 0 0' }}><span>签约规则</span></h3>
          </div>
          <div className="ft-orange fn-ml30">在线购买服务必须为商户主账号签约。</div>
          <div className="itempromo-new-form-padding">
            <h3 className="itempromo-new-form-subtitle" style={{ margin: '15px 0 0 0' }}><span>服务规则</span></h3>
          </div>
          <div className="fn-ml30">商户在开通“在线购买”服务后才能参加“在线购买商品／服务”相关活动。</div>
          <div className="fn-ml30" style={{ color: 'gray' }}>开通“在线购买”服务后才能参加“在线购买商品/服务”相关的活动。</div>
          <div className="fn-ml30" style={{ color: 'gray' }}>具体参加活动的商户范围以口碑实际开放的为准。</div>
          <div className="itempromo-new-form-padding">
            <h3 className="itempromo-new-form-subtitle" style={{ margin: '15px 0 0 0' }}><span>费率收取</span></h3>
          </div>
          <div className="fn-ml30">开通成功后，口碑将按照 <span className="ft-orange">{rateTxt}</span> 的费率收取服务费（信用卡渠道除外，需另外开通）。</div>
          <div className="fn-ml15 fn-mt15">
            <Checkbox
              checked={checked}
              onChange={this.onChangeCheckbox}>
              阅读并同意<a href={signUrl} target="_blank">《在线购买服务商户协议》</a>
            </Checkbox>
          </div>
        </FormItem>
      </Modal>
    );
  }
}
