import React from 'react';
import { Alert} from 'antd';
import './dialog.less';

class OperatorDialog extends React.Component {
  state={
    data: '',
    original: '',
    operated: [],
  }
  componentDidMount() { // 从中取出要删除的值
    const {roleId, deleteItems, featureDelete} = this.props.params;
    this.form = document.getElementById('dialog-form');
    if (window.alipay && window.alipay.security && window.alipay.security.core) {
      window.light.ready(() => {
        this.core = window.alipay.security.core.init({
          form: this.form, // 注：只能是原生对象，不支持jquery对象
          beforeAjaxValidate: () => {},
          afterAjaxValidate: () => {},
          block: () => {},
        });
      });
    }

    Array.prototype.slice.call(document.querySelectorAll('.J_roleId')).forEach(domItem => domItem.value = roleId);
    document.querySelector('.J_features').value = featureDelete;
    document.querySelector('.J_permissions').value = deleteItems;
  }
  setChecked(selected) {
    this.setState({selected});
  }
  submit() {
    if (this.core) {
      this.core.execute();
    } else if (this.form) {
      this.form.submit();
    }
  }
  render() {
    const {} = window.APP;

    return (
       <div>
         <Alert
          message="提示"
          description="删除后，该角色就不能再操作该功能。"
          type="Warning"
          showIcon
        />
        <div onClick={(e) => { e.preventDefault(); this.submit(); }} id="form-submit" />
      </div>);
  }
}

export default OperatorDialog;
