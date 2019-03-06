import React, {PropTypes} from 'react';
import {Form, Button, Modal, Radio} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

const QrcodeDownload = React.createClass({
  propTypes: {
    selectedIds: PropTypes.array,
  },

  getInitialState() {
    return {
      type: 'normal',
    };
  },

  onOk() {
    const {selectedIds} = this.props;
    const url = '/shop/crm/batchDownloadQRCode.htm?shopId=' + selectedIds.join(',') + '&type=' + this.state.type;
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
              <Radio style={{display: 'block', lineHeight: '30px'}} value="normal">整合版收款二维码</Radio>
              <Radio style={{display: 'block', lineHeight: '30px'}} value="mini">精简版收款二维码</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      ),
      onOk: this.onOk,
    });
  },

  render() {
    const {selectedIds} = this.props;
    return <Button type={this.props.buttonType || 'primary'} disabled={selectedIds.length === 0} style={{marginRight: 12}} onClick={this.showConfirm}>下载二维码</Button>;
  },
});

export default QrcodeDownload;
