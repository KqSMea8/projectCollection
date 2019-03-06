import React, {PropTypes} from 'react';
import CascaderSuggest from './CascaderSuggest';
import {merchantPid} from './validatorUtils';

const PidSelect = React.createClass({
  propTypes: {
    form: PropTypes.object,
    required: PropTypes.bool,
    onChange: PropTypes.func,
    style: PropTypes.object,
    includeTeam: PropTypes.bool,
    mode: PropTypes.string,
  },

  onChange(value, selectedOptions) {
    const merchantName = selectedOptions[0].label;
    const partnerId = String(value[1]);
    this.props.form.setFieldsValue({
      partnerId,
      partnerName: merchantName + '(' + partnerId + ')',
    });
    if (this.props.onChange) {
      this.props.onChange(value, selectedOptions);
    }
  },

  onInputChange() {
    this.props.form.setFieldsValue({
      partnerId: '',
    });
  },

  transform(data) {
    return data.map((row) => {
      if (row.children) {
        row.children = row.children.map((r, i) => {
          const arr = r.label.split(',');
          r.label = [arr[0], <br key={i}/>, 'pid: ' + arr[1]];
          return r;
        });
      }
      return row;
    });
  },

  render() {
    const {getFieldProps} = this.props.form;
    const {required} = this.props;
    const rules = required ? [{
      required,
      message: '请选择商户',
    }, merchantPid] : [];
    getFieldProps('partnerId', {
      validateFirst: true,
      rules,
    });
    const params = {};
    if (this.props.includeTeam) {
      params.type = 'subordinate';
    }
    params.size = 100;

    const props = {
      name: 'partnerName',
      fieldName: 'keyword',
      params: params,
      url: '/sale/merchant/queryByName.json',
      form: this.props.form,
      transform: this.transform,
      placeholder: '请输入商户名称',
      onChange: this.onChange,
      onInputChange: this.onInputChange,
      style: this.props.style,
      mode: this.props.mode,
    };
    return (<CascaderSuggest {...props}/>);
  },
});

PidSelect.defaultProps = {
  required: true,
};

export default PidSelect;
