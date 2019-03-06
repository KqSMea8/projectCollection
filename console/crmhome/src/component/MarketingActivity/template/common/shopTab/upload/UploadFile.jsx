import React, { PropTypes } from 'react';
import { Upload, Icon, Button } from 'antd';

const UploadFile = React.createClass({
  propTypes: {
    disabled: PropTypes.bool,
  },
  getInitialState() {
    return {
      fileList: this.props.value || [],
    };
  },
  render() {
    return (
      <Upload {...this.props} withCredentials >
        <Button type="ghost" disabled={this.props.disabled}>
          <Icon type="upload" /> 点击上传
        </Button>
      </Upload>
    );
  },
});

export default UploadFile;
