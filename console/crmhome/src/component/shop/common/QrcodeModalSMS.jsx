import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Row, Col, Form, Switch, Input, Icon, message, Alert, Popover} from 'antd';
import ajax from '../../../common/ajax';
import classnames from 'classnames';
import {mobilephone} from '../../../common/validatorUtils';

const FormItem = Form.Item;

const maxCount = 20;
const mobileNoHint = '请输入11位数的手机号码';
const cashierNoHint = '可填收银员姓名或桌码等';

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
        data['cashierNo' + k] = allData['cashierNo' + k];
        data['isEnable' + k] = allData['isEnable' + k];
        remoteKeys.push(k);
      }
    });
    form.validateFields(['mobileNo' + key, 'cashierNo' + key, 'isEnable' + key], (error)=> {
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
        data['cashierNo' + k] = allData['cashierNo' + k];
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
      message.error('最多只能存20个号码', 5);
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
      url: '/shop/showQrCodeByPhoneNum.json',
      data: {
        shopId: this.props.id,
        mobileNo: this.props.form.getFieldValue('mobileNo' + key),
        refresh: 1,
        cashierNo: this.props.form.getFieldValue('cashierNo' + key),
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
        cashierNo: data['cashierNo' + key],
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
      initData['cashierNo' + uuid] = row.cashierNo;
      initData['isEnable' + uuid] = row.isEnable;
      initData['editing' + uuid] = false;
      return uuid;
    });
    return initData;
  },

  fetchData() {
    ajax({
      url: '/shop/queryReceivingSms.json',
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
      url: '/shop/changePhoneNumber.json',
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
    location.href = '/shop/downloadQRCode.htm?shopId=' + this.props.id + '&qrCodeUrl=' + link;  // eslint-disable-line no-location-assign
  },

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
        style={{height: 60}}
        key={key}
        help>
        <Col span="7" style={{display: (editing ? 'block' : 'none'), textAlign: 'center'}}>
          <FormItem
            style={{padding: '0 10px'}}
            validateStatus={
              classnames({
                error: !!getFieldError('mobileNo' + key),
              })}
            required
            help={getFieldError('mobileNo' + key) || mobileNoHint}>
            <Input {...getFieldProps('mobileNo' + key, {
              initialValue: data['mobileNo' + key],
              rules: [{
                required: true,
                message: mobileNoHint,
              }, mobilephone],
            })} placeholder={mobileNoHint}/>
          </FormItem>
        </Col>
        <Col span="7" style={{marginBottom: 24, display: (!editing ? 'block' : 'none'), textAlign: 'center'}}>
          <p className="ant-form-text" style={{padding: '7px 8px', lineHeight: '18px'}}>{getFieldValue('mobileNo' + key)}</p>
        </Col>
        <Col span="6" style={{display: (editing ? 'block' : 'none'), textAlign: 'center'}}>
          <FormItem
            style={{padding: '0 10px'}}
            validateStatus={
              classnames({
                error: !!getFieldError('cashierNo' + key),
              })}
            required
            help={getFieldError('cashierNo' + key) || cashierNoHint}>
            <Input {...getFieldProps('cashierNo' + key, {
              initialValue: data['cashierNo' + key],
              rules: [{
                required: true,
                message: cashierNoHint,
              }],
            })} placeholder=""/>
          </FormItem>
        </Col>
        <Col span="6" style={{marginBottom: 24, display: (!editing ? 'block' : 'none'), textAlign: 'center'}}>
          <p className="ant-form-text" style={{padding: '7px 8px', lineHeight: '18px'}}>{getFieldValue('cashierNo' + key)}</p>
        </Col>
        <Col span="4" style={{textAlign: 'center'}}>
          <Switch checkedChildren="开" unCheckedChildren="关" {...getFieldProps('isEnable' + key, {
            initialValue: data['isEnable' + key] === undefined ? true : !!data['isEnable' + key],
            valuePropName: 'checked',
          })} disabled={!getFieldValue('editing' + key)}/>
        </Col>
        <Col span="3" style={{fontSize: 22, textAlign: 'center'}}>
          {!editing && <a href="#" onClick={this.download.bind(this, key)}><Icon type="qrcode"/></a>}
          {editing && <Icon type="qrcode"/>}
        </Col>
        <Col span="4" style={{textAlign: 'center'}}>
          {editing && <a href="" onClick={this.save.bind(this, key)}>保存</a>}
          {!editing && <a href="" onClick={this.showInput.bind(this, key)}>编辑</a>}
          <span style={{color: '#ccc', padding: '0 6px'}}>|</span>
          <a href="" style={{color: '#F66'}} onClick={this.remove.bind(this, key)}>删除</a>
        </Col>
      </FormItem>);
    });
    const imgContent = (
          <div ><img style={{width: 200, height: 200}} src="https://zos.alipayobjects.com/rmsportal/uPLskRsQPWzJddQ.png" /></div>
        );
    const downloadMessage = (
          <span>收款短信功能将在9月陆续下线，请
            <Popover content={imgContent} title="">
              <a>下载口碑商家</a>
            </Popover>客户端进行接收收款通知.</span>
        );
    return (<div style={{padding: 20, minHeight: 483}}>
      <Row style={{textAlign: 'center', marginBottom: 10}}>
        <div style={{height: '34px', borderRadius: '6px', marginBottom: '10px', lineHeight: 2.5, border: '1px solid #fec', backgroundColor: '#fff7e6', overflow: 'hidden'}}>
          <span style={{position: 'absolute', left: '145px', color: '#fa0'}}><Icon type="exclamation-circle"/></span><span><Alert
            message={downloadMessage}
            description=""
            type="warn" showIcon/></span>
        </div>

      </Row>
      <Row style={{textAlign: 'center', marginBottom: 20}}>
        <span style={{color: '#2db7f5'}}><Icon type="info-circle"/></span><span>&nbsp;通过二维码收款的通知将通过短信发送到以下手机，通知开关可以控制是否发送短信。</span>
        <span style={{display: 'block', color: '#f1ab36'}}>修改手机号码/识别号之后，请重新打印对应的二维码。</span>
      </Row>
      <Form horizontal style={{maxHeight: 325, overflowY: 'scroll'}} ref="form" form={this.props.form}>
        <Row style={{borderBottom: '1px #ccc solid', paddingBottom: 6, marginBottom: 20, textAlign: 'center'}}>
          <Col span="7">手机号码</Col>
          <Col span="6">识别号</Col>
          <Col span="4">短信通知开关</Col>
          <Col span="3">收款二维码</Col>
          <Col span="4">操作</Col>
        </Row>
        {rows}
      </Form>
      <div style={{paddingRight: 20, float: 'right'}}>
        <a href="#" onClick={this.add}>增加手机号码</a>
      </div>
    </div>);
  },
});

export default Form.create()(QrcodeModalSMS);
