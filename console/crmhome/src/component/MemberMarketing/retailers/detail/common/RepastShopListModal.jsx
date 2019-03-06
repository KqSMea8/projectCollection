import React, { PropTypes } from 'react';
import { Modal, Table } from 'antd';
import { pick } from 'lodash';

const columns = [{
  title: '门店名称',
  dataIndex: 'name',
  key: 'name',
}];

class RepastShopListModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    shops: PropTypes.array,
    hide: PropTypes.func.isRequired,
    title: PropTypes.string,
  }
  static defaultProps = {
    visible: false,
    shops: [],
    title: '门店列表',
  }
  state = {
    visible: false,
    current: 1,
    pageSize: 10,
    total: this.props.shops.length,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.shops !== this.props.shops) {
      this.setState({
        total: this.props.shops.length,
      });
    }
  }
  pageChange = (current) => {
    this.setState({
      current,
    });
  }
  render() {
    const { loading } = this.state;
    return (<Modal footer={null}
      title={this.props.title}
      visible={this.props.visible}
      onCancel={this.props.hide}>
      <Table className="kb-shop-list-table"
        columns={columns}
        showHeader={false}
        dataSource={this.props.shops}
        size="small"
        pagination={{...pick(this.state, ['current', 'pageSize', 'total']), onChange: this.pageChange}}
        loading={loading} />
    </Modal>);
  }
}

export default RepastShopListModal;
