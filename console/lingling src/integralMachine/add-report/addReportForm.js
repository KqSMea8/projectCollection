import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Button, Radio, message, Icon } from 'antd';
import PidSelect from '../../common/PidSelect';
import { Upload } from './picUpload';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const { object, array, string, func, bool } = PropTypes;

class AddReport extends PureComponent {
  static propTypes = {
    form: object,
    params: string,
    dispatch: func,
    list: object,
    owner: array,
    getUserInfo: func,
    pictures: array,
    modifyreport: object,
    isClicked: bool,
    create: object,
    formData: object,
    error: object,
    loading: bool,
  }
  state = {
    orderOwnerId: this.props.getUserInfo().id,
    selectOrderOwnerId: '',
    stuffTypeBox: false,
    hasSelected: false,
  }
  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.params) {
      dispatch({ type: 'getModifyReport', payload: {
        orderId: this.props.params,
      } });
    }
  }

  componentWillReceiveProps(next) {
    if (this.props.params && next.list && next.list.orderOwnerId) {
      this.setState({
        orderOwnerId: next.list.orderOwnerId,
      });
    }
  }

  queryByName = (value) => {
    const { dispatch } = this.props;
    dispatch({ type: 'getOrderOwnerId', payload: {
      keyword: value,
    } });
  }

  handleSubmit = (e) => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log('信息填写有误!!!');
        return;
      }
      const pic = this.props.form.getFieldValue('reportOrderPictures');
      const picIds = pic.map((item) => item.id).join(',');
      const formData = values;
      formData.orderOwnerId = this.state.hasSelected ?
        this.state.selectOrderOwnerId : this.state.orderOwnerId;
      formData.reportOrderPictures = picIds;
      if (this.props.params) {
        formData.orderId = this.props.params;
        dispatch({ type: 'createModifyReport', payload: formData });
      } else {
        dispatch({ type: 'createList', payload: formData });
      }
    });
  }

  changeOrder = () => {
    this.props.form.setFieldsValue({
      pictures: [],
      compactNo: '',
    });
  }

  getOrderOwnerId = (value) => {
    this.setState({
      hasSelected: true,
      selectOrderOwnerId: value,
    });
  }

  info = (info) => {
    if (info) {
      message.error(info);
    }
  }

  // 图片上传
  normalizeUploadValue = (info, limit) => {
    if (Array.isArray(info)) {
      return info;
    }
    if (!info) {
      return [];
    }
    let fileList = info.fileList;
    const event = info.event;
    if (limit) {
      if (fileList.length > limit) {
        fileList = fileList.slice(-limit);
      }
    }
    fileList = fileList.slice(0);


    // 2. 读取远程路径并显示链接
    fileList = fileList.map((doc) => {
      const file = doc;
      if (typeof file.response === 'string') {
        file.response = JSON.parse(file.response);
      }
      if (file.response) {
        // 组件会将 file.url 作为链接进行展示
        file.url = file.response.url;
        file.id = file.response.id;
      }
      return file;
    });

    // 3. 按照服务器返回信息筛选成功上传的文件
    if (info.file.length === undefined) {
      if (event !== undefined) {
        fileList = fileList.filter((file) => {
          if (file.type && file.type.indexOf('image') !== -1 && file.size > 2.9 * 1024 * 1024) {
            message.error('图片最大2.9M');
            return false;
          }
          return true;
        });
      } else {
        fileList = fileList.filter((file) => {
          if (file.response) {
            if (file.response.buserviceErrorCode === 'USER_NOT_LOGIN') {
              message.error('请重新登录');
            }
            return file.response.status === 'success' || file.response.status === 'succeed';
          }
          return true;
        });
      }
    }
    return fileList;
  }

  render() {
    const { getFieldProps, getFieldValue } = this.props.form;
    const { list, params } = this.props;
    const userInfo = this.props.getUserInfo();
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 8 },
      style: { margin: 15 },
    };
    const propsPic = {
      beforeUpload: (file) => {
        const type = file.name.substring(file.name.lastIndexOf('.') + 1);
        if (['jpg', 'jpeg', 'png', 'JPG'].indexOf(type) === -1) {
          message.error('文件格式错误');
          return false;
        }
        return true;
      },
    };

    const sellerName = list.orderOwnerType === 'SALES_STAFF' ? `${list.orderOwnerName} (${list.orderOwnerNickName})` :
      `${list.orderOwnerName} (${list.orderOwnerId})`;

    const options = [];
    this.props.owner.map((value) => {
      const obj = {};
      const obj2 = {};
      const obj3 = {};
      if (userInfo.userChannel === 'BUC') {
        obj.label = `${value.realName} (${value.nickName})`;
        obj.value = value.id;
      } else {
        obj.children = [];
        obj.label = value.realName;
        obj.value = value.id;
        obj2.label = value.loginName;
        obj3.label = `pid: ${value.id}`;
        obj2.value = value.loginName;
        obj3.value = value.id;
        obj.children.push(obj2, obj3);
      }
      options.push(obj);
      return options;
    });
    return (
      <div>
        <Form horizontal>
          <Row style={{ marginTop: 20 }}>
            <Col offset={2} style={{ borderLeft: '4px solid #2eb7f5', paddingLeft: 10, lineHeight: 1 }}>
              订单信息
            </Col>
          </Row>
          <FormItem {...formItemLayout}
            label="订单来源">
            <RadioGroup {...getFieldProps('source', {
              initialValue: list.source || 'OFFLINE',
              onChange: this.changeOrder,
              })}>
              <Radio value="OFFLINE">线下下单</Radio>
              <Radio value="ONLINE">天猫下单</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem {...formItemLayout}
            label={getFieldValue('source') === 'ONLINE' ?
            '天猫订单号' : '合同号'}>
              <Input type="text" {...getFieldProps('compactNo', {
                initialValue: list.compactNo, rules: [{
                  required: true,
                  max: 60,
                  message: getFieldValue('source') === 'ONLINE' ?
                  '请输入天猫订单号, 最多不超过60字' : '请输入合同号, 最多不超过60字',
                }],
              })}
                placeholder={getFieldValue('source') === 'ONLINE' ?
                '请输入天猫订单号' : '填写系统服务商(ISV)提供的合同号'} />
          </FormItem>
          <FormItem {...formItemLayout}
            className="pic"
            label="报单截图"
            help="不超过2.9M，最多上传5张，用作后续订单匹配的参考依据">
            <Upload form={this.props.form} {...getFieldProps('reportOrderPictures', {
                initialValue: list.pictures && list.pictures.length ?
                  list.pictures.map((row) => (
                    { ...row,
                      id: row.fileId,
                      url: row.fileUrl,
                      uid: row.fileId })) : null,
                valuePropName: 'fileList',
                normalize: this.normalizeUploadValue,
                rules: [{
                  required: this.state.stuffTypeBox,
                  type: 'array',
                  message: '请上传拜访照片',
                }, {
                  max: 5,
                  message: '不超过5张',
                  type: 'array',
                }],
              })} {...propsPic} >
              <Icon type="plus" />
              <div className="ant-upload-text">上传照片</div>
            </Upload>
          </FormItem>
          <FormItem {...formItemLayout}
            label="销售人:"
            required>
            <PidSelect form={this.props.form}
              params={params}
              option={options}
              user={userInfo}
              queryByName={this.queryByName}
              getOrderOwnerId={this.getOrderOwnerId}
              type={userInfo.userChannel}
              info={this.info}
              sellName={sellerName}
              {...getFieldProps('orderOwnerId', {
                rules: [{
                  required: true,
                  max: 60,
                  message: userInfo.userChannel === 'BUC' ?
                   '请输入内部小二的真名或花名' :
                   '请输入服务商小二姓名',
                }],
              })} />
          </FormItem>

          <Row style={{ marginTop: 50 }}>
            <Col offset={2} span={2} style={{
              borderLeft: '4px solid #2eb7f5', paddingLeft: 10, lineHeight: 1,
              }}>
              商家信息
            </Col>
            <Col className="info" style={{ lineHeight: 1, color: '#7e7e7e', fontSize: 12 }}>
              填写商家联系方式，以便管理合同和后续联系
            </Col>
          </Row>
          <FormItem {...formItemLayout}
            label="商家真实姓名">
            <Input type="text" {...getFieldProps('merchantName', {
              initialValue: list.merchantName, rules: [{
                required: true,
                max: 60,
                message: '请输入真实姓名, 最多不超过60字',
              }],
            })} />
          </FormItem>
          <FormItem {...formItemLayout}
            label="商家联系电话">
            <Input type="text" {...getFieldProps('merchantPhone', {
              initialValue: list.merchantPhone, rules: [
                { required: true, message: '请输入联系电话' },
                { validator: (rule, value, callback) => {
                  if (value) {
                    if (!/^(\d+(-\d+){2}|\d+(-\d+){1}|\d+)$/.test(value)) {
                      callback(new Error('联系电话格式不符合要求'));
                      return;
                    }
                    const count = (value.match(/-/g) || []).length;
                    if ((count === 0 && value.length === 11 && !/^[01]/.test(value)) ||
                        (count === 0 && (value.length < 7 || value.length > 12)) ||
                        (count === 1 && (value.length < 10 || value.length > 15)) ||
                        (count === 2 && (value.length < 13 || value.length > 20))) {
                      callback(new Error('联系电话格式不符合要求'));
                    }
                    callback();
                  }
                  callback();
                } },
              ] })} />
          </FormItem>
          <FormItem {...formItemLayout}
            label="商家淘宝账号">
            <Input type="text" {...getFieldProps('merchantTaobaoId', {
              initialValue: list.merchantTaobaoId, rules: [{
                max: 60,
                message: '账号最多不超过60字',
              }],
              })} placeholder="选填" />
          </FormItem>
          <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
            <Button loading={this.props.loading} type="primary" htmlType="submit" onClick={this.handleSubmit}>提交</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(AddReport);
