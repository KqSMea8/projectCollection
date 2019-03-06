import React, {PropTypes} from 'react';
import Cascader from './Cascader';
import {Col, Form} from 'antd';
import mixins from './mixins';
const FormItem = Form.Item;

const AreaCategoryCols = React.createClass({
  propTypes: {
    form: PropTypes.object,
    allCategory: PropTypes.bool,
    allArea: PropTypes.bool,
  },

  mixins: [mixins],
  render() {
    const {getFieldProps} = this.props.form;
    return (<div>
      <Col span="8">
        <FormItem
          labelCol={{span: 6}}
          wrapperCol={{span: 18}}
          label="区域：">
          <Cascader {...this.props} data={this.state.areas}
            {...getFieldProps('area', {
              onChange: this.onAreaChange,
            })}
          /></FormItem></Col>
      <Col span="8">
        <FormItem
          labelCol={{span: 6}}
          wrapperCol={{span: 18}}
          label="品类：">
          <Cascader {...this.props} data={this.state.categories}
            {...getFieldProps('categoryId')}
          /></FormItem></Col>
    </div>);
  },
});

export default AreaCategoryCols;
