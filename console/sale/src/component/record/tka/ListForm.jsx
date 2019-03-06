import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Row, Col, Button, Form, Checkbox, Select } from 'antd';
import moment from 'moment';
import MerchantSelect from './component/MerchantSelect';
import SubCompanyInput from './component/SubCompanyInput';
import BdUserSelect from './component/BdUserSelect';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

class ListForm extends React.Component {
  static propTypes = {
    onSearch: PropTypes.func,
    initQuery: PropTypes.any, // 初始化查询参数
  };

  static defaultProps = {
    onSearch: () => {},
  };

  constructor(props) {
    super(props);

    const dd = new Date();
    dd.setDate(dd.getDate() - 30);
    const last30Str = moment(dd).format('YYYY-MM-DD');
    const todayStr = moment(new Date()).format('YYYY-MM-DD');
    this.dataRangeToday = [`${todayStr} 00:00`, `${todayStr} 23:59`];
    this.dataRangeRecent30 = [`${last30Str} 00:00`, `${todayStr} 23:59`];
  }

  componentDidMount() {
    if (this.props.initQuery) {
      this.onSearch();
    }
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.onSearch();
    }
  }

  onSearch() {
    this.props.form.validateFields((error, values) => {
      if (error) return;
      const beginDate = values.dateRange && values.dateRange[0];
      const endDate = values.dateRange && values.dateRange[1];
      if (beginDate instanceof Date) {
        beginDate.setHours(0);
        beginDate.setMinutes(0);
      }
      if (endDate instanceof Date) {
        endDate.setHours(23);
        endDate.setMinutes(59);
      }
      const param = {
        ...values,
        beginDate: beginDate instanceof Date ? moment(beginDate).format('YYYY-MM-DD HH:mm') : beginDate,
        endDate: endDate instanceof Date ? moment(endDate).format('YYYY-MM-DD HH:mm') : endDate,
        customerType: 'MERCHANT',
        isContainSub: values.isContainSub ? '1' : '0',
      };
      delete param.dateRange;
      this.props.onSearch(param);
    });
  }

  onChangeDate(dataRange) {
    this.props.form.setFieldsValue({
      dateRange: dataRange,
    });
  }

  onReset() {
    this.props.form.setFieldsValue({
      dateRange: undefined,
      visitWay: undefined,
      customerId: undefined,
      visitPurposes: undefined,
      auditResult: undefined,
      companyName: undefined,
      visitPersonId: undefined,
      ownerId: undefined,
      isContainSub: undefined,
    });
  }

  render() {
    const { initQuery } = this.props;
    const { getFieldProps, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };
    return (<div onKeyDown={this.onKeyDown.bind(this)}>
        <Form className="ant-advanced-search-form" horizontal>
          <Row>
            <Col span="16">
              <FormItem
                label="拜访时间："
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
              >
                <RangePicker
                  size="default"
                  style={{ width: '60%' }}
                  format="yyyy-MM-dd"
                  {...getFieldProps('dateRange', {
                    initialValue: initQuery && [initQuery.beginDate, initQuery.endDate] || this.dataRangeRecent30,
                  })}
                />
                <Button
                  size="default"
                  type={getFieldValue('dateRange') === this.dataRangeToday ? 'primary' : 'ghost'}
                  onClick={this.onChangeDate.bind(this, this.dataRangeToday)}
                  style={{ marginLeft: 8 }}
                >今日</Button>
                <Button
                  size="default"
                  type={getFieldValue('dateRange') === this.dataRangeRecent30 ? 'primary' : 'ghost'}
                  onClick={this.onChangeDate.bind(this, this.dataRangeRecent30)}
                  style={{ marginLeft: 8 }}
                >近30日</Button>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="拜访方式：" {...formItemLayout}>
                <Select {...getFieldProps('visitWay', {
                  initialValue: initQuery && initQuery.visitWay || '',
                })} placeholder="请输入" size="default">
                  <Option value="VISIT_SPEAK">面谈</Option>
                  <Option value="VISIT_PHONE">电话</Option>
                  <Option value="VISIT_MERCHANT">商户来访</Option>
                  <Option value="VISIT_OTHER">其他</Option>
                  <Option value="">所有方式</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="拜访商户：" {...formItemLayout}>
                <MerchantSelect {...getFieldProps('customerId', {
                  initialValue: initQuery && initQuery.customerId,
                })} isAllMerchant placeholder="请输入商户名或商户PID" />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="拜访目的：" {...formItemLayout}>
                <Select {...getFieldProps('visitPurposes', {
                  initialValue: initQuery && initQuery.visitPurposes,
                })} placeholder="请输入" size="default" allowClear multiple combobox={false}>
                  <Option value="NEED_INTENT_TALK">需求&意向沟通</Option>
                  <Option value="SIGN_PLAN_TALK">签约计划沟通</Option>
                  <Option value="ACTIVITY_REPLAY">活动复盘</Option>
                  <Option value="OTHER_TKA">其他</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="审阅结果: " {...formItemLayout}>
                <Select {...getFieldProps('auditResult', {
                  initialValue: initQuery && initQuery.auditResult || '',
                })} placeholder="请选择">
                  <Option value="1">有效拜访</Option>
                  <Option value="0">无效拜访</Option>
                  <Option value="">所有拜访</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="拜访分公司：" {...formItemLayout} >
                <SubCompanyInput
                  {...getFieldProps('companyName', {
                    initialValue: initQuery && initQuery.companyName,
                  })}
                  showAddLink={false}
                  merchantId={getFieldValue('customerId')}
                />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem {...formItemLayout} label="拜访人：">
                <BdUserSelect {...getFieldProps('visitPersonId', {
                  initialValue: initQuery && initQuery.visitPersonId,
                })} />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="归属人：" {...formItemLayout} >
                <div style={{ display: 'flex' }}>
                  <BdUserSelect {...getFieldProps('ownerId', { initialValue: initQuery && initQuery.ownerId })}
                    style={{ flex: 1 }}
                    doSearch={this.onSearch.bind(this)}
                    isDefaultChooseSelf={!initQuery} />
                  <Checkbox {...getFieldProps('isContainSub', {
                    initialValue: initQuery && initQuery.isContainSub,
                    valuePropName: 'checked',
                  })} style={{ marginLeft: 8 }}>含其下属</Checkbox>
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24" className="ft-right">
              <Button type="primary" onClick={this.onSearch.bind(this)}>搜索</Button>
              <Button className="fn-ml8" type="ghost" onClick={this.onReset.bind(this)}>清除条件</Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ListForm);
