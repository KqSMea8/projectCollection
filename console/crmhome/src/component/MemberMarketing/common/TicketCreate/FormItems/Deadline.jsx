import React, {PropTypes} from 'react';
import { Form, DatePicker } from 'antd';
import { dateLaterThanToday, serverStringToDate } from '../../../../../common/dateUtils';

const FormItem = Form.Item;

/*
  表单字段 － 商家确认截止时间
*/

const Deadline = React.createClass({
  propTypes: {
    form: PropTypes.object,
    layout: PropTypes.object,
    initData: PropTypes.object,
  },

  getDefaultProps() {
    return {
      initData: {},
    };
  },

  checkConfirmTime(rule, value, callback) {
    const { getFieldValue } = this.props.form;
    const start = getFieldValue('startTime');

    if (value && start && value > new Date(start)) {
      callback([new Error('确认截止时间要早于活动开始时间')]);
      return;
    }
    callback();
  },

  render() {
    const { getFieldProps } = this.props.form;
    const { initData } = this.props;

    const now = +new Date();
    const time = new Date(now + 5 * 24 * 60 * 60 * 1000);
    const defaultTime = new Date(time.getFullYear(), time.getMonth(), time.getDate(), 0, 0, 0);

    let initConfirmTime = null;

    if (initData.confirmTime) {
      initConfirmTime = serverStringToDate(initData.confirmTime);
    }

    return (
      <FormItem
        {...this.props.layout}
        required
        label="商户确认截止时间：">
        <DatePicker
          showTime
          format="yyyy-MM-dd HH:mm"
          style={{ width: 250 }}
          {...getFieldProps('confirmTime', {
            rules: [
              { required: true, type: 'date', message: '请选择商户确认截止时间' },
              { validator: this.checkConfirmTime },
            ],
            initialValue: initConfirmTime || defaultTime,
          })}
          disabledDate={dateLaterThanToday} />
      </FormItem>
    );
  },
});

export default Deadline;
