import React, {PropTypes} from 'react';
import {Form, Button, Modal, Radio, message} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

const QrcodeDownload = React.createClass({
  propTypes: {
    selectedIds: PropTypes.array,
    afterDownload: PropTypes.func,
  },

  getInitialState() {
    return {
      type: 'normal',
    };
  },

  onOk() {
    if (this.props.selectedIds.length > 100) {
      return message.warn('最多选择100家门店');
    }
    const {selectedIds} = this.props;
    const url = window.APP.crmhomeUrl + '/shop/koubei/batchDownloadQRCode.htm?shopId=' + selectedIds.join(',') + '&type=' + this.state.type;
    if (this.props.afterDownload) this.props.afterDownload();
    window.open(url);
  },

  onChange(e) {
    this.setState({
      type: e.target.value,
    });
  },

  showConfirm() {
    confirm({
      title: '你要下载哪个二维码？',
      content: (
        <Form horizontal style={{marginTop: 20}}>
          <FormItem>
            <RadioGroup defaultValue={this.state.type} onChange={this.onChange}>
              <Radio value="normal">整合版收款二维码</Radio>
              <Radio value="mini">精简版收款二维码</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      ),
      onOk: this.onOk,
    });
  },

  render() {
    const {selectedIds} = this.props;
    return <Button type="primary" disabled={selectedIds.length === 0} style={{marginRight: 12}} onClick={this.showConfirm}>下载二维码</Button>;
  },
});

export default QrcodeDownload;
