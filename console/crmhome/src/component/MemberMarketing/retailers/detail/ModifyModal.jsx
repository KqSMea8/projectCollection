import React, { PropTypes } from 'react';
import moment from 'moment';
import union from 'lodash/union';
import { Modal, Form, Row, Col, DatePicker, Checkbox, Input, Tabs, Select, InputNumber } from 'antd';
import classnames from 'classnames';
import { AddableRow, ImgCropModal } from 'hermes-react';
import CommonTitle from '../../../../common/layout/CommonTitle';
import UploadCropPic from '../../../MarketingActivity/BuyGive/UploadCropPic';
import ShopSelectTree from './ShopSelectTree';
import styles from './ModifyModal.module.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Preview = ImgCropModal.Preview;
const Option = Select.Option;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

function descListLayout(rowIndex) {
  return (rowIndex === 0) ? {
    label: '使用须知',
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  } : {
    label: null,
    wrapperCol: { offset: 8, span: 16 },
  };
}

const DescListLineMaxLen = 100;

function composeImageUrl(fileId) {
  return `http://oalipay-dl-django.alicdn.com/rest/1.0/image?fileIds=${fileId}`;
}

function extractFileId(imageUrl) {
  const [, fileId] = /\bfileIds=([a-zA-Z0-9\-_]+)/.exec(imageUrl);
  return fileId;
}

function checkSpecialCharacter(rule, value, callback) {
  if (/[`~!@#$^&*=|{}':;',\[\].<>/?~！@#￥……&*——|{}【】‘；：”“'。，、？]/.test(value)) {
    callback('品牌名称中不能包含特殊字符');
  } else {
    callback();
  }
}

class ModifyModal extends React.Component {
  static propTypes = {
    data: PropTypes.shape(), // TODO: 细化
    currentShopIds: PropTypes.arrayOf(PropTypes.string),
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
  };

  state = {
    selectedShopIds: this.props.currentShopIds,  // 当前选中的门店，含已生效门店
  }

  componentDidMount() {
    this.update(this.props.data);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.update(nextProps.data);
    }
  }

  getPicInfo = (positionInfo) => {
    const { width, height, url } = positionInfo;
    // 裁剪后的照片，按照长的一边作为基准展示，短的一边则裁剪或两边留白
    const fillType = width > height ? 'width' : 'height';
    return (
      <div className={styles.preview}>
        <div className={styles.guide}>
          <p>您上传的图片将会自动适配为以下尺寸</p>
        </div>
        <Preview
          url={url}
          fillType={fillType}
          picStyle={{ borderRadius: '100%', border: '1px solid #ddd', overflow: 'hidden' }}
          style={{ width: 100, height: 100, background: '#fff', marginBottom: 10 }}
          crop={positionInfo}
        />
        <div className={styles.name}>品牌Logo</div>
      </div>
    );
  };

  getDescListError = (activityId, rowIndex) => {
    return this.descListError[activityId] &&
      this.descListError[activityId][rowIndex];
  }

  descListError = {};

  update = (data) => {
    if (!(data && data.activities)) {
      return;
    }
    this.props.form.setFieldsValue(this.updatedValues(data));
  }

  updatedValues = (data) => {
    const { autoDelayFlag, activities } = data;
    const [{ startTime, endTime, vouchers: [{ brandName, voucherLogoFileId }] }] = activities;
    const values = {
      startTime: moment(startTime).format('YYYY-MM-DD 00:00'),
      endTime: moment(endTime).format('YYYY-MM-DD 23:59'),
      brandName,
      voucherLogoFileList: [{
        uid: -1,
        name: '',
        status: 'done',
        url: composeImageUrl(voucherLogoFileId),
        thumbUrl: composeImageUrl(voucherLogoFileId),
      }],
      autoDelayFlag,
    };
    activities.forEach(activity => {
      const { activityId, descList = [''] } = activity;
      values[`${activityId}-descList`] = descList.map(text => ({ text }));
    });
    return values;
  }

  validateDescList = (activityId, descList) => {
    if (!this.descListError[activityId]) {
      this.descListError[activityId] = [];
    }
    descList.forEach((desc, idx) => {
      if (desc.text && desc.text.length > DescListLineMaxLen) {
        this.descListError[activityId][idx] = `单条不能超过${DescListLineMaxLen}字`;
      } else {
        this.descListError[activityId][idx] = undefined;
      }
    });
  }

  handleShopCheck = (checkedKeys) => {
    this.setState({
      selectedShopIds: checkedKeys,
    });
  }

  isDirty = () => {
    const { data, form } = this.props;
    return JSON.stringify(this.updatedValues(data)) !== JSON.stringify(form.getFieldsValue());
  }

  warnToClose = () => {
    if (this.isDirty()) {
      Modal.confirm({
        title: '确认放弃编辑',
        content: '关闭后已编辑内容将丢失，确认放弃编辑吗？',
        onOk: this.props.onCancel,
      });
    } else {
      this.props.onCancel();
    }
  }

  submit = () => {
    const { form, data, onOk, currentShopIds } = this.props;
    const shopIds = union(this.state.selectedShopIds, currentShopIds);
    form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { smartPromoId } = data;
        const { startTime, endTime, brandName, voucherLogoFileList, autoDelayFlag } = values;
        const formatStringStart = 'YYYY-MM-DD 00:00:00';
        const formatStringEnd = 'YYYY-MM-DD 23:59:59';
        const activities = data.activities.map(activity => {
          const { activityId } = activity;
          const descList = values[`${activityId}-descList`].map(({ text }) => text).filter(val => !!val);
          const totalAvailableNum = values[`${activityId}-totalAvailableLimit`] === 'limit' ? values[`${activityId}-totalAvailableNum`] : '-1';
          return {
            activityId,
            descList,
            brandName,
            startTime: moment(startTime).format(formatStringStart),
            endTime: moment(endTime).format(formatStringEnd),
            voucherLogoFileId: extractFileId(voucherLogoFileList[0].url),
            totalAvailableNum,
          };
        });
        onOk({
          smartPromoId,
          gmtStart: moment(startTime).format(formatStringStart),
          gmtEnd: moment(endTime).format(formatStringEnd),
          shopIds,
          autoDelayFlag,
          activities,
        });
      }
    });
  }

  render() {
    const { data, visible, form, currentShopIds, submitting } = this.props;
    if (!(data && data.activities)) {
      return null;
    }
    const { getFieldProps, getFieldError, getFieldValue, validateFields } = form;
    const { status } = data;
    const [{ endTime }] = data.activities;
    return (
      <Modal
        title="修改营销方案内容"
        visible={visible}
        onCancel={this.warnToClose}
        onOk={this.submit}
        width={1000}
        confirmLoading={submitting}
      >
        <Row>
          <Col span={9} style={{ paddingRight: 16 }}>
            <ShopSelectTree
              checked={union(currentShopIds, this.state.selectedShopIds)}
              disabled={currentShopIds}
              onCheck={this.handleShopCheck}
            />
          </Col>
          <Col span={15} style={{ borderLeft: '1px solid #e9e9e9', paddingLeft: 16 }}>
            <CommonTitle name="方案信息" />
            <Form horizontal onSubmit={this.submit}>
              <FormItem
                {...formItemLayout}
                label="活动时间"
                required
              >
                <FormItem
                  style={{ display: 'inline-block' }}
                  label={null}
                  help={(getFieldError('startTime') || []).join(', ')}
                  validateStatus={getFieldError('startTime') && 'error'}
                >
                  <DatePicker
                    {...getFieldProps('startTime', {
                      rules: [
                        { required: true, message: '请选择活动开始时间'},
                        { validator: (rule, value, callback) => {
                          if (!getFieldValue('endTime')) {
                            callback();
                          } else {
                            const startDate = moment(value);
                            const endDate = moment(getFieldValue('endTime'));

                            if (!startDate.isBefore(endDate)) {
                              callback([new Error('开始时间应该早于结束时间')]);
                              return;
                            }

                            if (endDate.diff(startDate, 'days') + 1 < 30) {
                              callback(new Error('活动结束时间至少晚于开始时间30天'));
                              return;
                            }

                            if (getFieldError('endTime')) {
                              validateFields(['endTime'], {force: true});
                            }

                            callback();
                          }
                        }},
                      ],
                    })}
                    format="yyyy-MM-dd 00:00"
                    disabled={status !== 'PUBLISHED' /* 活动未生效允许修改 */}
                    disabledDate={current => current && moment(current.time).isBefore(moment(), 'day')}
                  />
                </FormItem>
                <span style={{ verticalAlign: 'top' }}> – </span>
                <FormItem
                  style={{ display: 'inline-block' }}
                  label={null}
                  help={(getFieldError('endTime') || []).join(', ')}
                  validateStatus={getFieldError('endTime') && 'error'}
                >
                  <DatePicker
                    {...getFieldProps('endTime', {
                      rules: [
                        { required: true, message: '请选择活动结束时间' },
                        { validator: (rule, value, callback) => {
                          if (!getFieldValue('startTime')) {
                            callback();
                          } else {
                            const startDate = moment(getFieldValue('startTime'));
                            const endDate = moment(value);

                            if (!startDate.isBefore(endDate)) {
                              callback([new Error('结束时间应该大于开始时间')]);
                              return;
                            }

                            if (endDate.diff(startDate, 'days') + 1 < 30) {
                              callback(new Error('活动结束时间至少晚于开始时间30天'));
                              return;
                            }

                            if (getFieldError('startTime')) {
                              validateFields(['startTime'], {force: true});
                            }
                            callback();
                          }
                        }},
                      ],
                    })}
                    format="yyyy-MM-dd 23:59"
                    disabledDate={current => current && moment(current.time).isBefore(moment(endTime), 'day')}
                  />
                </FormItem>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="品牌名称"
                required
                help={(getFieldError('brandName') || []).join(', ')}
                validateStatus={getFieldError('brandName') && 'error'}
              >
                <Input
                  placeholder="请输入品牌名称，20字以内"
                  {...getFieldProps('brandName', {
                    rules: [{
                      required: true,
                      message: '请输入品牌名称',
                    }, {
                      type: 'string',
                      max: 20,
                      message: '品牌名称不能超过20字',
                    }, {
                      validator: checkSpecialCharacter,
                    }],
                  })}
                />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="券Logo"
                required
                help={(getFieldError('voucherLogoFileList') || []).join(', ')}
                validateStatus={getFieldError('voucherLogoFileList') && 'error'}
              >
                <UploadCropPic
                  maxSize={5120} // 上传文件最大尺寸,单位为KB
                  triggerText="品牌Logo"
                  rate={1} // 裁剪的虚线框的宽/高比
                  initWidth={0.8}
                  requiredSize={{ width: 500, height: 500 }}  // 要求的最小尺寸
                  getPicInfo={this.getPicInfo}
                  {...getFieldProps('voucherLogoFileList', {
                    rules: [{
                      required: true,
                      message: '请上传品牌Logo',
                    }],
                  })}
                />
                <p className={styles.hint}>
                  格式：bmp，png，jpeg，gif。<br />
                  文件体积不超过5MB。<br />
                  尺寸为不小于500 x 500px的正方形。
                </p>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="自动续期"
              >
                <Checkbox {...getFieldProps('autoDelayFlag', { valuePropName: 'checked' })}>
                  自动延长上架时间
                </Checkbox>
                <p className={styles.hint}>
                  活动时间结束后自动延期，每次延期30天
                </p>
              </FormItem>
            </Form>
            <Tabs type="card">
              {data.activities.map((activity) => (
                <TabPane key={activity.activityId} tab={activity.activityName || '活动'}>
                  <FormItem
                    {...formItemLayout}
                    label="券名称"
                  >
                    <p className="ant-form-text">{activity.vouchers[0].voucherName}</p>
                  </FormItem>
                  <FormItem label="发放总量：" {...formItemLayout} required>
                    <Col span="9">
                      <Select
                        {...getFieldProps(`${activity.activityId}-totalAvailableLimit`, {
                          initialValue: activity.totalAvailableNum === '-1' ? 'nolimit' : 'limit',
                        })}
                        style={{ width: 120 }}
                        placeholder="请选择"
                        disabled={activity.totalAvailableNum === '-1'}
                      >
                        <Option value="nolimit">不限制</Option>
                        <Option value="limit">设定总数</Option>
                      </Select>
                    </Col>
                    <Col span="15">
                      {
                        getFieldValue(`${activity.activityId}-totalAvailableLimit`) === 'limit' &&
                        <FormItem style={{ marginLeft: 10, display: 'inline-block' }}
                          help={getFieldError(`${activity.activityId}-totalAvailableNum`)}
                          validateStatus={
                            classnames({
                              error: !!getFieldError(`${activity.activityId}-totalAvailableNum`),
                            })
                          }
                        >
                          <span style={{marginRight: 10}}>最多发放</span>
                          <InputNumber
                            {...getFieldProps(`${activity.activityId}-totalAvailableNum`, {
                              initialValue: activity.totalAvailableNum === '-1' ? '' : activity.totalAvailableNum,
                              rules: [
                                {
                                  required: getFieldValue(`${activity.activityId}-totalAvailableLimit`) === 'limit',
                                  message: '最多发放总量必填',
                                },
                                {
                                  validator: (rule, value, callback) => {
                                    if (+value < +activity.totalAvailableNum) {
                                      callback(new Error('发放总量只能增加不能减少'));
                                    }

                                    callback();
                                  },
                                },
                              ],
                            })}
                            min={1}
                            max={999999998}
                            step="1"
                          /> 张
                        </FormItem>
                      }
                    </Col>
                  </FormItem>
                  <div style={{clear: 'both'}}>
                  <AddableRow
                    max={6}
                    {...getFieldProps(`${activity.activityId}-descList`, {
                      onChange: (value) => this.validateDescList(activity.activityId, value),
                    })}
                    options={[{
                      name: 'text',
                      width: 18,
                      render: (rowIndex, formProps) => (
                        <FormItem
                          {...descListLayout(rowIndex)}
                          help={this.getDescListError(activity.activityId, rowIndex)}
                          validateStatus={this.getDescListError(activity.activityId, rowIndex) ? 'error' : ''}
                        >
                          <Input
                            {...formProps}
                            placeholder={`请输入使用说明，${DescListLineMaxLen}字以内`} />
                        </FormItem>
                      ),
                    }]}
                  />
                  <FormItem
                    label={null}
                    wrapperCol={{ offset: 6 }}
                  >
                    <p className={styles.hint}>最多可增加6条，每条{DescListLineMaxLen}字以内</p>
                  </FormItem>
                  </div>
                </TabPane>
              ))}
            </Tabs>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default Form.create()(ModifyModal);
