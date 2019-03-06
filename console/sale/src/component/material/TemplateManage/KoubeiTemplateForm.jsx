import React, {PropTypes} from 'react';
import { DatePicker, Input, Select, Row, Col, Button, Form } from 'antd';
import {MaterialPropertiesMap} from '../common/MaterialLogMap';
import ajax from 'Utility/ajax';
import BuserviceUserSelect from '@alipay/opbase-biz-components/src/component/user-select/BuserviceUserSelect';
const RangePicker = DatePicker.RangePicker;
import {appendOwnerUrlIfDev} from '../../../common/utils';
import {format} from '../../../common/dateUtils';
const Option = Select.Option;
const FormItem = Form.Item;
import {History} from 'react-router';

const KoubeiTemplateForm = React.createClass({
  propTypes: {
    form: PropTypes.object,
    onSearch: PropTypes.func,
  },
  mixins: [History],
  getInitialState() {
    return {
      optionData: {},
    };
  },

  componentWillMount() {
    this.getWillSelectData('EFFECTIVE');
  },
  onSearch(e) {
    e.preventDefault();
    this.props.form.validateFields((error, values) => {
      const info = values;
      if (info.creator) {
        info.creator = info.creator.id;
      }
      if (info.activityTime) {
        info.startTime = format(info.activityTime[0]);
        info.endTime = format(info.activityTime[1]);
      }
      delete info.activityTime;
      if (info.targetBeginDate) {
        info.claimStartDate = format(info.targetBeginDate[0]);
        info.claimEndDate = format(info.targetBeginDate[1]);
        delete info.dateRange;
      }
      for (const v in info) {
        if (info[v] === undefined) {
          info[v] = '';
        }
        this.props.onSearch(info);
      }
    });
  },

  getWillSelectData(status) {
    // 初始化状态为生效中
    const info = {};
    info.status = status;
    this.props.onSearch(info);
    const params = {
      // stuffType: value, // 服务端没有使用这个参数
      mappingValue: 'kbasset.queryStuffAttribute',
      domain: 'KOUBEI',
    };
    ajax({
      // url: appendOwnerUrlIfDev('/sale/asset/stuffTemplateAttribute.json'),
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
          this.setState({
            optionData: obj2,
            childata: obj1,
          });
        }
      },
    });
  },

  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },
  // 遍历option
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
    const {getFieldProps, getFieldError} = this.props.form;
    return (<div>
      <Form className="advanced-search-form" horizontal onSubmit={this.onSearch}>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="业务来源：">
              <Select
                {...getFieldProps('bizSource')}
                style={{ width: '100%' }}
                placeholder="请选择">
                <Option key="KOUBEI_STUFF">口碑</Option>
                <Option key="KOUBEI_CODE">口碑码</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="创建人："
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              help={getFieldError('creator') || true}>
              <BuserviceUserSelect ajax={ajax}
                 placeholder="输入创建人名称"
                 size="large"
                 allowClear
                 notFoundContent=""
                 channel="inner_user_channels"
                 searchScope={window.APP.jobPath ? 'job_scope' : 'global'}
                 scopeTarget={window.APP.jobPath}
                {...getFieldProps('creator')}
                 buserviceUrl={window.APP.buserviceUrl}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="物料属性：">
              <Select
                {...getFieldProps('stuffType', {initialValue: ''})}
                style={{width: '100%'}}>
                <Option value="">全部</Option>
                <Option value="BASIC">{MaterialPropertiesMap.BASIC}</Option>
                <Option value="ACTIVITY">{MaterialPropertiesMap.ACTIVITY}</Option>
                <Option value="ACTUAL">{MaterialPropertiesMap.ACTUAL}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="模板名称：">
                <Input placeholder="请输入" {...getFieldProps('name')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="创建时间：">
            <RangePicker
              {...getFieldProps('activityTime')}
              showTime={false}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="物料类型："
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}>
              <Select
                {...getFieldProps('stuffAttrId', {initialValue: ''})}
                style={{width: '100%'}}>
                <Option value="">全部</Option>
                {this.eachOption(this.state.optionData)}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="模板ID：">
              <Input placeholder="请输入" {...getFieldProps('templateId', {
                rules: [{
                  required: false,
                  pattern: /^\d+$/,
                  message: '模板ID只能是数字',
                }],
              })}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="模板状态：">
              <Select
                  {...getFieldProps('status', {initialValue: 'EFFECTIVE'})}
                  style={{width: '100%'}}>
                <Option value="">全部</Option>
                <Option value="INVALID">已失效</Option>
                <Option value="EFFECTIVE">生效中</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8" offset="16" style={{textAlign: 'right'}}>
            <Button type="primary" htmlType="submit">搜索</Button>
            <Button onClick={this.reset}>清除条件</Button>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(KoubeiTemplateForm);
