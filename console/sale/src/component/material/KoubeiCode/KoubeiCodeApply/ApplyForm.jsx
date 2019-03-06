import React, { Component, PropTypes } from 'react';
import { Form, Input, InputNumber, Button, Radio, Upload, Icon, Popover, Modal, message } from 'antd';
import SelectTableModal from '../KoubeiCodeBind/SelectTableModal';
import classnames from 'classnames';
import ajax from 'Utility/ajax';
import { API_STATUS } from '../common/enums';
import { IMPORT_FROM_ISV_URL, REMARK_MAX_LEN, DOWNLOAD_GUIDE__URL, EXCEL_TEMPLATE_URL, EXCEL_UPLOAD_URL } from '../common/constants';
import { UPLOAD_STATUS, BIND_SOURCE, BIND_TYPE } from '../common/enums';
import bindSourceConfig from './config/bindSource';
import { fieldPropsWithHelp } from '../common/utils';
import isEmpty from 'lodash/isEmpty';
import { trimParams } from '../common/utils';
import TemplateRadioCards from './TemplateRadioCards';
import TextRadioCards from './TextRadioCards';
import './Notes.less';
import './ApplyForm.less';

/**
 * 名词定义
 * @def type 码类型
 * @def scene 绑定用途（场景）
 * @def source 绑定方式（数据来源）
 * @def template 物料模板
 */

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class ApplyForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    typeList: PropTypes.array,
    templateList: PropTypes.array,
    shopList: PropTypes.array,
  };

  defaultProps = {
    onSubmit: () => {},
    typeList: [],
    submitting: false,
  };

  constructor(props) {
    super(props);
    // 初始化表单
    const { typeList } = props;
    const type = typeList[0];
    const scene = type.children[0];
    const templateType = scene.children[0];
    const sourceId = type.id === BIND_TYPE.IN_SHOP_BINDING ? null : bindSourceConfig[scene.id][0].value;
    this.state = {
      ...this.state,
      type,
      scene,
      sourceId,
      templateType,
    };
  }

  state = {
    type: null,           // 类型，【明码/空码】
    scene: null,          // 场景，仅适用于明码时，【门店/桌码/商圈/货架】
    sourceId: null,       // 绑定来源
    templateType: null,
    templateId: null,
    pickingShop: false,   // 选择门店组件状态
    pickedShopData: null, // 已选门店数据
    submittingPickedShop: false,
    dataId: null,         // Excel、门店提交流水ID
    fileError: null,
    fileList: [],
    uploading: false,
  };

  onTypeChange = id => {
    const { typeList } = this.props;
    const type = typeList.find(t => t.id === id);
    let sourceId = null;
    const scene = type.children[0];
    const templateType = scene.children[0];
    if (id === BIND_TYPE.DIRECT_BINDING) {
      sourceId = bindSourceConfig[scene.id][0].value;
    }
    this.setState({
      type,
      scene,
      sourceId,
      templateType,
      templateId: null,
      pickingShop: false,   // 选择门店组件状态
      pickedShopData: null, // 已选门店数据
      submittingPickedShop: false,
      dataId: null,
      fileError: null,
      fileList: [],
    });
  };

  onSceneChange = e => {
    const sceneId = e.target.value;
    const { type } = this.state;
    const scene = type.children.find(s => s.id === sceneId);
    let sourceId = null;
    if (type.id === BIND_TYPE.DIRECT_BINDING) {
      sourceId = bindSourceConfig[scene.id][0].value;
    }
    this.setState({
      scene,
      sourceId,
      templateType: scene.children[0],
      templateId: null,
      dataId: null,
      fileError: null,
      fileList: [],
    });
  };

  onSourceChange = e => {
    this.setState({
      sourceId: e.target.value,
      dataId: null,
      fileError: null,
      fileList: [],
    });
  };

  onTemplateTypeChange = e => {
    const id = e.target.value;
    const { scene } = this.state;
    this.setState({
      templateId: null,
      templateType: scene.children.find(t => t.id === id),
    });
  };

  onTemplateChange = templateId => {
    this.setState({
      templateId,
    });
  };

  onPickShop = () => {
    if (this.props.shopList.length === 0) {
      // 没有门店，只能绑定空码
      Modal.info({
        title: '你只能在线生成空码',
        content: '由于你名下没有归属门店，无法生成明码',
      });
      return;
    }
    this.setState({
      pickingShop: true
    });
  };

  onPickShopOk = pickedShopData => {
    this.setState({
      submittingPickedShop: true,
    });
    this.submitISVShopInfo(pickedShopData.shopIds.join(','))
      .then(data => {
        this.setState({
          submittingPickedShop: false,
          dataId: data.dataId,
          pickedShopData,
          pickingShop: false,
        });
        if (!isEmpty(data.noOrderPluginShops)) {
          Modal.success({
            title: (
              <div
                style={{ display: 'inline-block', width: 480, verticalAlign: 'top', paddingTop: 6 }}
              >
              操作成功，以下门店未上架相关服务应用，在铺码之前，请到 [服务市场] 订购且完成上架。
              </div>
            ),
            content: (
              <div style={{height: '120px', overflowY: 'scroll'}}>
                <ul>
                  {data.noOrderPluginShops.map((shop, index) => <li key={index}>{shop}</li>)}
                </ul>
              </div>
            )
          });
        } else {
          message.success('操作成功');
        }
      })
      .catch(() => {
        this.setState({
          submittingPickedShop: false,
        });
      });
  };

  onCancelShopPicker = () => {
    this.setState({
      pickingShop: false,
    });
  };

  onUploadChange = info => {
    const { file, fileList } = info;
    const { status, response } = file;
    const succeed = status === UPLOAD_STATUS.DONE && response && response.status === API_STATUS.SUCCEED;
    const failed = status === UPLOAD_STATUS.DONE && response && response.status === API_STATUS.FAILED;
    const notLogin = status === UPLOAD_STATUS.DONE && response && response.buserviceErrorCode === 'USER_NOT_LOGIN';
    if (status === UPLOAD_STATUS.UPLOADING) {
      this.setState({
        uploading: true,
        fileList,
        dataId: null,
        fileError: null,
      });
    } else if (status === UPLOAD_STATUS.REMOVED) {
      this.setState({
        fileList: [],
        dataId: null,
        fileError: null,
      });
    } else if (succeed) {
      this.setState({
        uploading: false,
        fileList: fileList.slice(-1),  // 只保留最后一个上传的文件
        dataId: response.data,
        fileError: null,
      });
    } else if (failed) {
      // 文件格式、内容出错
      let error = null;
      if (response.resultCode === 'bindDataError') {
        Modal.info({
          title: '信息有错',
          content: (
            <div style={{height: 120, overflowY: 'scroll'}}>
              <ul>{response.resultMsg.map((msg, index) => <li key={index}>第{msg.rowNo}行：{msg.errMsg}</li>)}</ul>
            </div>
          ),
        });
      } else {
        message.error(response.resultMsg);
        error = response.resultMsg;
      }
      this.setState({
        uploading: false,
        fileList: [],
        dataId: null,
        fileError: error || '文件上传失败',
      });
    } else if (notLogin) {
      this.setState({
        uploading: false,
        fileList: [],
        dataId: null,
        fileError: '登录超时，请重新登录再上传',
      });
      Modal.confirm({
        title: '登录超时，需要立刻跳转到登录页吗？',
        onOk: () => {
          location.reload();
        }
      });
    } else {// 其余情况均判作 error
      this.setState({
        uploading: false,
        fileList: [],
        dataId: null,
        fileError: '文件上传失败',
      });
    }
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const {type, scene, sourceId, templateId, dataId } = this.state;
        const { remark, quantity } = values;
        const bindType = type.id;
        // 二次校验
        if (!templateId) {
          message.error('请选择物料模板');
          return false;
        }
        const params = {
          templateNickName: templateId,
          bindType,
          quantity,
          remark,
        };
        if (bindType === BIND_TYPE.DIRECT_BINDING) {
          // 二次校验
          if (!scene) {
            message.error('请选择绑定用途');
            return false;
          }
          if (!sourceId) {
            message.error('请选择绑定方式');
            return false;
          }
          if (!dataId) {
            message.error('请上传或选择门店信息');
            return false;
          }
          params.bindScene = scene.id;
          params.bindSource = sourceId.toLowerCase();
          params.dataId = dataId;
        } else if (bindType === BIND_TYPE.IN_SHOP_BINDING) {
          // 二次校验
          if (!quantity) {
            message.error('请填写数量');
            return false;
          }
          params.quantity = quantity;
        }
        this.props.onSubmit(trimParams(params), this.resetForm);
      }
    });
  };

  resetForm = () => {
    this.props.form.resetFields();
    const { typeList } = this.props;
    const type = typeList[0];
    const scene = type.children[0];
    const templateType = scene.children[0];
    this.setState({
      type,
      scene,
      sourceId: null,       // 绑定来源
      templateType,
      templateId: null,
      pickingShop: false,   // 选择门店组件状态
      pickedShopData: null, // 已选门店数据
      submittingPickedShop: false,
      dataId: null,         // Excel、门店提交流水ID
      fileError: null,
      fileList: [],
      uploading: false,
    });
  };

  beforeSelectFile = e => {
    if (this.props.shopList.length === 0) {
      // 没有门店，只能绑定空码
      e.stopPropagation();
      Modal.info({
        title: '你只能在线生成空码',
        content: '由于你名下没有归属门店，无法生成明码',
      });
    }
  };

  submitISVShopInfo = shopIds => {
    const { scene, templateId } = this.state;
    const bindScene = scene.id;
    return new Promise((resolve, reject) => {
      ajax({
        url: IMPORT_FROM_ISV_URL,
        data: { bindScene, shopIds, templateNickName: templateId },
      })
        .then(res => {
          if (res.status === API_STATUS.SUCCEED) {
            resolve(res.data);
          } else {
            reject(res);
          }
        })
        .catch(res => reject(res));
    });
  };

  render() {
    const { type, scene, sourceId, dataId, templateType, templateId, fileError, fileList, uploading, pickingShop, pickedShopData, submittingPickedShop } = this.state;
    const { getFieldProps, getFieldError } = this.props.form;
    const { typeList, templateList, submitting, shopList } = this.props;
    // 是否【明码】
    const isDirectBind = type.id === BIND_TYPE.DIRECT_BINDING;
    const bindSourceOptions = scene ? bindSourceConfig[scene.id] : [];
    const showExcelUpload = sourceId === BIND_SOURCE.EXCEL;
    const showIsvImport = sourceId === BIND_SOURCE.ISV;
    const templateTypes = scene.children;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      style: { marginBottom: 24 },
    };

    return (
      <Form
        horizontal
        onSubmit={this.onSubmit}
      >
        <FormItem
          label="码类型"
          required
          {...formItemLayout}
        >
          <TextRadioCards
            options={typeList}
            value={type.id}
            onChange={this.onTypeChange}
          />
        </FormItem>
        <FormItem
          label="适用场景"
          required
          help={scene.desc}
          {...formItemLayout}
        >
          <RadioGroup
            size="default"
            value={scene.id}
            defaultValue={scene.id}
            onChange={this.onSceneChange}
          >
            {type.children.map(s => (
              <RadioButton
                key={s.id}
                value={s.id}
              >
                {s.name}
              </RadioButton>
            ))}
          </RadioGroup>
        </FormItem>
        <FormItem
          label="物料模板"
          required
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <RadioGroup
            value={templateType.id}
            size="default"
            onChange={this.onTemplateTypeChange}
          >
            {templateTypes.map((t) => (
              <RadioButton key={t.id} value={t.id}>{t.name}</RadioButton>
            ))}
          </RadioGroup>
          <TemplateRadioCards
            data={templateList}
            options={templateType.nickNameList}
            selected={templateId}
            onChange={this.onTemplateChange}
          />
        </FormItem>
        {isDirectBind && (
          <FormItem
            label="绑定方式"
            required
            style={{ marginBottom: 0 }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <RadioGroup
              onChange={this.onSourceChange}
              value={sourceId}
              defaultValue={sourceId}
            >
              {bindSourceOptions.map(op => (
                <Radio
                  value={op.value}
                  key={op.value}
                >
                  {op.name}{' '}
                  <Popover
                    title={op.name}
                    overlay={op.popover}
                  >
                    <a>了解</a>
                  </Popover>
                </Radio>
              ))}
            </RadioGroup>
          </FormItem>
        )}
        {showExcelUpload && (
          <FormItem
            required
            validateStatus={classnames({
              error: !!fileError,
            })}
            help={fileError}
            style={{marginBottom: 24}}
            wrapperCol={{ span: 18, offset: 6 }}
          >
            <p>
              请<a href={`${EXCEL_TEMPLATE_URL}?bindScene=${scene.id}`}>下载模版</a>，按照此模版填写再上传，一次最多150行纪录
            </p>
            <Upload
              name="file"
              accept=".xls,.xlsx"
              action={EXCEL_UPLOAD_URL}
              data={{bindScene: scene.id, templateNickName: templateId}}
              onChange={this.onUploadChange}
              fileList={fileList}
            >
              {!uploading && !dataId && (
                <Button disabled={!templateId} type="ghost" onClick={this.beforeSelectFile}>
                  <Icon type="upload" /> 上传列表
                </Button>
              )}
            </Upload>
          </FormItem>
        )}
        {showIsvImport && (
          <FormItem
            style={{ marginBottom: 24 }}
            wrapperCol={{ span: 18, offset: 6 }}
          >
            <Button disabled={!templateId} type="ghost" onClick={this.onPickShop}>
              {pickedShopData
                ? <span>已选{pickedShopData.shopIds.length}个门店，{pickedShopData.tableCnt}个码</span>
                : <span>+选择门店</span>
              }
            </Button>
            <p>一次最多可选150桌，但门店超过150桌将分批生成</p>
          </FormItem>
        )}
        {!isDirectBind && (
          <FormItem
            label="数量："
            required
            {...fieldPropsWithHelp(this.props.form, 'quantity', '一次最多150个') }
            {...formItemLayout}
          >
            <InputNumber
              min={1}
              max={150}
              {...getFieldProps('quantity', {
                rules: [{
                  type: 'number',
                  max: 150,
                  message: '超过单批次数量上限',
                }, {
                  required: true,
                  message: '请填写数量',
                }],
              }) }
            />
            {' '}张
          </FormItem>
        )}

        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
          style={{ marginTop: 24 }}
        >
          <div className="notes">
            <div className="title">制作要求</div>
            <div className="content">
              <em style={{ color: '#f90', fontStyle: 'normal' }}>为保证物料的材质，请务必按照口碑要求的物料打印规范进行制作，点击查看 </em>
              <a
                style={{ color: '#0ae', fontStyle: 'normal' }}
                href={DOWNLOAD_GUIDE__URL}
                target="_blank"
              >
                物料材质要求
              </a>
            </div>
          </div>
        </FormItem>
        <FormItem
          label="备注："
          validateStatus={classnames({
            error: !!getFieldError('remark'),
          })}
          help={getFieldError('remark')}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          <Input
            type="textarea"
            placeholder="备注你需要的内容，可不填"
            {...getFieldProps('remark', {
              rules: [{
                type: 'string',
                max: REMARK_MAX_LEN,
                message: `备注信息不能超过${REMARK_MAX_LEN}个字`,
              }],
            }) }
          />
        </FormItem>
        <FormItem
          wrapperCol={{ span: 18, offset: 6 }}
          style={{ marginTop: 24 }}
        >
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
          >
            开始生成
          </Button>
        </FormItem>
        <SelectTableModal
          submitting={submittingPickedShop}
          visible={pickingShop}
          onCancel={this.onCancelShopPicker}
          onOk={this.onPickShopOk}
          shopList={shopList}
        />
      </Form>
    );
  }
}

export default Form.create()(ApplyForm);
