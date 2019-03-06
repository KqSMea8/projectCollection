import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { Tree, Button, Upload, Icon, Modal, message, Form, Input, Pagination } from 'antd';
import MaterialDelete from './material-delete';
import fetch from '@alipay/kb-fetch';
import ajax from '../../common/ajax';
import copy from '../../common/copy';
import { urlDecode, getCookie } from '../../common/utils';

import './index.less';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
/* eslint-disable */
class MaterialCenter extends Component {
  static propTypes = {
    form: PropTypes.object,
    exampleList: PropTypes.array,
    fileList: PropTypes.array,
    initialValue: PropTypes.array,
  };
  constructor(props) {
    super(props);
    this.state = {
      madelFlag: false,
      deleteFlag: false,
      priviewVisible: false,
      copyVisible: false,
      priviewImage: '',
      file: {},
      modifyModal: false,
      modifyName: '',
      loading: false,
      uploadLoading: false,
      deleteLoading: false,
      modifyLoading: false,
      groupId: '201607150000111470',
      copyId: '',
      pagination: {
        page: 1,
        itemsPerPage: 20,
        items: 1,
        pages: 1,
      },
      materialType: [],
      delEnable: '',
      dataList: [],
    };
  }
  componentDidMount() {
    this.searchGroup(); // 查询分组
    this.searchList(); // 查询列表
  }

  onSelect = (selectedKeys, e) => {
    // 判断点击的是哪个然后进行数据的更换
    if (selectedKeys[0]) {
      if (selectedKeys[0] === 'picture') {
        this.setState(
          {
            groupId: '201607150000111470',
            pagination: {
              ...this.state.pagination,
              page: 1,
            },
          },
          () => {
            this.searchList();
          }
        );
      } else {
        this.setState(
          {
            groupId: selectedKeys[0],
            pagination: {
              ...this.state.pagination,
              page: 1,
            },
          },
          () => {
            this.searchList();
          }
        );
      }
    } else {
      return false;
    }
  };
  // 控制修改显示
  onModify = (id, name) => {
    this.setState({
      modifyModal: true,
      modifyId: id,
      modifyName: name,
    });
  };
  // 分组查询
  searchGroup = () => {
    const { loading } = this.state;
    if (!loading) {
      this.setState({ loading: true });
      return fetch({
        url: 'kbmaterialcenter.groupQueryWrapperService.queryByPrincipalIdForCrmhome',
        param: {
          ownerId: '',
        },
        gwServer: `${window.APP.crmhomeUrl}/spigw.json`,
        devServer: ['kbmaterialcenter-zth-1.gz00b.dev.alipay.net'],
      })
        .then(res => {
          if (res && res.data.success && res.data.pageInfo) {
            this.setState({
              loading: false,
              materialType: res.data.values,
            });
            res.data.values.map(v => {
              if (v.delEnable === 'N') {
                this.setState({
                  wordLibraryIdentifier: v.groupId,
                });
              } else {
                this.setState({
                  wordLibraryIdentifier: '',
                });
              }
            });
          } else {
            message.error('系统错误');
            this.setState({ loading: false });
          }
        })
        .catch(err => {
          if (!err.success) {
            message.error('系统错误');
          }
          if (err && err.resultMsg) {
            message.error(err.resultMsg);
          }
          this.setState({ loading: false });
        });
    }
  };
  // 分页查询
  searchList = () => {
    const { pagination, loading, groupId } = this.state;
    if (!loading) {
      this.setState({ loading: true });
      return fetch({
        url: 'crmhome.materialCenterManageSpiProcesser.pageQueryMaterials',
        param: {
          groupId,
          pageSize: pagination.itemsPerPage,
          pageNo: pagination.page,
        },
        gwServer: `${window.APP.crmhomeUrl}/spigw.json`,
        devServer: ['crmhome-zth-9.gz00b.dev.alipay.net'],
      })
        .then(res => {
          if (res && res.data.success && res.data.pageInfo) {
            const { page, items, itemsPerPage = 20, pages } = res.data.pageInfo;
            this.setState({
              loading: false,
              pagination: { ...pagination, items, page, itemsPerPage, pages },
              dataList: res.data.values,
            });
          } else {
            message.error('系统错误');
            this.setState({ loading: false });
          }
        })
        .catch(err => {
          if (!err.success) {
            message.error('系统错误');
          }
          if (err && err.resultMsg) {
            message.error(err.resultMsg);
          }
          this.setState({ loading: false });
        });
    }
  };
  // 删除模版
  deleteModal = id => {
    Modal.confirm({
      title: '是否删除该素材？',
      content: '删除后，不影响已经在使用的场景。',
      okText: '是',
      cancelText: '否',
      onOk: () => {
        this.delete(id);
      },
      onCancel: () => {
        this.setState({ deleteLoading: false });
      },
    });
  };
  // 删除
  delete = id => {
    const { deleteLoading } = this.state;
    const { merchantId, inkb } = this.props;
    if (!deleteLoading) {
      this.setState({ deleteLoading: true });
      return ajax({
        url: `${window.APP.crmhomeUrl}/material/delMaterial.json${inkb ? '.kb' : ''}`,
        data: { id, timestamp: Date.now(), materalID: id, op_merchant_id: merchantId },
      })
        .then(res => {
          if (res.success) {
            message.success('删除成功');
            setTimeout(() => {
              this.handleReset(true);
            }, 0);
          } else {
            message.error('系统错误');
          }
          this.setState({ deleteLoading: false });
          return res;
        })
        .catch(res => {
          if (!res.success) {
            message.error('系统错误');
          }
          this.setState({ deleteLoading: false });
          return res;
        });
    }
  };
  // 修改
  modify = (id, name) => {
    const { modifyLoading } = this.state;
    const { merchantId, inkb } = this.props;
    if (!modifyLoading) {
      this.setState({ modifyLoading: true });
      ajax({
        url: `${window.APP.crmhomeUrl}/material/editMaterial.json${inkb ? '.kb' : ''}`,
        data: { id, name, timestamp: Date.now(), op_merchant_id: merchantId },
        success: res => {
          if (res.success) {
            message.success('修改成功');
            this.handleReset(true);
          } else {
            message.error('系统错误');
          }
          this.setState({ modifyLoading: false, modifyModal: false });
        },
        error: res => {
          if (!res.success) {
            message.error('系统错误');
          } else if (res && !res.resultMsg) {
            message.error(res.resultMsg);
          }
          this.setState({ modifyLoading: false, modifyModal: false });
        },
      });
    }
  };
  // 上传的onChange事件
  handleUpload = info => {
    this.setState({
      file: info.file,
    });
    if (info.file && info.file.status === 'done') {
      // 失败处理
      if (info.file.response && info.file.response.imgModel) {
        message.success('上传成功');
        const { pagination } = this.state; // 老的逻辑刷新页面
        this.setState({ uploadLoading: false, pagination: { ...pagination, current: 1 } }, () => {
          this.searchList();
        });
      } else if (info.file.response && info.file.response.stat === 'deny') {
        const isKbInput = document.getElementById('J_isFromKbServ');
        const isParentFrame = isKbInput && isKbInput.value === 'true' && window.parent;
        Modal.warning({
          title: '登录超时，需要立刻跳转到登录页吗？',
          onOk() {
            if (isParentFrame) {
              window.parent.location.reload();
            } else {
              window.reload();
            }
          },
          onCancel() {
            message.error('请重新登录');
            this.setState({ uploadLoading: false });
          },
        });
        this.setState({ uploadLoading: false });
      } else {
        message.error(
          (info.file && info.file.response && info.file.response.resultMsg) || '上传失败'
        );
        this.setState({ uploadLoading: false });
      }
    }
  };
  beforeUpload = file => {
    if (['image/jpeg', 'image/gif', 'image/png', 'image/bmp'].indexOf(file.type) < 0) {
      message.error('图片格式错误');
      return false;
    }

    if (file.size > 3000000) {
      message.error('图片已超过2.9M');
      return false;
    }
    this.setState({
      uploadLoading: true,
    });
    return true;
  };
  // 批量删除
  deleteBatches = () => {
    this.setState({
      deleteFlag: true,
    });
  };
  // 取消批量删除
  deleteFlagClick = flag => {
    this.setState({
      deleteFlag: flag,
    });
  };
  // 复制model
  copyModal = id => {
    this.setState({
      copyVisible: true,
      copyId: id,
    });
  };
  // 成功后刷新的回调
  handleReset = reset => {
    if (reset) {
      const { pagination } = this.state;
      this.setState({ pagination: { ...pagination, page: 1 } }, () => {
        this.searchGroup();
        this.searchList();
      });
    } else {
      this.searchGroup();
      this.searchList();
    }
  };
  showImage = (name, url) => {
    this.setState({
      priviewVisible: true,
      priviewImage: url,
      name,
    });
  };
  render() {
    const isKbInput = document.getElementById('J_isFromKbServ');
    const isParentFrame = isKbInput && isKbInput.value === 'true';
    const merchantId =
      (this.props.location && this.props.location.query.op_merchant_id) ||
      urlDecode().op_merchant_id;
    // this.state.fileList.unshift();// 每次往数组前边添加一个对象
    const props = {
      action: `${window.APP.crmhomeUrl}/material/picUpload2.json${
        isParentFrame && merchantId ? '.kb' : ''
      }`,
      data: {
        groupId: this.state.groupId,
        file: this.state.file,
        op_merchant_id: merchantId || '',
        ctoken: getCookie('ctoken'),
      },
      listType: 'picture-card',
      beforeUpload: this.beforeUpload,
      onChange: this.handleUpload,
    };
    const { modifyModal, modifyName, pagination, dataList } = this.state;
    return (
      <div style={{ height: '100%' }}>
        <div className="material-center">
          <div className="material-center-header">
            <span>素材中心</span>
          </div>
          <div
            style={{ width: '100%', height: '100%', display: 'flex' }}
            className="material-center-main"
          >
            <Tree
              onSelect={this.onSelect}
              defaultExpandedKeys={['picture', '201607150000111470']}
              defaultSelectedKeys={[this.state.groupId]}
            >
              <TreeNode title="图片" key="picture">
                {this.state.materialType.map(val => {
                  return (
                    <TreeNode
                      title={val.count ? `${val.name}(${val.count})` : val.name}
                      key={val.groupId}
                    />
                  );
                })}
              </TreeNode>
            </Tree>
            {this.state.deleteFlag ? (
              <MaterialDelete
                fileList={this.state.dataList}
                deleteFlagClick={this.deleteFlagClick}
                pagination={this.state.pagination}
                groupId={this.state.groupId}
                onRefresh={reset => {
                  this.handleReset(reset);
                }}
              />
            ) : this.state.wordLibraryIdentifier === this.state.groupId ? (
              <div
                className="material-center-main-right"
                style={{ paddingTop: '10px', paddingRight: '20px', paddingLeft: '12px' }}
              >
                <div className="add-shop-goods" style={{ marginTop: '10px' }}>
                  {dataList &&
                    dataList.map((val, key) => {
                      return (
                        <a
                          target="_blank"
                          className={`upload-example upload-example${key}`}
                          key={key}
                        >
                          <img
                            alt={val.name}
                            src={val.outMaterialUrl}
                            onClick={() => {
                              this.showImage(val.name, val.outMaterialUrl);
                            }}
                          />
                          <span className="example-model">
                            <span
                              className="copy"
                              style={{ left: '27px' }}
                              onClick={() => {
                                this.copyModal(val.outMaterialId);
                              }}
                            >
                              复制
                            </span>
                          </span>
                        </a>
                      );
                    })}
                </div>
                {dataList && dataList.length ? (
                  <Pagination
                    style={{ float: 'right' }}
                    total={pagination.items}
                    pageSize={pagination.itemsPerPage}
                    defaultCurrent={pagination.page}
                    current={pagination.page}
                    onChange={page => {
                      this.setState({ pagination: { ...pagination, page } }, () => {
                        this.searchList();
                      });
                    }}
                  />
                ) : (
                  ''
                )}
                <Modal
                  visible={this.state.priviewVisible}
                  footer={null}
                  onCancel={() => {
                    this.setState({
                      priviewVisible: false,
                    });
                  }}
                >
                  <img
                    style={{ width: '332px', height: '249px' }}
                    alt={this.state.name}
                    src={this.state.priviewImage}
                  />
                </Modal>
                <Modal
                  title="复制编号"
                  wrapClassName="vertical-center-modal"
                  visible={this.state.copyVisible}
                  okText="复制"
                  onOk={() => {
                    copy(this.state.copyId);
                    this.setState({ copyVisible: false });
                  }}
                  onCancel={() => {
                    this.setState({ copyVisible: false });
                  }}
                >
                  <p>素材编号：{this.state.copyId}</p>
                </Modal>
              </div>
            ) : (
              <div
                className="material-center-main-right"
                style={{ paddingTop: '10px', paddingRight: '20px', paddingLeft: '12px' }}
              >
                <div>
                  <Button
                    type="primary"
                    size="large"
                    style={{ marginLeft: '718px' }}
                    onClick={this.deleteBatches}
                  >
                    批量删除
                  </Button>
                </div>
                <div className="add-shop-goods" style={{ marginTop: '10px' }}>
                  <div className="upload-btn">
                    <Upload {...props} showUploadList={false}>
                      <Icon type="plus" />
                      <div className="ant-upload-text">添加图片</div>
                    </Upload>
                  </div>
                  {dataList &&
                    dataList.map((val, key) => {
                      return (
                        <a
                          target="_blank"
                          className={`upload-example upload-example${key}`}
                          key={key}
                        >
                          <img
                            alt={val.name}
                            src={val.outMaterialUrl}
                            onClick={() => {
                              this.showImage(val.name, val.outMaterialUrl);
                            }}
                          />
                          <span className="example-model">
                            <span
                              className="modify"
                              onClick={() => {
                                this.onModify(val.materialId, val.name);
                              }}
                            >
                              修改
                            </span>
                            <span
                              className="delete"
                              onClick={() => {
                                this.deleteModal(val.materialId);
                              }}
                            >
                              删除
                            </span>
                            <span
                              className="copy"
                              onClick={() => {
                                this.copyModal(val.outMaterialId);
                              }}
                            >
                              复制
                            </span>
                          </span>
                        </a>
                      );
                    })}
                </div>
                {dataList && dataList.length ? (
                  <Pagination
                    style={{ float: 'right' }}
                    total={pagination.items}
                    pageSize={pagination.itemsPerPage}
                    defaultCurrent={pagination.page}
                    current={pagination.page}
                    onChange={page => {
                      this.setState({ pagination: { ...pagination, page } }, () => {
                        this.searchList();
                      });
                    }}
                  />
                ) : (
                  ''
                )}
                <Modal
                  title="修改"
                  visible={modifyModal}
                  className="modify-model-style"
                  onOk={() => {
                    if (modifyName) {
                      this.modify(this.state.modifyId, this.state.modifyName);
                    }
                  }}
                  onCancel={() => {
                    this.setState({ modifyModal: false });
                  }}
                >
                  <FormItem
                    label="素材名称："
                    validateStatus={classnames({ error: !modifyName })}
                    help={!modifyName ? '请填写素材名称' : ''}
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 19 }}
                  >
                    <Input
                      placeholder="请填写素材名称"
                      value={modifyName}
                      onChange={e => {
                        this.setState({ modifyName: e.target.value });
                      }}
                    />
                  </FormItem>
                </Modal>
                <Modal
                  visible={this.state.priviewVisible}
                  footer={null}
                  onCancel={() => {
                    this.setState({
                      priviewVisible: false,
                    });
                  }}
                >
                  <img
                    style={{ width: '332px', height: '249px' }}
                    alt={this.state.name}
                    src={this.state.priviewImage}
                  />
                </Modal>
                <Modal
                  title="复制编号"
                  wrapClassName="vertical-center-modal"
                  visible={this.state.copyVisible}
                  okText="复制"
                  onOk={() => {
                    copy(this.state.copyId);
                    this.setState({ copyVisible: false });
                  }}
                  onCancel={() => {
                    this.setState({ copyVisible: false });
                  }}
                >
                  <p>素材编号：{this.state.copyId}</p>
                </Modal>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default MaterialCenter;
