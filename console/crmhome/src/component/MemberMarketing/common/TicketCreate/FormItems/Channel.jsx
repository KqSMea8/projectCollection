import React, {PropTypes} from 'react';
import { Form, Input, Upload, Icon, Modal, Checkbox, Row, Col, message } from 'antd';
import {assign, assignInWith, forIn} from 'lodash';
import classnames from 'classnames';

const FormItem = Form.Item;

const hideClassName = 'hide';
const inputCouponName = 'deliveryChannelSlogan';
const inputQuanUrlName = 'deliveryChannelImgFileId';

const Channel = React.createClass({
  propTypes: {
    form: PropTypes.object,
    layout: PropTypes.object,
    initData: PropTypes.object,
    roleType: PropTypes.string,
    actionType: PropTypes.string,
    checkBox: PropTypes.object,
  },

  getDefaultProps() {
    return {
      initData: {},
    };
  },

  getInitialState() {
    return {
      toggleClassName: '',
      quanPicList: [],
      modalVisible: false,
      previewVisible: false,
      previewImage: '',
      checkBox: {
        'pay': {
          'label': '支付成功页',
          'name': 'PAYMENT_RESULT',
          'checked': true,
          'img': 'https://zos.alipayobjects.com/rmsportal/WWKjEdpgkFwFxRo.png@w500',
        },
        'discount': {
          'label': '专属优惠频道',
          'name': 'SPECIAL_LIST',
          'checked': true,
          'img': 'https://zos.alipayobjects.com/rmsportal/eJyarGFluZAMppL.png@w500',
        },
      },
    };
  },

  componentWillMount() {
    // 设置渠道表单
    this.setDeliveryChannelsValue();
  },

  componentWillReceiveProps(nextProps) {
    const { initData } = nextProps;

    if (!this.props.initData.deliveryChannelImgUrl && initData.deliveryChannelImgUrl) {
      this.setState({
        quanPicList: [{
          uid: '-1' + Math.random(),
          name: 'xxx.png',
          status: 'done',
          url: initData.deliveryChannelImgUrl,
          thumbUrl: initData.deliveryChannelImgUrl,
        }],
      });
    }

    if (!this.props.initData.deliveryChannels && initData.deliveryChannels) {
      const arr = initData.deliveryChannels;
      const obj = {};

      forIn(this.state.checkBox, (item, key) => {
        if (arr.indexOf(item.name) === -1) {
          obj[key] = {
            checked: false,
          };
        }
      });

      // 接收checkbox默认状态
      const assignCheckBox = assignInWith(this.state.checkBox, obj, (objValue, srcValue) => {
        return assign(objValue, srcValue);
      });

      this.setState({
        toggleClassName: this.getToggleClassName(assignCheckBox),
        checkBox: assignCheckBox,
      });

      // 设置渠道表单
      this.setDeliveryChannelsValue();
    }
  },

  // 切换checkbox
  onChangeCheckbox(e) {
    this.state.checkBox[e.target.kid].checked = e.target.checked;

    const previewClassNameNext = this.getToggleClassName(this.state.checkBox);
    const previewClassNameCurrent = this.state.toggleClassName;

    this.setState({
      toggleClassName: previewClassNameNext,
      modalVisible: false,
      checkBox: this.state.checkBox,
    });

    // 券展示状态切换后，同步校验状态
    if (previewClassNameNext !== previewClassNameCurrent) {
      this.props.form.resetFields([inputCouponName, inputQuanUrlName]);
    }

    this.setDeliveryChannelsValue();
  },

  // 设置渠道提交表单
  setDeliveryChannelsValue() {
    const valueArr = [];
    forIn(this.state.checkBox, (item) => {
      if (item.checked) {
        valueArr.push(item.name);
      }
    });

    this.props.form.setFieldsValue({
      'deliveryChannels': valueArr,
    });
  },

  // 获取切换隐藏class
  getToggleClassName(data) {
    let cls = hideClassName;

    forIn(data, (item) => {
      if (item.checked) {
        cls = '';
        return;
      }
    });

    return cls;
  },

  // 点击预览
  clickPreview(e) {
    e.preventDefault();
    this.setState({
      modalVisible: true,
    });
  },

  // 关闭预览
  closePreview() {
    this.setState({ modalVisible: false });
  },

  // 上传图片取消预览
  handleCancelPreview() {
    this.setState({
      previewVisible: false,
    });
  },

  // 上传券图片
  uploadQuanPic(info) {
    const list = info.fileList.slice(-1);

    let fileId = '';

    if ( list && list.length ) {
      list[0].url = list[0].thumbUrl;
      const { response } = list[0];
      if (response && response.status && response.status === 'succeed') {
        fileId = response.fileId;
      }
      if (response && response.stat && response.stat === 'deny') {
        Modal.error({
          title: '登录超时，需要立刻跳转到登录页吗？',
          content: <a href={location.href} target="_blank">点此跳转登录页</a>,
        });

        this.setState({ quanPicList: [] });
        this.props.form.setFieldsValue({
          'deliveryChannelImgFileId': '',
        });

        return;
      }
    }

    this.setState({ quanPicList: list });
    this.props.form.setFieldsValue({
      'deliveryChannelImgFileId': fileId,
    });
  },

  render() {
    const self = this;

    const { getFieldProps, getFieldError } = this.props.form;
    const { initData, layout, roleType, actionType } = this.props;
    const toggleClassName = this.state.toggleClassName;
    const { pay, discount } = this.state.checkBox;
    const isEdit = actionType === 'edit';
    const isMerchant = roleType === 'merchant';

    if (isEdit && !initData[inputCouponName]) {
      return null;
    }

    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }

    // 销售中台账户登录，需要获取merchantId，图片上传中增加op_merchant_id参数
    const merchant = document.getElementById('J_crmhome_merchantId');

    const quanPicProps = {
      name: 'Filedata',
      // action: 'http://crmhome.stable.alipay.net/goods/itempromo/uploadPicture.json',
      action: '/goods/itempromo/uploadPicture.json',
      listType: 'picture-card',
      onChange: this.uploadQuanPic,
      fileList: this.state.quanPicList,
      data: {
        op_merchant_id: merchant && merchant.value ? merchant.value : null,
      },
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
      onPreview(file) {
        self.setState({
          previewImage: file.url,
          previewVisible: true,
        });
      },
    };

    // checkbox拉成array并创建表单props
    const checkboxProps = {};
    const checkBoxArr = [];
    forIn(this.state.checkBox, (item, key) => {
      checkBoxArr.push(item);

      checkboxProps[item.name] = {
        kid: key,
        checked: item.checked,
        onChange: self.onChangeCheckbox,
        value: item.name,
      };
    });

    return (
      <div>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancelPreview}>
          <img src={this.state.previewImage} style={{ maxWidth: '100%' }} />
        </Modal>

        <FormItem
          {...layout.checkbox}
          required
          label="投放渠道："
          help={getFieldError('deliveryChannels')}
          validateStatus={
          classnames({
            error: !!getFieldError('deliveryChannels'),
          })}>
          <p>活动创建后，将出现在支付宝以下位置 <a href="#" onClick={this.clickPreview} className={toggleClassName}>预览</a></p>

          {
            checkBoxArr.map((item) => {
              return <div key={item.name}><Checkbox disabled={isEdit && isMerchant} {...checkboxProps[item.name]} />{item.label}<br /></div>;
            })
          }
          <Input type="hidden" {...getFieldProps('deliveryChannels', {
            rules: [
              { required: true, type: 'array', message: '请选择投放渠道' },
            ],
          })} />
        </FormItem>
        <div className="kb-ticket-create-channel-extra">
        { pay.checked || discount.checked ?
          <Row>
            <Col span="17" offset="7">
              <FormItem
                {...layout.quan}
                required
                label="专属优惠推荐理由：">
                <Input
                  disabled={isEdit && isMerchant}
                  placeholder="为活动人群配置一句专属文案"
                  {...getFieldProps(inputCouponName, {
                    rules: [
                      { required: true, message: '请填写专属优惠推荐理由' },
                      { max: 20, message: '最多 20 个字符' },
                    ],
                    initialValue: initData[inputCouponName],
                  })} />
              </FormItem>
            </Col>
          </Row>
        : null}
        { discount.checked ?
          <div>
            <Row>
              <Col span="17" offset="7">
              {isEdit && isMerchant ?
                <FormItem
                  {...layout.quan}
                  required
                  label="专属优惠图片：">
                  <img src={initData.deliveryChannelImgUrl} style={{ maxWidth: 80, maxHeight: 80}} />
                </FormItem>
              :
                <FormItem
                  {...layout.quan}
                  required
                  label="专属优惠图片："
                  help="建议：请尽量选择和券内容相关的图片，不超过2M。格式：bmp, png, jpeg, jpg, gif。建议尺寸: 500px＊500px">
                  <Upload {...quanPicProps}>
                    <Icon type="plus" />
                    <div className="ant-upload-text">上传图片</div>
                  </Upload>
                </FormItem>
              }
              </Col>
            </Row>
            <Row>
              <Col span="17" offset="7">
                <FormItem
                  style={{ marginBottom: 0, marginLeft: 135 }}>
                  <Input type="hidden" {...getFieldProps(inputQuanUrlName, {
                    rules: [
                      {
                        required: true, message: '请上传图片',
                      },
                    ],
                    initialValue: initData.deliveryChannelImgFileId,
                  })} />
                </FormItem>
              </Col>
            </Row>
          </div>
        : null}
        </div>
        <Modal ref="modal" style={{top: modalTop}}
          visible={this.state.modalVisible} onCancel={this.closePreview}
          title="投放渠道预览"
          width="800"
          footer={[]}>
          <Row type="flex" justify="space-between">
            {
              checkBoxArr.map((item) => {
                if (item.checked) {
                  return <Col key={item.name} span="7">{item.label}<img width="100%" src={item.img}/></Col>;
                }
              })
            }
          </Row>
        </Modal>
      </div>
    );
  },
});

export default Channel;
