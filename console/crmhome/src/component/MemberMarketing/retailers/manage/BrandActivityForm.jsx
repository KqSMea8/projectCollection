import React, {PropTypes} from 'react';
import {Button, Form, Select, Row, Col, Input} from 'antd';
import AutoInvitationTable from './AutoInvitationTable';
import ajax from '../../../../common/ajax';

const FormItem = Form.Item;
const Option = Select.Option;

const BrandActivityForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  getInitialState() {
    return {
      visible: false,
      isSupermarket: '',
    };
  },

  componentDidMount() {
    ajax({
      url: '/promo/recruit/queryList.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        this.setState({
          isSupermarket: res.isSupermarket,
        });
      },
    });
  },

  displayRender(label) {
    return label[label.length - 1];
  },

  handleSubmit(e) {
    // const params = this.props.form.getFieldsValue();
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      const params = {
        ...fieldsValue,
      };
      this.props.onSearch(params);
    });
  },

  handleClear(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  handleOk() {
    this.setState({
      visible: false,
    });
  },
  handleCancel() {
    this.setState({
      visible: false,
    });
  },

  render() {
    const {getFieldProps} = this.props.form;
    const {isSupermarket} = this.state;
    return (
      <div>
        <Form inline form={this.props.form} onSubmit={this.handleSubmit} className="advanced-search-form">
          <Row key="1" style={{marginLeft: '15px'}}>
            <Col span="8">
              <FormItem label="活动名称：">
                <Input size="large"
                       style={{width: 240}}
                       placeholder="请输入活动名称"
                       {...getFieldProps('activityName')}
                />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                id="inviteStatus"
                label="邀约状态：">
                <Select id="inviteStatus"
                        placeholder="请选择邀约状态"
                        style={{width: 240}}
                        size="default"
                        {...getFieldProps('inviteStatus', {
                          initialValue: 'PLAN_GOING',
                        })}
                >
                  <Option key="PLAN_GOING">所有邀约状态</Option>
                  <Option key="INIT">未确认</Option>
                  <Option key="SUCCESS">已确认</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                id="statusSelect"
                label="活动状态：">
                <Select id="statusSelect"
                        placeholder="请选择活动状态"
                        style={{width: 240}}
                        size="default"
                        {...getFieldProps('activityStatus', {
                          initialValue: 'all',
                        })}
                >
                  <Option key="all">所有活动状态</Option>
                  <Option key="PLAN_GOING">招商中</Option>
                  <Option key="STARTED">活动开始</Option>
                  <Option key="CLOSED">活动已下架</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row key="2" style={{marginLeft: '15px', marginTop: '10px'}}>
            {
              isSupermarket ?
                [
                  (<Col span="4">
                    <AutoInvitationTable />
                  </Col>),
                  (<Col span="8" offset="12" style={{textAlign: 'right', paddingRight: 15}}>
                    <Button type="primary" onClick={this.handleSubmit}>搜索</Button>
                    <Button type="ghost" onClick={this.handleClear}>清除条件</Button>
                  </Col>)
                ]
                :
                (<Col span="8" offset="16" style={{textAlign: 'right', paddingRight: 15}}>
                  <Button type="primary" onClick={this.handleSubmit}>搜索</Button>
                  <Button type="ghost" onClick={this.handleClear}>清除条件</Button>
                </Col>)
            }


            {/* <Col span="8">
             <div style={{float: 'right', marginRight: '15px'}}>
             <Button type="primary" onClick={this.handleSubmit}>搜索</Button>
             <Button type="ghost" onClick={this.handleClear}>清除条件</Button>
             </div>
             </Col> */}
          </Row>
        </Form>
      </div>);
  },
});

export default Form.create()(BrandActivityForm);
