import React, {PropTypes} from 'react';
import { Row, Col, Button, Form, Input } from 'antd';
import {format} from '../../../common/dateUtils';

const FormItem = Form.Item;

const FundsSearchForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
    onAction: PropTypes.func,
  },

  getInitialState() {
    return {
      loading: true,
      formInit: {
        allActivityName: [],
        allActivityType: [],
        dataStatusList: [],
        merchantList: [],
      },
    };
  },

  handleSubmit(e) {
    e.preventDefault();
    const values = this.props.form.getFieldsValue();
    if (values.dateRange) {
      values.fromDate = format(values.dateRange[0]);
      values.toDate = format(values.dateRange[1]);
    }
    // 点搜索重置为第一页
    this.props.onSearch({...values, pageNum: 1});
  },

  handleClear(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  render() {
    const { getFieldProps } = this.props.form;

    const downloadSheetUrl = `${window.APP.mdataprodUrl}/midoffice/index.htm#/data/midoffice_pc_corp_subsidy_bill_daily`;

    return (<div>
      <Form horizontal className="advanced-search-form" onSubmit={this.handleSubmit} style={{padding: '16px 0px'}}>
        <Row>
          <Col span="8">
            <FormItem
              label="资金池名称："
              labelCol={{span: 5}}
              wrapperCol={{span: 16}}
            >
              <Input {...getFieldProps('poolName')} onBlur={this.checkMerchantPid} placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="资金池ID："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
            >
              <Input {...getFieldProps('poolId')} onBlur={this.checkMerchantPid} placeholder="请输入完整资金池id"/>
            </FormItem>
          </Col>
          <Col span="8">
            <div style={{float: 'right'}}>
              <Button type="primary" htmlType="submit" style={{marginRight: 5}}>搜索</Button>
              <Button type="ghost" style={{marginRight: 12}} onClick={this.handleClear}>清除条件</Button>
              <a target="_blank" href={downloadSheetUrl}>
                <Button type="ghost" style={{marginRight: 0}}>下载报表</Button>
              </a>
            </div>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(FundsSearchForm);
