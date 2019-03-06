import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CascaderSuggest from './CascaderSuggest';

class PidSelect extends PureComponent {
  static propTypes = {
    form: PropTypes.object,
    required: PropTypes.bool,
    onChange: PropTypes.func,
    style: PropTypes.object,
    includeTeam: PropTypes.bool,
    mode: PropTypes.string,
    getOrderOwnerId: PropTypes.func,
    type: PropTypes.string,
    queryByName: PropTypes.func,
    option: PropTypes.array,
    user: PropTypes.object,
    info: PropTypes.func,
    sellName: PropTypes.string,
    params: PropTypes.bool,
  }
  state = {
    data: '',
    hasChanged: false,
  }
  onChange = (value, selectedOptions) => {
    this.setState({
      hasChanged: true,
    });
    const orderOwnerId = value[0];
    this.props.getOrderOwnerId(orderOwnerId);
    if (this.props.type === 'BUC') {
      this.props.form.setFieldsValue({
        orderOwnerId: selectedOptions[0].label,
      });
      this.setState({
        data: selectedOptions[0].label,
      });
    } else {
      this.props.form.setFieldsValue({
        orderOwnerId: `${selectedOptions[0].label} (${selectedOptions[0].value})`,
      });
      this.setState({
        data: `${selectedOptions[0].label} (${selectedOptions[0].value})`,
      });
    }
  }

  onInputChange = (value) => {
    this.props.form.setFieldsValue({
      orderOwnerId: value,
    });
  }

  render() {
    const props = {
      name: 'orderOwnerId',
      fieldName: 'keyword',
      form: this.props.form,
      placeholder: this.props.type === 'BUC' ?
        '请输入内部小二的真名或花名' : '请输入服务商小二姓名',
      onChange: this.onChange,
      onInputChange: this.onInputChange,
      style: this.props.style,
      queryByName: this.props.queryByName,
      option: this.props.option,
      type: this.props.type,
      user: this.props.user,
      info: this.props.info,
      hasChanged: this.state.hasChanged,
      data: this.state.data,
      sellName: this.props.sellName,
      params: this.props.params,
    };
    return (<CascaderSuggest {...props} />);
  }
}

PidSelect.defaultProps = {
  required: true,
};

export default PidSelect;
