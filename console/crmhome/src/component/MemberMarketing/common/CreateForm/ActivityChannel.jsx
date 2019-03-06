import React, {PropTypes} from 'react';
import { Form, Modal, Row, Col, Radio, InputNumber} from 'antd';
import classnames from 'classnames';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const ActivityChannel = React.createClass({
  propTypes: {
    form: PropTypes.object,
    layout: PropTypes.object,
    initData: PropTypes.object,
    roleType: PropTypes.string,
    actionType: PropTypes.string,
    checkBox: PropTypes.object,
  },

  getDefaultProps() {
    return {
      initData: {},
    };
  },

  getInitialState() {
    const { initData } = this.props;
    return {
      modalVisible: false,
      valueRadio: initData.deliveryChannels && initData.deliveryChannels.join('') || '',
    };
  },

  componentWillMount() {
  },

  onRadioChange(e) {
    this.setState({
      valueRadio: e.target.value,
    });
  },

  // 点击预览
  clickPreview(type, e) {
    e.preventDefault();
    this.setState({
      modalType: type,
      modalVisible: true,
    });
  },

  // 关闭预览
  closePreview() {
    this.setState({ modalVisible: false });
  },

  checkNum(rule, value, callback) {
    const { initData, actionType} = this.props;
    if (value <= 0 ) {
      callback([new Error('商品件数必须大于零')]);
    }
    if (actionType === 'edit' && initData.displayStatus === 'STARTED') {
      if (value < Number(initData.dayAvailableNum) ) {
        callback([new Error('商品件数只能增加不能减少')]);
      }
    }

    callback();
  },

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { initData, layout, actionType } = this.props;
    let isDisabled = false;
    if (actionType === 'edit' && initData.displayStatus === 'STARTED') {
      isDisabled = true;
    }

    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    let deliveryChannelsValue;
    if (initData.deliveryChannels) {
      initData.deliveryChannels.map(p => {
        if ( p === 'SHOP_DETAIL' || p === 'BIG_BRAND_BUY') {
          deliveryChannelsValue = p;
        }
      });
    }
    return (
      <div>
        <FormItem
          {...layout.checkbox}
          required
          label="投放渠道：">
            <RadioGroup {...getFieldProps('deliveryChannels', {
              initialValue: deliveryChannelsValue ? deliveryChannelsValue : '',
              onChange: this.onRadioChange,
              rules: [
                { required: true, type: 'string', message: '请选择投放渠道' },
              ],
            })}>
              <Radio style={radioStyle} disabled={isDisabled} value="SHOP_DETAIL">店铺详情页活动<a href="#" onClick={this.clickPreview.bind(this, 'SHOP_DETAIL')} style={{marginLeft: 32}}>预览</a></Radio>
              <Radio style={radioStyle} disabled={isDisabled} value="BIG_BRAND_BUY">
                大牌快抢频道活动<a href="#" onClick={this.clickPreview.bind(this, 'BIG_BRAND_BUY')} style={{marginLeft: 20}}>预览</a>
                {this.state.valueRadio === 'BIG_BRAND_BUY' ?
                  <FormItem
                  style={{marginLeft: 20}}
                  label=""
                  help={getFieldError('dayAvailableNum')}
                  validateStatus={
                  classnames({
                    error: !!getFieldError('dayAvailableNum'),
                  })}>
                    每日快抢优惠券数量
                    <InputNumber min={1} max={99999999} step={1} style={{ width: 70, marginLeft: 5, marginRight: 5 }}
                    {...getFieldProps('dayAvailableNum', {
                      rules: [
                        { required: this.state.valueRadio === 'BIG_BRAND_BUY' ? true : false, type: 'number', message: '请输入每日快抢优惠券数量' },
                        { validator: this.checkNum },
                      ],
                      initialValue: initData.dayAvailableNum ? Number(initData.dayAvailableNum) : initData.dayAvailableNum,
                    })} />
                    张
                  </FormItem> : null}
              </Radio>
            </RadioGroup>
        </FormItem>
        {this.state.modalType ? <Modal ref="modal" style={{top: modalTop}}
          visible={this.state.modalVisible} onCancel={this.closePreview}
          title={this.state.modalType === 'SHOP_DETAIL' ? '店铺详情页预览' : '大牌快抢预览'}
          width="800"
          footer={[]}>
          <Row type="flex" justify="space-around">
            <Col span="8">
              <div style={{textAlign: 'center', padding: '10px 0 25px', fontSize: 15}}>{this.state.modalType === 'SHOP_DETAIL' ? '店铺详情页' : '大牌快抢'}</div>
              <img width="100%" src={this.state.modalType === 'SHOP_DETAIL' ? 'https://zos.alipayobjects.com/rmsportal/iYAngRiQMzedKHo.png' : 'https://zos.alipayobjects.com/rmsportal/WWhsFMomlJmniNK.png'}/>
              {this.state.modalType === 'SHOP_DETAIL' ? <div style={{textAlign: 'center', marginTop: 10}}>店铺详情页露出<br/>可丰富店铺内容，线上线下结合引流<br/>不需要审核活动参与资格</div> : <div style={{textAlign: 'center', marginTop: 10}}>口碑大牌快抢频道<br/>集中大品牌的活动渠道，利用线上流量优势推荐<br/>需要审核活动参与资格</div>}
            </Col>
          </Row>
        </Modal> : null}
      </div>
    );
  },
});

export default ActivityChannel;
