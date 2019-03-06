import React from 'react';
import { Alert, Table, message } from 'antd';
import ajax from 'Utility/ajax';
import { format, formatTime } from '../../../common/dateUtils';
import permission from '@alipay/kb-framework/framework/permission';
import QrcodeApplyButton from './QrcodeApplyButton';
import AssignSupplierModal from './AssignSupplierModal';
import { getData as getFengdieData } from 'Utility/fengdie';
import { keyMirror } from '../../../common/TypeUtils';

const pageSize = 10;
// 批次处理状态
const statusMapping = {
  'INIT': '正在处理中…',
  'PROCESS': '正在处理中…',
  'COMPLETED': '已生成',
  'FAILED': '生成失败',
};
// 文件处理状态
const FileStatus = keyMirror({
  INIT: null,
  PROCESS: null,
  COMPLETED: null,
  CTEATE_FILE: null,
  WAIT_ASSIGN: null,
  WAIT_DOWNLOAD: null,
  PART_DOWNLOAD: null,
  DOWNLOAD: null
});
const FileStatusText = {
  [FileStatus.INIT]: '初始化',
  [FileStatus.PROCESS]: '处理中',
  [FileStatus.COMPLETED]: '待生成TXT文件',
  [FileStatus.CTEATE_FILE]: '文件生成处理中',
  [FileStatus.WAIT_ASSIGN]: '待分配供应商',
  [FileStatus.WAIT_DOWNLOAD]: '待供应商下载',
  [FileStatus.PART_DOWNLOAD]: '部分下载',
  [FileStatus.DOWNLOAD]: '已全部下载'
};
const qrcodeTypesArray = window.APP.qrcodeTypes || [];
const qrcodeTypes = qrcodeTypesArray.reduce((accum, curr) => ({...accum, [curr.qrcodeType]: curr}), {});

const pollingTimers = {};
let pollingRequestCounter = 0;
const pollingRequestLimit = 11; // 限制并发请求数量上限，避免网速慢时轮询请求数量过多
const pollingInterval = 1000;

const QrcodeGenerate = React.createClass({

  getInitialState() {
    const columns = [
      {
        title: '申请ID',
        dataIndex: 'id',
        width: 60,
      },
      {
        title: '申请时间',
        dataIndex: 'applyTime',
        width: 140,
      },
      {
        title: '申请人',
        dataIndex: 'applicant',
        width: 120,
      },
      {
        title: '二维码类型',
        dataIndex: 'qrcodeType',
        width: 120,
      },
      {
        title: '物料申请数量',
        dataIndex: 'quantity',
        width: 120,
      },
      {
        title: '批次处理状态',
        dataIndex: '',
        width: 120,
        render: (text, record) => {
          const status = this.state.statuses[record.id];
          const readableStatus = statusMapping[status] || status;
          return readableStatus;
        },
      },
      {
        title: '文件处理状态',
        dataIndex: 'isAsync',
        width: 120,
        render: text => {
          if (!text) {
            return '';
          }
          return FileStatusText[text];
        }
      },
      {
        title: '供应商',
        dataIndex: 'targetName',
        width: 150,
        render: (name, record) => {
          // 接口暂未返回 targetName字段
          const suppliers = this.state.assignSupplierModal.suppliers;
          const s = suppliers.find(supplier => supplier.sid === record.targetId);
          return s && s.name;
        }
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 300,
      },
      {
        title: '操作',
        dataIndex: '',
        width: 120,
        render: (text, record) => {
          const status = this.state.statuses[record.id];
          const fileUrl = this.state.fileUrls[record.id];
          const stuffType = qrcodeTypes[record.stuffAttrId];
          const showDownloadBtn = status === 'COMPLETED'
            && !/^BATCH/.test(record.stuffAttrId)
            && fileUrl;
          const showAssignBtn = stuffType && stuffType.permissionList.every(p => permission(p.permission)) // 权限码校验
            && record.status === 'COMPLETED' // 已生成
            && record.targetId === '' // 未分配
            && /^BATCH/.test(record.stuffAttrId) // 指定码类型
            && record.isAsync === FileStatus.WAIT_ASSIGN; // 文件状态
          return (
            <div>
              {showAssignBtn && <a onClick={this.onAssignSupplier.bind(this, record.id)}>分配供应商</a>}
              {showAssignBtn && showDownloadBtn && <span> | </span>}
              {showDownloadBtn && <a href={fileUrl}>下载</a>}
            </div>
          );
        },
      },
    ];
    return {
      current: 1, // 当前页
      columns,
      data: [],
      loading: true,
      total: 0,
      statuses: {},  // 不直接使用 record.status, 而用 this.state.statuses[record.id] 来获取最新状态
      fileUrls: {},
      assignSupplierModal: {
        id: NaN,
        suppliers: [],
        visible: false,
      }
    };
  },

  componentWillMount() {
    this.fetch(1);
  },

  componentDidMount() {
    this.fetchSuppliers();
  },

  onPageChange(current) {
    this.fetch(current);
  },

  onAssignSupplier(id) {
    this.setState({
      assignSupplierModal: {
        ...this.state.assignSupplierModal,
        id,
        visible: true,
      }
    });
  },

  onAssignSupplierOk() {
    // page reload
    this.fetch(this.state.current);
    this.closeAssignSupplierModal();
  },


  setStatusAtId({ id, status }) {
    const { statuses } = this.state;
    statuses[id] = status;
    this.setState({ statuses });
  },

  setFileUrlAtId({ id, fileUrl }) {
    const { fileUrls } = this.state;
    fileUrls[id] = fileUrl;
    this.setState({ fileUrls });
  },

  closeAssignSupplierModal() {
    this.setState({
      assignSupplierModal: {
        ...this.state.assignSupplierModal,
        visible: false,
      }
    });
  },

  fetchSuppliers() {
    getFengdieData('material-supplier/config/list-h5data')
      .then( suppliers => {
        this.setState({
          assignSupplierModal: {
            ...this.state.assignSupplierModal,
            suppliers,
          }
        });
      });
  },

  fetch(current) {
    this.stopPolling();
    this.setState({
      loading: true,
    });
    ajax({
      url: '/home/proxy.json',
      method: 'get',
      data: {
        mappingValue: 'kbasset.queryQrCode',
        pageNum: current,
        pageSize,
      },
    }).then((result) => {
      this.setState({
        loading: false,
      });
      if (result && result.status === 'succeed') {
        this.setState({
          current,
          data: this.transform(result.data.data),
          total: result.data.totalSize,
        });
      } else {
        throw new Error({ resultMsg: '查询数据错误' });
      }
    }).catch((reason) => {
      this.setState({
        loading: false,
      });
      message.error(reason.resultMsg || '未知错误');
    });
  },

  transform(data) {
    return data.map(record => {
      const d = new Date(record.gmtCreate);
      record.applyTime = format(d) + ' ' + formatTime(d);
      const t = qrcodeTypes[record.stuffAttrId] || {};
      record.qrcodeType = t.readableName || record.stuffAttrId;
      this.setStatusAtId({
        id: record.id,
        status: record.status,
      });
      this.setFileUrlAtId({
        id: record.id,
        fileUrl: record.fileUrl,
      });
      this.startPolling(record.id);
      return record;
    });
  },

  startPolling(id) {
    if (this.state.statuses[id] === 'COMPLETED') {
      return;
    }
    if (!pollingTimers[id]) {
      pollingTimers[id] = setInterval(() => {
        if (pollingRequestCounter > pollingRequestLimit) {
          return;
        }
        pollingRequestCounter++;
        ajax({
          url: '/home/proxy.json',
          data: {
            mappingValue: 'kbasset.queryQrCode',
            id,
          },
        }).then((result) => {
          pollingRequestCounter--;
          if (result.status === 'succeed' &&
              result.data &&
              result.data.data &&
              result.data.data[0] &&
              result.data.data[0].status) {
            const [ record ] = result.data.data;
            const { status } = record;
            this.setStatusAtId({ id, status });
            if (status === 'COMPLETED' || status === 'FAILED') {
              clearInterval(pollingTimers[id]);
              pollingTimers[id] = null;
            }
            if (status === 'COMPLETED') {
              const { fileUrl } = record;
              this.setFileUrlAtId({ id, fileUrl });
            }
          }
        }).catch(() => {
          pollingRequestCounter--;
        });
      }, pollingInterval);
    }
  },

  stopPolling() {
    Object.keys(pollingTimers).forEach((elem, id) => {
      clearInterval(pollingTimers[id]);
      pollingTimers[id] = null;
    });
  },

  render() {
    const { columns, data, loading, total, assignSupplierModal } = this.state;
    return (<div>
      <div className="app-detail-header">二维码生成记录</div>
      <div className="app-detail-content-padding">
        <Alert message="批量生成二维码需要一些时间，请耐心等待。" type="warning" showIcon />
        <Table columns={columns}
          dataSource={data}
          pagination={{ total, onChange: this.onPageChange }}
          rowKey={(record, index) => index}
          loading={loading} />
      </div>
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <QrcodeApplyButton types={qrcodeTypes} />
      </div>
      <AssignSupplierModal
        id={assignSupplierModal.id}
        visible={assignSupplierModal.visible}
        suppliers={assignSupplierModal.suppliers}
        closeModal={this.closeAssignSupplierModal}
        onAssignOk={this.onAssignSupplierOk}
      />
    </div>);
  },
});

export default QrcodeGenerate;
