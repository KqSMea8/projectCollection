import React, {PropTypes} from 'react';
import { DatePicker, Input, Select, Row, Col, Button, Form } from 'antd';
import {typeList, statusList, typeListAdd, typeListAddV2} from '../common/GoodsConfig';
import { getQueryFromURL } from '../../../common/utils';
import {format} from '../../../common/dateUtils';

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const FormItem = Form.Item;

const statusListV2 = [
  {key: 'INIT', value: '待生效', color: 'yellow'},
  {key: 'ONLINE', value: '已上架已开始', color: 'green'},
  {key: 'READY_TO_ONLINE', value: '已上架未开始', color: 'green'},
  {key: 'PAUSE', value: '已下架（暂停售卖）', color: ''},
  {key: 'INVALID', value: '已删除', color: ''},
];

const GoodsListForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
    isServiceStage: PropTypes.bool, // 判断当前是否是服务工作台,如果是则添加货架商品
    isOperatingStage: PropTypes.bool, // 判断当前是否是运营工作台,如果是则添加货架商品
    isV2: PropTypes.bool,
  },

  getInitialState() {
    return {
      currentTypeList: this.props.isV2 ? typeListAddV2 : typeList,
    };
  },

  componentDidMount() {
    const pid = getQueryFromURL(location.hash.split('?')[1]).pid;
    if (pid) {
      this.props.form.setFieldsValue({
        partnerId: pid,
      });
      this.props.onSearch({partnerId: pid});
    }
  },

  componentDidUpdate(prevProps) {
    if (this.props.isV2 !== prevProps.isV2 || this.props.isServiceStage !== prevProps.isServiceStage || this.props.isOperatingStage !== prevProps.isOperatingStage) {
      // 判断当前是否是服务工作台或运营中台,如果是则添加货架商品、购买型代金券
      this.getServiceStage();
    }
  },

  onSearch(e) {
    e.preventDefault();
    const info = {...this.props.form.getFieldsValue()};
    if (info.dateRange) {
      info.startDateStr = format(info.dateRange[0]);
      info.endDateStr = format(info.dateRange[1]);
      delete info.dateRange;
    }
    this.props.onSearch(info);
  },

  // 如果是服务中台则使用typeListAdd下拉选,即添加货架商品
  getServiceStage() {
    this.setState({
      currentTypeList: this.props.isV2 ? typeListAddV2 : typeListAdd,
    });
  },

  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  render() {
    const {getFieldProps} = this.props.form;
    const { isV2 } = this.props;
    const {currentTypeList} = this.state;
    return (<div>
      <Form horizontal className="advanced-search-form">
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="门店名称："><Input {...getFieldProps('shopName')} />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="商户名称："><Input {...getFieldProps('partnerName')} />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label={`${isV2 ? '商品' : '优惠'}名称：`}><Input {...getFieldProps('itemName')} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="门店ID："><Input {...getFieldProps('shopId')} />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="商户PID："><Input {...getFieldProps('partnerId')} />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label={`${isV2 ? '商品ID' : '优惠ID/商品ID'}：`}><Input {...getFieldProps('itemId')} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="创建时间：">
              <RangePicker {...getFieldProps('dateRange')} showTime={false}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label={`${isV2 ? '商品' : '优惠'}类型：`}>
              <Select
                style={{width: '100%'}}
                {...getFieldProps('type', {
                  initialValue: '',
                })}>
                <Option value="">全部</Option>
                {
                  currentTypeList && (currentTypeList || []).map((row) => {
                    return <Option key={row.key}>{row.value}</Option>;
                  })
                }
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label={`${isV2 ? '商品' : '优惠'}状态：`}>
              <Select
                style={{width: '100%'}}
                {...getFieldProps('status', {
                  initialValue: '',
                })}>
                <Option value="">全部</Option>
                {
                  (isV2 ? statusListV2 : statusList).map((row) => {
                    return <Option key={row.key}>{row.value}</Option>;
                  })
                }
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6"><div style={{height: 1}}></div></Col>
          <Col span="10" offset="8">
            <div style={{float: 'right'}}>
              <Button type="primary" onClick={this.onSearch}>搜索</Button>
              <Button onClick={this.reset}>清除条件</Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(GoodsListForm);
