import React, {PropTypes} from 'react';
import {DatePicker, Input, message, Select, Button, Form, Upload, Icon, Radio, Row, Col} from 'antd';
import ajax from 'Utility/ajax';
import {MaterialPropertiesMap} from '../common/MaterialLogMap';
import {format, toDate} from '../../../common/dateUtils';
import {appendOwnerUrlIfDev} from '../../../common/utils';
import './tempmanage.less';
const Option = Select.Option;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

const CreateKoubeiTemp = React.createClass({
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
      StuffTypeOptions: [], // 用于存放物料属性的下拉选
      expression: '', // 提交验收图片数量
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

  // 新建模板逻辑走这里 当选择业务来源的时候联动物料属性 即选择我口碑码的时候只出现基础物料
  onSelectBizSource(value) {
    // 当物料来源改变是重置物料属性的值
    this.props.form.resetFields(['stuffType']);
    // 当物料来源改变是重置物料类型和规格尺寸的值
    this.props.form.resetFields(['stuffAttrId']);
    this.props.form.resetFields(['size']);
    // 业务来源与物料类型联动
    this.getSelectData(value);

    const TmpOptions = [];
    if (value === 'KOUBEI_STUFF') {
      TmpOptions.push(<Option value="ACTIVITY_CODEMATERIAL">{MaterialPropertiesMap.ACTIVITY_CODEMATERIAL}</Option>);
      TmpOptions.push(<Option value="BASIC">{MaterialPropertiesMap.BASIC}</Option>);
      TmpOptions.push(<Option value="ACTIVITY">{MaterialPropertiesMap.ACTIVITY}</Option>);
      TmpOptions.push(<Option value="ACTUAL">{MaterialPropertiesMap.ACTUAL}</Option>);
    }
    if (value === 'KOUBEI_CODE') {
      TmpOptions.push(<Option value="BASIC">{MaterialPropertiesMap.BASIC}</Option>);
    }
    this.setState({
      StuffTypeOptions: TmpOptions,
    });
  },
  // 获取物料设计图片信息
  getPicData() {
    const params = {
      mappingValue: 'kbasset.queryAttachFile',
      bizId: this.props.tempId,
      bizType: 'STUFF_TEMPLATE',
      domain: 'KOUBEI',
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
      domain: 'KOUBEI',
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
            if (data.ext) {
              data.expression = data.ext.expression;
              data.picNum = data.ext.picNum;
            }
            if (data.gmtStuffStart || data.gmtStuffEnd) {
              data.materialTime = [toDate(format(new Date(data.gmtStuffStart))), toDate(format(new Date(data.gmtStuffEnd)))];
            }
            this.props.form.setFieldsValue(data);
            this.setState({data: data});
            const bizSource = data.bizSource ? data.bizSource : '';
            this.backUpSelect(bizSource);
            console.log('setFieldsValue:', data);
            // const stuffType = data.stuffType ? data.stuffType : '';
            // this.handSelect(stuffType);
          }
        },
      });
    }
  },
  // 物料属性改变时物料类型的联动 分口碑和口碑吗
  getSelectData(value) {
    let tmpStr = '';
    if (value === 'KOUBEI_STUFF') {
      tmpStr = 'KOUBEI';
    } else if (value === 'KOUBEI_CODE') {
      tmpStr = 'KOUBEI_CODE';
    }
    const params = {
      // stuffType: value,
      mappingValue: 'kbasset.queryStuffAttribute',
      domain: tmpStr,
    };
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

  // 通过radio 判断创建是支付宝还是口碑模板
  getShowDom(e) {
    e.preventDefault();
    // 当选择不同的物理归属需要初始化一下
    this.props.form.resetFields();
    // 清空物料类型数据
    this.setState({
      optionData: {},
      fileIds: [],
      resourceIds: [],
    });
  },

  // 如果是回显走这里
  backUpSelect(value) {
    if (!this.state.data) {
      this.props.form.setFieldsValue({stuffAttrId: ''});
      this.props.form.setFieldsValue({size: ''});
    }
    this.setState(
      {show: value}
    );
    // 业务来源改变时物料类型的联动
    this.getSelectData(value);
    const TmpOptions = [];
    if (value === 'KOUBEI_STUFF') {
      TmpOptions.push(<Option value="BASIC">{MaterialPropertiesMap.BASIC}</Option>);
      TmpOptions.push(<Option value="ACTIVITY">{MaterialPropertiesMap.ACTIVITY}</Option>);
      TmpOptions.push(<Option value="ACTUAL">{MaterialPropertiesMap.ACTUAL}</Option>);
    }
    if (value === 'KOUBEI_CODE') {
      TmpOptions.push(<Option value="BASIC">{MaterialPropertiesMap.BASIC}</Option>);
    }
    this.setState({
      StuffTypeOptions: TmpOptions,
    });
  },

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      console.log('values:', values);
      if (!!errors) {
        return;
      }
      if (values.activityTime) {
        values.startTime = format(values.activityTime[0]);
        values.endTime = format(values.activityTime[1]);
      }
      if (values.stuffType === 'ACTIVITY' && values.materialTime && values.materialTime.length > 0) {
        values.gmtStuffStart = format(values.materialTime[0]);
        values.gmtStuffEnd = format(values.materialTime[1]);
        delete values.materialTime;
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
      console.log('values=========:', values);
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
    // const self = this;
    params.mappingValue = 'kbasset.addStuffTemplate';
    params.domain = 'KOUBEI';
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
          // location.hash = '#/material/TemplateManage/koubei';
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
    params.domain = 'KOUBEI';
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
          location.hash = '#/material/TemplateManage/koubei';
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
  handSelect(value, option) {
    // if (!this.state.data) {
    //   this.props.form.setFieldsValue({stuffAttrId: ''});
    //   this.props.form.setFieldsValue({size: ''});
    // }
    this.setState(
      {show: value}
    );
    // 物料属性改变时物料类型的联动
    // this.getSelectData(value);
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
      // this.props.form.resetFields(['size']);
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

    const maxUploadNum = this.state.show === 'ACTIVITY' ? 3 : 10;
    if (fileList.length > maxUploadNum) {
      message.warn(`上传最多${maxUploadNum}个`);
      return fileList.slice(0, maxUploadNum);
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
    const {StuffTypeOptions} = this.state;

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
    const showFitem = this.state.show === 'BASIC';
    const showTime = this.state.show === 'ACTUAL' || this.state.show === false || this.state.show === 'BASIC';

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
              onSelect={this.onSelectBizSource}>
                <Option key= "KOUBEI_STUFF">口碑</Option>
                <Option key= "KOUBEI_CODE">口碑码</Option>
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
              onSelect={this.handSelect} placeholder="请选择物料属性">
                {StuffTypeOptions}
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
              help={getFieldError('picture') ||
                this.state.show === 'ACTIVITY' ? '考虑到App应用的体验，需要物料验收的活动上传模版数不超过3张，支持图片格式 jpg、png, 源文件格式AI、EPS、PSD、CDR (图片格式小于20M,源文件格式小于500M)' :
                '最多可上传10个文件，支持图片格式 jpg、png, 源文件格式AI、EPS、PSD、CDR (图片格式小于20M,源文件格式小于500M)'
              }>
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
                    max: this.state.show === 'ACTIVITY' ? 3 : 10,
                    message: this.state.show === 'ACTIVITY' ? '不超过3张' : '不超过10张',
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
            {showFitem ? null : (<FormItem
            {...formItemLayout}
            label="活动名称："
            hasFeedback>
            <Input {...getFieldProps('activeName', {
              rules: [{
                required: this.state.show === 'ACTIVITY' ? true : false,
                max: 20,
                message: '用户名最多输入20个字符', type: 'string' },
              ],
            })}
            placeholder="请输入活动名称" />
          </FormItem>)}
          </Col>
        </Row>
        <Row>
          <Col>
            { getFieldValue('stuffAttrId') !== '999000' ?
              (<FormItem
              {...formItemLayout}
              label="活动有效时间：" >
              <RadioGroup {...getFieldProps('radioTime', {
                rules: [{
                  required: getFieldValue('stuffType') === 'ACTIVITY' ? true : false,
                }],
                initialValue: 'female',
              })}>
                  <Radio value="male" disabled={showTime ? true : null}>自定义时间</Radio>
                  <Radio value="female">永久生效</Radio>
                </RadioGroup>
              </FormItem>) :
              (<FormItem
                {...formItemLayout}
                label="是否永久生效：" >
                <div>是</div>
                </FormItem>)}
          </Col>
        </Row>
        <Row>
          <Col>
              {getFieldValue('radioTime') === 'male' ?
            (<FormItem
              {...formItemLayout}
              label="选择有效时间：" >
              <RangePicker
                format="yyyy/MM/dd"
                {...getFieldProps('activityTime', {
                  rules: [{ required: getFieldValue('radioTime') === 'male' ? true : false,
                       type: 'array',
                       message: '请选择时间'}],
                })} />
              </FormItem>) : null}
          </Col>
        </Row>
        {(this.state.show === 'ACTIVITY' || this.state.data.stuffType === 'ACTIVITY') ? (
          <div>
            <Row>
              <Col>
              <FormItem
                {...formItemLayout}
                label="选择审核类型：" >
                <RadioGroup {...getFieldProps('checkType', {
                  rules: [{
                    required: true,
                  }],
                  initialValue: 'MACHINE',
                })}>
                    <Radio value="MACHINE">机器审核</Radio>
                    <Radio value="MANUAL">人工审核</Radio>
                  </RadioGroup>
                </FormItem>
            </Col>
              <Col style={{marginBottom: 10}}>
                <FormItem
                  {...formItemLayout}
                  label="活动物料有效期："
                  help="用户规定商户铺设物料并上传物料实拍图片的有效时间段。"
                >
                  <RangePicker
                    format="yyyy/MM/dd"
                    {...getFieldProps('materialTime', {
                      rules: [{ required: true,
                           type: 'array',
                           message: '请选择时间'}],
                    })} />
                  </FormItem>
              </Col>
            </Row>
            <Row>
              <Col style={{marginBottom: 10}}>
                <FormItem
                  {...formItemLayout}
                  label="提交验收图片数量："
                  validateStatus={getFieldError('picNum') ? 'error' : 'success'}
                  help={getFieldError('picNum')}
                >
                  <InputGroup compact>
                    <Input addonBefore={
                      <Select
                        style={{ width: 90 }}
                        {...getFieldProps('expression', {
                          initialValue: '1',
                        })}
                      >
                        <Option value="0">固定数量</Option>
                        <Option value="1">至少</Option>
                      </Select>
                    }
                      addonAfter="张"
                      placeholder="请输入"
                      {...getFieldProps('picNum', {
                        rules: [{
                          pattern: /^[123]$/,
                          message: '限制只能输入1、2、3三个整数',
                        }],
                      })} />
                  </InputGroup>
                </FormItem>
              </Col>
            </Row>
          </div>
        ) : null}
        <Row>
          <Col style={{marginBottom: 10}}>
            {showFitem ? null : (<FormItem
            {...formItemLayout}
            label="活动方案审批号："
            hasFeedback
            help={getFieldError('activeProcessNo') || '如新物料已另外审批，请填写审批单号，以便日后查询'}>
            <Input {...getFieldProps('activeProcessNo', {
              rules: [{
                required: this.state.show === 'ACTIVITY' ? true : false,
                message: '活动方案审批号必填',
              }, {
                pattern: /^[A-Za-z0-9]+$/,
                message: '只能输入英文字母和数字组成的字符串',
              }],
            })} placeholder="活动方案审批号" />
            </FormItem>)}
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
export default Form.create()(CreateKoubeiTemp);
