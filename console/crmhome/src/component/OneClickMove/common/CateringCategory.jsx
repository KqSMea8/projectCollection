import React, { PropTypes } from 'react';
import { Form, Cascader, Spin } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import ajax from '../../../common/ajax';

const FormItem = Form.Item;

function formatOptions(data) {
  return data.map(d => {
    const rtn = { label: d.name, value: d.categoryId, canModifyItem: d.canModifyItem, canPublishItem: d.canPublishItem };
    if (d.isLeaf === 0 && d.subCategories && d.subCategories.length) { // 非叶子
      rtn.children = formatOptions(d.subCategories);
    }
    if (d.isLeaf === 0 && (!d.subCategories || d.subCategories.length === 0)) {
      rtn.disabled = true;
    }
    return rtn;
  });
}

export default class CateringCategory extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    placeholder: PropTypes.string,
    field: PropTypes.string,
  };

  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    label: '所属类目',
    placeholder: '请选择所属类目',
  };

  state = {
    options: [],
    loading: true,
  };

  componentWillMount() {
    this.fetchOptions(this.props.industry || '');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.industry !== nextProps.industry) {
      this.fetchOptions(nextProps.industry);
    }
  }

  fetchOptions = (code) => {
    this.setState({
      loading: true,
    });
    ajax({
      url: '/goods/catering/itemCategory.json',
      data: {
        industry: code || '',
      },
      method: 'GET',
      success: res => {
        if (res && res.status === 'succeed') {
          this.setState({
            options: formatOptions(res.itemCategory || []),
          });
        }
        this.setState({
          loading: false,
        });
      },
      error: () => { },
    });
  }

  render() {
    const { rules, field, required, placeholder, label, labelCol, wrapperCol, extra, disabled } = this.props;
    const { options = [], loading } = this.state;
    const isDisabled = disabled || options.length === 0;
    const r = [...rules];
    if (required) {
      r.push({ required: true, message: '请选择' + this.props.label });
    }
    return (
      <FormItem label={label} required={required} extra={extra} labelCol={labelCol} wrapperCol={wrapperCol}>
        <Spin spinning={loading}>
          <Cascader
            {...this.form.getFieldProps(field, {
              rules: r,
            })}
            expandTrigger="hover"
            disabled={isDisabled}
            options={options}
            size="large"
            placeholder={placeholder}
          />
        </Spin>
      </FormItem>
    );
  }
}
