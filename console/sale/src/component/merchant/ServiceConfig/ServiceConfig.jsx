import React, {PropTypes} from 'react';
import {Form, Select, Row, Col, Button, message, InputNumber, Modal} from 'antd';
import ajax from 'Utility/ajax';
import AreaCategoryTable from '../../../common/AreaCategoryTable/AreaCategoryTable';
import {parseAreaCategoryTableParam} from '../../../common/AreaCategoryTable/util';
import classnames from 'classnames';
const FormItem = Form.Item;

const ServiceConfig = React.createClass({
  propTypes: {
    form: PropTypes.object,
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      Loading: true,
      postLoading: false,
      merchant: {},
      areaCategoryData: [],
    };
  },

  componentDidMount() {
    this.fetchMerchant();
  },

  fetchMerchant() {
    ajax({
      url: '/sale/merchant/initMerchantConfig.json',
      method: 'GET',
      data: {
        partnerId: this.props.params.pid,
      },
      type: 'json',
      success: (result) => {
        const json = result.data;

        this.setState({
          Loading: false,
          merchant: json,
          areaCategoryData: json.areaConfigVOs,
        });
      },
    });
  },

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((error, values) => {
      if (!error) {
        // 针对泛行业的数据处理
        const firstCategories = 'categories-' + values.keys[0];
        // console.log(values.keys[0]);
        // console.log(values);
        if (!values[firstCategories] || values[firstCategories][0] === 'UNIVERSAL') {
          for (const i in values.keys) {
            /*eslint-disable */
            if (values.keys.hasOwnProperty(i)) {
              // console.log(values.keys[i]);
              const item = 'categories-' + values.keys[i];
              values[item] = ['UNIVERSAL'];
            }
            /*eslint-enable */
          }
          values.areaConstraintType = 'categoryLabels';
        } else {
          values.areaConstraintType = 'categories';
        }
        const params = parseAreaCategoryTableParam(values);
        params.partnerId = this.props.params.pid;
        params.id = this.state.merchant && this.state.merchant.id;

        this.setState({postLoading: true});

        ajax({
          url: '/sale/merchant/configMerchant.json',
          method: 'POST',
          data: params,
          type: 'json',
          success: (res) => {
            if (res.status === 'succeed') {
              Modal.success({
                title: '修改成功',
                content: '',
                okText: '知道了，关闭窗口',
                onOk() {
                  window.close();
                },
              });
            } else {
              message.error(res.resultMsg || '修改失败');
            }
          },
          error: (res) => {
            message.error(res.resultMsg || '修改失败');
          },
          complete: () => {
            this.setState({postLoading: false});
          },
        });
      }
    });
  },

  render() {
    const {getFieldProps, getFieldError} = this.props.form;
    const merchant = this.state.merchant;

    const getTreeOption = {
      url: '/kbConfig/queryBrokerAreaCategory.json',
      params: {
        brokerId: this.props.params.pid,
      },
    };

    const isShowParentTreeSelect = true;

    return (<div>
      <div className="app-detail-header">业务配置</div>
        <div className="app-detail-content" style={{padding: 24}}>
        <Form horizontal id="serviceConfig-form">
          <FormItem
            label="服务商名称："
            labelCol={{span: 6}}
            wrapperCol={{span: 6}}>
            <p className="ant-form-text" id="serviceName" name="serviceName">{merchant.merchantName}</p>
          </FormItem>

          <FormItem
            label="商户PID："
            labelCol={{span: 6}}
            wrapperCol={{span: 14}}>
            <p className="ant-form-text">{merchant.partnerId}</p>
          </FormItem>

          <FormItem
            label="服务区域品类："
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}>
            <AreaCategoryTable
              style={{width: 600}}
              isShowParentTreeSelect={isShowParentTreeSelect}
              getTreeOption={getTreeOption}
              form={this.props.form}
              data={this.state.areaCategoryData} />
          </FormItem>

          <FormItem
            id="serviceLevel"
            label="服务商等级："
            required
            labelCol={{span: 6}}
            wrapperCol={{span: 7}}>
              <Select size="large" {...getFieldProps('serviceLevel', {
                initialValue: merchant.serviceLevel,
                rules: [{
                  required: true,
                }],
              })}>
                <Option value="0">无等级</Option>
                <Option value="1">一级</Option>
                <Option value="2">二级</Option>
                <Option value="3">三级</Option>
              </Select>
          </FormItem>

          <FormItem
            id="leadsLimit"
            label="每人leads上限："
            validateStatus={
              classnames({
                error: !!getFieldError('leadsLimit'),
              })}
            required
            help={(getFieldError('leadsLimit') && '请输入每人leads上限') || '上限50000个'}
            labelCol={{span: 6}}
            wrapperCol={{span: 10}}>
            <InputNumber size="large" min={1} max={50000} {...getFieldProps('leadsLimit', {
              initialValue: merchant.leadsLimit,
              rules: [{
                required: true,
                type: 'number',
                min: 1,
                max: 50000,
              }],
            })} /> 个
          </FormItem>

          <FormItem
            label="领取的leads保护期时长："
            validateStatus={
              classnames({
                error: !!getFieldError('keepLeadsProtectDay'),
              })}
            required
            help={(getFieldError('keepLeadsProtectDay') && '请输入领取的leads保护期时长') || '上限20天'}
            labelCol={{span: 6}}
            wrapperCol={{span: 10}}>
            <InputNumber size="large" min={1} max={20} {...getFieldProps('keepLeadsProtectDay', {
              initialValue: merchant.keepLeadsProtectDay,
              rules: [{
                required: true,
                type: 'number',
                min: 1,
                max: 20,
              }],
            })} /> 天
          </FormItem>

          <FormItem
            label="业务员上限："
            validateStatus={
              classnames({
                error: !!getFieldError('salesMaxLimit'),
              })}
            labelCol={{span: 6}}
            required
            help={(getFieldError('salesMaxLimit') && '请输入业务员上限') || '上限5000人'}
            wrapperCol={{span: 10}}>
            <InputNumber size="large" min={1} max={5000} {...getFieldProps('salesMaxLimit', {
              initialValue: merchant.salesMaxLimit,
              rules: [{
                required: true,
                type: 'number',
                min: 1,
                max: 5000,
              }],
            })} /> 人
          </FormItem>

          <Row>
            <Col span="16" offset="6">
              <Button size="large"
                      style={{marginRight: 8}}
                      type="primary"
                      htmlType="submit"
                      disabled={this.state.Loading}
                      loading={this.state.postLoading}
                      onClick={this.handleSubmit}>确定</Button>
            </Col>
          </Row>
        </Form>

      </div>
    </div>);
  },
});

export default Form.create()(ServiceConfig);
