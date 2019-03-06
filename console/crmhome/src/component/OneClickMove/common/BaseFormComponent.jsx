/**
 * 表单基础类
 * 主要功能：
 *   - 简化 rc-form 对象的获取路径   this.form
 *   - 为 props 设置默认值
 */
import { PropTypes, Component } from 'react';

export default class BaseFormComponent extends Component {
  static propTypes = {
    field: PropTypes.any.isRequired, // 字段名
    label: PropTypes.string,            // 表单项名称
    placeholder: PropTypes.any,      // placeholder
    extra: PropTypes.any,
    rules: PropTypes.any,             // 校验规则
    required: PropTypes.bool,           // formitem 是否显示 * 表示必填
    labelCol: PropTypes.object,         // 项目名宽度
    wrapperCol: PropTypes.object,       // 表单项宽度
    disabled: PropTypes.any,
  }

  static contextTypes = {
    form: PropTypes.object.isRequired,
  }
  static defaultProps = {
    label: '',
    placeholder: null,
    extra: null,
    required: false,
    defaultValue: '',
    rules: [],
    disabled: false,
  }
  constructor(props, ctx) {
    super(props, ctx);
    this.form = ctx.form;
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.form = nextContext.form;
  }
}
