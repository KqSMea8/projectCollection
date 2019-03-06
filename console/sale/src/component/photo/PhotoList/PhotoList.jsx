import React, { PropTypes } from 'react';
import { Form } from 'antd';
import { addQueryParams } from '../../../common/urlUtils';
import classnames from 'classnames';
import PidSelect from '../../../common/PidSelect';

const FormItem = Form.Item;

const PhotoList = React.createClass({
  propTypes: {
    form: PropTypes.object,
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      pid: '',
      url: window.APP.crmhomeUrl + '/main.kb#/material/center',
    };
  },

  handleCascaderChange(value) {
    const pid = value[1];
    this.setState({
      pid,
    });
  },

  render() {
    const { getFieldError } = this.props.form;
    const { pid } = this.state;

    const materiaCenterlUrl = addQueryParams(window.APP.crmhomeUrl + '/main.htm.kb#/material/center', {
      op_merchant_id: pid,
    });

    return (<div>
      <div className="app-detail-header">素材中心</div>
      <div className="kb-list-main">
        <Form inline>
          <FormItem
            label="选择商户："
            validateStatus={
              classnames({
                error: !!getFieldError('pid'),
              })}
            help={getFieldError('pid')}>
            <PidSelect form={this.props.form} onChange={this.handleCascaderChange} style={{width: 400}}/>
            </FormItem>
        </Form>
        {pid === '' && (<div style={{
          marginTop: 16,
          textAlign: 'center',
          height: 440,
          lineHeight: '440px',
          border: '1px dashed #d9d9d9',
          color: '#ccc',
          backgroundColor: '#fbfbfb',
          fontSize: 14,
        }}>未选择商户</div>)}
        {
          pid &&
          <iframe src={materiaCenterlUrl} style={{display: 'block'}} id="crmhomePage" width="100%" height="998" scrolling="no" border="0" frameBorder="0"></iframe>
        }
      </div>
    </div>);
  },
});

export default Form.create()(PhotoList);
