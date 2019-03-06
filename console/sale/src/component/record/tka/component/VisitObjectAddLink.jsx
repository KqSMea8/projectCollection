import React, { PropTypes } from 'react';
import { message } from 'antd';
import VisitObjectEditModal from './VisitObjectEditModal';
import { addContacts } from '../common/api';

class VisitObjectAddLink extends React.Component {

  static propTypes = {
    merchantId: PropTypes.string,
    onAddSuc: PropTypes.func,
  };

  state = {
    modalVisible: false,
    loading: false,
  };

  onClick() {
    if (!this.props.merchantId) return message.info('请先选择商户');
    this.setState({ modalVisible: true });
  }

  onModalOk(values) {
    this.setState({ loading: true });
    addContacts({
      customerId: this.props.merchantId,
      ...values
    }).then(() => {
      this.setState({
        modalVisible: false,
        loading: false,
      });
      message.success('添加成功');
      if (this.props.onAddSuc) this.props.onAddSuc();
    }).catch(() => {
      this.setState({ loading: false });
    });
  }

  render() {
    const { style, merchantId } = this.props;
    const { modalVisible, loading } = this.state;

    return (<span style={{ display: 'inline-block', ...style }}>
      <a disabled={!merchantId} onClick={this.onClick.bind(this)}>添加对象</a>
      <VisitObjectEditModal
        visible={modalVisible}
        confirmLoading={loading}
        onOk={this.onModalOk.bind(this)}
        onCancel={() => this.setState({ modalVisible: false })}
      />
    </span>);
  }
}

export default VisitObjectAddLink;
