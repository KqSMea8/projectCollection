import React, { PropTypes } from 'react';
import { Modal, Form, Button, message } from 'antd';
import { approve } from '../common/api';
import CountInput from './CountInput';

class AuditControlButtons extends React.Component {

  static propTypes = {
    approveFinish: PropTypes.func,
    recordId: PropTypes.string,
  };

  state = {
    validLoading: false,
    modalVisible: false,
    modalLoading: false,
    invalidReason: '',
  };

  onClickValid() {
    this.setState({ validLoading: true });
    approve(this.props.recordId, true).then(() => {
      this.setState({ validLoading: false });
      if (this.props.approveFinish) this.props.approveFinish();
    }).catch(errMsg => {
      this.setState({ validLoading: false });
      Modal.error({ title: '审阅出错', content: errMsg || '' });
    });
  }

  onClickInvalid() {
    this.setState({ modalVisible: true });
  }

  onModalOk() {
    if (!this.state.invalidReason) {
      message.error('请输入判断为无效拜访的理由');
      return;
    }
    this.setState({ modalLoading: true });
    approve(this.props.recordId, false, this.state.invalidReason).then(() => {
      this.setState({
        modalLoading: false,
        invalidReason: '',
        modalVisible: false,
      });
      if (this.props.approveFinish) this.props.approveFinish();
    }).catch(errMsg => {
      this.setState({ modalLoading: false });
      Modal.error({ title: '审阅出错', content: errMsg || '' });
    });
  }

  render() {
    const { modalVisible, modalLoading, validLoading } = this.state;

    return (<div style={{ display: 'inline-block' }}>
      <Button type="primary" onClick={this.onClickValid.bind(this)} loading={validLoading}>这是有效拜访</Button>
      <Button onClick={this.onClickInvalid.bind(this)} style={{ marginLeft: 12 }}>这是无效拜访</Button>
      <Modal
        title="审阅拜访记录"
        visible={modalVisible}
        loading={modalLoading}
        onOk={this.onModalOk.bind(this)}
        onCancel={() => this.setState({ modalVisible: false })}
      >
        <Form>
          <Form.Item label="无效理由：" require labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            <CountInput placeholder="请输入判断为无效拜访的理由" type="textarea" rows={4}
              onChange={e => this.setState({ invalidReason: e.target.value })} />
          </Form.Item>
        </Form>
      </Modal>
    </div>);
  }
}

export default AuditControlButtons;
