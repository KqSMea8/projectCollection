import React, {PropTypes} from 'react';
import { Form, Checkbox, Modal, Row, Col } from 'antd';

const FormItem = Form.Item;
const AGREEMENT_INFO = {
  payment: {
    title: '委托核销服务协议',
    src: 'https://os.alipayobjects.com/rmsportal/ycxhoLimVQzlAbm.html',
  },

  settle: {
    title: '资金自动结算相关协议',
    src: 'https://os.alipayobjects.com/rmsportal/INAWnwFnJzDnOwd.html',
  },
};

/*
  表单字段 － 同意协议
*/

const Agreement = React.createClass({
  propTypes: {
    form: PropTypes.object,
    needKBSettle: PropTypes.bool,
  },

  getInitialState() {
    return {
      dealVisible: false,
      type: 'payment',
    };
  },

  showDeal(event, type) {
    event.preventDefault();

    this.setState({
      dealVisible: true,
      type: type,
    });
  },

  closeDeal() {
    this.setState({
      dealVisible: false,
    });
  },

  render() {
    const { getFieldProps } = this.props.form;
    const { dealVisible, type } = this.state;

    return (
      <div>
        <Row>
          <Col span="17" offset="7">
            <FormItem>
              <Checkbox {...getFieldProps('agreement')}>同意
                <a href="#" onClick={(event) => {this.showDeal(event, 'payment');}}>《{AGREEMENT_INFO.payment.title}》</a>
                {
                  this.props.needKBSettle ? (<a href="#" onClick={(event) => {this.showDeal(event, 'settle');}}>《{AGREEMENT_INFO.settle.title}》</a>) : null
                }
              </Checkbox>
            </FormItem>
          </Col>
        </Row>
        <Modal title={AGREEMENT_INFO[type].title}
               visible={dealVisible}
               onCancel={this.closeDeal}
               footer={[]}
               width={750}>
          <iframe src={AGREEMENT_INFO[type].src} width="750" height="400" scrolling="no" style={{border: 'none'}}></iframe>
        </Modal>
      </div>
    );
  },
});

export default Agreement;
