import React from 'react';
import { Modal, Form, Input, DatePicker, Cascader, message, Button } from 'antd';
import { formOption } from '../../common/formOption';
import {Uploader, normalizeUploadValueOne/* , normalizeUploadValueOneAndAutoReplace*/} from './common/Uploader';
import {format} from '../../common/dateUtils';
import ajax from '@alipay/kb-framework/framework/ajax';
const FormItem = Form.Item;

class CreatTaskModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: [],
      submitLoading: false,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.cities !== nextProps.cities) {
      const cities = nextProps.cities;
      this.setState({ cities });
    }
    if (nextProps.action === 'EDIT' && this.props.row !== nextProps.row) {
      const {taskName, endTime, fileName, fileKey, tipsFileName, tipsFileKey, desc} = nextProps.row;
      const url = `${window.APP.kbsalesUrl}/downLoadFile.json?ossFileKey=${fileKey}&fileName=${encodeURIComponent(fileName)}`;
      const tipsUrl = `${window.APP.kbsalesUrl}/showImage.json?ossFileKey=${tipsFileKey}`;
      this.props.form.setFieldsValue({
        taskName,
        endTime: endTime && new Date(endTime.substr(0, 10)),
        file: fileName && [{uid: -1, name: fileName, status: 'done', url, key: fileKey}],
        tipsFile: tipsFileName && [{uid: -1, name: tipsFileName, status: 'done', url: tipsUrl, key: tipsFileKey}],
        desc,
      });
    }
    if (this.props.action !== nextProps.action && nextProps.action === 'NEW') {
      this.props.form.resetFields();
    }
  }

  onRemove(disabledForm) {
    if (!disabledForm) {
      this.props.form.setFieldsValue({file: []});
    }
  }

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({submitLoading: true});
        const params = {...values};
        let url = '';
        if (this.props.isCountryTask) url = this.props.action === 'NEW' ? `${window.APP.kbsalesUrl}/shop/createBusinessTaskGroup.json` : `${window.APP.kbsalesUrl}/shop/editBusinessTaskGroup.json`;
        else url = this.props.action === 'NEW' ? `${window.APP.kbsalesUrl}/shop/createBusinessTask.json` : `${window.APP.kbsalesUrl}/shop/editBusinessTask.json`;
        this.processFormValues(params);
        ajax({
          url,
          method: 'post',
          data: params,
          success: (res) => {
            if (res && res.status === 'succeed') {
              this.setState({submitLoading: false});
              message.success('提交成功');
              if (this.props.action === 'NEW') {
                this.props.form.resetFields();
              }
              this.props.onHideModal();
              this.props.onRefresh({pageNum: 1, pageSize: 10}, true);
            }
          },
          error: (res) => {
            if (res && res.status === 'failed') {
              this.setState({submitLoading: false});
              message.error(res.resultMsg);
            }
          },
        });
      }
    });
  }

  processFormValues(params) {
    const {action, row} = this.props;
    this.dealUploadData(params, 'file');
    this.dealUploadData(params, 'tipsFile');

    params.scene = 'CITY_SHOP_SELF_ISSUED';
    params.cityCode = params.city[1];
    params.cityName = params.city[1];
    params.endTime = format(params.endTime) + ' 23:59:59';
    if (params.city) {
      const cities = this.props.cities;
      cities.forEach(item1 => {
        if (item1.children) {
          item1.children.forEach(item2 => {
            if (item2.value === params.city[1]) {
              params.cityName = item2.label;
            }
          });
        }
      });
    }
    if (action === 'EDIT' && row.length !== 0) {
      params.status = row.status;
      params.taskId = row.taskId;
    }
    delete params.city;
    delete params.file;
    delete params.tipsFile;
  }

  // 处理上传文件提交的数据
  dealUploadData(params, type) {
    if (params[type]) {
      const responseData = this.isUploadData(params[type]);
      if (responseData) {
        params[`${type}Url`] = responseData.ossFileKey;
        params[`${type}Name`] = responseData.fileName;
      } else {
        params[`${type}Url`] = params[type][0] && params[type][0].key;
        params[`${type}Name`] = params[type][0] && params[type][0].name;
      }
    }
  }

  // 判断是否为新上传的文件
  isUploadData(data) {
    if (data[0] && data[0].response) {
      return data[0].response.data;
    }
  }

  handleCancel = () => {
    if (this.props.action === 'NEW') {
      this.props.form.resetFields();
    }
    this.props.onHideModal();
  }

  dateLaterThanToday(current) {
    if (!current) {
      return false;
    }
    return current && current.getTime() < Date.now();
  }

  render() {
    const { getFieldProps, getFieldValue } = this.props.form;
    const { action, row, cityCode, isCountryTask} = this.props;
    const modalTitle = this.props.action === 'NEW' ? '创建任务' : '修改任务';
    const formStyle = {
      labelCol: {span: 5},
      wrapperCol: {span: 14},
    };
    const disabledForm = action === 'EDIT' && (row.status === 'PROCESS' || row.status === 'PARTFAIL');// 当修改任务&& 状态未执行中或执行中部分失败
    return (
      <Modal
        width={800}
        title={modalTitle}
        visible={this.props.visible}
        onCancel={this.handleCancel}
        footer={[
          <Button key="cancel" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
          <Button key="confirm" type="primary" size="large" onClick={this.handleOk} loading={this.state.submitLoading}>确定</Button>
        ]}
      >
        <Form className="fn-p20">
          <FormItem
            {...formStyle}
            label="城市："
          >
            <Cascader
              className="fix-cascader-disabled"
              style={{ marginTop: '-1px', width: '100%' }}
              expandTrigger="hover"
              onChange={this.onCityTreeSelect}
              options={this.state.cities}
              disabled={action === 'EDIT' || isCountryTask}
              {...getFieldProps('city', {
                initialValue: cityCode,
                rules: [{
                  required: !isCountryTask, message: '此处必填',
                }]
              })}
            />
          </FormItem>

          <FormItem
            {...formStyle}
            label="任务名称："
          >
            <Input
              disabled={disabledForm}
              {...getFieldProps('taskName', {
                rules: [
                  {required: true, message: '此处必填'},
                  {max: 8, message: '任务名称最多8个字'},
                ]
              })}
              placeholder="最多8个字"
            />
          </FormItem>

          <FormItem
            {...formStyle}
            label="截止时间："
          >
            <DatePicker
              disabledDate={this.dateLaterThanToday}
              disabled={disabledForm}
              style={{width: '80%'}}
              {...getFieldProps('endTime', {
                validateFirst: true,
                rules: [{
                  required: true,
                  message: '此处必填',
                  type: 'date',
                }],
              })}/>
            <Input
              disabled
              style={{marginLeft: 10, width: '17%'}}
              value="23:59:59"
            />
          </FormItem>

          <FormItem
            {...formStyle}
            label="任务门店："
            extra={<span>请 <a href={`${window.APP.kbsalesUrl}/batch/templateDownload.json?scene=CITY_SHOP_SELF_ISSUED`}>下载模版</a>，按照此模版填写再上传，一次最多<span style={{color: '#f04134'}}>20000</span>行纪录</span>}
          >
            <Uploader
              uploadUrl={`${window.APP.kbsalesUrl}/batch/batchFileUpload.json`}
              acceptType=".xls"
              fileList={getFieldValue('file') || []}
              disabled={disabledForm}
              onRemove={this.onRemove.bind(this, disabledForm)}
              {...getFieldProps('file', {
                normalize: normalizeUploadValueOne,
                defaultFileList: {},
                rules: [{
                  required: true,
                  max: 1,
                  type: 'array',
                }],
              })}/>
          </FormItem>

          <FormItem
            {...formStyle}
            label="任务小贴士："
            extra={<div>上传可指导服务商执行任务的sop资料，限一张，5M以下，展示在钉钉中台-待办任务-右上角的“小贴士”</div>}
          >
            <Uploader
              uploadUrl={`${window.APP.kbsalesUrl}/imageUpload.json`}
              acceptType="image/jpg,image/png,image/jpeg,image/gif"
              fileList={getFieldValue('tipsFile') || []}
              needReview
              {...getFieldProps('tipsFile', {
                /* initialValue: isCountryTask ? [{
                  uid: -1,
                  name: '2017_06_20_15_51_49.png',
                  status: 'done',
                  url: `${window.APP.kbsalesUrl}/showImage.json?ossFileKey=KbsalesImageOssFileKey8ee04e8deffd4ccc9765ec13c5b53dea`,
                  key: 'KbsalesImageOssFileKey8ee04e8deffd4ccc9765ec13c5b53dea',
                }] : [],*/
                normalize: /* isCountryTask ? normalizeUploadValueOneAndAutoReplace : */normalizeUploadValueOne,
                rules: [{
                  max: 1,
                  type: 'array',
                }],
              })}/>
          </FormItem>

          <FormItem
            {...formStyle}
            label="任务描述："
          >
            <Input
              type="textarea"
              rows="3"
              {...getFieldProps('desc', {
                rules: [{max: 20, message: '任务描述最多20个字'}]
              })}
              placeholder="最多20个字"
            />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create(formOption)(CreatTaskModal);
