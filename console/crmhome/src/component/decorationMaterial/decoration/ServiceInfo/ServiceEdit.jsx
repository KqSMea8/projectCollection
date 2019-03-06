import React from 'react';
import {message, Spin, Form, Button, Breadcrumb, Modal, Input} from 'antd';
import {TagSelect} from 'hermes-react';
import ajax from '../../../../common/ajax';
import {getCategoryId} from '../../common/utils';
import {kbScrollToTop} from '../../../../common/utils';

const FormItem = Form.Item;

const ServiceEdit = React.createClass({
  getInitialState() {
    window.parent.postMessage({'showPidSelect': false}, '*');
    return {
      data: {},
      loading: true,
      saveLoading: false,
      allTags: [],
    };
  },
  componentDidMount() {
    const {shopId} = this.props.params;
    const params = {
      shopId,
    };
    ajax({
      url: '/shop/queryShopServiceDetail.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (data) => {
        if (data.status === 'succeed') {
          const result = data.result;
          this.setState({
            loading: false,
            allTags: result.allTags,
            data: result.vo,
          });
        } else {
          message.error(data.resultMsg);
        }
      },
      error: (_, msg) => {
        message.error(msg);
      },
    });
  },
  onSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) return;
      this.save(values);
    });
  },
  goTo(hash) {
    window.parent.postMessage({'showPidSelect': true}, '*');
    if (hash) {
      window.location.hash = hash;
    } else {
      window.history.back();
    }
  },
  save(values) {
    const {shopId} = this.props.params;
    this.setState({
      saveLoading: true,
    });
    const params = {
      shopId,
      serviceTag: values.serviceTag.join(','),
      extraService: values.extraService,
    };
    ajax({
      url: '/shop/modifyShopService.json',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          message.success('提交成功');
          this.goTo('/decoration/' + getCategoryId() + '/service');
        } else {
          Modal.error({
            title: '提交失败',
            content: result.resultMsg,
            onOk: () => this.goBack('#/decoration/' + getCategoryId() + '/service'),
          });
        }
        this.setState({
          saveLoading: false,
        });
        kbScrollToTop();
      },
      error: (_, msg) => {
        message.error(msg);
        this.setState({
          saveLoading: false,
        });
        kbScrollToTop();
      },
    });
  },
  goBack(hash) {
    kbScrollToTop();
    Modal.confirm({
      title: '是否放弃提交',
      content: '',
      okText: '是',
      cancelText: '否',
      onOk: () => {
        if (hash) {
          window.location.hash = hash;
        } else {
          window.history.back();
        }
      },
    });
  },
  checkDescription(rule, value, callback) {
    if (value && value.length > 140) {
      callback(new Error('已超过' + (value.length - 140) + '个字'));
    }
    callback();
  },
  render() {
    const {allTags, data, loading, saveLoading} = this.state;
    const {getFieldProps} = this.props.form;
    const formItemLayout = {
      labelCol: {span: '5'},
      wrapperCol: {span: '15'},
    };
    return (<div className="service-create">
      <div className="app-detail-header">
        <Breadcrumb separator=">">
          <Breadcrumb.Item onClick={() => {this.goBack('#/decoration/' + getCategoryId() + '/service');}} href={null}>服务信息</Breadcrumb.Item>
          <Breadcrumb.Item>修改</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="app-detail-content-padding">
      {!loading ? <Form form={this.props.form} horizontal>
          <FormItem {...formItemLayout} label="适用门店">
            <div>{data.shopName}</div>
          </FormItem>
          <FormItem {...formItemLayout} label="选择特色标签">
            <TagSelect options={allTags.map(v => v.name)} {...getFieldProps('serviceTag', {
              initialValue: data.serviceList.map(v => v.name),
              rules: [{max: 15, type: 'array', message: '最多选择15个标签，已达到上限。'}],
            })} />
          </FormItem>
          <FormItem {...formItemLayout} label="更多服务" extra="限140个字">
            <Input type="textarea" rows="3" placeholder="如果您还提供了其他服务内容，请填写在这里。" {...getFieldProps('extraService', {
              initialValue: data.desc,
              rules: [
                this.checkDescription,
              ],
            })} />
          </FormItem>
          <FormItem {...formItemLayout} label=" " className="kb-without-colon">
            <Button type="primary" loading={saveLoading} onClick={this.onSubmit}>提交</Button>
            <Button style={{marginLeft: '10px'}} onClick={() => this.goBack()}>取消</Button>
          </FormItem>
        </Form> : <Spin />}
       </div>
    </div>);
  },
});

export default Form.create()(ServiceEdit);
