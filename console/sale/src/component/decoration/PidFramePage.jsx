import PidSelect from '../../common/PidSelect';
import {Form, Icon} from 'antd';
import FramePage from './FramePage';
import React, {PropTypes} from 'react';
import classnames from 'classnames';

const FormItem = Form.Item;

const PidFramePage = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },

  getInitialState() {
    return {
      showPidSelect: true,
    };
  },

  componentDidMount() {
    window.addEventListener('message', (e) => {
      const {showPidSelect} = e.data;
      if (typeof showPidSelect === 'boolean') {
        this.setState({ showPidSelect });
      }
    });
  },

  render() {
    const merchant = this.props.form.getFieldsValue(['partnerId', 'partnerName']);
    return (<div className="decoration-container">
         <div className={classnames({'app-detail-header': !merchant.partnerId})}>
            {!merchant.partnerId ? <p>门店内容</p> : null}
            <div className="decoration-pid-select" style={{display: this.state.showPidSelect ? 'block' : 'none'}}>
              <Form style={{height: 50}} className="decoratoin-pid-form">
                <FormItem
                  labelCol={{span: 0}}
                  wrapperCol={{span: 24}}
                >
                <PidSelect form={this.props.form}/>
               </FormItem>
             </Form>
            </div>
           {merchant.partnerId ? <FramePage params={{url: `${window.APP.crmhomeUrl}/main.htm.kb?op_merchant_id=${merchant.partnerId}#/decoration`, merchantId: merchant.partnerId}} /> : <div className="no-category">
              <p>
                <Icon style={{fontSize: 24, paddingRight: 5, verticalAlign: 'middle'}} type="meh" />
                <span style={{verticalAlign: 'middle'}}>请先选择一个一商家</span>
              </p>
            </div>}
         </div>
    </div>);
  },
});

export default Form.create()(PidFramePage);
