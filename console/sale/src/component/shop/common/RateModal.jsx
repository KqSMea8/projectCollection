import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import {Modal, Form, InputNumber, message, Button} from 'antd';
import classnames from 'classnames';
const FormItem = Form.Item;
import { times, div } from '../../../common/utils';
const ControlModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    id: PropTypes.string,
    pId: PropTypes.string,
    options: PropTypes.array,
    merchantPid: PropTypes.string,
    categoryId: PropTypes.string,
    RateData: PropTypes.object,
  },

  getInitialState() {
    return ({
      visible: false,
      values: [],
      value: '管控工具',
      help: '',
      submitButtonDisable: false,
    });
  },

  componentDidMount() {
    // 费率范围
  },
  onOptionsChange(item) {
    const {options} = this.props;
    options.map(item1 => {
      if (item1.value === item[0]) {
        item1.children.map(item2 => {
          if (item2.value === item[1]) {
            this.setState({
              value: item2.control,
              help: item2.remind,
            });
          }
        });
      }
    });
  },
  onSubmit() {
    this.props.form.submit(() => {
      this.props.form.validateFields((errors) => {
        if (errors) {
          return;
        }
        this.setState({submitButtonDisable: true});
        const info = {...this.props.form.getFieldsValue()};
        if (info.rate) {
          const startAE = /^\.\d+$/;
          const floatAE = /^\d+\.\d+$/;
          let rateStr = info.rate.toString();
          if (rateStr.indexOf('.') !== -1) {
            if (startAE.test(rateStr)) {
              rateStr = '0' + rateStr;
            }
            if (floatAE.test(rateStr)) {
              info.rate = info.rate && info.rate.toString().replace('.', '.00');
            }
          } else {
            info.rate = div(info.rate, 100);
          }
        }
        info.shopId = this.props.id;
        info.pid = this.props.pId;
        info.psCode = this.state.RateData.psCode;
        info.psId = this.state.RateData.psId;
        ajax({
          url: window.APP.crmhomeUrl + '/shop/koubei/modifyRate.json',
          method: 'post',
          data: info,
          type: 'json',
          success: (result) => {
            if (result.status === 'succeed') {
              this.setState({
                visible: false,
                submitButtonDisable: false,
              });
              if (result.data.needConfirm) {
                Modal.success({
                  title: '提交成功，待商户确认',
                  content: <p>请通知商户在<span style={{color: '#f04134'}}>口碑掌柜</span>中确认,费率才可生效</p>,
                  okText: '知道了，关闭窗口',
                });
              } else {
                Modal.success({
                  title: '提交成功，即刻生效',
                  content: '',
                  okText: '知道了，关闭窗口',
                });
              }

              this.props.form.resetFields();
              this.setTimeOut();
            }
          },
          error: (result) => {
            if (result.status === 'failed') {
              message.error(result.resultMsg, 2.5);
              this.handleCancel();
              this.setState({submitButtonDisable: false});
            }
          },
        });
      });
    });
  },
  setTimeOut() {
    setTimeout(()=> {
      window.location.hash = '#/shop/my';
    }, 3000);
  },
// 查询费率
  queryLoginRole() {
    const data = {
      categoryId: this.props.categoryId,
      pid: this.props.pId,
      type: 'MODIFY_SHOP_RATE',
    };
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/queryStandardRate.json',
      method: 'get',
      data: data,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          if (result.data.needShowRate) {
            this.setState({
              visible: true,
            });
          }
          this.setState({
            RateData: result.data,
          });
        }
      },
      error: (result) => {
        if (result.status === 'failed') {
          message.error(result.resultMsg, 2.5);
          this.handleCancel();
          this.setState({submitButtonDisable: false});
        }
      },
    });
  },
  // closeWindow() {
  //   window.close();
  // },
  showModal() {
    this.queryLoginRole();
  },
  handleCancel() {
    this.setState({
      visible: false,
      submitButtonDisable: false,
    });
    this.props.form.resetFields();
  },
  render() {
    const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
    const RateData = this.state.RateData || {};
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    console.log(this.state.visible);
    const minRate = RateData.minRate && times(RateData.minRate, 100);
    const maxRate = RateData.maxRate && times(RateData.maxRate, 100);
    const rate = RateData.rate && times(RateData.rate, 100);
    return (<div style={{display: 'inline-block'}}>
      <a onClick={this.showModal}>修改费率</a>
      <Modal
        title="修改费率"
        visible={this.state.visible}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
          <Button key="submit" type="primary" size="large" loading={this.state.submitButtonDisable} onClick={this.onSubmit}>
            确定
          </Button>,
        ]}
      >
        <Form form = {this.props.form}>
          <FormItem
            {...formItemLayout}
            label="费率："
            validateStatus={
              classnames({
                error: !!getFieldError('rate'),
              })}
            help={getFieldError('rate')}
            extra={<p>根据当前门店已选品类，允许调价范围: {minRate + '%' } - {maxRate + '%'}</p> }
            style={{margin: '15px 0px', overflow: 'hidden'}}>
            <InputNumber step={0.0001} {...getFieldProps('rate', {
              rules: [{
                required: true,
                type: 'number',
                message: '此处必填',
              }, {
                max: maxRate,
                type: 'number',
                message: '费率不能高于' + maxRate + '%',
              }, {
                min: minRate,
                type: 'number',
                message: '费率不能低于于' + minRate + '%',
              }],
            })}/>%
          </FormItem>
        </Form>
        { (maxRate !== rate) && (getFieldValue('rate') > rate) && <p style={{color: '#ffbf00', marginLeft: '82px'}}>高于{rate + '%'}时，需商户同意才生效，请及时联系商户，如商户已经确认过则无需重新确认。</p>}
      </Modal>
    </div>);
  },
});

export default Form.create()(ControlModal);
