import React, {PropTypes} from 'react';
import {Tabs, Button, message, Modal, Form, Input} from 'antd';
import ActivityDetailOperation from './ActivityDetailOperation';
import ActivityDetailBase from './ActivityDetailBase';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const ActivityDetail = React.createClass({
  propTypes: {
    children: PropTypes.any,
    params: PropTypes.object,
    form: PropTypes.object,
  },
  getInitialState() {
    return {
      display: (permission('SERVICEC_CAMPAIGN_OFFLINE') && this.props.params.allowKbOffline === 'true' && this.props.params.type !== 'MULTI_STEP_CASH' && this.props.params.type !== 'BRAND_CART_DISCOUNT') ? true : false,
      disabled: this.props.params.campStatusFlag === 'CAMP_NEW' ? false : true,
      visible: false,
    };
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },
  onClick() {
    if (this.props.params.campStatusFlag === 'CAMP_NEW') {
      this.setState({
        visible: true,
      });
    } else {
      this.handAjax();
    }
  },
  handleOk() {
    this.props.form.validateFieldsAndScroll((errors) => {
      if (!!errors) {
        // console.log('Errors in form!!!');
      } else {
        this.handAjax();
      }
    });
  },
  handAjax() {
    const params = {
      campId: this.props.params.campId,
      campStatus: this.props.params.campStatusFlag,
      merchantId: this.props.params.merchantId,
      memo: this.props.form.getFieldValue('reason'),
    };
    ajax({
      url: window.APP.crmhomeUrl + '/goods/koubei/promotionOffline.json',
      method: 'post',
      data: params || {},
      type: 'json',
      success: (result) => {
        if (result.status === 'failed' && result.status) {
          message.error(result.resultMsg);
        } else {
          this.setState({
            visible: false,
            display: false,
          });
          message.success(result.resultMsg);
        }
      },
    });
  },
  handleCancel() {
    this.setState({
      visible: false,
    });
  },
  render() {
    const {getFieldProps} = this.props.form;
    let tab = (
      <Tabs tabBarExtraContent={this.state.display ? <Button type="primary" size="large" onClick={this.onClick}>下架</Button> : null}>
        <TabPane tab="营销活动详情" key="base">
          <ActivityDetailBase {...this.props}/>
        </TabPane>
        <TabPane tab="操作日志" key="operation" disabled={this.state.disabled}>
          <ActivityDetailOperation {...this.props}/>
        </TabPane>
      </Tabs>
    );
    if (this.state.disabled) {
      tab = (
        <Tabs tabBarExtraContent={this.state.display ? <Button type="primary" size="large" onClick={this.onClick}>下架</Button> : null}>
          <TabPane tab="营销活动详情" key="base">
            <ActivityDetailBase {...this.props}/>
          </TabPane>
        </Tabs>
      );
    }
    return (<div>
      <div className="kb-tabs-main" style={{position: 'relative'}}>
        {tab}
      </div>
      <div>
        <Modal title="下架" visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}>
            <div style={{height: 150, paddingTop: 30}}>
              <Form horizontal>
                <FormItem label="下架原因：" extra="限50字" labelCol={{span: 4}} wrapperCol={{span: 16}}>
                  <Input type="textarea" placeholder="输入原因" rows="4" {...getFieldProps('reason', {
                    rules: [
                      { required: true, message: '此处必填'},
                      { max: 50, message: '限50字'},
                    ],
                  })}/>
                </FormItem>
              </Form>
            </div>
        </Modal>
      </div>
    </div>);
  },
});

export default Form.create()(ActivityDetail);
