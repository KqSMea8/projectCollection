import React, {PropTypes} from 'react';
import {Table, Spin, message, Modal} from 'antd';
import ajax from '../../common/ajax';
import moment from 'moment';

class TreasureTable extends React.Component {
  state = {
    data: [],
    loading: false,
    spinLoading: false,
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
    const pager = {...this.state.paginationpagination};
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

  static PropTypes = {
    params: PropTypes.object,
  };

  refresh() {
    const {pageSize} = this.state.pagination;
    this.fetch({
      page: 1,
      itemsPerPage: pageSize,
    });
  }

  fetch = (pageParams = {}) => {
    const params = {
      itemType: 'TRADE_VOUCHER',
      ...this.props.params,
      ...pageParams,
    };
    this.setState({loading: true});
    ajax({
      url: '/merchant/queryItemList.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed' && result.result.merchantList) {
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
        }
        if (result.resultMsg) {
          message.error(result.resultMsg);
        }
      },
      error: (err) => {
        this.setState({
          loading: false,
          data: [],
        });
        if (err) {
          message.error(err.resultMsg || '系统错误');
        }
      },
    });
  }

  clickGoTO = (itemId) => (e) => {
    e.preventDefault();
    this.setState({ spinLoading: true });
    ajax({
      url: '/merchant/getWeiboPromote.json?itemType=TRADE_VOUCHER',
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
        message.error(err.resultMsg || '系统繁忙');
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

  columns = () =>{
    return [{
      title: '宝贝ID',
      dataIndex: 'itemId',
      width: '13%',
    }, {
      title: '宝贝名称',
      dataIndex: 'itemName',
      width: '13%',
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
      title: '宝贝时间',
      dataIndex: 'startTime',
      width: '28%',
      render: (t, r) => {
        return (<div>
          {(t || r.endTime) && `${t && moment(Number(t)).format('YYYY-MM-DD HH:mm:ss')} ~ ${r.endTime && moment(Number(r.endTime)).format('YYYY-MM-DD HH:mm:ss')}`}
         </div>);
      },
    }, {
      title: '原价',
      dataIndex: 'originalPrice',
      width: '8%',
    }, {
      title: '现价',
      dataIndex: 'price',
      width: '8%',
    }, {
      title: '操作',
      render: (t, r) => {
        return (
          <div>
            <a href="#" onClick={this.clickGoTO(r.itemId)}>去微博推广</a>
          </div>
        );
      },
    }];
  }
  render() {
    const {data, loading, spinLoading, pagination} = this.state;
    return (
      <div style={{padding: 20}}>
        <Spin spinning={spinLoading}>
          <Table
            rowKey={r => r.itemId}
            columns={this.columns()}
            dataSource={data}
            loading={loading}
            pagination={pagination}
            onChange={this.onTableChange}
          />
        </Spin>
      </div>
    );
  }

}

export default TreasureTable;
