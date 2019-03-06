import {Table, message, Modal} from 'antd';
import ajax from 'Utility/ajax';
import React, {PropTypes} from 'react';
// import RecordImgModal from '../common/RecordImgModal';
// import RecordDescModal from '../common/RecordDescModal';
import {visitWayMap, positionMap, ResultMap} from '../common/RecordSelect';
import {queryPurposeMap} from '../common/queryVisitPurpose';
import RecordPopover from '../common/RecordPopover';
import moment from 'moment';
import { json2params } from '../../../common/urlUtils';

const RecordEditorLeadsTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    type: PropTypes.string,
    brandId: PropTypes.any,
    typeMap: PropTypes.any,
    isPosSale: PropTypes.bool,
  },

  getInitialState() {
    const { type, isPosSale } = this.props;
    this.columns = [{
      title: (<div><p>拜访人</p><p style={{color: '#999'}}>拜访时间</p></div>),
      width: 105,
      dataIndex: 'visitTime',
      render(visitTime, index) {
        return (<div>
            <p>{index.creatorName}</p>
            <p>{moment(new Date(visitTime)).format('YYYY-MM-DD HH:mm')}</p>
          </div>);
      },
    }, {
      title: (<div><p>拜访门店</p><p style={{color: '#999'}}>门店ID</p></div>),
      width: 160,
      dataIndex: '',
      render(t, r) {
        return (<div>
          <div> {r.customerName} </div>
          <div> {r.customerId} </div>
        </div>);
      },
    }, {
      title: (<div>
        <p>归属人</p>
        {!this.props.isPosSale && <p style={{color: '#999'}}>BD／服务商／服务商员工</p>}
      </div>),
      width: 120,
      dataIndex: '',
      render(t, r) {
        return (
            <div> {r.ownerName} </div>
          );
      },
    }, {
      title: (<div><p>拜访对象</p><p style={{color: '#999'}}>电话</p></div>),
      width: 150,
      dataIndex: '',
      render(t, r) {
        return (<div>
          <div> {r.contact ? r.contact.name : ''}{r.contact ? '(' + positionMap[r.contact.position] + ')' : ''}</div>
          <div> {r.contact ? r.contact.tel : ''} </div>
        </div>);
      },
    }, {
      title: (<div><p>拜访目的</p><p style={{color: '#999'}}>详细内容</p></div>),
      width: 150,
      dataIndex: '',
      render: (t, r) => {
        let visitList = '';
        if (r.visitPurposes) {
          (r.visitPurposes).filter((v) => {
            return v !== 'LAYING_MATERIAL' && v !== 'OTHER'; // 过滤掉拜访目的中的物料铺设,其他
          }).map((p, index) => {
            if (index === 0) {
              visitList += (this.state.visitPurposeMap[p] || p);
            } else {
              visitList += ',' + (this.state.visitPurposeMap[p] || p);
            }
          });
        }
        let stuffTypeList = '';
        if (r.stuffType) {
          const array = (r.stuffType).split(',');
          const { typeMap } = this.props;
          array.map((p, index) => {
            if (index === 0) {
              if (p === 'ACTIVITY' && r.activityDesc) {
                stuffTypeList += r.activityDesc;
              } else {
                stuffTypeList += typeMap[p];
              }
            } else {
              if (p === 'ACTIVITY' && r.activityDesc) {
                stuffTypeList += ',' + r.activityDesc;
              } else {
                stuffTypeList += ',' + typeMap[p];
              }
            }
          });
        }
        return (<div>
          <div> {visitList}</div>
          { r.visitPurposeResult && <div>签约：{ResultMap[r.visitPurposeResult] }</div> }
          { r.stuffType && <div>物料铺设：{ stuffTypeList }</div> }
          { r.visitPurposeDesc && <div>其他：{r.visitPurposeDesc }</div> }
        </div>);
      },
    }, {
      title: (<div><p>拜访方式</p><p style={{color: '#999'}}>签到</p></div>),
      width: 100,
      dataIndex: 'visitWay',
      render(visitWay, index) {
        let way;
        if (visitWayMap[visitWay] === '上门') {
          way = index.signStatus === '1' ? <RecordPopover data={index} type="SHOP"/> : (<p style={{color: '#999'}} >未签到</p>);
        }
        return (
          <div>
            <div>{visitWayMap[visitWay]}</div>
            {way}
          </div>
          );
      },
    // }, {
    //   title: '拜访描述',
    //   width: 160,
    //   dataIndex: 'visitDesc',
    //   render(visitDesc) {
    //     return visitDesc.length > 100 ? <RecordDescModal data={visitDesc} /> : visitDesc;
    //   },
    // }, {
    //   title: '拜访照片',
    //   width: 80,
    //   dataIndex: 'visitPics',
    //   render(visitPics) {
    //     return visitPics.length > 0 ? <RecordImgModal data={visitPics} /> : '无';
    //   },
    }, {
      title: '操作',
      width: 80,
      dataIndex: 'visitDetail',
      render(t, r) {
        return <a href={`#/record/recordDetail/${r.id}/${isPosSale}/${type}`}>查看</a>;
      },
    },
  ];
    return {
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: this.showTotal,
        pageSize: 10,
        current: 1,
      },
      visitPurposeMap: {},
      loading: false,
      visible: false,
    };
  },
  componentDidMount() {
    queryPurposeMap().then(visitPurposeMap => this.setState({ visitPurposeMap }));
  },
  componentDidUpdate(prevProps) {
    const isLeadsType = this.props.params.customerType === 'PRIVATE_LEADS' || this.props.params.customerType === 'POS_LEADS';
    if (this.props.params !== prevProps.params && isLeadsType && this.props.params.downloadType !== 'download') {
      this.refresh();
    } else if (this.props.params && this.props.params.downloadType === 'download') {
      delete this.props.params.downloadType;
      // this.onDownload();
      this.onPrevDownload();
    }
  },
  onTableChange(pagination) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      current: pagination.current,
    };
    this.fetch(params);
  },
  onOk(batchId) {
    const url = '/sale/visitrecord/AsynExportVisitRecord.json?_input_charset=utf-8&batchId=' + batchId;
    window.open(url).document.title = '数据处理中...';
  },
  onPrevDownload() {
    message.warn('正在生成数据，请稍后5-30分钟在弹框上下载', 3);
    const params = {
      ...this.state.pagination,
      ...this.props.params,
    };
    if (params.current) {
      params.pageNum = params.current;
    }
    if (!params.ownerId) {
      params.ownerId = '';
    }
    if (!params.customerId) {
      params.customerId = '';
    }
    if (!params.visitPurposes) {
      params.visitPurposes = '';
    }
    if (!params.visitWay) {
      params.visitWay = '';
    }
    if (!params.visitPersonId) {
      params.visitPersonId = '';
    }
    delete params.showTotal;
    const visitPurposes = params.visitPurposes;
    delete params.visitPurposes; // 拜访目的需要使用多个 query 字段传给后端，而不是 , 分割的数组
    ajax({
      url: '/sale/visitrecord/exportVisitRecord.json?' + json2params(params),
      data: { visitPurposes },
      method: 'get',
      success: (result) => {
        if (result.status === 'succeed' && result.batchId) {
          this.fetchAsyncData(result.batchId);
        } else {
          message.warn('数据生成失败，请重试', 3);
        }
      },
      error: (result) => {
        if (result.resultMsg) {
          message.error(result.resultMsg, 3);
        }
      },
    });
  },
  fetchAsyncData(batchId) {
    ajax({
      url: '/sale/visitrecord/queryBatchOrder.json',
      method: 'get',
      data: {batchId: batchId},
      success: (res) => {
        if (res.resultCode === 'AE0311717081') {
          window.setTimeout(() => {
            this.fetchAsyncData(batchId);
          }, 4000);
        } else if (res.status === 'SUCCESS') {
          Modal.confirm({
            title: '数据处理完毕，请下载报表',
            okText: '下载报表',
            cancelText: '取消',
            onCancel: this.onCancel,
            onOk: this.onOk.bind(this, batchId),
          });
        } else {
          message.error('数据生成失败，请重试', 3);
        }
      },
      error: (result) => {
        if (result.resultMsg) {
          message.error(result.resultMsg, 3);
        }
      },
    });
  },
  refresh(update) {
    const {pageSize, current} = this.state.pagination;
    this.onTableChange({
      current: update ? current : 1,
      pageSize,
    });
  },
  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    if (params.current) {
      params.pageNum = params.current;
    }
    this.setState({loading: true});
    ajax({
      url: `${window.APP.kbservcenterUrl}/sale/visitrecord/queryVisitRecord.json`,
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = {...this.state.pagination};
        pagination.total = result.totalItems;
        this.power = result.power;
        this.setState({
          loading: false,
          data: result.data,
          pagination,
        });
      },
      error: (result) => {
        if (result.resultMsg) {
          message.error(result.resultMsg, 3);
        }
        this.setState({loading: false});
      },
    });
  },
  showTotal(total) {
    return `共 ${total} 条`;
  },
  render() {
    const {data, pagination, loading} = this.state;
    return (
      <div>
        <div>
          <Table columns={this.columns}
                 rowSelection={this.rowSelection}
                 rowKey={r => r.id}
                 dataSource={data}
                 pagination={pagination}
                 loading={loading}
                 onChange={this.onTableChange}/>
        </div>
      </div>
    );
  },
});

export default RecordEditorLeadsTable;
