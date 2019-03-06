import React, { PropTypes } from 'react';
import { Button, Modal, Icon, Row, Col } from 'antd';
import IconSlider from '../common/IconSlider';

const DeleteModal = React.createClass({
  propTypes: {
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  },

  getInitialState() {
    return {
      lock: true,
    };
  },

  handleChange(isUnlock) {
    this.setState({
      lock: !isUnlock,
    });
  },

  render() {
    const ModelFooter = (<Row type="flex" justify="end" className="kb-delete-footer"><Col span="8">
      <IconSlider handleChange={ this.handleChange }/></Col>
      <Col span="8">
        <Button size="large" type="primary" onClick={ this.props.onOk } disabled={ this.state.lock } >确定</Button>
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
