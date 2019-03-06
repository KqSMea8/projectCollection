/**
 * @file TipsImageUploader
 * @desc 任务攻略图片上传控件
 */
import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';
import isEqual from 'lodash/isEqual';
import {ImageUpload} from '@alipay/kb-framework-components/lib/biz';
import {message} from 'antd';

class TipsImageUpload extends React.Component {
  static propTypes = {
    value: PropTypes.shape({
      ossKey: PropTypes.string,
      fileName: PropTypes.string
    }),
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
  };
  static defaultProps = {
    value: null,
    onChange: noop,
    disabled: false,
  };

  shouldComponentUpdate(next) {
    return !isEqual(next.value, this.props.value);
  }

  handleChange = (fileList) => {
    const file = fileList.length > 0 ? fileList[0] : null;
    this.props.onChange(file ? {ossKey: file.ossKey, fileName: file.name} : null);
  };

  handleBeforeUpload = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      message.error('图片太大了，请压缩到5M以内再上传');
      return false;
    }
    return true;
  };

  render() {
    const {value, disabled} = this.props;
    const defaultFileList = value ? [value] : [];
    return (
      <div>
        <ImageUpload
          disabled={disabled}
          defaultFileList={defaultFileList}
          limit={1}
          onChange={this.handleChange}
          beforeUpload={this.handleBeforeUpload}
          kbsalesUrl={window.APP.kbsalesUrl}
        />
        <div style={{lineHeight: '20px'}}>上传可指导服务商执行任务的sop资料，限1张，5M以下，展示在钉钉中台-待办任务-右上角的“攻略”</div>
      </div>
    );
  }
}

export default TipsImageUpload;
