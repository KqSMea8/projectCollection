import React, { PropTypes } from 'react';
import {
  message,
  Form,
  Radio,
  Tooltip,
  Pagination,
  Button,
  Select,
  Input,
  Icon,
  Upload,
  Spin,
  Modal,
} from 'antd';
import List from './List';
import { urlDecode, getCookie } from '../../../common/utils';
import ajax from '../../../common/ajax';
import './index.less';

const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;

const Material = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },

  getInitialState() {
    const isKbInput = document.getElementById('J_isFromKbServ');
    const isParentFrame = isKbInput && isKbInput.value === 'true';
    const merchantId =
      (this.props.location && this.props.location.query.op_merchant_id) ||
      urlDecode().op_merchant_id;
    this.uploadProps = {
      action: `http://crmhome-zth-27.gz00b.dev.alipay.net/material/picUpload2.json${
        isParentFrame && merchantId ? '.kb' : ''
      }`,
      withCredentials: true,
      data: {
        op_merchant_id: merchantId || '',
        ctoken: getCookie('ctoken'),
      },
      beforeUpload: this.beforeUpload,
      onChange: this.handleUpload,
    };
    return {
      merchantId,
      inkb: isParentFrame,
      loading: false,
      uploadLoading: false,
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0,
      },
      dataList: [],
    };
  },

  componentDidMount() {
    this.searchList();
  },

  beforeUpload(file) {
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
  },

  handleUpload(info) {
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
  },

  searchList(params = {}) {
    const { pagination, loading, merchantId, inkb } = this.state;
    if (!loading) {
      this.setState({ loading: true });
      const { checkPass, name } = { ...this.props.form.getFieldsValue(), ...params };
      ajax({
        url: `/material/searchMaterial.json${inkb && merchantId ? '.kb' : ''}`,
        data: {
          pageNum: pagination.current,
          op_merchant_id: merchantId,
          standard: checkPass, // todo 接口新加字段
          keyword: name, // todo 接口新加字段 交互需要探讨，点击按钮后关键字生效，还是按照输入框里的生效？
        },
        success: res => {
          console.log('ressssss', res);
          if (res && res.success && res.materialVOList && res.pageInfo) {
            const { currentPage: current, totalSize: total, pageSize = 20 } = res.pageInfo;
            this.setState({
              loading: false,
              dataList: res.materialVOList,
              pagination: { ...pagination, total, current, pageSize },
            });
          } else {
            message.error('系统错误');
            this.setState({ loading: false });
          }
        },
        error: e => {
          if (!e.success) {
            message.error('系统错误');
          }
          if (e && e.resultMsg) {
            message.error(e.resultMsg);
          }
          this.setState({ loading: false });
        },
      });
    }
  },

  handleReset(reset) {
    if (reset) {
      const { pagination } = this.state;
      this.setState({ pagination: { ...pagination, current: 1 } }, () => {
        this.searchList();
      });
    } else {
      this.searchList();
    }
  },

  render() {
    const { pagination, dataList, uploadLoading, loading, merchantId, inkb } = this.state;
    const { getFieldProps, getFieldValue } = this.props.form;
    const standard =
      typeof getFieldValue('checkPass') === 'boolean' ? getFieldValue('checkPass') : true;

    return (
      <div>
        <div className="app-detail-header">
          素材管理
          <div className="material-sub-title">
            为避免图片上传时耗时过长、压缩时质量受损，建议图片大小不小于200k,不大于3M，当前仅支持
            bmp、png、jpeg、jpg、gif格式。
          </div>
          <ButtonGroup style={{ position: 'absolute', top: 16, right: 16, zIndex: 1, width: 100 }}>
            <Upload {...this.uploadProps} showUploadList={false} multiple>
              <Tooltip placement="top" title="按住ctrl，同时可上传多张图片">
                <Button loading={uploadLoading} size="large" type="primary">
                  添加素材
                </Button>
              </Tooltip>
            </Upload>
          </ButtonGroup>
        </div>
        <div className="app-detail-content-padding material-form">
          <Form>
            <RadioGroup
              {...getFieldProps('checkPass', {
                initialValue: true,
                onChange: e => {
                  this.searchList({ checkPass: e.target.value });
                },
              })}
            >
              <Radio value>有效</Radio>
              <Radio value={false}>无效</Radio>
            </RadioGroup>
            <div className="ant-search-input-wrapper" style={{ width: 200 }}>
              <Input.Group className="ant-search-input">
                <Select
                  combobox
                  showArrow={false}
                  placeholder="素材名称"
                  {...getFieldProps('name')}
                />
                <div className="ant-input-group-wrap">
                  <Button
                    className="ant-search-btn-noempty ant-search-btn"
                    onClick={() => {
                      this.searchList();
                    }}
                  >
                    <Icon type="search" />
                  </Button>
                </div>
              </Input.Group>
            </div>
          </Form>
          {loading ? (
            <div style={{ minHeight: 400 }}>
              <Spin />
            </div>
          ) : (
            <List
              list={dataList}
              onRefresh={reset => {
                this.handleReset(reset);
              }}
              inkb={inkb}
              merchantId={merchantId}
              standard={standard}
            />
          )}
          {dataList && dataList.length ? (
            <Pagination
              style={{ float: 'right' }}
              {...pagination}
              onChange={page => {
                const newPagination = { ...pagination, current: page };
                this.setState({ pagination: newPagination }, () => {
                  this.searchList();
                });
              }}
              showQuickJumper
              showTotal={total => `共${total}个记录`}
              pageSize={pagination.pageSize}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    );
  },
});

export default Form.create()(Material);
