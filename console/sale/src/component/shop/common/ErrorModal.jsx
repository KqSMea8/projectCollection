import React, {PropTypes} from 'react';
import {Modal} from 'antd';

const ErrorModal = React.createClass({
  propTypes: {
    data: PropTypes.array,
  },

  render() {
    const {data} = this.props;
    const content = data.map((row, i) => {
      return (<li key={i} style={{listStyle: 'decimal', marginLeft: 30, marginBottom: 16}}>
          <p style={{marginBottom: 8}}>{row.shopName}</p>
          <p><span style={{color: '#f60'}}>失败原因：</span>{row.errorMsg}</p>
        </li>);
    });
    return (
      <Modal {...this.props} visible>
        <ol style={{height: 300, overflowY: 'scroll'}}>{content}</ol>
      </Modal>
    );
  },
});

export default ErrorModal;
