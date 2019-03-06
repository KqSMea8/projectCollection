import React, {PropTypes} from 'react';
import {Form, Modal} from 'antd';
import AllMoneyForm from './AllMoneyForm';
import OneRateForm from './OneRateForm';
import OneMoneyForm from './OneMoneyForm';

const InputCouponModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    data: PropTypes.object,
    isEdit: PropTypes.bool,
    isSignleVisible: PropTypes.bool,
    showModal: PropTypes.bool,
    isCampaignStart: PropTypes.bool,
  },

  getInitialState() {
    return {
      myType: this.props.data.myType || 'ALL_MONEY',
    };
  },
  onOk() {
    const {getFieldValue, getFieldsValue} = this.props.form;
    const values = getFieldsValue();
    values.descList = [];
    values.descListKeys.forEach((key) => {
      const value = getFieldValue('descList' + key);
      if (value) {
        values.descList.push(value);
      }
    });
    values.forbiddenDate = [];
    values.forbiddenDateKeys.forEach((key) => {
      const value = getFieldValue('forbiddenDate' + key);
      if (value && value[0] && value[1]) {
        values.forbiddenDate.push(value);
      }
    });

    this.props.form.validateFieldsAndScroll((error) => {
      this.props.onOk(error, values, this.props.form);
    });
  },

  onTypeChange(myType) {
    this.setState({
      myType,
    });
  },

  render() {
    const {isEdit, data, isSignleVisible, showModal, isCampaignStart} = this.props;
    const myType = this.state.myType;
    const formProps = {
      form: this.props.form,
      onTypeChange: this.onTypeChange,
      data,
      isEdit,
      isSignleVisible,
      isCampaignStart,
    };
    if (myType === 'ALL_MONEY' && !isEdit) {
      // 当初始值化为全场代金券且为创建的情况下默认需要设置使用条件
      formProps.data.conditionsOfUseType = '2';
    } else if (!isEdit) {
      // 否则,如果不是编辑状态的都被设置为不需要设置默认使用条件
      formProps.data.conditionsOfUseType = '1';
    }
    return (<Modal title={isEdit ? '编辑券' : '添加券'} visible={showModal} width={700} style={{top: 20}} maskClosable={false}
      onOk={this.onOk} onCancel={this.props.onCancel}>
      {myType === 'ALL_MONEY' && <AllMoneyForm {...formProps}/>}
      {myType === 'ONE_RATE' && <OneRateForm {...formProps}/>}
      {myType === 'ONE_MONEY' && <OneMoneyForm {...formProps}/>}
    </Modal>);
  },
});

export default Form.create()(InputCouponModal);
