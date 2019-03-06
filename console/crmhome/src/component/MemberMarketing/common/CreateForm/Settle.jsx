import React, {PropTypes} from 'react';
import { Form, Radio, message, Alert, Icon } from 'antd';
import ajax from '../../../../common/ajax';


const FormItem = Form.Item;
const RadioGroup = Radio.Group;

/*
  表单字段 － 结算方式
*/

const Settle = React.createClass({
  propTypes: {
    form: PropTypes.object,
    layout: PropTypes.object,
    initData: PropTypes.object,
    actionType: PropTypes.string,
    changeType: PropTypes.func,
  },

  getDefaultProps() {
    return {
      initData: {},
    };
  },

  getInitialState() {
    return {
      points: null,
      warningStatus: 'enough',
      isShowSettle: false,
    };
  },

  componentWillMount() {
    this.queryOpenStatus();
  },

  getPoints() {
    const self = this;
    const { form: { setFieldsValue }, actionType } = self.props;

    ajax({
      url: '/promo/kbsettle/getPoints.json',
      method: 'GET',
      type: 'json',

      success: (res) => {
        if (res.success === true) {
          self.setState({
            pointBalance: res.pointBalance,
            warningStatus: res.warningStatus,
            isShowSettle: true,
          }, ()=> {
            // 非编辑状态下，如果预存资金不足，默认选项为线下结算
            if (actionType === 'edit') {
              return;
            }

            if (res.warningStatus === 'lack') {
              setFieldsValue({
                needKBSettle: 'false',
              });
              self.props.changeType(false);
            }
          });
        } else {
          message.error(res.errorMsg);
        }
      },
      error: (err) => {
        message.error(err.errorMsg);
      },
    });
  },

  queryOpenStatus() {
    ajax({
      url: '/promo/kbsettle/openStatus.json',
      method: 'GET',
      type: 'json',
      success: (res) => {
        if (res.success === true) {
          if (res.openStatus) {
            this.getPoints();
          }
        }
      },
      error: (err) => {
        message.error(err.errorMsg || '获取签约积分状态失败');
      },
    });
  },

  render() {
    const { getFieldProps } = this.props.form;
    const { layout, initData, actionType } = this.props;

    const { warningStatus, pointBalance, isShowSettle } = this.state;

    let isDisabled = false;
    if (actionType === 'edit') {
      isDisabled = true;
    }

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return isShowSettle ? (
        <div>
          <div className="title-split">
            <span>结算方式</span>
          </div>
          <FormItem
              {...layout}
              required
              label="结算方式">
            <RadioGroup
                disabled={isDisabled}
                {...getFieldProps('needKBSettle', {
                  initialValue: initData.needKBSettle ? 'true' : 'false',
                  onChange: (event) => {
                    this.props.changeType(event.target.value === 'true');
                  },
                })}>
              <Radio style={radioStyle} key="a" value="true" disabled={warningStatus === 'lack'}>启用资金自动结算功能</Radio>
              {
                warningStatus !== 'enough' && (
                    <div>
                      { warningStatus === 'lack' ? (
                          <Alert message={(
                              <div>
                                <p><Icon type="exclamation-circle" className="ant-alert-icon"/>你的预存资金处于“资金不足”状态，预存资金已低于设定的预警资金值，如使用此功能，请尽快充值。<a href="https://jf.alipay.com/aop/purchase.htm" target="_blank">[立即充值]</a></p>
                                <p style={{marginTop: 10}}>当前剩余预存资金为 <span style={{color: '#FF6600', fontSize: 16}}>{pointBalance}元</span></p>
                              </div>
                          )} type="error"/>
                      ) : (
                          <Alert message={(
                              <div>
                                <p><Icon type="exclamation-circle" className="ant-alert-icon"/>你的预存资金处于“资金紧张”状态，预存资金即将到达预警资金值，为保证结算正常，请尽快充值。<a href="https://jf.alipay.com/aop/purchase.htm" target="_blank">[立即充值]</a></p>
                                <p style={{marginTop: 10}}>当前剩余预存资金为 <span style={{color: '#FF6600', fontSize: 16}}>{pointBalance}元</span></p>
                              </div>
                          )} type="warning"/>
                      )}
                    </div>
                )
              }
              <Radio style={radioStyle} key="b" value="false">活动后与商户线下结算</Radio>
            </RadioGroup>
          </FormItem>
        </div>
    ) : (<div></div>);
  },
});

export default Settle;
