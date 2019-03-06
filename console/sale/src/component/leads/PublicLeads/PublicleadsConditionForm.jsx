import React, { PropTypes } from 'react';
import { Input, Row, Col, Button, Form, Cascader, Select } from 'antd';
import BrandSelect from '../common/BrandSelect';
import { LeadsTagGroupForFilter, LeadsTagGroupPosSaleForFilter } from '../common/leadsTagEnums';
import { format } from '../../../common/dateUtils';
import { addAll } from '../../../common/treeUtils';
import queryIsPosSale from '../../../common/queryIsPosSale';
const FormItem = Form.Item;
import CategoryByArea from '../../../common/AreaCategory/mixins';
import { History } from 'react-router';
import Report from '../common/Report';
import permission from '@alipay/kb-framework/framework/permission';
const Option = Select.Option;
const OptGroup = Select.OptGroup;

const PublicleadsConditionForm = React.createClass({
  propTypes: {
    form: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object,
    onSearch: PropTypes.any,
  },
  mixins: [History, CategoryByArea],
  componentDidMount() {
    queryIsPosSale().then(isPosSale => {
      this.setState({ isPosSale });
      if (isPosSale) {
        const { getFieldValue, setFieldsValue } = this.props.form;
        if (!getFieldValue('labels') || getFieldValue('labels').length === 0) {
          setFieldsValue({ labels: ['POS_SALES'] });
        }
      }
    });
  },
  onSearch(e) {
    e.preventDefault();
    const info = { ...this.props.form.getFieldsValue() };
    if (info.dateRange) {
      info.claimStartDate = format(info.dateRange[0]);
      info.claimEndDate = format(info.dateRange[1]);
      delete info.dateRange;
    }
    const { area } = info;
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
    if (info.labels) {
      info.labels = info.labels.join(',');
    }
    // if (this.props.location.params) {
    //   info.pageSize = parseInt(this.props.location.query.pageSize, 10);
    // }
    this.props.onSearch(info);
    //  this.history.replaceState(null, '/private-leads/valid', info);
  },
  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },
  render() {
    const { getFieldProps, getFieldValue } = this.props.form;
    const { areas, categories, isPosSale } = this.state;
    return (<div>
      <Form className="advanced-search-form" horizontal>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="门店名称："><Input placeholder="请输入" disabled={!!getFieldValue('leadsId')} {...getFieldProps('name') } />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="leadsID：">
              <Input placeholder="请输入" {...getFieldProps('leadsId') } />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="公司名称：">
              <Input placeholder="请输入" disabled={!!getFieldValue('leadsId')} {...getFieldProps('companyName') } />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <div>
            <Col span="8">
              <FormItem
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                label="区域：">
                <Cascader style={{ width: '100%' }}
                  options={areas || []}
                  disabled={!!getFieldValue('leadsId')}
                  expandTrigger="hover"
                  placeholder="省-市-区"
                  {...getFieldProps('area', {
                    onChange: this.onAreaChange,
                  }) } />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                label="品类：">
                <Cascader
                  placeholder="请选择"
                  options={addAll(categories) || []}
                  style={{ width: '100%' }}
                  expandTrigger="hover"
                  disabled={(!!getFieldValue('leadsId') || (getFieldValue('area').length === 0)) ? true : false}
                  {...getFieldProps('categoryId') } />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                label="品牌名称：">
                <BrandSelect
                  disabled={!!getFieldValue('leadsId')}
                  {...getFieldProps('brand') }
                />
              </FormItem></Col>
          </div>
        </Row>
        <Row>
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
                {(isPosSale ? LeadsTagGroupPosSaleForFilter : LeadsTagGroupForFilter).map((group, index) => (
                  <OptGroup label={group.label} key={index}>
                    {group.children.map(item => <Option value={item.value}>{item.label}</Option>)}
                  </OptGroup>
                ))}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6"><div style={{ height: 2 }} /></Col>
          <Col span="10" offset="8">
            <div style={{ float: 'right' }}>
              <Button type="primary" style={{ marginRight: 5 }} onClick={this.onSearch}>搜索</Button>
              <Button type="ghost" style={{ marginRight: 12 }} onClick={this.reset}>清除条件</Button>
              {permission('PUBLIC_LEADS_REPORT') && <Report downloadeType="public" style={{ marginRight: 12 }} />}
            </div>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(PublicleadsConditionForm);
