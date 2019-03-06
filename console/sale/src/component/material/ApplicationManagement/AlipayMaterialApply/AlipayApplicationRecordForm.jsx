import React, { PropTypes } from 'react';
import { Input, Row, Col, Button, Form, DatePicker, Select, message } from 'antd';
import { History } from 'react-router';
import ajax from 'Utility/ajax';
import { appendOwnerUrlIfDev } from '../../../../common/utils';
import disabledFutureDate from '../../../../common/disableFutureDate';
import { format } from '../../../../common/dateUtils';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

const ApplicationRecordForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
    bizSourceOptions: PropTypes.any,
    bizSourceData: PropTypes.string,
    // AlipayApplicationRecordList里的函数用于控制ApplicationRecordTable里的table展示
    rebackBizSourceData: PropTypes.func,
  },

  mixins: [History],

  getInitialState() {
    return {
      optionData: {},
      alipayOptions: {
        ISV_STUFF: {
          '502': '申请中',
          '503': '审核中',
          '504': '发货中',
          '501': '发货完毕',
          '500': '已驳回',
        },
        TRANSFER_CODE: {
          '600': '待制作',
          '601': '制作中',
          '602': '已寄送',
        },
      },
    };
  },
  componentWillMount() {
    // 初始化获取相应的权限后展示效果
    this.getSelectData(this.props.bizSourceData);
  },

  onSearch(e) {
    e.preventDefault();
    const info = {...this.props.form.getFieldsValue()};
    const info2 = {};
    if (info.orderId) {
      info2.orderId = info.orderId;
      info2.bizSource = info.bizSource;
      this.props.onSearch(info2);
    } else {
      if (info.dateRange) {
        info.gmtStart = format(info.dateRange[0]);
        info.gmtEnd = format(info.dateRange[1]);
      }
      this.props.onSearch(info);
    }
  },

  // 当切换业务来源时触发查询请求
  onBizSearch(value) {
    const info = {...this.props.form.getFieldsValue()};
    info.bizSource = value;
    const info2 = {};
    if (info.orderId && value) {
      info2.orderId = info.orderId;
      info2.bizSource = value;
      this.props.onSearch(info2);
    } else {
      if (info.dateRange) {
        info.gmtStart = format(info.dateRange[0]);
        info.gmtEnd = format(info.dateRange[1]);
      }
      this.props.onSearch(info);
    }
  },

  // 根据不同的业务来源选择 获取物料类型的下拉数据
  getSelectData(value) {
    this.props.rebackBizSourceData(value);
    // 当切换业务来源时触发查询请求
    this.onBizSearch(value);
    // 当切换业务来源时触发申请状态和物料类型重新拉 下拉选的数据
    this.props.form.resetFields(['status']);
    this.props.form.resetFields(['stuffAttrId']);

    const self = this;
    const params = {
      mappingValue: 'kbasset.queryStuffAttribute',
    };
    if (!value) {
      this.setState({
        applicantLabel: 'ISV/商户名称：',
      });
      return;
    }
    if (value === 'ISV_STUFF') {
      params.domain = 'ALIPAY';
      this.setState({
        applicantLabel: 'ISV名称：',
      });
    }
    if (value === 'TRANSFER_CODE') {
      params.domain = 'MERCHANT';
      this.setState({
        applicantLabel: '商户名称：',
      });
    }
    ajax({
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
          self.setState({
            optionData: obj2,
          });
        } else if (result.status === 'failed') {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
      error: () => {
        self.setState({
          optionData: {},
        });
      },
    });
  },

  // 根据业务来源的不同 展示不同下拉数据
  getStatus(bizSource) {
    const {alipayOptions} = this.state;
    const obj = alipayOptions[bizSource];
    const Options = [];
    for (const val in obj) {
      if (obj.hasOwnProperty) {
        Options.push(<Option key={val} value={val}>{obj[val]}</Option>);
      }
    }
    return Options;
  },
  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },
  // 遍历
  eachOption(obj) {
    const Options = [];
    for (const val in obj) {
      if (obj.hasOwnProperty) {
        Options.push(<Option key={val} value={val}>{obj[val]}</Option>);
      }
    }
    return Options;
  },
  render() {
    const { getFieldProps, getFieldValue } = this.props.form;
    return (<div>
      <Form className="advanced-search-form" horizontal onSubmit={this.onSearch}>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="业务来源：">
              <Select
                {...getFieldProps('bizSource', {initialValue: this.props.bizSourceData})}
                style={{ width: '100%' }}
                placeholder={this.props.bizSourceData ? '请选择' : '暂无权限'}
                onSelect={this.getSelectData}>
                {this.props.bizSourceOptions}
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="申请单号："
            >
              <Input
                placeholder="请输入"
                {...getFieldProps('orderId')}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="物料类型："
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              <Select
                disabled={!getFieldValue('bizSource')}
                {...getFieldProps('stuffAttrId', { initialValue: '' })}
                style={{ width: '100%' }}
              >
                <Option value="">全部</Option>
                {this.eachOption(this.state.optionData)}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="申请时间："
            >
              <RangePicker
                {...getFieldProps('dateRange')}
                disabledDate={disabledFutureDate}
                showTime={false} style={{ width: '100%' }}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="申请状态：">
              <Select
                disabled={!getFieldValue('bizSource')}
                {...getFieldProps('status', { initialValue: '' })}
                style={{ width: '100%' }}>
                <Option value="">全部</Option>
                {this.getStatus(getFieldValue('bizSource'))}
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label={this.state.applicantLabel}
            >
              <Input
                placeholder="请输入"
                {...getFieldProps('applicant')}
              />
            </FormItem>
          </Col>
        </Row>
        <div style={{ float: 'right' }}>
          <Button style={{ marginRight: 12 }} disabled={this.props.bizSourceData ? null : true} type="primary" htmlType="submit" onClick={this.onSearch}>{this.props.bizSourceData ? '搜索' : '暂无权限'}</Button>
          <Button style={{ marginRight: 12 }} onClick={this.reset}>清除条件</Button>
        </div>
      </Form>
    </div>);
  },
});

export default Form.create()(ApplicationRecordForm);
