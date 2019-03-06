import React, {PropTypes} from 'react';
import { Form, Row, Col } from 'antd';
import classnames from 'classnames';
import PidSelect from '../../../common/PidSelect';

const FormItem = Form.Item;

const ThirdPartyMarketingActivityManage = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },
  getInitialState() {
    this.params = {
      title: '第三方活动管理',
      url: window.APP.crmhomeUrl + '/main.htm.kb',
      hash: '#/marketing/retailers/manage/brandType/isKbservLogin',
    };
    return {
      hideCrmhomePage: true,
    };
  },
  handlePidSelectChange(value) {
    this.setState({
      hideCrmhomePage: true,
    });
    const oldVal = this.props.form.getFieldValue('partnerIdVal');
    if (value && (oldVal !== value[1])) {
      this.props.form.setFieldsValue({
        partnerIdVal: value[1],
      });
      const hash = this.params.hash;
      this.setState({
        hideCrmhomePage: false,
        url: this.params.url + '?op_merchant_id=' + value[1] + ( hash ? hash : '' ),
      });
    }
  },

  render() {
    const {getFieldError, getFieldProps} = this.props.form;
    getFieldProps('partnerIdVal');
    this.url = this.state.url;
    return (
      <div>
        <div className="app-detail-header">
          {this.params.title}
        </div>
        <div className="kb-detail-main" style = {{paddingBottom: 0}}>
          <Form horizontal>
            <Row>
              <Col span="12" offset = "0">
                <FormItem
                  labelCol={{span: 4}}
                  wrapperCol={{span: 18}}
                  validateStatus={
                  classnames({
                    error: !!getFieldError('partnerId'),
                  })}
                  required
                  label="选择商户：">
                  <PidSelect form={this.props.form} includeTeam = {this.props.params.includeTeam} onChange={this.handlePidSelectChange}/>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        {this.state.hideCrmhomePage === true || this.state.hideCrmhomePage ? null : <iframe src={this.url} style={{display: this.state.hideCrmhomePage ? 'none' : 'block'}} id="crmhomePage" width="100%" height="998" scrolling="no" border="0" frameBorder="0"></iframe>}
      </div>
    );
  },
});

export default Form.create()(ThirdPartyMarketingActivityManage);
