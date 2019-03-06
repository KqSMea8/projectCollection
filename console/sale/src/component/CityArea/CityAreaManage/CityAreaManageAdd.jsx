import './CityAreaManage.less';
import React, {PropTypes} from 'react';
import {Input, Form, Button, message} from 'antd';
import ajax from 'Utility/ajax';
const FormItem = Form.Item;

const CityAreaManageAdd = React.createClass({
  propTypes: {
    form: PropTypes.object,
    modifyData: PropTypes.object,
    onCancel: PropTypes.func,
    cityId: PropTypes.string,
    cityCode: PropTypes.string,
    parentId: PropTypes.string,
    fetchCity: PropTypes.func,
    title: PropTypes.string,
  },
  getInitialState() {
    return {
      loading: false,
    };
  },

  componentDidMount() {
    if (this.props.modifyData.territoryName) {
      this.props.form.setFieldsValue(this.props.modifyData);
    }
  },
  onSubmit(e) {
    e.preventDefault();
    this.props.form.submit(() => {
      this.props.form.validateFields((errors, values) => {
        if (!!errors) {
          return;
        }
        this.fetch(values);
      });
    });
  },
  fetch(values) {
    let params = {
      cityCode: this.props.cityId,
      ...values,
    };
    let url = window.APP.crmhomeUrl + '/shop/koubei/territory/create.json';
    if (this.props.modifyData.territoryName) {
      params = {
        parentId: this.props.parentId,
        territoryId: this.props.cityId,
        cityCode: this.props.cityCode,
        ...values,
      };
      url = window.APP.crmhomeUrl + '/shop/koubei/territory/modify.json';
    } else if (this.props.parentId) {
      params = {
        parentId: this.props.parentId,
        cityCode: this.props.cityCode,
        ...values,
      };
    }
    this.setState({loading: true});
    ajax({
      url: url,
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          let cityKey = '';
          if (this.props.cityCode) {
            cityKey = this.props.cityCode;
          } else {
            cityKey = this.props.cityId;
          }
          const submitkey = {
            cityKey,
            areaKey: result.data,
            title: this.props.title,
          };
          this.props.fetchCity(submitkey);
          this.setState({loading: false});
          message.success('提交成功', 3);
        }
      },
      error: (results) =>{
        if (results.resultMsg) {
          this.setState({loading: false});
          message.error(results.resultMsg);
        }
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
      <div className="right-add-panel">
        <div className="add-header">{this.props.modifyData.territoryName ? '修改网格' : '创建网格'}</div>
          <Form horizontal>
            <div className="right-add-content">
            <FormItem
              {...formItemLayout}
              label="网格名称："
              extra="限14个字">
              <Input placeholder="例如：黄龙地区"
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
              <Button type="primary" loading={this.state.loading} onClick={this.onSubmit}>提交</Button>
              <Button type="ghost" onClick={this.props.onCancel}>取消</Button>
            </div>
          </Form>
      </div>
    );
  },
});

export default Form.create()(CityAreaManageAdd);
