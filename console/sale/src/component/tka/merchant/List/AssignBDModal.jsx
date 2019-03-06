import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Form, message} from 'antd';
import fetch from '@alipay/kb-fetch';
import noop from 'lodash/noop';
import KbSalesUserSelect, {UserType} from '@alipay/kb-framework-components/lib/biz/user/KbSalesUserSelect';

const FormItem = Form.Item;

class AssignBDModal extends React.Component {
  static propTypes = {
    onSubmitOk: PropTypes.func
  };
  static defaultProps = {
    onSubmitOk: noop
  };
  state = {
    ...AssignBDModal.initialState
  };
  static initialState = {
    pid: '',
    bdId: '',
    visible: false
  };
  open(pid) {
    this.setState({
      ...AssignBDModal.initialState,
      pid,
      bdId: '',
      value: null,
      visible: true
    });
  }
  close() {
    this.setState({ visible: false, bdId: '', value: null });
  }
  handleSubmit = () => {
    const { pid, bdId } = this.state;
    if (!bdId) {
      message.error('请先选择BD', 3);
      return;
    }
    fetch({
      url: 'kbsales.merchantSpiService.changeMerchantRelation',
      param: {
        pid,
        newPrincipalId: bdId
      }
    })
      .then(() => {
        message.success('提交成功');
        this.props.onSubmitOk();
      }).catch(() => {
        // message.error('提交失败');
      });
  };
  handleCancel = () => {
    this.close();
  };
  handleBDChange = (v) => {
    if (!v || !v.loginName || !v.nickName) {
      return;
    }
    this.setState({
      value: v,
      bdId: v.id
    });
  };
  render() {
    const { visible, value } = this.state;
    return (
      <Modal
        visible={visible}
        title="分配归属BD"
        okText="提交"
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
      >
        <Form>
          <FormItem
            label="新归属BD"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <KbSalesUserSelect
              allowClear
              placeholder="请输入BD真名或花名"
              value={value}
              onChange={this.handleBDChange}
              type={UserType.BD}
              kbsalesUrl={window.APP.kbsalesUrl}/>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default AssignBDModal;
