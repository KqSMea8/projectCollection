/* eslint-disable */
import React, {PropTypes} from 'react';
import {Form, Select} from 'antd';
import classnames from 'classnames';
import SelectShops from '../../../../common/SelectShops/indexs';
/* eslint-enable */
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

const ShopFormItem = React.createClass({
  propTypes: {
    form: PropTypes.object,
    data: PropTypes.object,
    isEdit: PropTypes.bool,
    isCampaignStart: PropTypes.bool,
  },

  getInitialState() {
    const { data } = this.props;
    const shopList = data.shopList || {};
    if (this.props.isEdit) {
      return {
        selectedShops: data.shopList || [],
      };
    }
    return {
      selectedShops: shopList.checked || [],
    };
  },

  checkShopList(rule, value, callback) {
    this.props.form.validateFields(['targetShopType'], {force: true});
    callback();
  },

  checkTargetShopType(rule, value, callback) {
    const {form} = this.props;
    const shopList = form.getFieldValue('shopList');
    if (value === '2' && (shopList === undefined || shopList.length === 0)) {
      callback(new Error('请选择券适用门店'));
      return;
    }
    callback();
  },

  render() {
    const isOnline = this.props.isEdit && this.props.isCampaignStart;
    const {isEdit} = this.props;
    const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
    const targetShopType = getFieldValue('targetShopType') || '1';
    console.log(targetShopType);
    let shopUrl;
    if (isEdit) {
      shopUrl = '/goods/itempromo/getShopsByCityForNewCamp.json?isVoucher=true&campId=' + this.props.data.campId;
    }

    return (<FormItem
      label="券适用门店："
      required
      validateStatus={classnames({error: !!getFieldError('targetShopType')})}
      help={getFieldError('targetShopType')}
      {...formItemLayout}>
      <Select style={{width: 110, marginRight: 8}} disabled={isEdit} placeholder="请选择" {...getFieldProps('targetShopType', {
        validateFirst: true,
        rules: [this.checkTargetShopType],
      })}>
        <Option key="1">同活动门店</Option>
        <Option key="2">指定门店</Option>
      </Select>
      <div style={{display: targetShopType === '2' ? 'inline-block' : 'none'}}>
        <SelectShops form={this.props.form} canReduce={!isOnline} selectedShops={this.state.selectedShops} isEdit={isEdit} shopUrl={shopUrl} {...getFieldProps('shopList', {
          initialValue: this.state.selectedShops,
          rules: [this.checkShopList],
        })}/>
      </div>
    </FormItem>);
  },
});

export default ShopFormItem;
