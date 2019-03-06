import React, { PropTypes } from 'react';
import { Modal, Input, message } from 'antd';
import { addSubCompany } from '../common/api';

class SubCompanyAddLink extends React.Component {

  static propTypes = {
    merchantId: PropTypes.string,
    onAddSuc: PropTypes.func,
  };

  state = {
    modalVisible: false,
    loading: false,
    inputValue: '',
  };

  onClick() {
    if (!this.props.merchantId) return message.info('请先选择商户');
    this.setState({ modalVisible: true });
  }

  onModalOk() {
    const { inputValue } = this.state;
    if (!inputValue || inputValue.length > 50) {
      message.error('请输入分公司的全称(小于50字)');
      return;
    }
    this.setState({ loading: true });
    addSubCompany(this.props.merchantId, inputValue).then(() => {
      this.setState({
        modalVisible: false,
        loading: false,
        inputValue: '',
      });
      message.success('添加成功');
      if (this.props.onAddSuc) this.props.onAddSuc();
    }).catch(() => {
      this.setState({ loading: false });
    });
  }

  onInputChange(e) {
    this.setState({ inputValue: e.target.value });
  }

  render() {
    const { style, merchantId } = this.props;
    const { modalVisible, loading, inputValue } = this.state;

    return (<span style={{ display: 'inline-block', ...style }}>
      <a disabled={!merchantId} onClick={this.onClick.bind(this)}>添加分公司</a>
      <Modal
        title="添加分公司"
        visible={modalVisible}
        confirmLoading={loading}
        onOk={this.onModalOk.bind(this)}
        onCancel={() => this.setState({ modalVisible: false })}
      >
        <Input type="textarea" rows={4} placeholder="请输入分公司的全称，最多50字" value={inputValue}
          onChange={this.onInputChange.bind(this)} />
      </Modal>
    </span>);
  }
}

export default SubCompanyAddLink;
