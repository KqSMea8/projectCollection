import React from 'react';
import { Form, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class GroupAddIndustry extends React.Component {
  static propTypes = {
    formItemLayout: React.PropTypes.object.isRequired,
    form: React.PropTypes.object.isRequired,
    type: React.PropTypes.oneOf(['brands', 'retailers', 'cate7']).isRequired,
  }

  static defaultProps = {
    formItemLayout: {
      labelCol: { span: 7 },
      wrapperCol: { span: 12, offset: 1 },
    },
  }

  render() {
    const { form, formItemLayout, type } = this.props;
    const { getFieldProps } = form;
    const cateProps = getFieldProps('cate', {
      rules: [
        { type: 'array', max: 3, message: '最多选择3项' },
      ],
    });
    let options = [];
    if (type.startsWith('cate')) {
      options = ['中餐', '火锅', '快餐', '小吃', '烧烤', '烘焙糕点'].map(option =>
        <Option key={option}>{option}</Option>);
    } else {
      options = ['保健食品', '零食食品', '冲调食品', '家用电器', '服装服饰', '厨房食品', '宠物用品',
        '个人护理', '家庭清洁', '进口食品', '酒', '饮料', '厨房配件', '卫生纸品', '文化用品',
          '母婴用品', '生活百货', '家居针织品'].map(option =>
            <Option key={option}>{option}</Option>);
    }
    return (
      <groups-add-industry>
        <div>
          <span>行业标签</span>
        </div>

        <FormItem { ...formItemLayout } label="品类偏好：">
          <Select { ...cateProps } multiple style={{ width: 400 }} placeholder="请选择，最多选择3项">
            {options}
          </Select>
        </FormItem>
      </groups-add-industry>
    );
  }
}

export default GroupAddIndustry;
