import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, DatePicker, Input, Button, Radio } from 'antd';
import MerchantPidSelect from '../../common/MerchantPidSelect';
import ShopSelect from '../../common/ShopSelect';
import { FILTER_BY } from './enums';
import moment from 'moment';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class FilterForm extends Component {
  static propTypes = {
    filterBy: PropTypes.string,
    onSwitchFilterBy: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  state = {
    shopId: null,
  }

  onShopSelectChange = (value) => {
    this.props.form.setFieldsValue({
      bindTargetId: value,
    });
    this.setState({
      shopId: value,
    });
  }

  onFilterByChange = e => {
    const filterBy = e.target.value;
    this.props.onSwitchFilterBy(filterBy);
    this.props.form.resetFields();
  }

  onSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { filterBy } = this.state;
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const keys = ['bindTargetId', 'merchantPrincipalId'];
        const params = keys
          .filter(k => values[k] !== undefined)
          .reduce((obj, k) => ({ ...obj, [k]: values[k] }), {});
        const { staff, bindTime } = values;
        if (staff && staff.id) {
          params.staffPrincipalName = staff.id;
        }
        if (bindTime && bindTime[0] && bindTime[1]) {
          params.gmtModifiedStart = moment(bindTime[0]).format('YYYY-MM-DD');
          params.gmtModifiedEnd = moment(bindTime[1]).format('YYYY-MM-DD');
        }
        this.props.onSubmit(params, filterBy);
      }
    });
  }

  onReset = (e) => {
    this.props.form.resetFields();
    this.setState({
      shopId: null,
    });
    this.onSubmit(e);
  }

  render() {
    const { getFieldProps } = this.props.form;
    const { filterBy } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form
        horizontal
        className="advanced-search-form"
        onSubmit={this.onSubmit}
        onReset={this.onReset}>
        <Row style={{margin: '5px 0 10px'}}>
          <Col span="24">
            <FormItem>
              <RadioGroup
                value={filterBy}
                defaultValue={filterBy}
                size="default"
                onChange={this.onFilterByChange}
              >
                <RadioButton value={FILTER_BY.SHOP}>查看绑定门店的数据</RadioButton>
                <RadioButton value={FILTER_BY.MERCHANT}>查看绑定商户的数据</RadioButton>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
        {filterBy === FILTER_BY.SHOP && (
          <Col span="8">
            <FormItem
              label="门店名称："
              {...formItemLayout}
            >
              <ShopSelect onChange={this.onShopSelectChange} value={this.state.shopId} />
            </FormItem>
          </Col>
        )}
          <Col span="8">
            <FormItem
              label="商户名称："
              {...formItemLayout}
            >
              <MerchantPidSelect
                {...getFieldProps('merchantPrincipalId') }
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="绑定时间："
              {...formItemLayout}
            >
              <RangePicker
                {...getFieldProps('bindTime')}
                disabledDate={current => (
                  current && (
                    (current.getTime() > Date.now()) ||
                    (current.getTime() <= Date.now() - 90 * 24 * 60 * 60 * 1000)
                  )
                )}
                format="yyyy-MM-dd"
              />
            </FormItem>
          </Col>
        </Row>
        {filterBy === FILTER_BY.SHOP && (
        <Row>
          <Col span="8">
            <FormItem
              label="门店ID："
              {...formItemLayout}
            >
              <Input placeholder="请输入" {...getFieldProps('bindTargetId') } />
            </FormItem>
          </Col>
        </Row>
        )}
        <Row>
          <Col span="8" offset="16">
            <div style={{ float: 'right' }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 12 }}>
                搜索
              </Button>
              <Button
                type="ghost"
                htmlType="reset"
                style={{ marginRight: 12 }}>
                清除条件
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(FilterForm);
