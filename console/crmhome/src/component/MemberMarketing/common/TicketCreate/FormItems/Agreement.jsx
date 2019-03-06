import React, {PropTypes} from 'react';
import { Form, Checkbox, Modal, Row, Col } from 'antd';

const FormItem = Form.Item;

/*
  表单字段 － 同意协议
*/

const Agreement = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },

  getInitialState() {
    return {
      dealVisible: false,
    };
  },

  showDeal(event) {
    event.preventDefault();

    this.setState({
      dealVisible: true,
    });
  },

  closeDeal() {
    this.setState({
      dealVisible: false,
    });
  },

  render() {
    const { getFieldProps } = this.props.form;

    return (
      <div>
        <Row>
          <Col span="17" offset="7">
            <FormItem>
              <Checkbox {...getFieldProps('agreement')}>同意 <a href="#" onClick={this.showDeal}>《委托核销服务协议》</a></Checkbox>
            </FormItem>
          </Col>
        </Row>
        <Modal title="委托核销服务协议"
               visible={this.state.dealVisible}
               onCancel={this.closeDeal}
               footer={[]}
               width={700}>
          <iframe src="/promo/common/agreement.htm" width="700" height="400" scrolling="no" style={{border: 'none'}}></iframe>
        </Modal>
      </div>
    );
  },
});

export default Agreement;
