import React, {PropTypes} from 'react';
import {Input, Form, Button, message, Modal} from 'antd';
import ajax from 'Utility/ajax';
import CityCascader from '../common/CityCascader';
import Constants from '../common/constants';
import './CityAreaManagerAdd.less';
const FormItem = Form.Item;

const CityAreaManageAdd = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },
  getInitialState() {
    this.territoryId = this.props.location.query.territoryId;
    this.cityCode = this.props.location.query.cityCode;
    this.parentId = this.props.location.query.parentId;
    this.territoryName = this.props.location.query.territoryName;
    this.territoryMemo = this.props.location.query.territoryMemo;
    return {
      submitting: false,
    };
  },

  componentDidMount() {
    this.props.form.setFieldsValue({
      territoryName: this.territoryName,
      memo: this.territoryMemo,
    });
  },
  onSubmit(e) {
    e.preventDefault();
    this.props.form.submit(() => {
      this.props.form.validateFields((errors, values) => {
        if (!!errors) {
          return;
        }
        this.doAjaxRequest(values);
      });
    });
  },
  goBack(changed) {
    if (history.length > 1) {
      history.back();
    } else {
      if (changed && window.opener && window.opener.postMessage) {
        window.opener.postMessage({type: Constants.TerritoryChanged}, location.origin);
      }
      window.close();
    }
  },
  doAjaxRequest(values) {
    let params;
    let url;
    const cityCode = values.cityValues[values.cityValues.length - 1];
    delete values.cityValues;
    if (this.territoryId) { // 修改
      url = window.APP.crmhomeUrl + '/shop/koubei/territory/modify.json';
      params = {
        parentId: this.parentId,
        territoryId: this.territoryId,
        cityCode,
        ...values,
      };
    } else { // 新增
      url = window.APP.crmhomeUrl + '/shop/koubei/territory/create.json';
      params = {
        cityCode,
        ...values,
      };
    }
    this.setState({submitting: true});
    ajax({
      url: url,
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        this.setState({submitting: false});
        if (result.status && result.status === 'succeed') {
          Modal.success({
            title: '提交成功',
            onOk: () => this.goBack(true),
          });
        }
      },
      error: (results) =>{
        this.setState({submitting: false});
        message.error(results && results.resultMsg || '请求失败');
      },
    });
  },
  render() {
    const {getFieldProps} = this.props.form;

    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 9 },
    };
    return (
      <div className="city-area-manager-add right-add-panel">
        <div className="add-header">{this.territoryId ? '修改网格' : '创建网格'}</div>
          <Form horizontal>
            <div className="right-add-content">
            <FormItem {...formItemLayout} label="所属城市：" required>
              <CityCascader style={{width: '230px'}} cityCode={this.cityCode} disabled={this.territoryId}
                {...getFieldProps('cityValues', {
                  rules: [{
                    required: true,
                    message: '此处必填',
                  }]})} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="网格名称：">
              <Input placeholder="例如：黄龙地区，最多限14个字"
                {...getFieldProps('territoryName', {
                  rules: [{
                    required: true,
                    message: '此处必填',
                  }, {
                    max: 14,
                    message: '限14个字',
                  }]})}/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注：">
              <Input type="textarea" placeholder="请描述下，方便辨识"
                {...getFieldProps('memo', {
                  rules: [{
                    max: 100,
                    message: '限100个字',
                  }]})}/>
            </FormItem>
            </div>
            <div className="right-add-footer">
              <Button type="primary" loading={this.state.submitting} onClick={this.onSubmit}>提交</Button>
              <Button type="ghost" onClick={() => this.goBack()}>取消</Button>
            </div>
          </Form>
      </div>
    );
  },
});

export default Form.create()(CityAreaManageAdd);
