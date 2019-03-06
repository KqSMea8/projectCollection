import React, { PropTypes } from 'react';
import { Button, Modal, Icon, Row, Col, message } from 'antd';
import ajax from 'Utility/ajax';
import IconSlider from './IconSlider';

const DeleteModal = React.createClass({
  propTypes: {
    sceneCode: PropTypes.string,
    onCancel: PropTypes.func,
    onRefresh: PropTypes.func,
  },

  getInitialState() {
    return {
      lock: true,
    };
  },

  getDefaultPropertys() {
    return {
      id: '',
    };
  },

  handleChange(isUnlock) {
    this.setState({
      lock: !isUnlock,
    });
  },

  handleDelete() {
    if ( this.props.sceneCode ) {
      ajax({
        url: '/manage/notify/deleteConfig.json',
        method: 'post',
        data: { sceneCode: this.props.sceneCode },
        type: 'json',
        success: (result) => {
          if (result.status === 'succeed') {
            this.props.onRefresh();
            message.success('删除成功');
          }
        },
      });
    }
  },

  render() {
    const { handleChange, handleDelete } = this;

    const ModelFooter = (<Row type="flex" justify="end" className="kb-delete-footer"><Col span="8">
      <IconSlider handleChange={ handleChange }/></Col>
      <Col span="8">
        <Button size="large" type="primary" onClick={ handleDelete } disabled={ this.state.lock } >确定</Button>
        <Button size="large" onClick={ this.props.onCancel }>取消</Button>
      </Col>
    </Row>);

    return (<Modal title="删除配置" visible footer={ ModelFooter } onCancel={ this.props.onCancel }>
         <div className="delete-model-container kb-delete-modal">
           <Icon type="info-circle-o" className="delete-badge"/>
           <div className="delete-badge-content">
              <div className="delete-badge-title">请注意</div>
              <div>删除不可逆请再三确认！</div>
           </div>
         </div>
      </Modal>
    );
  },
});

export default DeleteModal;
