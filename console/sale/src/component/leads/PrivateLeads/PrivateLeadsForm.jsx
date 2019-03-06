import React, {PropTypes} from 'react';
import { DatePicker, Input, Select, Row, Col, Button, Form } from 'antd';
import BrandSelect from '../common/BrandSelect';
import disabledFutureDate from '../../../common/disableFutureDate';
import {format} from '../../../common/dateUtils';
import CategorySelect from '../../../common/CategorySelect';
import AreaSelect from '../../../common/AreaSelect';
import {History} from 'react-router';
import { LeadsTagGroupForFilter } from '../common/leadsTagEnums';

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const OptGroup = Select.OptGroup;
const FormItem = Form.Item;

const PrivateLeadsForm = React.createClass({
  propTypes: {
    form: PropTypes.object,
    location: PropTypes.object,
  },
  mixins: [History],
  componentWillMount() {
    const info = {...this.props.location.query};
    if (info.claimStartDate) {
      info.dateRange = [info.claimStartDate, info.claimEndDate];
      delete info.claimStartDate;
      delete info.claimEndDate;
    }
    if (info.provinceCode) {
      info.area = [info.provinceCode, info.cityCode, info.districtCode];
      delete info.provinceCode;
      delete info.cityCode;
      delete info.districtCode;
    }
    if (info.categoryId) {
      info.categoryId = info.categoryId.split(',');
    }
    if (info.brandId) {
      info.brand = {
        id: info.brandId,
        name: info.brandName,
      };
      delete info.brandId;
      delete info.brandName;
    }
    if (info.labels) {
      info.labels = info.labels.split(',');
    }
    this.props.form.setFieldsValue(info);
  },
  onSearch(e) {
    e.preventDefault();
    const info = {...this.props.form.getFieldsValue()};
    if (info.dateRange) {
      info.claimStartDate = format(info.dateRange[0]);
      info.claimEndDate = format(info.dateRange[1]);
      delete info.dateRange;
    }
    const {area} = info;
    if (area) {
      info.provinceCode = area[0];
      info.cityCode = area[1];
      info.districtCode = area[2];
      delete info.area;
    }

    if (info.brand) {
      info.brandId = info.brand.id;
      info.brandName = info.brand.name;
      delete info.brand;
    }
    if (info.categoryId) {
      info.categoryId = info.categoryId.join(',');
    }
    info._ts = Date.now();
    if (this.props.location.query.pageSize) {
      info.pageSize = parseInt(this.props.location.query.pageSize, 10);
    }
    if (info.labels) {
      info.labels = info.labels.join(',');
    }
    // 给this.props.location.query设置info参数
    this.history.replaceState(null, '/private-leads/valid', info);
  },
  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },
  render() {
    const {getFieldProps, getFieldValue} = this.props.form;
    // const options = [];
    // if (!permission('LEADS_QUERY_WAIT_IDENTIFIED')) {
    //   options.push(<Option key="" value="">全部状态</Option>,
    //   <Option key="CLAIMED" value="CLAIMED">已认领</Option>,
    //   // <Option key="CONFIRMING" value="CONFIRMING">待商户确认</Option>,
    //   <Option key="OPENING" value="OPENING">开店中</Option>);
    // } else {
    //   options.push(<Option key="" value="">全部状态</Option>,
    //   <Option key="CLAIMED" value="CLAIMED">已认领</Option>,
    //   <Option key="OPENING" value="OPENING">开店中</Option>);
    // }
    return (<div>
      <Form className="advanced-search-form" horizontal>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="认领时间：">
              <RangePicker
                disabled={!!getFieldValue('leadsId')}
                {...getFieldProps('dateRange')}
                disabledDate={disabledFutureDate}
                showTime={false}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="leadsID：">
              <Input placeholder="请输入" {...getFieldProps('leadsId')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="公司名称：">
              <Input placeholder="请输入" disabled={!!getFieldValue('leadsId')} {...getFieldProps('companyName')}/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="门店名称："><Input placeholder="请输入" disabled={!!getFieldValue('leadsId')} {...getFieldProps('name')}/>
            </FormItem></Col>
          <div>
            <Col span="8"><FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="leads状态：">
              <Select
                disabled={!!getFieldValue('leadsId')}
                {...getFieldProps('leadsStatus', {initialValue: ''})}
                style={{width: '100%'}}>
                <Option key="" value="">全部状态</Option>
                <Option key="CLAIMED" value="CLAIMED">已认领</Option>
                <Option key="OPENING" value="OPENING">开店中</Option>
              </Select></FormItem>
            </Col>
            <Col span="8">
              <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="品牌：">
                <BrandSelect
                  brandName={this.props.location.query.brandName}
                  disabled={!!getFieldValue('leadsId')}
                  {...getFieldProps('brand')}
                />
              </FormItem></Col>
          </div>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="区域：">
              <AreaSelect
                disabled={!!getFieldValue('leadsId')}
                {...getFieldProps('area')}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="品类：">
              <CategorySelect
                withAll
                disabled={!!getFieldValue('leadsId')}
                {...getFieldProps('categoryId')}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="Leads标签：">
              <Select
                placeholder="请选择"
                disabled={(!!getFieldValue('leadsId'))}
                style={{ width: '100%' }}
                multiple
                showSearch={false}
                {...getFieldProps('labels') }>
                {LeadsTagGroupForFilter.map((group, index) => (
                  <OptGroup label={group.label} key={index}>
                    {group.children.map(item => <Option value={item.value}>{item.label}</Option>)}
                  </OptGroup>
                ))}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="2" offset="20" style={{textAlign: 'right'}}>
            <Button type="primary" onClick={this.onSearch}>搜索</Button>
            &nbsp;
          </Col>
          <Col span="2" style={{textAlign: 'right'}}>
            <Button onClick={this.reset}>清除条件</Button>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(PrivateLeadsForm);
