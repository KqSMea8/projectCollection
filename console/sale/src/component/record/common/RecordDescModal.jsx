import { Modal } from 'antd';
import React, {PropTypes} from 'react';


const RecordDescModal = React.createClass({
  propTypes: {
    data: PropTypes.string,
  },
  getInitialState() {
    return {
      data: this.props.data || '',
    };
  },
  onCancel() {
    this.setState({
      visible: false,
    });
  },
  onShow() {
    this.setState({
      visible: true,
    });
  },
  render() {
    const { data } = this.state;
    return (
      <div>
        <a onClick={this.onShow}>查看描述</a>
        {this.state.visible ? <Modal title="拜访描述" visible onCancel={this.onCancel}
          footer={false} width={600}>
          <p style={{ paddingBottom: 30, textIndent: '2em', wordWrap: 'break-word' }}>{data}</p>
        </Modal> : null }
      </div>
    );
  },
});

export default RecordDescModal;
