import React, {PropTypes} from 'react';
import ShopModal from './ShopModal';
import classnames from 'classnames';
import {Form, Spin} from 'antd';

const FormItem = Form.Item;

const ShopsSetting = React.createClass({
  propTypes: {
    form: PropTypes.object,
    treeData: PropTypes.array,
    previousShopID: PropTypes.array,
    previousShopNames: PropTypes.array,
    shopInfos: PropTypes.array,
    showSpin: PropTypes.bool,
    loading: PropTypes.bool,
  },

  getInitialState() {
    return {
      showShopModal: false,
    };
  },

  render() {
    const {getFieldValue, getFieldProps, getFieldError} = this.props.form;
    const {treeData, previousShopID, previousShopNames, shopInfos, showSpin, loading} = this.props;
    const choose = getFieldValue('choosedShops', {
      rules: [{
        type: 'array',
      }],
    });
    const choosedShops = choose || [];
    const previousShow = choose && choose.length === 0 ? [] : previousShopNames;
    const showShops = choosedShops.length > 0 ? choosedShops : previousShow;
    const button = showSpin || loading ? <Spin size="default"/> : <a onClick={() => {this.setState({showShopModal: true}); }}>门店选择</a>;
    const shopModal = !loading ? (<ShopModal treeData={treeData} previousShopID={previousShopID} shopInfos={shopInfos} visible={this.state.showShopModal} {...getFieldProps('choosedShops', {
      rules: [{
        required: true,
        type: 'array',
        message: '请选择门店',
      }],
    })}
    onCancel={() => {
      this.setState({showShopModal: false});
    }}/>) : null;
    return (<div className="huabei-shop-container">
      <Form horizontal>
        <FormItem
          validateStatus={classnames({error: !!getFieldError('choosedShops')})}
          help={getFieldError('choosedShops')}
          labelCol={{span: 2}}
          wrapperCol={{span: 22}}
          label="适用店铺"
        >
          {shopModal}
          {treeData.length > 0 && !loading ? (<div><a onClick={() => {this.setState({showShopModal: true}); }}>门店选择</a>
          <ul style={{marginTop: 8, height: (showShops.length >= 20 ? 358 : null), overflowY: (showShops.length >= 20 ? 'scroll' : null)}} className="huabei-shops-list">
            {showShops.map((item, i) => <li key={i}>{item.name}</li>)}
          </ul></div>) : button}
        </FormItem>
      </Form>
    </div>);
  },
});

export default ShopsSetting;
