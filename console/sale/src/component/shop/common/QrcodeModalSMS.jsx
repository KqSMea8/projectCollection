import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Row, Col, Form, Switch, Input, Button, Icon, message, Alert, Popover} from 'antd';
import ajax from 'Utility/ajax';
import classnames from 'classnames';
import {mobilephone} from '../../../common/validatorUtils';

const FormItem = Form.Item;

const maxCount = 20;

let uuid = 0;

const QrcodeModalSMS = React.createClass({
  propTypes: {
    form: PropTypes.object,
    id: PropTypes.string,
  },

  getInitialState() {
    return {
      data: {},
    };
  },

  componentWillMount() {
    this.remoteKeys = [];
    this.fetchData();
  },

  showInput(key, e) {
    e.preventDefault();
    const data = {...this.state.data};
    data['editing' + key] = true;
    this.setState({
      data,
    });
  },

  hideInput(key) {
    const data = {...this.state.data};
    data['editing' + key] = false;
    this.setState({
      data,
    });
  },

  save(key, e) {
    e.preventDefault();
    const {form} = this.props;
    const allData = form.getFieldsValue();
    const remoteKeys = [];
    const data = {};
    form.getFieldValue('keys').forEach((k) => {
      if (this.remoteKeys.indexOf(k) >= 0 || key === k) {
        data['mobileNo' + k] = allData['mobileNo' + k];
        data['isEnable' + k] = allData['isEnable' + k];
        remoteKeys.push(k);
      }
    });
    form.validateFields(['mobileNo' + key, 'isEnable' + key], (error)=> {
      if (!error) {
        const formData = this.transformFormData(remoteKeys, data);
        this.saveData({
          shopReceiveSmsVOs: JSON.stringify(formData),
        }, () => {
          this.remoteKeys = remoteKeys;
          this.hideInput(key);
        });
      }
    });
    message.info('更改识别码/手机号码后，请重新打印对应的二维码', 5);
  },

  remove(key, e) {
    e.preventDefault();
    // 服务器上没有数据，不需要发请求
    if (this.remoteKeys.indexOf(key) < 0) {
      this.removeLocal(key);
      return;
    }
    // 删除服务器上的数据
    const {form} = this.props;
    const allData = form.getFieldsValue();
    const remoteKeys = [];
    const data = {};
    form.getFieldValue('keys').forEach((k) => {
      if (this.remoteKeys.indexOf(k) >= 0 && key !== k) {
        data['mobileNo' + k] = allData['mobileNo' + k];
        data['isEnable' + k] = allData['isEnable' + k];
        remoteKeys.push(k);
      }
    });
    const formData = this.transformFormData(remoteKeys, data);
    this.saveData({
      shopReceiveSmsVOs: JSON.stringify(formData),
    }, () => {
      this.remoteKeys = remoteKeys;
      this.removeLocal(key);
    });
  },

  add(e) {
    e.preventDefault();
    uuid++;
    const {form} = this.props;
    let keys = form.getFieldValue('keys');
    if (keys.length >= maxCount) {
      return;
    }
    keys = keys.concat(uuid);
    form.setFieldsValue({
      keys,
    });
    const formDOM = ReactDOM.findDOMNode(this.refs.form);
    setTimeout(() => {
      formDOM.scrollTop = formDOM.offsetHeight;
    }, 10);
  },

  download(key, e) {
    e.preventDefault();
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/showQrCodeByPhoneNum.json',
      data: {
        shopId: this.props.id,
        mobileNo: this.props.form.getFieldValue('mobileNo' + key),
        refresh: 1,
      },
      success: (data)=> {
        if (data.status === 'succeed' && data.data) {
          this.downLoadQrcode(data.data);
        } else {
          message.error(data.resultMsg);
        }
      },
    });
  },

  removeLocal(key) {
    const {form} = this.props;
    let keys = form.getFieldValue('keys');
    keys = keys.filter((k) => {
      return k !== key;
    });
    form.setFieldsValue({
      keys,
    });
  },

  transformFormData(keys, data) {
    const formData = keys.map((key) => {
      return {
        mobileNo: data['mobileNo' + key],
        isEnable: data['isEnable' + key],
      };
    });
    return formData;
  },

  transformInitData(data) {
    const initData = {};
    this.remoteKeys = data.map((row) => {
      uuid++;
      initData['mobileNo' + uuid] = row.mobileNo;
      initData['isEnable' + uuid] = row.isEnable;
      initData['editing' + uuid] = false;
      return uuid;
    });
    return initData;
  },

  fetchData() {
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/queryReceivingSms.json',
      data: {
        shopId: this.props.id,
      },
      success: (data)=> {
        if (data.status === 'succeed' && data.data) {
          this.setState({
            data: this.transformInitData(data.data),
          });
        }
      },
    });
  },

  saveData(values, callback) {
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/changePhoneNumber.json',
      method: 'post',
      data: {
        shopId: this.props.id,
        code: 'pc',
        ...values,
      },
      success: (data) => {
        if (data.status !== 'succeed') {
          message.error(data.resultMsg || '保存数据失败');
          return;
        }
        message.success('操作成功');
        callback();
      },
    });
  },

  downLoadQrcode(data) {
    const link = encodeURIComponent(data);
    location.href = window.APP.crmhomeUrl + '/shop/koubei/downloadQRCode.htm?shopId=' + this.props.id + '&qrCodeUrl=' + link;
  },
  // hide() {
  //   this.setState({
  //     visible: false,
  //   });
  // },
  // handleVisibleChange(visible) {
  //   this.setState({ visible });
  // },
  render() {
    const {getFieldValue, getFieldProps, getFieldError} = this.props.form;
    const {data} = this.state;
    getFieldProps('keys', {
      initialValue: this.remoteKeys || [],
    });
    const keys = getFieldValue('keys');
    const rows = keys.map((key)=> {
      getFieldProps('editing' + key, {
        initialValue: data['editing' + key] !== undefined ? data['editing' + key] : true,
      });
      const editing = getFieldValue('editing' + key);
      return (<FormItem
        key={key}
        help>
        <Col span="4">
          <div style={{height: 1}}></div>
        </Col>
        <Col span="6" style={{marginRight: 10, display: (editing ? 'block' : 'none')}}>
          <FormItem
            validateStatus={
              classnames({
                error: !!getFieldError('mobileNo' + key),
              })}
            required
            help={getFieldError('mobileNo' + key)}>
            <Input {...getFieldProps('mobileNo' + key, {
              initialValue: data['mobileNo' + key],
              rules: [{
                required: true,
                message: '此处必填',
              }, mobilephone],
            })} placeholder="手机号码"/>
          </FormItem>
        </Col>
        <Col span="6" style={{marginRight: 10, marginBottom: 24, display: (!editing ? 'block' : 'none')}}>
          <p className="ant-form-text" style={{padding: '7px 8px', lineHeight: '18px'}}>{getFieldValue('mobileNo' + key)}</p>
        </Col>
        <Col span="2" style={{display: editing ? 'block' : 'none'}}>
          <Switch checkedChildren="开" unCheckedChildren="关" {...getFieldProps('isEnable' + key, {
            initialValue: data['isEnable' + key] === undefined ? true : !!data['isEnable' + key],
            valuePropName: 'checked',
          })}/>
        </Col>
        <Col span="3" style={{display: !editing ? 'block' : 'none'}}>
          <Button type="primary" onClick={this.showInput.bind(this, key)}>修改</Button>
        </Col>
        <Col span="2" style={{fontSize: 22}}>
          {!editing && <a href="#" onClick={this.download.bind(this, key)}><Icon type="qrcode"/></a>}
        </Col>
        <Col span="6">
          {editing && <Button type="primary" style={{marginRight: 10}} onClick={this.save.bind(this, key)}>保存</Button>}
          {editing && <Button type="ghost" onClick={this.remove.bind(this, key)}>删除</Button>}
        </Col>
      </FormItem>);
    });
    const imgContent = (
      <div><img style={{width: 200, height: 200}} src="https://zos.alipayobjects.com/rmsportal/uPLskRsQPWzJddQ.png" /></div>
    );
    const downloadMessage = (
      <span>收款短信功能将在9月陆续下线，请
        <Popover content={imgContent} title="">
          <a>下载口碑商家</a>
        </Popover>客户端进行接收收款通知.</span>
    );

    return (<div style={{fontSize: 14, padding: 20, minHeight: 483}}>
      <Row style={{textAlign: 'center', marginBottom: 10}}>
        <Alert
          message={downloadMessage}
          description=""
          type="warnig" showIcon/>
      </Row>
      <Row style={{textAlign: 'center', marginBottom: 20}}>
        <span style={{color: '#2db7f5'}}><Icon type="info-circle"/></span><span>&nbsp;通过二维码收款的通知将通过短信发送到以下手机，通知开关可以控制是否发送短信</span>
        <span style={{display: 'block', color: '#f1ab36'}}>修改手机号码/识别号之后，请重新打印对应的二维码。</span>
      </Row>
      <Form horizontal style={{maxHeight: 325, overflowY: 'scroll'}} ref="form">
        {rows}
      </Form>
      <div style={{padding: '20px 0 20px 125px'}}>
        {keys.length < maxCount && <a href="#" style={{fontSize: 14}} onClick={this.add}>增加手机号码</a>}
      </div>
    </div>);
  },
});

export default Form.create()(QrcodeModalSMS);
