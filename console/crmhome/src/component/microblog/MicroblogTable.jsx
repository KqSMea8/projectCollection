import React, {PropTypes} from 'react';
import { Table, message, Modal, Button, Spin } from 'antd';
import ajax from '../../common/ajax';
import moment from 'moment';

class MicroblogTable extends React.Component {
  static propTypes = {
    params: PropTypes.object,
  };
  state = {
    data: [],
    detail: {},
    loading: false,
    spinLoading: false,
    visible: false,
    pagination: {
      showQuickJumper: true,
      showSizeChanger: true,
      pageSize: 10,
      showTotal: (total) => {
        return `共${total}个记录`;
      },
      current: 1,
    },
  };
  componentDidMount() {
    this.refresh();
  }
  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.refresh();
    }
  }
  onTableChange = (pagination) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      page: pagination.current,
      itemsPerPage: pagination.pageSize,
    };
    this.fetch(params);
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  refresh = () => {
    const { pageSize } = this.state.pagination;
    this.fetch({
      page: 1,
      itemsPerPage: pageSize,
    });
  }
  fetch = (pageParams = {}) => {
    const params = {
      itemType: 'VOUCHER',
      ...pageParams,
      ...this.props.params,
    };
    this.setState({loading: true});
    ajax({
      url: '/merchant/weiboPromoteQueryList.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed' && result.result && result.result.merchantList) {
          const pagination = {...this.state.pagination};
          pagination.total = result.pageInfo.items;
          pagination.pageSize = result.pageInfo.itemsPerPage;
          pagination.current = result.pageInfo.page;
          this.setState({
            loading: false,
            data: result.result.merchantList,
            pagination,
          });
        } else {
          this.setState({
            loading: false,
            data: [],
          });
          if (result.resultMsg) {
            message.error(result.resultMsg);
          }
        }
      },
      error: (err) => {
        this.setState({
          loading: false,
          data: [],
        });
        message.error(err.resultMsg || '系统错误');
      },
    });
  }

  clickGoTO = (itemId) => (e) => {
    e.preventDefault();
    this.setState({ spinLoading: true });
    ajax({
      url: '/merchant/getWeiboPromote.json?itemType=VOUCHER',
      method: 'get',
      data: {itemId},
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed' && result.result) {
          this.setState({ spinLoading: false });
          window.open(result.result.replace(/&amp;/g, '&'));
        } else {
          this.setState({ spinLoading: false });
          message.error(result.resultMsg || '跳转失败,请稍候再试');
        }
      },
      error: (err) => {
        this.setState({ spinLoading: false });
        message.error(err && err.resultMsg || '系统繁忙');
      },
    });
  }

  lookCitys = (citys) =>{
    Modal.info({
      title: '查看活动城市',
      content: citys,
      onOk() {},
    });
  }

  columns = () => {
    return [
      {
        title: '券ID',
        dataIndex: 'itemId',
        width: 140,
      }, {
        title: '券名称',
        dataIndex: 'itemName',
        width: 140,
      }, {
        title: '优惠信息',
        dataIndex: 'discountInfo',
        width: 140,
      }, {
        title: '活动城市',
        dataIndex: 'cities',
        width: '17%',
        render: (t) => {
          const citys = t !== '' ? t.split(',') : [];
          return (
            <div>
              {
              citys.length > 3 ?
              <div>
                {
                  citys.map(( item, i) => {
                    if ( i < 3 ) {
                      return <span key={i}>{item}{i !== 2 ? ', ' : ''}</span>;
                    }
                  })
                }
                <br />
                <a onClick={()=>this.lookCitys(t)}>更多</a>
              </div> :
              t
              }
            </div>
          );
        },
      }, {
        title: '活动时间',
        dataIndex: 'startTime',
        width: '28%',
        render: (t, r) => {
          return (<div>
           {(t || r.endTime) && `${t && moment(Number(t)).format('YYYY-MM-DD HH:mm:ss')} ~ ${r.endTime && moment(Number(r.endTime)).format('YYYY-MM-DD HH:mm:ss')}`}
          </div>);
        },
      }, {
        title: '操作',
        dataIndex: '',
        width: 120,
        render: (t, r) => {
          return (
            <div>
              <a href="#" onClick={this.clickGoTO(r.itemId)}>去微博推广</a>
            </div>
          );
        },
      },
    ];
  }
  render() {
    const {loading, spinLoading, data, pagination, detail } = this.state;
    return (
      <div style={{ padding: 20 }}>
        <Spin spinning={spinLoading}>
          <Table columns={this.columns()}
            rowKey={r => r.itemId}
            loading={loading}
            dataSource={data}
            pagination={pagination}
            firstShow={!this.props.params}
            onChange={this.onTableChange}
          />
        </Spin>
        <Modal
          title="查 看"
          width="600"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={[
            <Button type="primary" size="large" onClick={this.handleCancel}>
              知道了
            </Button>,
          ]}
        >
          <div style={{ height: 150 }}>
            <div style={{ width: '50%', float: 'left', paddingRight: 10 }}>
              <table>
                <tbody>
                <tr>
                  <td style={{ width: '30%' }}>活动ID：</td>
                  <td>{detail.itemId}</td>
                </tr>
                <tr>
                  <td style={{ width: '30%' }}>优惠信息：</td>
                  <td>{detail.discountInfo}</td>
                </tr>
                <tr>
                  <td style={{ width: '30%' }}>品牌名称：</td>
                  <td>{detail.brands}</td>
                </tr>
                <tr>
                  <td style={{ width: '30%' }}>券面额：</td>
                  <td>{detail.worthValue}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div style={{ width: '50%', float: 'left', height: '100%', paddingLeft: 10, borderLeft: '1px solid #ddd'}}>
              <table>
                <tbody>
                <tr>
                  <td style={{ width: '30%' }}>券名称：</td>
                  <td>{detail.itemName}</td>
                </tr>
                <tr>
                  <td style={{ width: '30%' }}>适用城市：</td>
                  <td>{detail.cities}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default MicroblogTable;
