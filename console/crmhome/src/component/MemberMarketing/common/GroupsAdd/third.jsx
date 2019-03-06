import React from 'react';
import { Form, Select, Radio, message, Icon } from 'antd';
import ajax from '../../../../common/ajax';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class GroupAddThird extends React.Component {
  static propTypes = {
    formItemLayout: React.PropTypes.object.isRequired,
    form: React.PropTypes.object.isRequired,
  }

  static defaultProps = {
    formItemLayout: {
      labelCol: { span: 7 },
      wrapperCol: { span: 12, offset: 1 },
    },
  }

  state = {
    categories: [],
  }

  componentWillMount() {
    ajax({
      url: '/promo/merchant/crowd/thirdTag.json',
      method: 'GET',
      type: 'json',
      success: ({ status, data, errorMsg }) => {
        if (status === 'success') {
          const categories = data.oneOf.categories;
          this.setState({ categories });
        } else {
          message.error(errorMsg, 3);
        }
      },
    });
  }

  render() {
    const { form, formItemLayout } = this.props;
    const { getFieldProps } = form;
    const { categories } = this.state;
    const thirdProps = getFieldProps('third');
    const options = categories.map(({ title }, i) =>
      <Option key={i} value={i}>{title}</Option>);
    const tags = categories.length && thirdProps.value !== undefined &&
      categories[thirdProps.value].tags || [];
    const tagItems = tags.map(({ title, tagCode, op, sources }) => {
      const radios = sources.map(({ label, value }) =>
        <Radio key={value} value={`${op},${value}`}>{label}</Radio>);
      radios.push(<Radio key="all" value="all">不限制</Radio>);
      return (
        <FormItem key={tagCode} { ...formItemLayout } label={`${title}：`}>
          <RadioGroup { ...getFieldProps(`_${tagCode}`) }>
            {radios}
          </RadioGroup>
        </FormItem>
      );
    });

    return (
      <groups-add-third>
        <div>
          <span>第三方标签</span>
        </div>

        <FormItem { ...formItemLayout } label="第三方标签：">
          <Select { ...thirdProps } style={{ width: 300 }}>
            {options}
          </Select>
          <div>
            <Icon type="info-circle" />
            <span>由您已订阅的第三方服务商提供，标签由该服务商提供，详细信息请联系服务商。</span>
          </div>
        </FormItem>
        {tagItems}
      </groups-add-third>
    );
  }
}

export default GroupAddThird;
