import React from 'react';
import { Alert, Checkbox, Button, Form, Spin, Row, message, Modal } from 'antd';
import ErrorPage from '../../../common/ErrorPage';
import permission from '@alipay/kb-framework/framework/permission';
import ajax from 'Utility/ajax';
import './SignConfirm.less';

const SignConfirm = React.createClass({
  getInitialState() {
    return {
      loading: true,
      data: {},
      submitting: false,
      visible: false,
      protocolContent: null,
      ctuError: false,
    };
  },
  componentDidMount() {
    if (permission('KB_REWARD_SIGN')) {
      ajax({
        url: window.APP.crmhomeUrl + '/merchant/koubei/merchantSignCheckReward.json.kb',
        method: 'get',
        data: {
          alias: 'koubeireward',
        },
        type: 'json',
        success: (result) => {
          if (result.status === 'succeed' && result.data) {
            this.setState({
              loading: false,
              data: result.data,
            });
          } else {
            this.setState({
              loading: false,
            });
            message.error(result.resultMsg || '请求异常，请稍后再试');
          }
        },
        error: (result) => {
          this.setState({
            loading: false,
          });
          message.error(result.resultMsg || '请求异常，请稍后再试');
        },
      });
    }
  },
  onOpen() {
    const { getFieldValue } = this.props.form;
    if (getFieldValue('agreeProtocol')) {
      this.setState({
        submitting: true,
      }, () => {
        ajax({
          url: window.APP.crmhomeUrl + '/merchant/koubei/merchantSign.json.kb',
          method: 'post',
          data: {
            alias: 'koubeireward',
          },
          type: 'json',
          success: (result) => {
            if (result.data) {
              this.setState({
                submitting: false,
                data: {
                  opened: true,
                },
              });
            } else {
              this.setState({
                submitting: false,
              });
              message.error(result.resultMsg || '请求异常，请稍后再试');
            }
          },
          error: (result) => {
            if (result && result.resultCode === 'AE0311717s32') {
              this.setState({
                submitting: false,
                ctuError: true,
              });
            } else {
              this.setState({
                submitting: false,
              });
              message.error(result && result.resultMsg || '请求异常，请稍后再试');
            }
          },
        });
      });
    }
  },
  openModal(companyCode, salesPlans) {
    ajax({
      url: window.APP.crmhomeUrl + '/merchant/koubei/merchantSignProtocol.json.kb',
      method: 'get',
      data: {
        companyCode,
        codes: salesPlans.map((item) => {return item.salesPlanCode;}).join(','),
      },
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed' && result.data && result.data.length > 0) {
          this.setState({
            visible: true,
            protocolContent: result.data[0].protocolContent,
          });
        } else {
          message.error(result.resultMsg || '请求异常，请稍后再试');
        }
      },
      error: () => {
        message.error('请求异常，请稍后再试');
      },
    });
  },
  render() {
    if (!permission('KB_REWARD_SIGN')) {
      return <ErrorPage type="permission"/>;
    }

    const { data, loading, submitting, ctuError } = this.state;
    const { getFieldProps, getFieldValue } = this.props.form;

    let conflictLink = null;
    if (data.opened === false && !!data.conflicts && data.conflicts.length !== 0) {
      conflictLink = data.conflicts.map((item, index) => {
        if (!item.orderLinkId) {
          return <span key={`${index}-conflictLink`} >{` ${item.salesPlanName} `}</span>;
        }
        return <a key={`${index}-conflictLink`} href={`${window.APP.morderprodUrl}/order/myProductInfo.htm?orderItemId=${item.orderLinkId}`} target="_blank">{` ${item.salesPlanName} `}</a>;
      });
    }

    let protocolLink = null;
    if (data.salesPlans && data.salesProtocols) {
      protocolLink = data.salesProtocols.map((item, index) => {
        return (<a
          href="#"
          key={`${index}-protocol`}
          onClick={(e) => {
            e.preventDefault();
            this.openModal(item.companyCode, data.salesPlans);
          }}>《{item.protocolName}》</a>);
      });
    }
    return (<div>
      {
        loading && <Row style={{textAlign: 'center', marginTop: 80}}><Spin/></Row>
      }
      {!loading && <div>
        <div className="app-detail-header">
          首页 > 消息详情
        </div>
        <div className="app-detail-content-padding">
          <h3 className="kb-form-sub-title" style={{marginTop: '0'}}>
            <div className="kb-form-sub-title-icon"></div>
            <span className="kb-form-sub-title-text">签约支付宝当面付推广产品</span>
          </h3>
          {data.opened === false && !!data.conflicts && data.conflicts.length !== 0 ? <div style={{padding: '0 0 0 16px'}}>
            <Alert message={<span>当前协议与您账号现已签约的 {conflictLink} 有冲突，无法开通此服务。</span>} type="error" showIcon />
          </div> : null}
          {ctuError && <div style={{padding: '0 0 0 16px'}}>
            <Alert message="当前签约账户存在安全风险，请更换账户来签约" type="error" showIcon />
          </div>}
          {data.opened ? <div style={{padding: '0 0 0 16px'}}>
            <Alert message="已签约开通此服务" type="success" showIcon />
          </div> : null}
          <div style={{padding: '0 0 0 16px'}}>签约成功后，服务商账号及公司员工可以推广线下商家开通支付宝当面付支付产品，以便顾客在该商家消费后使用支付宝钱包付款。</div>
          <div style={{width: '70%', marginTop: '32px', marginLeft: '16px', paddingBottom: '32px', borderBottom: '1px dashed #e4e4e4'}}>
            <img src="https://zos.alipayobjects.com/rmsportal/UcgYHlyAgMCpXpS.png" style={{width: '100%'}}/>
          </div>
          {!data.opened && protocolLink ? <div>
            <div style={{padding: '24px 0 24px 16px'}}>
              <label>
                <Checkbox {...getFieldProps('agreeProtocol', {
                  valuePropName: 'checked',
                  initialValue: true,
                })}/>
                同意{protocolLink}
              </label>
            </div>
            <div style={{padding: '0 0 0 16px'}}>
              <Button type="primary" size="large" disabled={!getFieldValue('agreeProtocol') || data && data.opened || data.conflicts && data.conflicts.length !== 0 || ctuError} onClick={this.onOpen} loading={submitting}>确定开通服务</Button>
            </div>
          </div> : null}
        </div>
      </div>}
      <Modal
        title="协议内容"
        visible={this.state.visible}
        closable={false}
        onOk={() => { this.setState({visible: false}); }}
        onCancel={() => { this.setState({visible: false}); }}
        className="sign-protocol"
      >
        <div dangerouslySetInnerHTML={{__html: this.state.protocolContent}} />
      </Modal>
    </div>);
  },
});

export default Form.create()(SignConfirm);
