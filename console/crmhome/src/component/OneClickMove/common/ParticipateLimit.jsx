/**
 * 参与限制
 */
import React, { PropTypes } from 'react';
import { Form, Checkbox, InputNumber } from 'antd';
import { pick } from 'lodash';
import Base from './BaseFormComponent';

const FormItem = Form.Item;

function getState(dayValue, totalValue) {
  return {
    dayLimitChecked: dayValue > 0,
    totalLimitChecked: totalValue > 0,
  };
}

export default class ParticipateLimit extends Base {
  static propTypes = {
    ...Base.propTypes,
    field: PropTypes.shape({
      dayLimit: PropTypes.string.isRequired,
      totalLimit: PropTypes.string.isRequired,
    }).isRequired,
    rules: PropTypes.shape({
      dayLimit: PropTypes.array,
      totalLimit: PropTypes.array,
    }),
  }
  static defaultProps = {
    label: '参与限制',
    rules: {
      dayLimit: [],
      totalLimit: [],
    },
  }

  constructor(props, ctx) {
    super(props, ctx);
    const { getFieldValue } = ctx.form;
    const field = props.field;
    const dayValue = getFieldValue(field.dayLimit);
    const totalValue = getFieldValue(field.totalLimit);
    this.state = getState(dayValue, totalValue);
  }

  /*
  componentWillReceiveProps(nextProps, nextContext) {
    this.form = nextContext.form;
    const { getFieldValue } = this.form;
    const field = this.props.field;
    const dayValue = getFieldValue(field.dayLimit);
    const totalValue = getFieldValue(field.totalLimit);
    this.setState(getState(dayValue, totalValue));
  }
  */

  totalValueShouldLargerThenDayValue = (r, v, cb) => {
    const field = this.props.field;
    const values = this.form.getFieldsValue([field.dayLimit, field.totalLimit]);
    if (values[field.dayLimit] > values[field.totalLimit]) {
      return cb('每天参与次数不能大于总共参与次数');
    }
    cb();
  }

  render() {
    const formProps = pick(this.props, ['label', 'extra', 'required', 'labelCol', 'wrapperCol']);
    const field = this.props.field;
    const { getFieldProps } = this.form;
    const rules = {
      day: [...this.props.rules.dayLimit],
      total: [...this.props.rules.totalLimit],
    };

    rules.day.push(this.totalValueShouldLargerThenDayValue);
    rules.total.push(this.totalValueShouldLargerThenDayValue);

    const err = this.form.getFieldError(field.totalLimit) || this.form.getFieldError(field.dayLimit);

    return (
      <FormItem
        {...formProps}
        help={this.props.help || err}
        validateStatus={err ? 'error' : 'success'}
      >
        <div style={{ marginBottom: 0 }}>
          <Checkbox
            checked={this.state.totalLimitChecked}
            onChange={e => {
              if (!e.target.checked) {
                this.form.setFieldsValue({
                  [field.totalLimit]: undefined,
                });
              }
              this.setState({ totalLimitChecked: e.target.checked });
            }}
          >限定每个用户总共参与</Checkbox>
          <InputNumber
            step={1}
            size="normal"
            disabled={!this.state.totalLimitChecked}
            {...getFieldProps(field.totalLimit, {
              rules: rules.total,
            })}
          />
        </div>
        <div>
          <Checkbox
            checked={this.state.dayLimitChecked}
            onChange={e => {
              if (!e.target.checked) {
                this.form.setFieldsValue({
                  [field.dayLimit]: undefined,
                });
              }
              this.setState({ dayLimitChecked: e.target.checked });
            }}
          >限定每个用户每日参与</Checkbox>
          <InputNumber
            step={1}
            size="normal"
            disabled={!this.state.dayLimitChecked}
            {...getFieldProps(field.dayLimit, {
              rules: rules.day,
            })}
          />
        </div>
      </FormItem>
    );
  }
}
