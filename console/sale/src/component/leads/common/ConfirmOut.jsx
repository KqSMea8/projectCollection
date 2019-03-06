import React, { PropTypes } from 'react';
import { Modal, Icon } from 'antd';

const DeleteModal = React.createClass({
  propTypes: {
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
  },

  render() {
    const { onCancel, onOk } = this.props;

    return (<Modal title="二次确认" visible onCancel={ onCancel } onOk={ onOk }>
         <div className="delete-model-container kb-delete-modal">
           <Icon type="info-circle-o" className="delete-badge"/>
           <div className="delete-badge-content">
              <div className="delete-badge-title">确定离开当前编辑嘛？</div>
              <div>当前并不保存草稿</div>
           </div>
         </div>
      </Modal>
    );
  },
});

export default DeleteModal;
