import React, { PropTypes } from 'react';
import VisitObjectEditModal from './VisitObjectEditModal';
import { modifyContacts } from '../common/api';

class VisitObjectEditLink extends React.Component {

  static propTypes = {
    merchantId: PropTypes.string,
    data: PropTypes.any, // {contactId, name, tel, position, otherPosition} 要编辑数据
    onEditSuc: PropTypes.func,
  };

  state = {
    modalVisible: false,
    loading: false,
  };

  onClick() {
    this.setState({ modalVisible: true });
  }

  onModalOk(values) {
    this.setState({ loading: true });
    modifyContacts({
      customerId: this.props.merchantId,
      id: this.props.data.contactId,
      ...values
    }).then(() => {
      this.setState({
        modalVisible: false,
        loading: false,
      });
      if (this.props.onEditSuc) this.props.onEditSuc();
    }).catch(() => {
      this.setState({ loading: false });
    });
  }

  render() {
    const { style, data } = this.props;
    const { modalVisible, loading } = this.state;

    return (<span style={{ display: 'inline-block', ...style }} onClick={this.onClick.bind(this)}>
      编辑
      <VisitObjectEditModal
        initData={data}
        visible={modalVisible}
        confirmLoading={loading}
        onOk={this.onModalOk.bind(this)}
        onCancel={() => this.setState({ modalVisible: false })}
      />
    </span>);
  }
}

export default VisitObjectEditLink;
