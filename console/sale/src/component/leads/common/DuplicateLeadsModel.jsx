import React, { PropTypes } from 'react';
import { Modal, Button} from 'antd';

const DeleteModal = React.createClass({
  propTypes: {
    onCancel: PropTypes.func,
    onAppeal: PropTypes.func,
    onClaim: PropTypes.func,
    visible: PropTypes.bool,
    params: PropTypes.object,
  },

  render() {
    const { onCancel, onAppeal, onClaim, params} = this.props;

    return (<Modal title="" visible={this.props.visible} footer={''} className="ant-confirm" closable={false}>
        <div style={{zoom: 1, overflow: 'hidden'}}>
          <div className="ant-confirm-body">
            <i className="anticon anticon-cross-circle"></i>
            <span className="ant-confirm-title">{params.title}</span>
            <div className="ant-confirm-content">{params.textMsg}</div>
          </div>
          <div className="ant-confirm-btns">
            {params.entityId ? <Button type="ghost" size="large" onClick={onClaim} >认领该leads</Button> : null}
            <Button type="ghost" size="large" onClick={onAppeal}>我要申诉</Button>
            <Button type="primary" size="large" onClick={onCancel}>算 了</Button>
          </div>
        </div>
      </Modal>
    );
  },
});

export default DeleteModal;
