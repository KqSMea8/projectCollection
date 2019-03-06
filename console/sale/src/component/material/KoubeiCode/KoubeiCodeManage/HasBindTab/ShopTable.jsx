import React, { Component, PropTypes } from 'react';
import { Table } from 'antd';
import { BIND_BIZ_TYPE } from '../../common/enums';
import { FILTER_BY } from './enums';
import ShopCodeListTable from './ShopCodeListTable';

const shopCol = {
  title: '门店信息',
  key: 'shopInfo',
  render: (text, record) => (
    <span>
      {record.bindBizType === BIND_BIZ_TYPE.MALL &&
      <span style={{color: '#F90'}}>[商圈]</span>
      }
      {record.bindTargetName}
      <br />
      {record.bindTargetId}
    </span>
  ),
};

class ShopTable extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    pagination: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  columns = [{
    title: '商户信息',
    key: 'merchantInfo',
    render: (text, record) => <span>{record.merchantName}<br />{record.merchantId}</span>,
  }, {
    title: '绑定数量',
    key: 'bindCount',
    dataIndex: 'bindCount',
    render: (bindCount, record) => {
      const filterBy = this.props.filterBy;
      if (filterBy === FILTER_BY.MERCHANT) {
        return (
          <span>{bindCount.RETAIL_CODE}个</span>
        );
      }
      return (
        <span>
          绑定{record.bindBizType === BIND_BIZ_TYPE.MALL ? '区域' : '编号'}：{bindCount.TABLE_PASTER}个
          <br />
          绑定{record.bindBizType === BIND_BIZ_TYPE.MALL ? '商圈' : '门店'}：{bindCount.DOOR_PASTER}个
          <br />
          绑定充电宝：{bindCount.CHARGER_QRCODE}个
        </span>
      );
    },
  }, {
    title: '操作',
    key: 'actions',
    dataIndex: 'bindTargetId',
    render: (bindTargetId, record) => {
      let bindScene = '';
      try {
        bindScene = JSON.parse(record.extInfo).kbCodeTemplateInfo.bindScene;
      } catch (err) {
        // noop
      }
      return <a onClick={() => this.props.onDownloadCodeUrl(bindTargetId, bindScene)}>打包下载码的URL</a>;
    },
  }];

  renderExpandedRow = (record) => {
    const { bindTargetId, bindTargetName } = record;
    const props = { bindTargetId, bindTargetName };
    return <ShopCodeListTable {...props} />;
  }

  render() {
    const { loading, pagination, data, onChange, filterBy, locale } = this.props;
    let columns = this.columns;
    if (filterBy === FILTER_BY.SHOP) {
      columns = [
        shopCol,
        ...this.columns,
      ];
    }
    return (
      <Table
        dataSource={data}
        columns={columns}
        rowKey={record => record.bindTargetId}
        loading={loading}
        pagination={pagination}
        locale={locale}
        expandedRowRender={this.renderExpandedRow}
        onChange={onChange}
      />
    );
  }
}

export default ShopTable;
