import React, {PropTypes} from 'react';
import {Col, Form} from 'antd';
import Cascader from '../../../common/AreaCategory/Cascader';
import mixins from '../../../common/AreaCategory/mixins';

const FormItem = Form.Item;

const AreaCategoryCols = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },

  mixins: [mixins],

  render() {
    const {getFieldProps} = this.props.form;
    return (<div>
      <Col span="8" style={{padding: '0 8px'}}>
        <FormItem
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          label="区域：">
          <Cascader data={this.state.areas}
            {...getFieldProps('area', {
              onChange: this.onAreaChange,
            })}
          />
        </FormItem>
      </Col>
      <Col span="8" style={{padding: '0 8px'}}>
        <FormItem
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          label="品类：">
          <Cascader data={this.state.categories}
            {...getFieldProps('categoryId')}
          />
        </FormItem>
      </Col>
    </div>);
  },
});

export default AreaCategoryCols;
