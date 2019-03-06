import React, {PropTypes} from 'react';
import {Input, Button, Form, Select, message, InputNumber, Icon, Upload, Modal, Cascader} from 'antd';
import ajax from '../../../common/ajax';
import classnames from 'classnames';

import { getUriParam } from '../../../common/utils';

const FormItem = Form.Item;
const Option = Select.Option;

const ItemOperate = React.createClass({
  propTypes: {
    params: PropTypes.object,
    form: PropTypes.object,
  },

  getInitialState() {
    return {
      initData: {},
      brandList: [],
      cateList: [],
      imgList: [],
      loading: false,
      previewVisible: false,
      previewImage: '',
    };
  },

  componentDidMount() {
    this.initForm();
  },

  displayRender(label) {
    return label[label.length - 1];
  },

  initForm() {
    ajax({
      url: '/goods/ic/queryBrandsInfo.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            brandList: res.data,
          });
        } else {
          message.error(res.resultMsg);
        }
      },
      error: (res) => {
        message.error(res.resultMsg);
      },
    });

    ajax({
      url: '/goods/ic/queryCatetoriesInfo.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            cateList: res.data,
          });
        } else {
          message.error(res.resultMsg);
        }
      },
      error: (res) => {
        message.error(res.resultMsg);
      },
    }).then(() => {
      if (this.props.params.id) {
        this.fetchDetail();
      }
    });
  },

  fetchDetail() {
    ajax({
      url: '/goods/ic/queryItemDetail.json',
      data: {
        id: this.props.params.id,
      },
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const data = res.data;
          this.setState({
            initData: Object.assign(data, {
              fileId: getUriParam('fileIds', data.picture),
              categoryCode: this.buildCateData(data.categoryCode),
            }),
            imgList: [{
              uid: '-1' + Math.random(),
              name: 'itemPic.png',
              status: 'done',
              url: data.picture,
              thumbUrl: data.picture,
            }],
          });
        } else {
          message.error(res.resultMsg);
        }
      },
      error: (res) => {
        message.error(res.resultMsg);
      },
    });
  },


  handleSubmit(e) {
    const self = this;
    e.preventDefault();

    self.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }

      self.setState({
        loading: true,
      });

      Object.assign(values, {
        categoryCode: values.categoryCode[values.categoryCode.length - 1],
      });

      let api;
      if (this.props.params.id) {
        api = 'updateItemInfo.json';

        Object.assign(values, {
          id: this.props.params.id,
        });
      } else {
        api = 'addItemInfo.json';
      }

      ajax({
        url: '/goods/ic/' + api,
        method: 'post',
        data: values,
        type: 'json',
        success: (res) => {
          self.setState({
            loading: false,
          }, () => {
            if (res.status === 'succeed') {
              message.success(res.resultMsg);
              setTimeout(() => {
                location.hash = '/item-management/item-list';
              }, 1000);
            } else {
              message.error(res.resultMsg);
            }
          });
        },
        error: (res) => {
          self.setState({
            loading: false,
          }, () => {
            message.error(res.resultMsg);
          });
        },
      });
    });
  },

  previewCancel() {
    this.setState({
      previewVisible: false,
    });
  },

  uploadPic(info) {
    const list = info.fileList.slice(-1);

    let fileId = '';

    if ( list && list.length ) {
      list[0].url = list[0].thumbUrl;
      const { response } = list[0];
      if (response && response.status && response.status === 'succeed') {
        fileId = response.fileId;
      }
      // 登陆超时
      if (response && response.stat && response.stat === 'deny') {
        Modal.error({
          title: '登录超时，需要立刻跳转到登录页吗？',
          content: <a href={location.href} target="_blank">点此跳转登录页</a>,
        });

        this.setState({ imgList: [] });
        this.props.form.setFieldsValue({
          'fileId': '',
        });

        return;
      }
    }

    this.setState({ imgList: list });
    this.props.form.setFieldsValue({
      'fileId': fileId,
    });
  },

  buildCateData(categoryCode) {
    let result;
    this.state.cateList.map((obj) => {
      if (obj.value === categoryCode) {
        result = [obj.value];
        return;
      }

      if (obj.children && obj.children.length > 0 ) {
        obj.children.map((child) => {
          if (child.value === categoryCode) {
            result = [obj.value, child.value];
            return;
          }

          if (child.children && child.children.length > 0) {
            child.children.map((item) => {
              if (item.value === categoryCode) {
                result = [obj.value, item.parentId, item.value];
              }
            });
          }
        });
      }
    });

    return result;
  },

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const { initData } = this.state;

    const { getFieldProps, getFieldError} = this.props.form;

    // 销售中台账户登录，需要获取merchantId，图片上传中增加op_merchant_id参数
    const merchant = document.getElementById('J_crmhome_merchantId');

    const uploadProps = {
      name: 'Filedata',
      action: '/goods/itempromo/uploadPicture.json',
      listType: 'picture-card',
      fileList: this.state.imgList,
      data: {
        op_merchant_id: merchant && merchant.value ? merchant.value : null,
      },
      onChange: this.uploadPic,
      beforeUpload(file) {
        const isTooLarge = file.size > 2 * 1024 * 1024;
        const arr = ['image/jpeg', 'image/bmp', 'image/png', 'image/gif'];
        const isImg = arr.indexOf(file.type) !== -1;

        if (isTooLarge) {
          message.error('图片不能超过2M');
        }

        if (!isImg) {
          message.error('请上传 bmp, png, jpg, gif 格式的文件');
        }

        return !isTooLarge && isImg;
      },
      onPreview: (file) => {
        this.setState({
          previewImage: file.url,
          previewVisible: true,
        });
      },
    };

    const type = this.props.params.id ? '编辑' : '添加';

    return (<div className="commodity">
      <div className="app-detail-header">商品库 > {type}商品</div>

      <div className="app-detail-content-padding">
        <Form horizontal form={this.props.form}>
          <FormItem
            {...formItemLayout}
            required
            label="商品国标码："
          >
            <Input
              size="large"
              style={{ width: 300 }}
              placeholder="请输入商品国标码"
              {...getFieldProps('itemCode', {
                rules: [
                  { required: true, message: '请输入商品国标码' },
                  { max: 30, message: '商品编码长度不能超过30个字' },
                ],
                initialValue: initData.itemCode,
              })}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            required
            label="商品名称："
          >
            <Input
              size="large"
              style={{ width: 300 }}
              placeholder="请输入商品名称"
              {...getFieldProps('title', {
                rules: [
                  { required: true, message: '请输入商品名称' },
                  { max: 50, message: '商品名称长度不能超过50个字' },
                ],
                initialValue: initData.title,
              })}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            required
            label="商品品牌："
          >
            <Select size="large"
                    style={{ width: 300 }}
              {...getFieldProps('brandCode', {
                rules: [
                  { required: true, message: '请选择品牌' },
                ],
                initialValue: initData.brandCode,
              })}
            >
              <Option value="">请选择品牌</Option>
              {this.state.brandList.map((item, key) => {
                return (
                  <Option key={key} value={item.brandCode}>{item.name}</Option>
                );
              })}
            </Select>
          </FormItem>
          <FormItem
            {...formItemLayout}
            required
            label="商品品类："
            placeholder="请选择商品品类"
            help={getFieldError('categoryCode')}
            validateStatus={
              classnames({
                error: !!getFieldError('categoryCode'),
              })
            }
          >
            <Cascader options={this.state.cateList}
                      expandTrigger="hover"
                      displayRender={this.displayRender}
                      style={{width: 300}}
                      placeholder="请选择品类"
              {...getFieldProps('categoryCode', {
                rules: [
                  { type: 'array', required: true, message: '请选择品类'},
                ],
                initialValue: initData.categoryCode,
              })}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="商品价格："
          >
            <InputNumber
              size="large"
              style={{ width: 300 }}
              min={0.01} max={49999.99} step={0.01}
              placeholder="请输入商品价格"
              {...getFieldProps('price', {
                initialValue: initData.price && Number.parseFloat(initData.price / 100),
              }
              )} />
            元
          </FormItem>
          <FormItem
            {...formItemLayout}
            required
            label="商品规格："
          >
            <Input
              size="large"
              style={{ width: 300 }}
              placeholder="例: 500ml"
              {...getFieldProps('specification', {
                rules: [
                  { required: true, message: '请输入商品规格' },
                  { max: 50, message: '商品规格长度不能超过50个字' },
                ],
                initialValue: initData.specification,
              })}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            required
            label="商品图片："
            help={getFieldError('fileId')}
            validateStatus={
              classnames({
                error: !!getFieldError('fileId'),
              })
            }
          >
            <div>

              <Upload {...uploadProps}>
                <Icon type="plus" />
                <div className="ant-upload-text">上传照片</div>
              </Upload>
              <p style={{color: '#999'}}>建议：请上传商品图片，不超过2M。格式：bmp, png, jpeg, jpg, gif。</p>
              <Input type="hidden" {...getFieldProps('fileId', {
                rules: [
                  { required: true, message: '请上传商品图片'},
                ],
                initialValue: initData.fileId,
              })}/>
              <Modal visible={this.state.previewVisible}
                     footer={null}
                     onCancel={this.previewCancel}
                     width={650}
                     wrapClassName="img-preview"
              >
                <img style={{maxWidth: 600, marginTop: 20}} src={this.state.previewImage} />
              </Modal>
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="商品数量："
          >
            <InputNumber
              size="large"
              min={1} max={5000} step={1}
              style={{ width: 300 }}
              placeholder="请输入商品入库数量"
              {...getFieldProps('count', {
                initialValue: initData.count > 0 ? initData.count : '',
              })}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="商品描述："
          >
            <Input
              size="large"
              style={{ width: 300 }}
              placeholder="请输入商品内容简介，200字以内"
              {...getFieldProps('description', {
                rules: [
                  { max: 200, message: '商品内容简介不能超过200个字' },
                ],
                initialValue: initData.description,
              })}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="商品产地："
          >
            <Input
              size="large"
              style={{ width: 300 }}
              placeholder="请输入商品产地"
              {...getFieldProps('country', {
                rules: [
                  { max: 20, message: '商品产地长度不能超过20个字' },
                ],
                initialValue: initData.country,
              })}
            />
          </FormItem>
          <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 10 }}>
            <Button type="primary" onClick={this.handleSubmit} loading={this.state.loading}>提交</Button>
          </FormItem>
        </Form>
      </div>
    </div>);
  },
});

export default Form.create()(ItemOperate);
