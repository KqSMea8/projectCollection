import React, {PropTypes, Component} from 'react';
import { Form } from 'antd';
import classnames from 'classnames';
import ShopTreeModal from './ShopTreeModal';

const FormItem = Form.Item;

/*
  表单字段 － 选择门店
*/
class SelectShop extends Component {
  static propTypes = {
    form: PropTypes.object,
    layout: PropTypes.object,
    actionType: PropTypes.string,
    initData: PropTypes.object,
  }

  static defaultProps = {
    initData: {},
  }

  state = {
    treeData: [],
    checkedSymbols: [],
    visible: false,
  }

  checkShop = (rule, value, callback) => {
    if (value === undefined || value.length === 0) {
      callback('至少选择一家门店');
    }

    callback();
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { initData, roleType, actionType, layout, params } = this.props;
    const isEdit = actionType === 'edit';
    const isMerchant = roleType === 'merchant';

    let shopUrl;
    if (isEdit) {
      shopUrl = `/goods/itempromo/getShopsByCityForNewCamp.json?isVoucher=true&campId=${params.id}`;
    }

    return (
      <FormItem
        {...layout}
        required
        label="券适用门店："
        help={getFieldError('shopIds')}
        validateStatus={
        classnames({
          error: !!getFieldError('shopIds'),
        })}
      >
        <ShopTreeModal
          isEdit={isEdit}
          canReduce={!(isEdit && isMerchant && initData.campaignStart)}
          shopUrl={shopUrl}
          selectedShops={initData.cityShop}
          {...getFieldProps('shopIds', {
            rules: [
              {required: true, type: 'array', message: '请选择门店'},
              {validator: this.checkShop},
            ],
            initialValue: initData.shopIds,
          }) }
        />
      </FormItem>
    );
  }
}

export default SelectShop;
