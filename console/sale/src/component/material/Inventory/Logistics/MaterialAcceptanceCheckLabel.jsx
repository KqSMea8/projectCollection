import React, {PropTypes} from 'react';
import {Button, message} from 'antd';
import MaterialAcceptanceCheckModal from './MaterialAcceptanceCheckModal';
import permission from '@alipay/kb-framework/framework/permission';

const MaterialAcceptanceCheckLabel = React.createClass({
  propTypes: {
    id: PropTypes.string,
    checkEnable: PropTypes.string,
    showText: PropTypes.bool,
    updateTableData: PropTypes.func,
  },

  getDefaultProps() {
    return {
      updateTableData: () => {},
    };
  },

  getInitialState() {
    return {
      showModal: false,
    };
  },

  onCancel() {
    this.setState({showModal: false});
  },

  onClick(e) {
    e.preventDefault();
    if (permission('STUFF_CHECK_INFO_AUDIT')) {
      this.setState({showModal: true});
    } else {
      message.error('您没有权限操作！', 3);
    }
  },

  updateModal() {
    this.props.updateTableData();
  },

  render() {
    return (<div style={{display: 'inline-block'}}>
      {this.props.checkEnable === '1' && this.props.checkType !== 'MACHINE' && !this.props.showText && <Button type="primary" onClick={this.onClick}>验收</Button>}
      {this.props.checkEnable === '1' && this.props.checkType !== 'MACHINE' && this.props.showText && <a onClick={this.onClick}>验收</a>}
      {this.state.showModal ? <MaterialAcceptanceCheckModal id={this.props.id} onCancel={this.onCancel} updateLabel={this.updateModal}/> : null}
    </div>);
  },
});

export default MaterialAcceptanceCheckLabel;
