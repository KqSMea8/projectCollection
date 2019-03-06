import React from 'react';
import QRCode from 'qrcode.react';
import { Table, message, Row, Col, Button, Form, Modal, Input, Tooltip, Icon, Spin, Tag } from 'antd';
import classnames from 'classnames';
import ajax from '../../../common/ajax';
import ActionColumn from './ActionColumn';
import { saveJumpTo, isFromKbServ } from '../../../common/utils';
import ApplySignModal from '../Activity/ApplySignModal';
import * as API from './cateringAPI';
import './CateringList.less';

const stickLabel = <div style={{ textAlign: 'center' }}><Tag color="yellow" style={{ marginRight: 0, cursor: 'default' }}>顶</Tag></div>;
const FormItem = Form.Item;
const node = document.getElementById('J_isFromKbServ');
const isIframe = window.top !== window && node && node.value === 'true';
// const STATUS_ENUM = {
//   '1': '待审核',
//   '2': '处理中',
//   '3': '已退回',
//   '4': '已上架',
//   '-1': '已下架',
// };

function reload() {
  window.setTimeout(() => {
    window.location.reload();
  }, 1500);
}

class CateringList extends React.Component {
  // constructor(props) {
  //   super(props);
  // }
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      showCreateBtn: false, // 是否露出【新建商品】入口
      prodStatus: '',  // 商品状态
      categoryOptions: [],  // 类目的option
      isTableLoading: true,
      data: [],   // 列表数据
      pageStart: 1,
      total: 0,
      pageSize: 10,
      rejectModal: false,
      showSignModal: false,
      showQrcode: false, // 显示二维码
      qrcode: '', // 二维码url
      rate: '0',
      currentSequenceId: null,
      currentItemId: null,
      signed: undefined,    // 是否已签约在线购买协议
      isPostLoading: false, // 是否正在提交
      options: [{ key: '', name: '全部状态' }],
      isFetchingOptions: false,
      modalActionKey: undefined,  // 签约 popup 时记录按的是哪个操作
      pagination: {
        showQuickJumper: true,
        showSizeChanger: false,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
    };
  }

  componentWillMount() {
    this.setState({
      isFetchingOptions: true,
    });
  }

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    }
  }

  onTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      pageStart: pagination.current,
    };
    this.fetch(params);
  };
  columns = [{
    title: '',
    key: 'top',
    width: 26,
    dataIndex: 'top',
    align: 'center',
    render: top => top > 0 && stickLabel,
  }, {
    title: '商品名称',
    key: 'title',
    dataIndex: 'title',
    width: 100,
    render: (t, r) => {
      return (
        <div>
          <div>{t}</div>
          {r.remark && <Tooltip title={r.remark}><div className="catering-remark">{`备注：${r.remark}`}</div></Tooltip>}
        </div>
      );
    },
  }, {
    title: '原价',
    key: 'originPrice',
    width: 80,
    render: (ori) => {
      return (ori.originPrice).toString();
    },
  }, {
    title: '优惠价',
    width: 80,
    key: 'price',
    render: (price) => {
      return (price.price).toString();
    },
  }, {
    title: '剩余库存',
    key: 'inventory',
    dataIndex: 'inventory',
    width: 80,
  }, {
    title: '商品有效期',
    key: 'itemValidity',
    dataIndex: 'itemValidity',
    width: 150,
    render: (t) => {
      if (t && t.indexOf('至') >= 0) {
        const text = t.split('至');
        return <span><span style={{ paddingLeft: 13 }}>{text[0].replace('有效期', '')}</span><br />至{text[1]}</span>;
      }
      return t;
    },
  }, {
    title: '商品状态',
    key: 'statusDesc',
    width: 100,
    dataIndex: 'statusDesc',
    render: (t, r) => {
      const flowStatusDesc = r.flowStatusDesc ? ('-' + r.flowStatusDesc) : '';
      const tip = t + flowStatusDesc;
      if (tip.indexOf('已退回') !== -1) {
        return (
          <span style={{ color: '#FF6600' }}>
            {tip}
            {r.rejectReason && (
              <Tooltip placement="top" title={r.rejectReason}>
                <Icon type="exclamation-circle" style={{ color: '#efce93', marginLeft: '5px' }} />
              </Tooltip>
            )}
          </span>
        );
      }
      if (r.status.toString() === '1') {
        return <span style={{ color: '#FF6600' }}>{tip}</span>;
      }
      if (r.status.toString() === '5' || r.status.toString() === '6') {
        return (
          <span style={{ color: '#FF6600' }}>
            {r.status.toString() === '6' ? tip : t}
            {r.rejectReason && (
              <Tooltip placement="top" title={r.rejectReason}>
                <Icon type="exclamation-circle" style={{ color: '#efce93', marginLeft: '5px' }} />
              </Tooltip>
            )}
          </span>
        );
      }
      return t + flowStatusDesc;
    },
  },/* {
    title: '预览商品',
    key: 'detailUrl',
    dataIndex: 'detailUrl',
    width: 80,
    render: v => {
      return v && <div style={{ textAlign: 'center' }}><Icon type="qrcode" onClick={this.showCodeModal(v)} style={{ color: '#0ae', fontSize: 20 }} /></div>;
    },
  }, */{
    title: '操作',
    key: 'action',
    dataIndex: '',
    width: 110,
    // fixed: 'right',
    render: (v, data) => {
      return <ActionColumn data={data} isIframe={isIframe} onConfirmDelegator={this.actionDelegator} />;
    },
  }];

  actionDelegator = (key, data) => () => {
    if (!data.itemId) {
      message.error('搬家商品不支持置顶功能');
      return;
    }
    if (key === '3') {
      // 置顶
      this.setState({
        isPostLoading: true,
      });
      API.stickItem(data.itemId)
        .then(res => {
          if (res.status === 'succeed') {
            message.success('置顶成功');
            this.refresh();
          } else {
            message.error(res && res.resultMsg || '置顶失败');
          }
          this.setState({
            isPostLoading: false,
          });
        }, err => {
          message.error(err && err.resultMsg || '系统异常');
          this.setState({
            isPostLoading: false,
          });
        });
    } else if (key === '4') {
      // 取消置顶
      this.setState({
        isPostLoading: true,
      });
      API.stickCancelItem(data.itemId)
        .then(resp => {
          if (resp.status === 'succeed') {
            message.success('取消置顶成功');
            this.refresh();
          } else {
            message.error(resp && resp.resultMsg || '取消置顶失败');
          }
          this.setState({
            isPostLoading: false,
          });
        }, err => {
          message.error(err && err.resultMsg || '系统异常');
          this.setState({
            isPostLoading: false,
          });
        });
    } else if (key === '5') {
      // 审核通过
      this.checkSign(key, data);
    } else if (key === '6') {
      // 退回修改
      this.setState({
        rejectModal: { sequenceId: data.sequenceId, itemId: data.itemId },
      });
    } else if (key === '7') {
      // 删除
      this.handleDelete(data);
    } else if (key === '10') {
      // 上架
      if (isIframe) {
        this.confirmAction(key, data);
      } else {
        this.checkSign(key, data);
      }
    } else if (key === '11') {
      // 下架
      this.merchantPause(data);
    }
  }

  merchantPause = (data) => {
    API.merchantPause(data.itemId)
      .then(resp => {
        if (resp.status === 'succeed') {
          message.success(`${isFromKbServ() ? '代' : ''}下架成功`);
          reload();
        }
      }, e => {
        message.error(typeof e === 'string' ? e : e.message || `${isFromKbServ() ? '代' : ''}下架失败`);
      });
  }

  checkSign(actionKey, data) {
    if (this.state.signed !== true) { // 若已签约不再检查签约状态
      this.setState({
        isPostLoading: true,
      });
      API.checkSign()
        .then(res => {
          if (res.status === 'succeed') {
            if (res.hasSigned) {
              this.confirmAction(actionKey, data);
            } else {
              this.setState({
                isPostLoading: false,
                showSignModal: true,
                currentSequenceId: data.sequenceId,
                currentItemId: data.itemId,
                modalActionKey: actionKey,
              });
            }
          } else {
            message.error(res && res.resultMsg || '获取签约状态失败');
            this.setState({
              isPostLoading: false,
            });
          }
        }, err => {
          message.error(err && err.resultMsg || '系统异常');
          this.setState({
            isPostLoading: false,
          });
        });
    } else {
      this.confirmOnline(data);
      this.setState({
        currentSequenceId: data.sequenceId,
        currentItemId: data.itemId,
      });
    }
  }

  confirmAction = (actionKey, data) => {
    if (actionKey === '5') {// 审核通过
      this.confirmOnline(data);
    } else if (actionKey === '10') {// 上架
      this.handleOnline(data);
    }
  }

  handleOnline = ({ sequenceId, itemId }) => {
    this.setState({
      isPostLoading: true,
      showSignModal: false,
    });
    const data = {};
    if (itemId) {
      data.itemId = itemId;
    } else if (sequenceId) {
      data.sequenceId = sequenceId;
    }
    ajax({
      url: '/goods/caterItem/onlineItem.json',
      // url: 'http://pickpost.alipay.net/mock/kbcateringprod/goods/caterItem/onlineItem.json',
      data,
      type: 'json',
      method: 'post',
      success: (res) => {
        if (res && res.status === 'succeed') {
          message.success(`${isFromKbServ() ? '代' : ''}上架成功`);
          this.setState({
            signed: true,
            isPostLoading: false,
          });
          reload();
        } else {
          message.error((res && res.resultMsg) || `${isFromKbServ() ? '代' : ''}上架失败`);
          this.setState({
            isPostLoading: false,
          });
        }
      },
      error: res => {
        message.error((res && res.resultMsg) || '系统异常');
        this.setState({
          isPostLoading: false,
        });
      },
    });
  }

  confirmOnline = ({ sequenceId, itemId }) => { // 上架审核
    this.setState({
      isPostLoading: true,
      showSignModal: false,
    });
    const data = { optType: 1 };
    if (itemId) {
      data.itemId = itemId;
    } else if (sequenceId) {
      data.sequenceId = sequenceId;
    }
    ajax({
      url: '/goods/caterItem/merchantVerify.json',
      data,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          message.success('审核通过成功');
          this.setState({
            signed: true,
            isPostLoading: false,
          });
          reload();
        } else {
          message.error(res && res.resultMsg || '审核通过失败');
          this.setState({
            isPostLoading: false,
          });
        }
      },
      error: err => {
        message.error(err && err.resultMsg || '系统异常');
        this.setState({
          isPostLoading: false,
        });
      },
    });
  }

  handleReject = () => {
    const { sequenceId, itemId } = this.state.rejectModal;
    this.props.form.validateFields(['rejectReason'], {}, (errors) => {
      if (errors && errors.rejectReason) return;
      this.setState({
        isPostLoading: true,
      });
      const data = { sequenceId: sequenceId, optType: 2, rejectReason: this.props.form.getFieldValue('rejectReason') };
      if (itemId) {
        data.itemId = itemId;
      }
      ajax({
        url: '/goods/caterItem/merchantVerify.json',
        data,
        type: 'json',
        success: (res) => {
          if (res && res.status === 'succeed') {
            message.success('退回修改成功');
            reload();
          } else {
            message.error(res && res.resultMsg || '退回修改失败');
          }
          this.setState({
            isPostLoading: false,
          });
        },
        error: err => {
          message.error(err && err.resultMsg || '系统异常');
          this.setState({
            isPostLoading: false,
          });
        },
      });
      this.setState({
        rejectModal: false,
      });
    });
  }

  handleDelete = ({ sequenceId, itemId }) => {
    this.setState({
      isPostLoading: true,
    });
    const data = {};
    if (itemId) {
      data.itemId = itemId;
    }
    data.sequenceId = sequenceId;
    ajax({
      url: '/goods/caterItem/merchantOffline.json',
      data,
      type: 'json',
      success: (res) => {
        this.setState({
          isPostLoading: false,
        });
        if (res && res.status === 'succeed') {
          message.success('删除成功');
          reload();
        } else {
          message.error(res && res.resultMsg || '删除失败');
        }
      },
      error: err => {
        message.error(err && err.resultMsg || '系统异常');
        this.setState({
          isPostLoading: false,
        });
      },
    });
  }

  refresh() {
    const { pageSize, current } = this.state.pagination;
    this.fetch({
      pageSize,
      pageStart: current,
    });
  }

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    if (params.status === 'ALL') {
      params.status = '';
    }
    if (!params.industry) {
      params.industry = 'ALL';
    }
    params.caterCallChannel = isFromKbServ() ? 'SALES_MG' : 'CRM_HOME';
    ajax({
      url: '/goods/caterItem/queryItemList.json',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const pagination = { ...this.state.pagination };
          pagination.total = res.totalSize;
          this.setState({
            data: res.data || [],     // 此接口在没有数据的情况下，会没有 data 字段
            isTableLoading: false,
            pagination,
          });
        } else {
          message.error(res && res.resultMsg || '查询商品列表失败');
        }
      },
      error: err => {
        message.error(err && err.resultMsg || '系统异常');
      },
    });
  }

  hideSignModal = () => {
    this.setState({
      showSignModal: false,
    });
  }

  gotoCreate = () => {
    saveJumpTo('#/catering/new');
  }

  confirmOrderAgree = () => {
    const data = { sequenceId: this.state.currentSequenceId, itemId: this.state.currentItemId };
    this.confirmAction(this.state.modalActionKey, data);
  }
  showCodeModal = v => () => {
    this.setState({
      qrcode: v,
      showQrcode: true,
    });
  }
  cancelQrcode = () => {
    this.setState({
      showQrcode: false,
    });
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <div>
        <Spin spinning={this.state.isPostLoading}>
          <div className="kb-detail-main catering-list">
            <Row>
              <Col span={24}>
                <Table
                  rowKey={(r) => r.itemId}
                  loading={this.state.isTableLoading}
                  dataSource={this.state.data}
                  pagination={this.state.pagination}
                  onChange={this.onTableChange}
                  columns={this.columns}
                />
              </Col>
            </Row>
          </div>
        </Spin>
        <Modal title="退回原因"
          visible={!!this.state.rejectModal}
          onCancel={() => { this.setState({ rejectModal: false }); }}
          onOK={this.handleReject}
          className="catering-list-modal"
          footer={[
            <Button key="submit" type="primary" size="large" onClick={this.handleReject}>
              确定
            </Button>,
          ]}
        >
          <Form>
            <FormItem
              label="退回原因："
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              help={getFieldError('rejectReason')}
              validateStatus={
                classnames({
                  error: !!getFieldError('rejectReason'),
                })
              }
              required
            >
              <Input type="textarea" placeholder="请输入退回原因，最多100个字符"
                {...getFieldProps('rejectReason', {
                  rules: [
                    { required: true, message: '请输入退回原因' },
                    { max: 100, message: '退回原因最多不超过100个字' },
                  ],
                })}
              />
            </FormItem>
          </Form>
        </Modal>
        <Modal
          width="350"
          title="二维码"
          visible={!!this.state.showQrcode}
          onCancel={this.cancelQrcode}
          footer={false}
          style={{ textAlign: 'center' }}
        >
          <QRCode value={this.state.qrcode} size={250} ref="qrCode" />
          <p style={{ fontSize: 16, marginTop: 15 }}>请使用支付宝－扫一功能，<br />扫描二维码预览商品</p>
        </Modal>
        {this.state.showSignModal && (
          <ApplySignModal
            isCatering
            handleCancel={this.hideSignModal}
            confirmOrderAgree={this.confirmOrderAgree}
            onlineTradePayRate={this.state.rate}
          />
        )}
      </div>
    );
  }
}

export default Form.create()(CateringList);
