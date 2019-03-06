import React, { PureComponent } from 'react';
import { array, func, object, string } from 'prop-types';
import { Form, DatePicker, Radio, Button } from 'antd';
import moment from 'moment';

import './trade-date.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;

export default class TradeDate extends PureComponent {
  static propTypes = {
    dispatch: func,
    form: object,
    startDate: string,
    endDate: string,
    data: array,
    onDemand: func,
  }

  onRangeDateChange = (value) => {
    const { dispatch } = this.props;
    const [startDate, endDate] = value;
    dispatch({ type: 'setState', payload: {
      startDate: startDate && moment(startDate.getTime()).format('YYYY-MM-DD'),
      endDate: endDate && moment(endDate.getTime()).format('YYYY-MM-DD'),
    } });
  }

  onRadioTimeChange = (e) => {
    const { form: { setFieldsValue }, dispatch } = this.props;
    const { value } = e.target;
    const rangeDate = this.getRadioTimes()[value];
    const [startDate, endDate] = rangeDate;
    setFieldsValue({ rangeDate });
    dispatch({ type: 'setState', payload: { startDate, endDate } });
    this.handleSearch();
  }

  handleSearch = () => {
    const { form: { validateFieldsAndScroll }, dispatch } = this.props;
    validateFieldsAndScroll({ force: true, scroll: { offsetTop: 100 } }, (err, values) => {
      if (!err) {
        const { rangeDate: [startDate, endDate], checkShop: { shopId } } = values;
        dispatch({ type: 'queryExpenseAndRefundInfoDetail', payload: {
          shopId,
          startDate: typeof startDate === 'string' ? startDate : moment(startDate.getTime()).format('YYYY-MM-DD'),
          endDate: typeof endDate === 'string' ? endDate : moment(endDate.getTime()).format('YYYY-MM-DD'),
        } });
      }
    });
  }

  getRadioTimes() { // 每次获取都是最新的时间
    const todayDate = moment().format('YYYY-MM-DD');
    const yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
    return {
      today: [todayDate, todayDate],
      yesterday: [yesterdayDate, yesterdayDate],
      near7: [moment().subtract(6, 'days').format('YYYY-MM-DD'), todayDate],
      near30: [moment().subtract(29, 'days').format('YYYY-MM-DD'), todayDate],
    };
  }

  render() {
    const { form: { getFieldProps }, startDate, endDate } = this.props;

    const radioTimes = this.getRadioTimes();
    const radioTime = Object.keys(radioTimes).find(k => {
      const [sd, ed] = radioTimes[k];
      return sd === startDate && ed === endDate;
    });
    return (
      <Form className="trade-date">
        <FormItem required label="交易日期" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
          <RangePicker style={{ width: 184 }} size="default" format="yyyy-MM-dd" {...getFieldProps('rangeDate', {
            initialValue: [startDate, endDate],
            onChange: this.onRangeDateChange,
            rules: [{
              validator(rule, rangeDate, callback) {
                if (rangeDate.some(date => !date)) {
                  callback('请选择交易日期');
                  return;
                }
                callback();
              },
            }],
          })} />
          <RadioGroup size="default" value={radioTime} onChange={this.onRadioTimeChange}>
            <RadioButton value="today">今日</RadioButton>
            <RadioButton value="yesterday">昨日</RadioButton>
            <RadioButton value="near7">近7日</RadioButton>
            <RadioButton value="near30">近30日</RadioButton>
          </RadioGroup>
          <Button type="primary" size="default" onClick={this.handleSearch}>查询</Button>
        </FormItem>
      </Form>
    );
  }
}
