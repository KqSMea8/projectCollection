import React from 'react';
import PropTypes from 'prop-types';
import { PageNoAuth } from '@alipay/kb-framework-components';
import permission from '@alipay/kb-framework/framework/permission';
import {
  Button,
  Table,
  Icon,
  Menu,
  Dropdown,
  Modal,
  message,
  Tooltip,
  Form,
} from 'antd';
import { Page } from '@alipay/kb-framework-components/lib/layout';
import { UserSelect } from '@alipay/kb-biz-components';
import DefaultSelfUserSelect from './component/DefaultSelfUserSelect';
import BrandShopConfig from './BrandShopChild/brandShopConfig';
import { pageListShopGroup, deleteShopGroup, batchTask } from './common/api';
import './index.less';

/* eslint-disable */
const { object } = PropTypes;
const createForm = Form.create;
const FormItem = Form.Item;
class BrandShopGroup extends React.Component {
  static propTypes = {
    form: object,
  };
  constructor(props) {
    super(props);
    this.state = {
      bizGroupVOS: [],
      totalItems: 0,
      record: {},
      visible: false,
      modalTitle: '',
      pageNo: 0,
      pageSize: 15,
      userSelectValue: null,
      onlySearchSubordinate: true,
      hiddenOperationButton: true,
      hrefUrl: '',
    };
  }

  componentDidMount() {
    // 判断权限
    if (permission('SUPER_QUERY_ADMIN')) {
      // 超级管理员
      this.setState({
        onlySearchSubordinate: false,
      });
      // 没有操作权限只显示上传查看下载
    }
    if (
      !permission('BIZ_GROUP_OPERATE_AUTH') &&
      !permission('SUPER_OPERATE_ADMIN')
    ) {
      this.setState({
        hiddenOperationButton: false,
      });
    } else {
      this.setState({
        hiddenOperationButton: true,
      });
    }
    const obj = {
      operatorId: '',
      pageSize: this.state.pageSize,
      pageNo: this.state.pageNo,
    };
    this.getTableList(obj);
  }

  getTableList = obj => {
    pageListShopGroup(obj).then(res => {
      this.setState({
        totalItems: res.data.totalItems,
        bizGroupVOS: res.data.bizGroupVOS,
        pageNo: res.data.pageNo,
        pageSize: res.data.pageSize,
      });
    });
  };

  // 新增品牌门店组
  newBrandStoreGroup = () => {
    this.props.history.push('/brandShopGroup/new');
  };

  renderActionDelete = text => {
    return (
      <a
        onClick={() => {
          this.delectShopGroup(text);
        }}
      >
        删除门店组
      </a>
    );
  };
  // 删除门店组
  delectShopGroup = text => {
    Modal.confirm({
      title: `确认删除“${text.groupName}”`,
      content: '删除后，品牌门店组内容会被清除',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        // 确定删除
        this.setState({ deleteLoading: false });
        deleteShopGroup({ groupId: text.groupId })
          .then(res => {
            if (res.status === 'succeed') {
              message.success('删除成功');
              setTimeout(() => {
                this.getTableList({
                  operatorId: this.state.operatorId,
                  pageSize: this.state.pageSize,
                  pageNo: this.state.pageNo,
                });
              }, 0);
            } else {
              message.error('删除失败');
              Modal.error({
                title: '删除失败',
                content: res.resultMsg,
              });
            }
            this.setState({ deleteLoading: false });
            return res;
          })
          .catch(e => {
            Modal.error({
              title: '删除失败',
              content: e.message,
              okText: '知道了',
            });
          });
      },
      onCancel: () => {
        this.setState({ deleteLoading: false });
      },
    });
  };

  renderActionDetail = text => {
    return (
      <a
        onClick={() => {
          this.findDetail(text);
        }}
      >
        查看
      </a>
    );
  };
  // 查看门店详情
  findDetail = text => {
    this.props.history.push(`/brandShopGroup/detail/${text.groupId}`);
  };

  renderActionModify = text => {
    return (
      <a
        onClick={() => {
          this.modifyShopGroup(text);
        }}
      >
        修改门店组
      </a>
    );
  };
  // 修改门店组
  modifyShopGroup = text => {
    this.props.history.push(`/brandShopGroup/edit/${text.groupId}`);
  };

  renderActionConfig = record => {
    return (
      <a
        onClick={() => {
          this.configShop('配置门店', record);
        }}
      >
        配置门店
      </a>
    );
  };
  // 配置门店
  configShop = (text, data) => {
    this.setState({
      visible: true,
      modalTitle: text,
      record: data,
    });
    if (!text) {
      this.setState({
        visible: false,
      });
    }
  };

  modifyRenderAction = record => {
    return (
      <a
        onClick={() => {
          this.configShop('修改门店', record);
        }}
      >
        修改门店
      </a>
    );
  };

  // 查看上传进度
  findUploadProgress = () => {
    location.hash = '#/batchFileManager?scene=SHOP_GROUP_RELATION_BATCH_UPDATE';
  };

  // 下载门店
  downShop = groupId => {
    this.setState({
      groupId,
    });
    return batchTask({ groupId }).then(res => {
      if (res.status === 'succeed') {
        window.open(`${window.APP.kbsalesUrl}${res.data}`);
      } else {
        message.error('请确定是否配置过门店');
      }
    });
  };

  // 下载门店
  downloadShop = groupId => {
    return (
      <span
        onClick={() => {
          this.downShop(groupId);
        }}
      >
        <a href={this.state.hrefUrl || ' javascript:;'}>下载门店</a>
      </span>
    );
  };

  render() {
    const { getFieldProps } = this.props.form;
    const {
      bizGroupVOS,
      totalItems,
      onlySearchSubordinate,
      operatorId,
      modalTitle,
      visible,
      record,
      pageNo,
      pageSize,
    } = this.state;
    if (
      !permission('BIZ_GROUP_QUERY_AUTH') &&
      !permission('SUPER_QUERY_ADMIN')
    ) {
      return <PageNoAuth authCodes={['BIZ_GROUP_QUERY_AUTH']} />;
    }
    const header = (
      <div>
        {(permission('SUPER_OPERATE_ADMIN') ||
          permission('BIZ_GROUP_OPERATE_AUTH')) && (
          <Button type="primary" onClick={this.newBrandStoreGroup}>
            新增品牌门店组
          </Button>
        )}
      </div>
    );
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 5 },
    };
    let menu;
    const columns = [
      {
        title: (
          <div>
            门店组信息<p className="groupId">名称 | ID</p>
          </div>
        ),
        dataIndex: 'groupName',
        key: 'groupName',
        render: (text, data) => {
          return (
            <span>
              {text}
              <br />
              <span className="groupId">{data.groupId}</span>
              <br />
              {data.memo && (
                <Tooltip
                  placement="bottomLeft"
                  title={data.memo}
                  trigger={['click']}
                >
                  <a href=" javascript:;">查看备注</a>
                </Tooltip>
              )}
            </span>
          );
        },
      },
      {
        title: '门店数量',
        dataIndex: 'shopCount',
        key: 'shopCount',
        render: (text, data) => {
          if (data.shopGroupConfigStatus === 'NOT_UPLOAD') {
            return <span className="pageListStatus">未配置门店</span>;
          } else if (data.shopGroupConfigStatus === 'UPLOADING_SHOPS') {
            return <span className="pageListStatus">门店上传中</span>;
          } else {
            return <span>{text}</span>;
          }
        },
      },
      {
        title: '管理BD',
        dataIndex: 'ownerName',
        key: 'ownerName',
        render: (text, data) => {
          return (
            <span>
              {text}
              <br />
              <span className="ownerId">{data.ownerNickName}</span>
            </span>
          );
        },
      },
      {
        title: '品牌',
        dataIndex: 'brandName',
        key: 'brandName',
        render: (text, data) => {
          if (text === '') {
            return <span className="textContent">--</span>;
          } else {
            return <span>{text}</span>;
          }
        },
      },
      {
        title: '更新时间',
        dataIndex: 'gmtModified',
        key: 'gmtModified',
        render: text => {
          const gmtModified = text.slice(0, 10).replace(/-/g, '/');
          return <span>{gmtModified}</span>;
        },
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => {
          if (record.shopGroupConfigStatus === 'NOT_UPLOAD') {
            menu = (
              <Menu>
                <Menu.Item key="0">{this.renderActionDetail(text)}</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="1">
                  {this.renderActionModify(text, record)}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="2">{this.renderActionDelete(text)}</Menu.Item>
              </Menu>
            );
            return (
              <span>
                {this.state.hiddenOperationButton ? (
                  <span>
                    {this.renderActionConfig(record)}
                    <span className="ant-divider" />
                    <Dropdown overlay={menu} trigger={['click']}>
                      <a className="ant-dropdown-link" href="#">
                        更多 <Icon type="down" />
                      </a>
                    </Dropdown>
                  </span>
                ) : (
                  this.renderActionDetail(text)
                )}
              </span>
            );
          } else if (record.shopGroupConfigStatus === 'UPLOADING_SHOPS') {
            return (
              <span>
                <a onClick={this.findUploadProgress}>门店上传进度</a>
                <span className="ant-divider" />
                {this.renderActionDetail(text)}
              </span>
            );
          } else {
            menu = (
              <Menu>
                <Menu.Item key="0">
                  {this.downloadShop(record.groupId)}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="1">{this.renderActionDetail(text)}</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="2">
                  {this.renderActionModify(text, record)}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">{this.renderActionDelete(text)}</Menu.Item>
              </Menu>
            );
            return (
              <div>
                {this.state.hiddenOperationButton ? (
                  <span>
                    {this.modifyRenderAction(record)}
                    <span className="ant-divider" />
                    <Dropdown overlay={menu} trigger={['click']}>
                      <a className="ant-dropdown-link" href="#">
                        更多 <Icon type="down" />
                      </a>
                    </Dropdown>
                  </span>
                ) : (
                  <span>
                    {this.downloadShop(record.groupId)}
                    <span className="ant-divider" />
                    {this.renderActionDetail(text)}
                  </span>
                )}
              </div>
            );
          }
        },
      },
    ];

    // 判断总长度是否大于15
    const showQuickJumperData = totalItems >= 15 ? true : false;
    const pagination = {
      total: totalItems,
      showSizeChanger: true,
      defaultPageSize: 15,
      pageSizeOptions: ['15', '30', '45', '60'],
      showQuickJumper: true,
      onShowSizeChange: (current, pageSize) => {
        this.setState(
          {
            pageNo: current - 1,
            pageSize,
          },
          () => {
            this.getTableList({
              operatorId: this.state.operatorId,
              pageNo: this.state.pageNo,
              pageSize: this.state.pageSize,
            });
          }
        );
      },
      onChange: current => {
        this.setState(
          {
            pageNo: current - 1,
          },
          () => {
            this.getTableList({
              operatorId: this.state.operatorId,
              pageNo: this.state.pageNo,
              pageSize: this.state.pageSize,
            });
          }
        );
      },
    };
    return (
      <Page title="品牌门店组管理" id="brandShopGroup" header={header}>
        <Form horizontal>
          <FormItem {...formItemLayout} label="管理BD">
            <DefaultSelfUserSelect
              {...getFieldProps('insideTheSmall2', {
                rules: [{ required: true, message: '请填写正确的小二名称' }],
              })}
              onChange={value => {
                if (value && !value.isSelf) {
                  this.getTableList({
                    operatorId: value.id,
                    pageSize: 15,
                    pageNo: 0,
                  });
                  this.setState({
                    operatorId: value.id,
                  });
                }
                this.setState({ bdUser: value });
              }}
              value={this.state && this.state.bdUser}
              kbsalesUrl={window.APP.kbsalesUrl}
              onlySearchSubordinate={onlySearchSubordinate}
              style={{ width: 250 }}
              role={UserSelect.UserRole.BD}
            />
          </FormItem>
        </Form>
        <Table
          columns={columns}
          dataSource={bizGroupVOS}
          pagination={showQuickJumperData ? pagination : false}
        />
        {visible && (
          <BrandShopConfig
            visible={visible}
            modalTitle={modalTitle}
            record={record}
            configShop={this.configShop}
            getTableList={this.getTableList}
            operatorId={operatorId}
            pageNo={pageNo}
            pageSize={pageSize}
          />
        )}
      </Page>
    );
  }
}

export default createForm()(BrandShopGroup);
