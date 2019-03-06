import React, {PropTypes} from 'react';
import {DatePicker, Input, Breadcrumb, message, Select, Button, Form, Icon, Row, Col, TreeSelect, Checkbox, Cascader, InputNumber} from 'antd';
import ajax from 'Utility/ajax';
import classnames from 'classnames';
import RecordModal from '../common/RecordModal';
import { Upload} from '../../../common/Upload';
import {visitWayOption, stuffTypeList, transformLCV} from '../common/RecordSelect';
import {queryPurposeOptionData} from '../common/queryVisitPurpose';
import VisitSelect from '../common/VisitSelect';
import moment from 'moment';
import { limitUploadSize } from '../common/Utils';
// import queryIsPosSale from '../../../common/queryIsPosSale';

const FormItem = Form.Item;

const RecordEditorAdd = React.createClass({

  propTypes: {
    params: PropTypes.object,
    show: PropTypes.bool,
    form: PropTypes.object,
    stuffCheckId: PropTypes.string,
  },
  getInitialState() {
    return {
      visible: false,
      data: [],
      contacts: [],
      customerId: '',
      number: 0,
      stuffTypeBox: false,
      buyPosPurpose: false,
      // buyShopPosCheck: false,
      otherDesc: false,
      loading: false,
      customerType: this.props.params.type,
      showMeituan: false,
      showWechant: false,
      showPayment: false,
      // isPosSale: false, // 是否是 POS 销售
    };
  },
  componentDidMount() {
    // queryIsPosSale().then(isPosSale => this.setState({ isPosSale }));
    queryPurposeOptionData().then(visitPurpose => this.setState({ visitPurpose }));
  },
  onChangeObj(value) {
    ajax({
      url: '/sale/visitrecord/queryVisitContacts.json',
      data: {customerId: value},
      success: (data) => {
        if (data.data.length === 0) {
          message.error('请新增拜访对象');
        }
        this.setState({
          contacts: transformLCV(data.data),
        });
      },
      error: () => {
      },
    });
    this.setState({customerId: value});
    this.props.form.setFieldsValue({visitContacts: ''});
  },
  onChangeTextArea(rule, value, callback) {
    const values = value || '';
    this.setState({
      number: Number(values.length),
    });
    callback();
  },
  onChangeTree(list) {
    this.setState({
      stuffTypeBox: list.indexOf('LAYING_MATERIAL') !== -1,
      buyPosPurpose: list.indexOf('POS_SALE') !== -1, //  含有POS销售拜访目的
      // buyShopPosCheck: list.indexOf('SHOP_POS_CHECK') !== -1, // 含有门店及POS验收拜访目的
      otherDesc: list.indexOf('OTHER') !== -1,
    });
  },
  onMeituanChange(e) {
    e.stopPropagation();
    this.setState({showMeituan: !this.state.showMeituan});
  },
  onWechatChange(e) {
    e.stopPropagation();
    this.setState({showWechant: !this.state.showWechant});
  },
  onPaymentChange(e) {
    e.stopPropagation();
    this.setState({showPayment: !this.state.showPayment});
  },
  resultModal(e) {
    if (e) {
      this.onChangeObj(this.state.customerId);
    }
  },
  saveRecord(e) {
    e.preventDefault();
    const visitComptitorsInfo = {};
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      if (values) {
        values.visitTime = moment(values.visitTime).format('YYYY-MM-DD HH:mm');
        const purposeHtml = this.eachMap(values.visitPurpose, '|');
        const stuffTypeHtml = this.eachMap(values.stuffType, ',');
        visitComptitorsInfo.competitors = {};
        let imgLIst = '';
        let weixinImgList = '';
        let xinmeidaImgList = '';
        let juhehzifuImgList = '';
        (values.picture).map((p, index) => {
          if ( index === 0) {
            imgLIst += p.response.id;
          } else {
            imgLIst += ',' + p.response.id;
          }
        });
        if ( values.wechatPicture ) {
          (values.wechatPicture).map((p, index) => {
            if ( index === 0) {
              weixinImgList += p.response.id;
            } else {
              weixinImgList += ',' + p.response.id;
            }
          });
        }

        if ( values.meituanPicture ) {
          (values.meituanPicture).map((p, index) => {
            if ( index === 0) {
              xinmeidaImgList += p.response.id;
            } else {
              xinmeidaImgList += ',' + p.response.id;
            }
          });
        }
        if ( values.paymentPicture ) {
          (values.paymentPicture).map((p, index) => {
            if ( index === 0) {
              juhehzifuImgList += p.response.id;
            } else {
              juhehzifuImgList += ',' + p.response.id;
            }
          });
        }
        /* if (values.inspection === false) {
          values.inspection = 'F';
        } else {
          values.inspection = 'T';
        } */
        values.visitContacts = values.visitContacts[1];
        values.stuffType = stuffTypeHtml;
        values.visitPurpose = purposeHtml;
        values.visitPics = imgLIst;
        delete values.picture;
        delete values.wechatPicture;
        delete values.meituanPicture;
        delete values.paymentPicture;
        values.customerType = this.state.customerType;
        if (this.state.showWechant) {
          visitComptitorsInfo.competitors.weixin = {
            pictures: weixinImgList,
            tradeRate: values.WECHAT.toString(),
          };
        }
        if (this.state.showMeituan) {
          visitComptitorsInfo.competitors.xinmeida = {
            pictures: xinmeidaImgList,
            tradeRate: values.MEI.toString(),
          };
        }
        if (this.state.showPayment) {
          visitComptitorsInfo.competitors.juhezhifu = {
            pictures: juhehzifuImgList,
            tradeRate: values.PAYMENT.toString(),
          };
        }
        values.visitCompetitorsInfo = JSON.stringify(visitComptitorsInfo);
      }
      // values.isPosShop = this.props.params.isPosSale === 'true' ? 1 : 0;
      this.handleSubmit(values);
    });
  },
  handleSubmit(params) {
    this.setState({loading: true});
    ajax({
      url: `${window.APP.kbservcenterUrl}/sale/visitrecord/createVisitRecord.json`,
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          message.success('新增成功', 2);
          this.setState({loading: false});
          setTimeout(()=> {
            let url;
            if (this.props.params.type === 'SHOP') {
              url = '#/record/shop';
            } else if (this.props.params.type === 'PRIVATE_LEADS') {
              url = '#/record/leads';
            } else if (this.props.params.type === 'POS_LEADS') {
              url = '#/record/pos_leads';
            } else {
              url = '#/record';
            }
            location.hash = url;
          }, 2000);
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
            this.setState({loading: false});
          }
        }
      },
      error: (result) => {
        if (result.resultMsg) {
          message.error(result.resultMsg, 3);
          this.setState({loading: false});
        }
      },
    });
  },
  resultCustomerType(type) {
    this.setState({customerType: type});
  },
  displayRender(label) {
    return label.join('-');
  },
  eachMap(array, type) {
    let arrayHtml = '';
    let mark = '|';
    if (mark !== type) {
      mark = ',';
    }
    if (array) {
      array.map((p, index) => {
        if ( index === 0) {
          arrayHtml += p;
        } else {
          arrayHtml += mark + p;
        }
      });
    }
    return arrayHtml;
  },
  normalizeUploadValue(info, limit) {
    if (Array.isArray(info)) {
      return info;
    }
    if (!info) {
      return [];
    }
    let fileList = info.fileList;
    const event = info.event;
    if (limit) {
      if (fileList.length > limit) {
        fileList = fileList.slice(-limit);
      }
    }
    fileList = fileList.slice(0);


    // 2. 读取远程路径并显示链接
    fileList = fileList.map((file) => {
      if (typeof file.response === 'string') {
        file.response = JSON.parse(file.response);
      }
      if (file.response) {
        // 组件会将 file.url 作为链接进行展示
        file.url = file.response.url;
        file.id = file.response.id;
      }
      return file;
    });

    // 3. 按照服务器返回信息筛选成功上传的文件
    if (info.file.length === undefined) {
      if (event !== undefined ) {
        fileList = fileList.filter((file) => {
          if (file.type && file.type.indexOf('image') !== -1 && file.size > 20 * 1024 * 1024) {
            message.error('图片最大20M');
            return false;
          }
          return true;
        });
      } else {
        fileList = fileList.filter((file) => {
          if (file.response) {
            if (file.response.buserviceErrorCode === 'USER_NOT_LOGIN') {
              message.error('请重新登录');
            }
            return file.response.status === 'success' || file.response.status === 'succeed';
          }
          return true;
        });
      }
    }
    return fileList;
  },
  render() {
    const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
    const {contacts, number, visitPurpose} = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
    };
    const propsPic = {
      beforeUpload: (file) => {
        const type = file.name.substring(file.name.lastIndexOf('.') + 1);
        if (['jpg', 'jpeg', 'png', 'JPG'].indexOf(type) === -1) {
          message.error('文件格式错误');
          return false;
        }
        return true;
      },
    };

    const tProps = {
      treeData: visitPurpose && visitPurpose.map((group) => {
        return {
          ...group,
          children: group.children && group.children.filter(child => {
            // FIXME 7.12 临时去除门店POS验收的拜访目的选择（等待后续选项OK后开启下面注释露出）
            // if (this.state.customerType === 'SHOP') {
            //   // 仅在拜访门店的时候露出 门店POS验收 目的
            //   return true;
            // }
            return child.value !== 'SHOP_POS_CHECK';
          }),
        };
      }),
      multiple: true,
      treeCheckable: true,
      showCheckedStrategy: TreeSelect.SHOW_CHILD,
      searchPlaceholder: '请选择',
      style: {
        width: '75%',
      },
    };
    const sProps = {
      treeData: stuffTypeList,
      multiple: true,
      treeCheckable: true,
      searchPlaceholder: '请选择',
      style: {
        width: '75%',
      },
    };
    const disabledDate = (current) => {
      if (!current) {
        message.error('请选择日期');
        return true; // 直接选择月份或年份值没带过来确定会有问题
      }
      return current.getTime() > Date.now();
    };
    return (<div>
      <div className="app-detail-header">
        <Breadcrumb separator=">">
          <Breadcrumb.Item href="#/record">拜访小记</Breadcrumb.Item>
          <Breadcrumb.Item>新增拜访小记</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="app-detail-content-padding" style={{position: 'relative'}}>
        <Form horizontal>
              <Row>
                <Col>
                  <FormItem
                    {...formItemLayout}
                    label="拜访时间：">
                    <DatePicker disabledDate={disabledDate} showTime format="yyyy-MM-dd HH:mm" style={{ width: '75%' }} {...getFieldProps('visitTime', {
                      rules: [{
                        required: true,
                        type: 'object',
                        message: '请选择拜访时间'},
                      ],
                    })}/>
                  </FormItem>
                </Col>
              </Row>
              { this.props.params.type === 'BRAND' ? <Row>
                <Col>
                  <FormItem
                    {...formItemLayout}
                    label="拜访品牌：">
                    <VisitSelect customerName="" isPosSale={this.props.params.isPosSale} type={this.props.params.type} style={{ width: '75%' }} placeholder="请选择" {...getFieldProps('customerId', {
                      onChange: this.onChangeObj,
                      rules: [{
                        required: true,
                        type: 'string',
                        message: '请选择拜访品牌'},
                      ],
                    })}/>
                  </FormItem>
                </Col>
              </Row> :
              <Row>
                <Col>
                  <FormItem
                    {...formItemLayout}
                    label="拜访门店：">
                    <VisitSelect customerName="" isPosSale={this.props.params.isPosSale} type={this.props.params.type} placeholder="请选择" result={this.resultCustomerType} {...getFieldProps('customerId', {
                      onChange: this.onChangeObj,
                      rules: [{
                        required: true,
                        type: 'string',
                        message: '请选择拜访门店'},
                      ],
                    })}/>
                  </FormItem>
                </Col>
              </Row> }
              <Row>
                <Col>
                  <FormItem
                    required
                    {...formItemLayout}
                    validateStatus={classnames({error: !!getFieldError('visitContacts')})}
                    help={getFieldError('visitContacts') || '' }
                    label="拜访对象：">
                      <Cascader
                        disabled={ contacts.length === 0 || !getFieldValue('customerId')}
                        options={contacts}
                        style={{ width: '75%' }}
                        placeholder="请选择拜访对象"
                        displayRender={this.displayRender}
                        {...getFieldProps('visitContacts', {
                          rules: [{
                            required: true,
                            message: '请选择拜访对象',
                            type: 'array',
                          }],
                        })}
                      />
                      <RecordModal customerId={this.state.customerId} result={this.resultModal}/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem
                    {...formItemLayout}
                    validateStatus={classnames({error: !!getFieldError('visitPurpose')})}
                    help={getFieldError('visitPurpose') || '' }
                    label="拜访目的：">
                      <TreeSelect {...tProps} {...getFieldProps('visitPurpose', {
                        onChange: this.onChangeTree,
                        rules: [{
                          required: true,
                          message: '请选择拜访目的',
                          type: 'array',
                        }],
                      })}/>
                  </FormItem>
                </Col>
              </Row>
              {
                this.state.stuffTypeBox && <Row>
                  <Col>
                    <FormItem
                      {...formItemLayout}
                      label="物料属性：">
                        <TreeSelect {...sProps} placeholder="请选择" {...getFieldProps('stuffType', {
                          rules: [{
                            required: true,
                            message: '请选择物料属性',
                            type: 'array',
                          }],
                        })}/>
                    </FormItem>
                  </Col>
                </Row>
              }
              {
                this.state.buyPosPurpose && <Row>
                  <Col>
                    <FormItem {...formItemLayout} label="购买POS意愿：" >
                      <Select placeholder="请选择"
                        {...getFieldProps('buyPosWill', {
                          rules: [{
                            required: true,
                            message: '请选择购买POS意愿',
                          }],
                        })}
                        style={{ width: '75%' }}>
                        <Option key="1">有</Option>
                        <Option key="0">没有</Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
              }
              {
                this.state.otherDesc && <Row>
                  <Col>
                    <FormItem
                      {...formItemLayout}
                      label="其他内容：">
                        <Input placeholder="最多可填写6个字" style={{ width: '75%'}} {...getFieldProps('otherDesc', {
                          rules: [{
                            required: true,
                            message: '请填写其他拜访目的',
                            type: 'string',
                          }, {
                            max: 6,
                            message: '最大长度为6个字符',
                          }],
                        })}/>
                    </FormItem>
                  </Col>
                </Row>
              }
              <Row>
                <Col>
                  <FormItem
                    {...formItemLayout}
                    label="拜访方式：" >
                    <Select
                      placeholder="请选择"
                      {...getFieldProps('visitWay', {
                        rules: [{
                          required: true,
                          message: '请选择拜访方式',
                        }],
                      })}
                    style={{ width: '75%' }}>
                      {visitWayOption}
                    </Select>
                  </FormItem>
                </Col>
              </Row>
            { this.props.params.type !== 'BRAND' &&
              <Row>
                <Col>
                  <FormItem
                    {...formItemLayout}
                    label="竞对信息："
                    >
                    <div style={{borderBottom: '1px solid #f0f0f0', marginBottom: '12px', width: '75%'}}>
                      <Checkbox onChange={this.onMeituanChange} style={{marginBottom: '12px'}}>来自美团、大众点评</Checkbox>
                    </div>
                  { this.state.showMeituan &&
                    <div style={{ width: '75%'}}>
                    <FormItem
                    extra={<div className="ft-gray">请输入日交易占比，必填</div>}
                    >
                        <InputNumber {...getFieldProps('MEI', {
                          rules: [{
                            required: true,
                            message: '此处必填',
                          }, {
                            type: 'number',
                            max: 100,
                            message: '不大于100',
                          }],
                        })} />%
                    </FormItem>
                        <div style={{marginTop: '12px'}}>
                    <FormItem
                    className="isHas-success"
                    validateStatus={classnames({error: !!getFieldError('meituanPicture')})}>
                        <Upload
                          exampleList={[]}
                          {...getFieldProps('meituanPicture', {
                            valuePropName: 'fileList',
                            normalize: limitUploadSize,
                            rules: [{
                              type: 'array',
                            }, {
                              max: 5,
                              message: '不超过5张',
                              type: 'array',
                            }],
                          })} {...propsPic}>
                          <Icon type="plus" />
                          <div className="ant-upload-text">上传照片</div>
                        </Upload>
                    </FormItem>
                        </div>
                        <div style={{marginTop: 20}}>请上传现场竞对的物料，或大众点评、美团app里带有活动的当前门店页，最多5张</div>
                    </div>
                  }
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    wrapperCol={{span: 12, offset: 5}}
                    >
                    <div style={{borderBottom: '1px solid #f0f0f0', marginBottom: '12px', width: '75%'}}>
                      <Checkbox onChange={this.onWechatChange} style={{marginBottom: '12px'}}>来自微信</Checkbox>
                    </div>
                  { this.state.showWechant &&
                    <div style={{ width: '75%'}}>
                    <FormItem
                    extra={<div className="ft-gray">请输入日交易占比，必填</div>}>
                      <InputNumber {...getFieldProps('WECHAT', {
                        rules: [{
                          required: true,
                          message: '此处必填',
                        }, {
                          type: 'number',
                          max: 100,
                          message: '不大于100',
                        }],
                      })} />%
                    </FormItem>
                      <div style={{marginTop: '12px'}}>
                    <FormItem
                    className="isHas-success"
                    validateStatus={classnames({error: !!getFieldError('wechatPicture')})}>
                      <Upload
                        exampleList={[]}
                        {...getFieldProps('wechatPicture', {
                          valuePropName: 'fileList',
                          normalize: limitUploadSize,
                          rules: [{
                            type: 'array',
                          }, {
                            max: 5,
                            message: '不超过5张',
                            type: 'array',
                          }],
                        })} {...propsPic}>
                        <Icon type="plus" />
                        <div className="ant-upload-text">上传照片</div>
                      </Upload>
                    </FormItem>
                      </div>
                      <div style={{marginTop: 20}}>请上传现场竞对的物料，或大众点评、美团app里带有活动的当前门店页，最多5张</div>
                    </div>
                  }
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    wrapperCol={{span: 12, offset: 5}}
                    >
                    <div style={{borderBottom: '1px solid #f0f0f0', marginBottom: '12px', width: '75%'}}>
                      <Checkbox onChange={this.onPaymentChange} style={{marginBottom: '12px'}}>来自聚合支付(收银码等插件)</Checkbox>
                    </div>
                  { this.state.showPayment &&
                    <div style={{ width: '75%'}}>
                    <FormItem
                    extra={<div className="ft-gray">请输入日交易占比，必填</div>}>
                    <InputNumber {...getFieldProps('PAYMENT', {
                      rules: [{
                        required: true,
                        message: '此处必填',
                      }, {
                        type: 'number',
                        max: 100,
                        message: '不大于100',
                      }],
                    })} />%
                    </FormItem>
                        <div style={{marginTop: '12px'}}>
                      <FormItem
                        className="isHas-success"
                        validateStatus={classnames({error: !!getFieldError('paymentPicture')})}>
                        <Upload
                          exampleList={[]}
                          {...getFieldProps('paymentPicture', {
                            valuePropName: 'fileList',
                            normalize: limitUploadSize,
                            rules: [{
                              type: 'array',
                            }, {
                              max: 5,
                              message: '不超过5张',
                              type: 'array',
                            }],
                          })} {...propsPic}>
                          <Icon type="plus" />
                          <div className="ant-upload-text">上传照片</div>
                        </Upload>
                      </FormItem>
                        </div>
                        <div style={{marginTop: 20}}>请上传现场竞对的物料，或大众点评、美团app里带有活动的当前门店页，最多5张</div>
                      </div>
                    }
                  </FormItem>
                </Col>
              </Row>
            }
              <Row>
                <Col>
                  <FormItem label= "现场照片："
                    className="isHas-success"
                    {...formItemLayout}
                    validateStatus={classnames({error: !!getFieldError('picture')})}
                    help={getFieldError('picture') || '最多可上传10个文件，支持图片格式 jpg、png(图片格式小于20M)'}>
                    <Upload
                      exampleList={[]}
                      {...getFieldProps('picture', {
                        valuePropName: 'fileList',
                        normalize: this.normalizeUploadValue,
                        rules: [{
                          required: this.state.stuffTypeBox,
                          type: 'array',
                          message: '请上传拜访照片',
                        }, {
                          max: 10,
                          message: '不超过10张',
                          type: 'array',
                        }],
                      })} {...propsPic}>
                      <Icon type="plus" />
                      <div className="ant-upload-text">上传照片</div>
                    </Upload>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem
                    required
                    {...formItemLayout}
                    validateStatus={classnames({error: !!getFieldError('visitDesc')})}
                    help={getFieldError('visitDesc') || '' }
                    label="拜访描述：">
                    <div ref="textareaDiv" style={{position: 'relative', width: '75%'}}>
                      <Input type="textarea" placeholder="请填写" style={{ width: '100%'}} {...getFieldProps('visitDesc', {
                        rules: [{
                          required: true,
                          message: '请填写拜访描述',
                          type: 'string',
                        }, {
                          max: 1000,
                          message: '最大长度为1000个字符',
                        }, this.onChangeTextArea],
                      })} rows="5"/>
                      <div style={{textAlign: 'right'}}>{number}/1000</div>
                    </div>
                  </FormItem>
                  </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem
                    wrapperCol={{ offset: 5, span: 12 }}
                  >
                    <p style={{lineHeight: '16px', color: '#999'}}>商户巡检：须确认商户是否正常经营、先上线下经营内容是否一致、当面付是否可正常使用；</p>
                    <p style={{lineHeight: '16px', color: '#999'}}>商户培训：须指导商户正确使用当面付，不得从事销赃、欺诈、套现、虚假交易等违法违规行为。</p>
                  </FormItem>
                  </Col>
              </Row>
              <Row>
                  <Col>
                    <FormItem
                      wrapperCol={{ span: 12, offset: 5 }} >
                      <Button type="primary" loading={this.state.loading} onClick={this.saveRecord}>保存</Button>
                      </FormItem>
                  </Col>
              </Row>
              </Form>
            </div>
    </div>);
  },
});
export default Form.create()(RecordEditorAdd);
