import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Input, Radio, Select } from 'antd';
import noop from 'lodash/noop';
import KbSalesUserSelect, {UserType} from '@alipay/kb-framework-components/lib/biz/user/KbSalesUserSelect';

const FormItem = Form.Item;
const Option = Select.Option;

import {MerchantTag} from '../common/enum';

class SearchForm extends React.Component {
  static propTypes = {
    onSearch: PropTypes.func,
    loading: PropTypes.bool
  };

  static defaultProps = {
    onSearch: noop,
    loading: false
  };

  handleSubmit = () => {
    const { validateFieldsAndScroll } = this.props.form;
    const { onSearch } = this.props;
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      onSearch(values);
    });
  };

  handleReset = () => {
    const { resetFields } = this.props.form;
    resetFields();
  };

  render() {
    const { loading, form } = this.props;
    const { getFieldProps } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };
    const merchantnameProps = getFieldProps('name');
    const merchantPIDProps = getFieldProps('pid');
    const merchantTagProps = getFieldProps('label', { initialValue: '' });
    const bdProps = getFieldProps('bd');
    const isSelfProps = getFieldProps('isSelf', { initialValue: '0' });
    return (
      <Form horizontal className="ant-advanced-search-form" style={{ marginTop: 16, marginBottom: 16 }}>
        <Row gutter={16}>
          <Col sm={8}>
            <FormItem
              label="商户名称"
              {...formItemLayout}
            >
              <Input {...merchantnameProps} placeholder="" size="default" />
            </FormItem>
          </Col>
          <Col sm={8}>
           <FormItem
              label="商户PID"
              {...formItemLayout}
            >
              <Input {...merchantPIDProps} placeholder="" size="default" />
            </FormItem>
         </Col>
          <Col sm={8}>
            <FormItem
              label="商户标签"
              {...formItemLayout}
            >
              <Select {...merchantTagProps}>
                <Option key="all" value="">全部</Option>
                {Object.keys(MerchantTag).map(t => <Option key={t} value={t}>{t}</Option>)}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col sm={8}>
            <FormItem
              label="归属人"
              {...formItemLayout}
            >
              <KbSalesUserSelect
                {...bdProps}
                type={UserType.BD}
                kbsalesUrl={window.APP.kbsalesUrl}
                placeholder="请输入小二花名/真名"
                size="default"
              />
            </FormItem>
          </Col>
          <Col sm={16}>
            <Radio.Group style={{marginLeft: 12}} {...isSelfProps} size="default">
              <Radio.Button value="0">全部</Radio.Button>
              <Radio.Button value="1">我的</Radio.Button>
              <Radio.Button value="2">团队的</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
        <Row>
          <Col span={12} offset={12} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: 8 }}>搜索</Button>
            <Button loading={loading} onClick={this.handleReset}>清除条件</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(SearchForm);
