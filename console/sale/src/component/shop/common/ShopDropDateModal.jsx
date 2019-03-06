import React, { PropTypes } from 'react';
import { Modal, Form, DatePicker } from 'antd';
import {format} from '../../../common/dateUtils';
import classnames from 'classnames';

const FormItem = Form.Item;

class ShopDropModal extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    defaultDateRange: PropTypes.array,
    onCancelDate: PropTypes.func,
  }

  componentDidMount = () => {
    this.props.form.setFieldsValue({'opTime': this.props.defaultDateRange});
  }

  onDownload = () => {
    const {cityCode} = this.props;
    const values = this.props.form.getFieldsValue();
    const startTime = format(values.gmtCreateStart);
    const endTime = format(values.gmtCreateEnd);
    window.open(`${window.APP.kbsalesUrl}/shop/downloadFallShops.json?cityCode=${cityCode[1]}&startTime=${startTime}&endTime=${endTime}`);
    this.props.onCancelDate();
  }

	disabledBeginTime = (beginValue) => {
  const endValue = this.props.form.getFieldValue('gmtCreateEnd');
  if (!beginValue || !endValue) {
    return false;
  }
  const defaultDateRange = this.props.defaultDateRange;

  return beginValue.getTime() > endValue.getTime() ||
    beginValue.getTime() < defaultDateRange[0].getTime() ||
    beginValue.getTime() > defaultDateRange[1].getTime();
	}

	disabledEndTime = (endValue) => {
  const beginValue = this.props.form.getFieldValue('gmtCreateStart');
  if (!endValue || !beginValue) {
    return false;
  }
  const defaultDateRange = this.props.defaultDateRange;

  return endValue.getTime() < beginValue.getTime() ||
    endValue.getTime() > defaultDateRange[1].getTime();
	}

  handleCancel = () => {
    this.props.onCancelDate();
  }

  render() {
    const {defaultDateRange, dateShow} = this.props;
    const {getFieldProps, getFieldError} = this.props.form;
    return (
      <Modal
        title="选择数据范围"
        visible= {dateShow}
        onOk={this.onDownload}
        onCancel={this.handleCancel}
        okText="下载"
        cancelText="取消"
      >
      <Form horizontal className="advanced-search-form">
        <FormItem
          validateStatus={ classnames({ error: !!getFieldError('gmtCreateStart') || !!getFieldError('gmtCreateEnd') }) }
          label="掉落时间："
          labelCol={{span: 6}}
          wrapperCol={{span: 18}}
          required>
          <div style={{display: 'inline-flex'}}>
            <DatePicker
              {...getFieldProps('gmtCreateStart', {
                initialValue: defaultDateRange[0],
                rules: [
                  {required: true, message: '请选择操作时间', type: 'date'},
                ],
              })}
              disabledDate={this.disabledBeginTime}
              format="yyyy-MM-dd"
              placeholder="开始时间" />
            &nbsp;&nbsp;-&nbsp;&nbsp;
            <DatePicker {...getFieldProps('gmtCreateEnd', {
              initialValue: defaultDateRange[1],
              rules: [
                {required: true, message: '请选择操作时间', type: 'date'},
              ],
            })}
              disabledDate={this.disabledEndTime}
              format="yyyy-MM-dd"
              placeholder="结束时间" />
          </div>
        </FormItem>
      </Form>
      </Modal>
		);
  }
}
export default Form.create()(ShopDropModal);
