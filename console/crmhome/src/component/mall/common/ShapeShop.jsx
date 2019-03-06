import React, {PropTypes} from 'react';
import {Form, Modal, Button, Radio, message} from 'antd';
import ajax from '../../../common/ajax';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const ShapeShop = React.createClass({
  propTypes: {
    mallId: PropTypes.string,
    selectedIds: PropTypes.array,
    type: PropTypes.string,
    buttonText: PropTypes.string,
    onEnd: PropTypes.func,
    deletMapShopId: PropTypes.func,
  },

  getInitialState() {
    return {
      visible: false,
      visibleTow: false,
      visibleThree: false,
      radioId: '1',
    };
  },
  onRadioGroupValue(e) {
    this.setState({
      radioId: e.target.value,
    });
  },
  showModal(e) {
    e.preventDefault();
    this.setState({
      visible: true,
    });
  },
  handleOk() {
    const {mallId, selectedIds} = this.props;
    const params = {};
    params.mallId = mallId;
    params.shopIds = selectedIds;
    params.authType = this.state.radioId;
    console.log(params);
    ajax({
      url: window.APP.kbretailprod + '/gateway.htm?biz=mall.dataauth&action=/dataauth/apply',
      method: 'get',
      data: {
        data: JSON.stringify(params),
      },
      type: 'json',
      success: (result) => {
        if (result.success) {
          message.success('操作成功');
          this.props.onEnd();
          this.setState({ visible: false });
        } else {
          message.error(result.errorMsg || '系统繁忙，请稍后再试', 3);
          this.setState({ visible: false });
        }
      },
      error: (e) => {
        message.error(e.errorMsg || '系统繁忙，请稍后再试', 3);
        this.setState({ visible: false });
      },
    });
  },
  handleCancel(e) {
    e.preventDefault();
    this.setState({ visible: false });
  },
  handleCancelTwo(e) {
    e.preventDefault();
    this.setState({ visibleTow: false});
  },
  showModalTow() {
    this.setState({
      visibleTow: true,
    });
  },
  showModalThree() {
    this.setState({
      visibleThree: true,
    });
  },
  render() {
    const {selectedIds, type, buttonText} = this.props;
    return (<div style={{display: 'inline-block'}}>
      {type === 'button' && <Button type="primary" onClick={this.showModal} disabled={selectedIds.length === 0}>{buttonText}</Button>}
      {type === 'text' && <a href="#" onClick={this.showModal}>{buttonText}</a>}
      <Modal
          title="申请商户数据"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确定"
          cancelText="取消"
        >
        <Form horizontal style={{marginTop: 20}}>
          <FormItem>
            <RadioGroup defaultValue={this.state.radioId} onChange={this.onRadioGroupValue}>
              <Radio style={{display: 'block', float: 'left', marginRight: '180px'}} value="1">口碑活动数据
                <a onClick={this.showModalTow} style={{display: 'block', marginLeft: '16px'}}>《活动数据授权协议》</a>
                <Modal
                  title="活动数据协议"
                  width="700px"
                  visible={this.state.visibleTow}
                  footer={[<Button key="modify" size="large" type="primary" onClick={() => {this.setState({ visibleTow: false });}}>确认</Button>]}
                  onCancel={ () => {this.setState({ visibleTow: false });}}>
                  <div>
                    <iframe src={'https://render.alipay.com/p/f/shopDataAuth/index.html'} width="680" height="450" scrolling="no" style={{border: 'none'}}/>
                  </div>
                </Modal>
              </Radio>
              <Radio style={{display: 'block', float: 'right'}} value="2">口碑交易数据
                <a onClick={this.showModalThree} style={{display: 'block', marginLeft: '16px'}}>《交易数据授权协议》</a>
                <Modal
                  title="交易数据协议"
                  width="700px"
                  visible={this.state.visibleThree}
                  footer={[<Button key="modify" size="large" type="primary" onClick={() => {this.setState({ visibleThree: false });}}>确认</Button>]}
                  onCancel={ () => {this.setState({ visibleThree: false });}}>
                    <div>
                      <iframe src={'https://render.alipay.com/p/f/shopDataAuth/index.html'} width="680" height="450" scrolling="no" style={{border: 'none'}}/>
                    </div>
                </Modal>
              </Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </Modal>
    </div>);
  },
});

export default ShapeShop;
