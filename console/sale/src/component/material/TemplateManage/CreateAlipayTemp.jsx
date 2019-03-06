import React, {PropTypes} from 'react';
import {Input, message, Select, Button, Form, Upload, Icon, Row, Col} from 'antd';
import ajax from 'Utility/ajax';
import {MaterialPropertiesMap} from '../common/MaterialLogMap';
import {format, toDate} from '../../../common/dateUtils';
import {appendOwnerUrlIfDev} from '../../../common/utils';
import './tempmanage.less';
const Option = Select.Option;
const FormItem = Form.Item;

const CreateAlipayTemp = React.createClass({
  propTypes: {
    show: PropTypes.bool,
    location: PropTypes.any,
    form: PropTypes.object,
    stuffCheckId: PropTypes.string,
    getCreateStatus: PropTypes.func,
    fromTab: PropTypes.string,
  },
  getInitialState() {
    return {
      show: false,
      showOutModel: false,
      isCreateModel: false,
      stuffTypeValue: '',
      materiaTypeValue: '',
      sizeLinkage: '',
      sizeValue: '',
      data: {},
      fileList: [],
      optionData: {},
      childata: {},
      fileIds: [],
      resourceIds: [],
    };
  },
  componentWillMount() {
    // 如果是复制操作则执行如下两个函数
    if (this.props.tempId) {
      // 获取物料设计图片信息
      this.getPicData();
      // 获取回填信息
      this.getTempInfo();
    }
  },
  // 获取物料设计图片信息
  getPicData() {
    const params = {
      mappingValue: 'kbasset.queryAttachFile',
      bizId: this.props.tempId,
      bizType: 'STUFF_TEMPLATE',
      domain: 'ALIPAY',
    };
    ajax({
      // url: appendOwnerUrlIfDev('/sale/asset/saleFileQuery.json'),
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          const resourceIds = [];
          const fileIds = [];
          result.data.map((key) => {
            const resourceIdObj = {};
            resourceIdObj.name = key.attaName;
            resourceIdObj.resourceIds = key.resourceId;
            resourceIds.push(resourceIdObj);
            fileIds.push(key.fileId);
          });
          this.setState({
            resourceIds: resourceIds,
            fileIds: fileIds,
          });
          // this.props.form.setFieldsValue({picture: resourceIds}); //此行代码可以修复复制操作上传图片旁边的红星消失的bug,如需要释放注释代码即可
        }
      },
    });
  },
  // 获取回填信息
  getTempInfo() {
    const params = {
      templateId: this.props.tempId,
      mappingValue: 'kbasset.detailQueryTemplate',
      domain: 'ALIPAY',
    };
    if (params) {
      ajax({
        // url: appendOwnerUrlIfDev('/sale/asset/stuffTemplateDetail.json'),
        url: appendOwnerUrlIfDev('/proxy.json'),
        data: params,
        method: 'get',
        type: 'json',
        success: (result) => {
          if (result.status === 'succeed') {
            const data = result.data;
            data.activityTime = [];
            if (data.startTime || data.endTime) {
              this.props.form.setFieldsValue({radioTime: 'male'});
              data.startTime = toDate(format(new Date(data.startTime)));
              data.endTime = toDate(format(new Date(data.endTime)));
              data.activityTime.push(data.startTime, data.endTime);
            }
            if (data.sizeName) {
              data.sizeID = data.size;
              data.size = data.sizeName;
            }
            this.props.form.setFieldsValue(data);
            this.setState({data: data});
            const bizSource = data.bizSource ? data.bizSource : '';
            this.handSelect(bizSource);
          }
        },
      });
    }
  },
  // 业务来源改变时物料类型的联动 分isv 和 转账码
  getSelectData(value) {
    const params = {
      // stuffType: value,
      mappingValue: 'kbasset.queryStuffAttribute',
    };
    if (value === 'ISV_STUFF') {
      params.domain = 'ALIPAY';
    }
    if (value === 'TRANSFER_CODE') {
      params.domain = 'MERCHANT';
    }
    ajax({
      // url: appendOwnerUrlIfDev('/sale/asset/stuffTemplateAttribute.json'),
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          const obj1 = {};
          const obj2 = {};
          result.data.map((key) => {
            const obj = {};
            obj2[key.stuffAttrId] = key.stuffAttrName;
            key.size.map((k) => {
              obj[k.code] = k.name;
              obj1[key.stuffAttrId] = obj;
            });
          });
          this.setState({
            optionData: obj2,
            childata: obj1,
          });
        }
      },
    });
  },

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      if (values.activityTime) {
        values.startTime = format(values.activityTime[0]);
        values.endTime = format(values.activityTime[1]);
      }
      delete values.activityTime;
      delete values.radioTime;
      delete values.picture;
      const parames = this.props.tempId;
    //  console.log( values);
      if (parames && values.size === this.state.data.sizeName) {
        values.size = this.state.data.sizeID;
      }
      if (this.state.materiaTypeValue) {
        values.stuffAttrName = this.state.materiaTypeValue;
      } else {
        values.stuffAttrName = this.state.data.stuffAttrName;
      }
      if (this.state.sizeValue) {
        values.sizeName = this.state.sizeValue;
      } else {
        values.sizeName = this.state.data.sizeName;
      }
    //  console.log(values);
      const resourceIds = [];
      for (let i = 0; i < this.state.fileList.length; i++) {
        resourceIds.push(this.state.fileList[i].response.fileId);
      }
      values.fileIds = resourceIds;
      for (const key in values) {
        if (values[key] === undefined || values[key] === '') {
          delete values[key];
        }
      }
      if (this.state.sizeLinkage === '999000') {
        values.size = '999000';
        values.sizeName = '其他';
        values.stuffAttrId = '999000';
        values.stuffAttrName = '其他';
      }
      // 判断this.state.fileIds 是否存在  存在要传copyFileIds
      if (this.state.fileIds.length > 0) {
        values.copyFileIds = this.state.fileIds;
        this.copyTempSubmit(values);
      } else {
        this.newTempSubmit(values);
      }
    });
  },
  newTempSubmit(params) {
    params.mappingValue = 'kbasset.addStuffTemplate';
    // params.domain = 'ALIPAY';
    ajax({
      // url: appendOwnerUrlIfDev('/sale/asset/stuffTemplateAdd.json'),
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          // self.isCreateSuccess = 'hidenModel';
          this.props.getCreateStatus('hidenModel');
          message.success('创建成功', 3);
          // location.hash = '#/material/TemplateManage/alipay';
          if (this.props.fromTab === 'koubei') {
            location.hash = '#/material/TemplateManage/koubei';
          } else {
            location.hash = '#/material/TemplateManage/alipay';
          }
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
      error: (result) => {
        if (result.resultMsg) {
          message.error(result.resultMsg, 3);
        }
      },
    });
  },
  copyTempSubmit(params) {
    // const self = this;
    params.mappingValue = 'kbasset.copyTemplate';
    // params.domain = 'ALIPAY';
    ajax({
      // url: appendOwnerUrlIfDev('/sale/asset/stuffTemplateCopy.json'),
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          message.success('创建成功', 3);
          // self.isCreateSuccess = 'hidenModel';
          this.props.getCreateStatus('hidenModel');
          location.hash = '#/material/TemplateManage/alipay';
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
      error: (result) => {
        if (result.resultMsg) {
          message.error(result.resultMsg, 3);
        }
      },
    });
  },
  // 如果是回显走这里
  handSelect(value, option) {
    if (!this.state.data) {
      this.props.form.setFieldsValue({stuffAttrId: ''});
      this.props.form.setFieldsValue({size: ''});
    }
    this.setState(
      {show: value}
    );

    // 业务来源改变时物料类型的联动
    this.getSelectData(value);

    if (option) {
      this.setState(
        {stuffTypeValue: option.props.children}
      );
    }
  },
  // 新建模板逻辑走这里
  newHandSelect(value, option) {
    this.props.form.setFieldsValue({stuffAttrId: ''});
    this.props.form.setFieldsValue({size: ''});
    this.setState(
      {show: value}
    );

    // 业务来源改变时物料类型的联动
    this.getSelectData(value);

    if (option) {
      this.setState(
        {stuffTypeValue: option.props.children}
      );
    }
  },

  // 物料类型获取Select的name
  linkageSelect(value, option) {
    if (value === '999000') {
      this.props.form.setFieldsValue({'size': '其他'});
    } else {
      this.props.form.setFieldsValue({'size': ''});
    }
    if (option) {
      this.setState(
        {sizeLinkage: value, materiaTypeValue: option.props.children}
      );
    }
  },
  // 获取规格尺寸select的name
  selectsizeValue(value, option) {
    if (option) {
      this.setState({
        sizeValue: option.props.children,
      });
    }
  },

  // 遍历option
  eachOption(obj) {
    const options = [];
    for (const val in obj) {
      if (obj.hasOwnProperty) {
        options.push(<Option key={val} value={val}>{obj[val]}</Option>);
      }
    }
    return options;
  },
  normalizeUploadValue(info) {
    // this.info = info; //为了支持不能上传同名文件用的,如果需要可以直接释放使用
    if (Array.isArray(info)) {
      return info;
    }
    if (!info) {
      return [];
    }
    let fileList = info.fileList;

    if (fileList.length > 10) {
      message.warn('上传最多10个');
      return fileList.slice(0, 10);
    }

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

    // 4. 按照服务器返回信息筛选成功上传的文件 大小限制
    fileList = fileList.filter((file) => {
      if (file.response) {
        if (file.response.buserviceErrorCode === 'USER_NOT_LOGIN') {
          message.error('请重新登录');
          return false;
        }
        if (file.response && file.response.exceptionCode) {
          message.error('上传失败');
          return false;
        }
        if (file.response.resultMsg) {
          message.error(file.response.resultMsg);
          return false;
        }
        return file.response.status === 'succeed';
      }
      if (file.type && file.type.indexOf('image') !== -1 && file.size > 20 * 1024 * 1024) {
        message.error('图片最大20M');
        return false;
      }

      if (file.type && file.type.indexOf('image') === -1 && file.size > 500 * 1024 * 1024) {
        message.error('文件最大500M');
        return false;
      }

      return true;
    });
    this.setState({
      fileList,
    });
    return fileList;
  },

  deleteImg(ids) {
    const fileIds = this.state.fileIds;
    const resourceIds = this.state.resourceIds;
    resourceIds.map((key, index) => {
      if (key.resourceIds === ids) {
        delete resourceIds[index];
      }
    });
    const fileindex = fileIds.indexOf(ids);
    fileIds.splice(fileindex, 1);
    this.setState({resourceIds, fileIds});
  },

  /*eslint-disable */
  render() {
    /*eslint-enable */
    const {getFieldProps, getFieldValue, getFieldError} = this.props.form;
    const childrenOption = this.state.childata;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
    };
    const propsPic = {
      action: appendOwnerUrlIfDev('/sale/asset/saleFileUpload.json'),
      multiple: true,
      beforeUpload: (file) => {
        // 这段代码是为了支持不能上传同名文件的,如果需要这段逻辑可以把注释代码释放即可
        // const items = this.info || [];
        // for (let i = 0; i < items.length; i++) {
        //   if (items[i].name === file.name) {
        //     message.error('不能上传同名的文件');
        //     return false;
        //   }
        // }
        const type = file.name.substring(file.name.lastIndexOf('.') + 1);
        if (['jpg', 'jpeg', 'png', 'psd', 'ai', 'eps', 'cdr'].indexOf(type) === -1) {
          message.error('文件格式错误');
          return false;
        }
        return true;
      },
    };
    const TipCopy = {
      BASIC: '如: 导视购物-卡通版-小心地滑',
      ACTIVITY: '如: 3月浙江大区轻餐大促海报',
      ACTUAL: '如: 围裙',
    };
    const TipCopyhelp = {
      BASIC: '模版名称＝物料作用－模版风格－应用场景',
      ACTIVITY: '模版名称＝活动名称(活动时间+活动范围+使用场景)+物料类型',
      ACTUAL: '模版名称=物料类型',
    };

    return (<div>
      <Form horizontal>
        <Row>
          <Col>
            <FormItem
              {...formItemLayout}
              label="业务来源：">
              <Select {...getFieldProps('bizSource', {
                rules: [{
                  required: true,
                  message: '请选择业务来源'},
                ],
              })}
              style={{ width: '100%' }}
              placeholder="请选择"
              onSelect={this.newHandSelect}>
                <Option key= "ISV_STUFF">ISV物料</Option>
                <Option key= "TRANSFER_CODE">支付宝转账码</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              {...formItemLayout}
              label="物料属性：">
              <Select {...getFieldProps('stuffType', {
                rules: [{
                  required: true,
                  message: '请选择物料属性'},
                ],
              })}
              style={{ width: '100%' }}
              placeholder="请选择物料属性">
                <Option value="BASIC">{MaterialPropertiesMap.BASIC}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              required
              help={getFieldError('name') || TipCopyhelp[getFieldValue('stuffType')]}
              {...formItemLayout}
              label="模板名称：">
              <Input {...getFieldProps('name', {
                rules: [{
                  required: true,
                  message: '请输入模板名称',
                }, {
                  max: 40,
                  message: '最多输入40个字符',
                }],
              })}
              placeholder={getFieldValue('stuffType') ? TipCopy[getFieldValue('stuffType')] : '请输入模板名称'}/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              {...formItemLayout}
              label="物料类型：">
              <Select
                notFoundContent="无选项"
                {...getFieldProps('stuffAttrId', {
                  rules: [{
                    required: true,
                    message: '请选择物料类型',
                  }],
                })}
              placeholder="请选择物料类型"
              style={{ width: '100%' }}
              onSelect={this.linkageSelect}>
              {this.eachOption(this.state.optionData)}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              {...formItemLayout}
              label="规格尺寸：" >
              <Select
                notFoundContent="无选项"
                onSelect={this.selectsizeValue}
                {...getFieldProps('size', {
                  rules: [{
                    required: true,
                    message: '请选择您的规格',
                  }],
                })}
              placeholder="规格尺寸"
              style={{ width: '100%' }}
              disabled={this.state.show === '999000' ? true : false}>
              {this.eachOption(childrenOption[getFieldValue('stuffAttrId')])}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            {getFieldValue('stuffAttrId') === '999000' ?
              (<FormItem label= "物料设计图："
              {...formItemLayout}>
                <div>无</div>
            </FormItem>) :
            (<FormItem label= "物料设计图："
              className="isHas-success"
              {...formItemLayout}
              help={getFieldError('picture') || '最多可上传10个文件，支持图片格式 jpg、png, 源文件格式AI、EPS、PSD、CDR (图片格式小于20M,源文件格式小于500M)'}>
              <Upload
                withCredentials
                {...getFieldProps('picture', {
                  valuePropName: 'fileList',
                  normalize: this.normalizeUploadValue,
                  rules: [{
                    required: this.state.fileIds.length > 0 ? false : true,
                    message: '请至少上传一个文件',
                    type: 'array',
                  }, {
                    max: 10,
                    message: '不超过10张',
                    type: 'array',
                  }],
                })} {...propsPic}>
                <Button type="ghost">
                  <Icon type="upload" /> 点击上传
                </Button>
              </Upload>
            </FormItem>)}
          </Col>
        </Row>
        <Row>
          <Col offset="5" span="12" style={{marginBottom: 10}}>
            {this.state.resourceIds &&
              this.state.resourceIds.map((key, index) => {
                return (<div key={index} className="ant-upload-list-item ant-upload-list-item-done">
                        <div className="ant-upload-list-item-info">
                          <i className="anticon anticon-paper-clip"></i>
                          <a href={appendOwnerUrlIfDev('/sale/asset/saleFileDownload.resource?resourceId=' + encodeURIComponent(key.resourceIds) + '&name=' + encodeURIComponent(key.name))} target="_blank" className="ant-upload-list-item-name">{key.name}</a>
                          <i onClick={this.deleteImg.bind(this, key.resourceIds)} className=" anticon anticon-cross"></i>
                        </div>
                      </div>);
              })
            }
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              {...formItemLayout}
              label="模板说明：">
              <Input type="textarea" placeholder="模板说明(200字符以内)" {...getFieldProps('memo', {
                rules: [{
                  max: 200,
                  message: '最大长度为200个字符',
                }],
              })} />
            </FormItem>
            </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              {...formItemLayout}
              label="模板别名：">
              <Input {...getFieldProps('nickName', {
                rules: [{
                  max: 40,
                  message: '最多输入40个字符',
                }],
              })}
              placeholder="请输入模板别名,最多40个字符"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              wrapperCol={{ span: 12, offset: 5 }} >
              <Button type="primary" onClick={this.handleSubmit}>确定创建</Button>
              </FormItem>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});
export default Form.create()(CreateAlipayTemp);
