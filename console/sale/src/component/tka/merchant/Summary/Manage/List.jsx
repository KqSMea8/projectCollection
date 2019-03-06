import React from 'react';
import { Radio, Table, Modal, Input, Form, message, Popover, Icon } from 'antd';
import { Page } from '@alipay/kb-framework-components/lib/layout';
import fetch from '@alipay/kb-fetch';
// import ajax from '../../../../../../../common/utility/ajax';

const FormItem = Form.Item;

class DataSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      confirm: 'ConfirmWait', // 待审批
      visible: false,
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        current: 1,
        total: 0,
      },
      selectRow: null, // 当前操作的行
    };
  }
  componentDidMount() {
    this.merchantTable();
  }
  onTableChange(pagination) {
    const { current, pageSize } = pagination;
    this.merchantTable({
      pageNum: current,
      pageSize,
    });
  }
  merchantTable = (params = {}) => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current: params.pageNum || this.state.pagination.current,
        pageSize: params.pageSize || this.state.pagination.pageSize,
      },
    });
    fetch({
      url: 'kbservcenter.dataSummaryService.findPageForApprove',
      param: {
        approved: this.state.confirm === 'ConfirmOk',
        pageNum: 1,
        pageSize: 10,
        ...params,
      },
    })
    .then((resp) => {
      this.setState({
        data: resp.data.contents,
        pagination: {
          ...this.state.pagination,
          total: resp.data.totalItems,
        },
      });
    })
    .catch(e => {
      console.log(e, '分页数据错误');
    });
  }
  handleConfirmChange(e) {
    const confirm = e.target.value;
    this.setState({ confirm }, () => {
      this.merchantTable({
        pageNum: 1,
      });
    });
  }
  download(row, e) {
    e.preventDefault();
    const { fileOriginName, url } = row;
    const resourceId = encodeURIComponent(url);
    const name = encodeURIComponent(fileOriginName);
    const a = document.createElement('a');
    a.target = '_blank';
    a.href = `${window.APP.kbservcenterUrl}/sale/asset/saleFileDownload.resource?resourceId=${resourceId}&name=${name}`;
    a.click();
  }
  handleOk() {
    this.props.form.validateFields((errors) => {
      if (!!errors) {
        return;
      }
      const { selectRow, title } = this.state;
      if (!selectRow) {
        return;
      }
      const passed = title === '审批通过';
      const remark = this.props.form.getFieldValue('remark') || '';
      fetch({
        url: 'kbservcenter.dataSummaryService.approveDataSummary', // required
        param: {
          passed,
          remark,
          id: selectRow.id,
        },
      })
      .then((resp) => {
        if (resp.status && resp.status === 'succeed') {
          message.success('审批提交成功');
          this.merchantTable({
            approved: true,
            pageNum: 1,
          });
          this.setState({
            selectRow: null,
            visible: false,
            confirm: 'ConfirmOk',
          });
          this.props.form.setFieldsValue({ remark: '' });
        } else {
          message.fail('审批提交失败');
        }
      })
      .catch(e => {
        console.log(e, '审批接口错误');
      });
    });
  }
  handleCancel() {
    this.setState({
      visible: false,
      selectRow: null,
    });
    this.props.form.setFieldsValue({ remark: '' });
  }
  showThroughModal(row, e) {
    e.preventDefault();
    this.setState({
      selectRow: row,
      visible: true,
      title: '审批通过',
    });
  }
  showNoThroughModal(row, e) {
    e.preventDefault();
    this.setState({
      selectRow: row,
      visible: true,
      title: '审批不通过',
    });
  }
  render() {
    const {
      data, confirm, pagination, visible, title
    } = this.state;
    const { getFieldProps, getFieldError } = this.props.form;
    window.f = this.props.form;
    const columns = [{
      title: (
        <div>
          <p>商户信息</p>
          <p style={{ color: '#ccc' }}>
            <span>商户名</span>
            <span style={{ margin: '0 4px' }}>|</span>
            <span> PID</span>
            <span style={{ margin: '0 4px' }}>|</span>
            <span>品牌</span>
          </p>
        </div>
      ),
      dataIndex: 'merchantInfo',
      key: 'merchantInfo',
      width: 100,
      render: (text, r) => (
        <div>
          <p>{r.partnerName}</p>
          <p style={{ color: '#ccc' }}>{r.partnerId}</p>
          <p style={{ color: '#ccc' }}>{r.brandName}</p>
        </div>
      )
    }, {
      title: '文件名',
      dataIndex: 'FileName',
      key: 'FileName',
      width: 100,
      render: (text, r) => <span>{r.fileOriginName}</span>
    }, {
      title: '上传人',
      dataIndex: 'OperationPerson',
      key: 'OperationPerson',
      width: 60,
      render: (text, r) => <span>{r.creatorRealName || ''}{r.creatorNickName ? `(${r.creatorNickName})` : ''}</span>
    }, {
      title: '上传时间',
      dataIndex: 'OperationTime',
      key: 'OperationTime',
      width: 80,
      render: (text, r) => <span>{r.createTime}</span>
    }, {
      title: '操作',
      key: 'operation',
      width: 90,
      render: (text, r) => {
        const ConfirmWait = (
          <span>
            <a href onClick={this.download.bind(this, r)}> 下载 </a>
            <span style={{ margin: '0 8px', color: '#ccc' }}>|</span>
            <a href onClick={this.showThroughModal.bind(this, r)} > 通过 </a>
            <span style={{ margin: '0 8px', color: '#ccc' }}>|</span>
            <a href onClick={this.showNoThroughModal.bind(this, r)} > 不通过 </a>
          </span>
        );
        const ConfirmOk = (
          <span>
            <a href onClick={this.download.bind(this, r)}> 下载 </a>
          </span>
        );
        const btns = (
          confirm === 'ConfirmOk' ? ConfirmOk : ConfirmWait
        );
        return btns;
      }
    }];
    if (confirm === 'ConfirmOk') {
      columns.splice(columns.length - 1, 0, ...[{
        title: '审批时间',
        dataIndex: 'ApproveTime',
        key: 'ApproveTime',
        width: 80,
        render: (text, r) => <span>{r.approveTime || ''}</span>
      }, {
        title: '审批状态',
        dataIndex: 'ApproverState',
        key: 'ApproverState',
        width: 50,
        render: (text, r) => {
          let pass;
          if ((r.status === '已通过' || r.status === '不通过') && r.remark) {
            const tit = <span>审批意见</span>;
            const content = (
              <p style={{ maxWidth: 300 }}>{r.remark}</p>
            );
            pass = (
              <div>
                <span>{r.status}</span>
                <Popover placement="topLeft" title={tit} content={content}>
                  <Icon type="question-circle-o" style={{paddingLeft: 4}}/>
                </Popover>
              </div>
            );
          } else {
            pass = <span>{r.status}</span>;
          }
          return pass;
        }
      }]);
    }
    return (
      <Page title="待审批的数据小结">
        <div style={{ padding: 20 }}>
          <Radio.Group value={confirm} onChange={this.handleConfirmChange.bind(this)}>
            <Radio.Button value="ConfirmWait">待审批</Radio.Button>
            <Radio.Button value="ConfirmOk">已审批</Radio.Button>
          </Radio.Group>
          <Table
            style={{ marginTop: 20 }}
            columns={columns}
            dataSource={data}
            pagination={pagination}
            onChange={this.onTableChange.bind(this)}
          />
        </div>
        <Modal
          title={title}
          visible={visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <Form>
            <FormItem help={getFieldError('remark')}>
              <Input
                {...getFieldProps('remark', {
                  rules: [{ max: 50, message: '意见最多50个字符' }]
                })}
                type="textarea"
                placeholder="选填，请输入意见，最多50个字符"
                rows={4}
              />
            </FormItem>
          </Form>
        </Modal>
      </Page>
    );
  }
}

export default Form.create()(DataSection);
