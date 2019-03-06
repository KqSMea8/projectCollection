import React, { PropTypes } from 'react';
import { Modal, Form, Button, Spin } from 'antd';
import ajax from '../../../common/ajax';

const ProductPaySettingsModal = React.createClass({
  propTypes: {
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    form: PropTypes.object,
    onRefresh: PropTypes.func,
    listData: PropTypes.object,
  },
  getInitialState() {
    return {
      showModal: false,
      securityLoading: true, // 安全服务化loading
      securityCheckUrl: '',
      showErrorText: '', // 用于展示没有请求到securityCheckUrl时的文案
    };
  },
  componentDidMount() {
  },
  onSave(e) {
    if (e) e.preventDefault();
    this.setState({
      showModal: false,
    });
    const { listData } = this.props; // CLOSED表示已关闭状态,对应操作为开通 OPENED表示已开通状态,对应操作为关闭
    const { securityId } = this.state;
    const { validateFields } = this.props.form;
    validateFields((errors) => {
      const data = {};
      if (!errors) {
        data.securityId = securityId;
        data.channelCode = listData.channelCode;
        if (listData.status === 'OPENED') {
          this.props.onOk(data, 'close'); // 已开通的调关闭接口
        } else if (listData.status === 'CLOSED') {
          this.props.onOk(data, 'open'); // 已关闭的调开通接口
        }
      } else {
        this.getSecurityCode(); // 安全服务化验证
      }
    });
  },

  onClick(e) {
    if (e) e.preventDefault();
    this.getSecurityCode(); // 安全服务化验证
    this.setState({
      showModal: true,
    });
  },

  onCancel() {
    this.setState({
      showModal: false,
    });
  },

  getSecurityCode() {
    ajax({
      url: '/goods/itempromo/initPayChannel.json',
      method: 'get',
      type: 'json',
      success: (result = {}) => {
        if (result.status === 'succeed') {
          const data = result.data || {};
          this.setState({
            securityId: data.securityId,
            securityCheckUrl: data.url,
            securityLoading: false,
          });
        } else {
          this.setState({
            securityLoading: false,
          });
        }
      },
      error: (result = {}) => {
        this.setState({
          securityLoading: false,
          showErrorText: result.resultMsg,
        });
      },
    });
  },

  render() {
    const { listData } = this.props;
    const {showModal, securityLoading, securityCheckUrl, showErrorText} = this.state;
    let showStatus; // 标识列表里需要展示的开通或者关闭文案
    let showModalStatus; // 标识modal里的title文案显示
    if (listData.status === 'OPENED') {
      showStatus = '关闭';
      showModalStatus = '关闭信用卡';
    } else if (listData.status === 'CLOSED') {
      showStatus = '开通';
      showModalStatus = '开通信用卡';
    }
    const errorStyle = {
      color: 'red',
      margin: '0 auto',
      width: '500px',
      fontSize: '15px',
      lineHeight: '130px',
      textAlign: 'center',
    };
    return (
      <div>
        <div><a href="" onClick={ this.onClick }>{showStatus}</a></div>
        {
          showModal ?
          <Modal title={showModalStatus} visible onCancel={ this.onCancel } width={510} footer={ null }>
            <Form style={{height: '180px'}} form={ this.props.form } horizontal onSubmit={ this.onSave }>
              <div>
                <Spin spinning={securityLoading}>
                  {
                    securityCheckUrl ?
                    <iframe src={securityCheckUrl} frameBorder="0" width="100%" onLoad={() => {this.setState({securityLoading: false});}}></iframe>
                    : <div style={{...errorStyle}}>{showErrorText}</div>
                  }
                </Spin>
              </div>
              <Button style={{display: 'none'}} id="formSubmit" key="submit" type="primary" size="large" onClick={this.onSave}>
                确定
              </Button>
            </Form>
          </Modal> : null
        }
      </div>
    );
  },
});

export default Form.create()(ProductPaySettingsModal);

