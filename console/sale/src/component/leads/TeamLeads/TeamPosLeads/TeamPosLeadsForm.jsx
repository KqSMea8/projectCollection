import React, { PropTypes } from 'react';
import { Input, Row, Col, Button, Form, Cascader, Select } from 'antd';
// import BrandSelect from '../common/BrandSelect';
import { PosLeadsTagEnums } from '../../common/PosLeadsTagEnums';
// import { format } from '../../../common/dateUtils';
// import { addAll } from '../../../common/treeUtils';
const FormItem = Form.Item;
import CategoryByArea from '../../../../common/AreaCategory/mixins';
import { History } from 'react-router';
const Option = Select.Option;
// const OptGroup = Select.OptGroup;

const TeamPosLeadsForm = React.createClass({
  propTypes: {
    form: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object,
    onSearch: PropTypes.any,
  },
  mixins: [History, CategoryByArea],
  componentWillMount() {
  },
  onSearch(e) {
    e.preventDefault();
    const info = { ...this.props.form.getFieldsValue() };
    const { area } = info;
    if (area) {
      info.provinceCode = area[0];
      info.cityCode = area[1];
      info.districtCode = area[2];
      delete info.area;
    }
    if (info.labelTypes) {
      info.labelTypes = info.labelTypes.join(',');
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
    const { getFieldProps } = this.props.form;
    const { areas } = this.state;
    return (<div>
      <Form horizontal>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="门店ID：">
              <Input placeholder="请输入门店ID" {...getFieldProps('shopId') } />
            </FormItem>
          </Col>
          <Col span="8">
          <FormItem
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="门店地址：">
            <Cascader style={{ width: '100%' }}
              options={areas || []}
              // disabled={!!getFieldValue('leadsId')}
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
              label="门店名称：">
              <Input placeholder="请输入门店名称"
                // disabled={!!getFieldValue('leadsId')}
                {...getFieldProps('name') } />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="Leads标签：">
              <Select
                placeholder="请选择"
                // disabled={(!!getFieldValue('leadsId'))}
                style={{ width: '100%' }}
                multiple
                showSearch={false}
                {...getFieldProps('labelTypes') }>
                {PosLeadsTagEnums.map((item) => (
                  <Option value={item.key}>{item.value}</Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span="13" offset="3" style={{textAlign: 'right'}}>
            <Button type="primary" onClick={this.onSearch}>搜索</Button>
            &nbsp; &nbsp;
            <Button onClick={this.reset}>清除条件</Button>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(TeamPosLeadsForm);
