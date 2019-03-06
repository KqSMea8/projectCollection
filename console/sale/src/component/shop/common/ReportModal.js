import React, {PropTypes} from 'react';
import {Modal, Form, Button, Checkbox} from 'antd';
import AreaSelect from '../../../common/AreaSelect';
import permission from '@alipay/kb-framework/framework/permission';

const FormItem = Form.Item;

const ReportModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    shopName: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    loading: PropTypes.bool,
  },

  getInitialState() {
    return {
      disableAreaSelect: false,
    };
  },

  onOK() {
    this.props.form.validateFields((error, values)=> {
      if (!error) {
        const info = {...values};
        const {area, allArea} = info;
        if (area) {
          info.provId = area[0];
          info.cityId = area[1];
          info.districtId = area[2];
          if (info.districtId === 'ALL') {
            info.districtId = '';
          }
          delete info.area;
        }
        if (allArea) {
          info.provId = info.cityId = info.districtId = '';
        }
        this.props.onOk(info);
      }
    });
  },

  onChange(event) {
    this.setState({disableAreaSelect: !event.target.value});
  },

  render() {
    const {getFieldProps} = this.props.form;
    return (<Modal title="选择数据范围" visible onCancel={this.props.onCancel}
      footer={[
        <Button key="back" type="ghost" size="large" onClick={this.props.onCancel}>取消</Button>,
        <Button key="submit" type="primary" size="large" loading={this.props.loading} onClick={this.onOK}>下载</Button>,
      ]}>
      <Form horizontal>
        <FormItem
          label="区域："
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}>
          <AreaSelect WithAll disabled={this.state.disableAreaSelect} {...getFieldProps('area', {
            rules: [{required: !this.state.disableAreaSelect, type: 'array', message: '此处必填'}],
          })}/>
        </FormItem>
        {permission('ALL_AREA_SHOP_REPORT_DOWNLOAD') &&
        (<FormItem
          label="全部区域："
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}>
          <Checkbox defaultChecked={false} {...getFieldProps('allArea', {
            onChange: this.onChange,
          })}/>
        </FormItem>)}
        <div style={{marginLeft: 81, color: '#f60'}}>数据是商业机密，暂不支持下载实时数据，</div>
        <div style={{marginLeft: 81, color: '#f60'}}>本次只能下载T+1天的数据，要保护好噢~</div>
      </Form>
    </Modal>);
  },
});

export default Form.create()(ReportModal);
