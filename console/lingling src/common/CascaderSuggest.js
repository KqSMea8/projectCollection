import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Cascader, Input } from 'antd';

class CascaderSuggest extends PureComponent {
  static propTypes = {
    placeholder: PropTypes.string,
    name: PropTypes.string,
    form: PropTypes.object,
    onChange: PropTypes.func,
    onInputChange: PropTypes.func,
    style: PropTypes.object,
    user: PropTypes.object,
    queryByName: PropTypes.func,
    type: PropTypes.string,
    option: PropTypes.object,
    hasChanged: PropTypes.bool,
    data: PropTypes.string,
    info: PropTypes.func,
    sellName: PropTypes.string,
    params: PropTypes.bool,
  }

  state = {
    isClick: false,
  }

  onInputChange = (e) => {
    this.setState({
      isClick: true,
    });
    if (e.target) {
      this.props.onInputChange(e.target.value);
      this.props.queryByName(e.target.value);
    }
  }

  defaultVaule = () => {
    let defaul;
    if (this.props.params && this.props.sellName) {
      defaul = this.props.sellName;
    } else {
      defaul = this.props.type === 'BUC' ?
        `${this.props.user.realName} (${this.props.user.nickName})` :
        `${this.props.user.realName} (${this.props.user.id})`;
    }
    return defaul;
  }

  clear = (e) => {
    if (this.props.option.length === 0) {
      this.props.info(this.state.isClick ? '未搜索到匹配人, 请重新输入' : '');
      this.props.form.setFieldsValue({
        orderOwnerId: this.props.hasChanged ? '' : this.defaultVaule(),
      });
      e.target.value = '';
      return;
    }
    if (this.props.hasChanged) {
      this.props.form.setFieldsValue({
        orderOwnerId: this.props.data,
      });
    }
    e.target.value = '';
  }

  render() {
    const { getFieldProps } = this.props.form;

    return (
      <Cascader options={this.props.option}
        onChange={this.props.onChange}
        expandTrigger="hover">
          <Input {...getFieldProps(this.props.name, {
              onChange: this.onInputChange,
              rules: [{
                required: true,
                message: this.props.type === 'BUC' ?
                '请输入内部小二的真名或花名' : '请输入服务商小二姓名',
              }],
              initialValue: this.defaultVaule(),
            })}
            style={this.props.style}
            onBlur={this.clear}
            placeholder={this.props.placeholder} autoComplete="off" />
      </Cascader>
    );
  }
}

export default CascaderSuggest;
