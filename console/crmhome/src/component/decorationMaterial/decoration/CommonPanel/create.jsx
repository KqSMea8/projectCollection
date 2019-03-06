import React, {PropTypes} from 'react';
import {Form, Input, Button, Breadcrumb, message} from 'antd';
import ShopItem from '../../common/ShopItem';
import ajax from '../../../../common/ajax';
import PhotoPickerModal from '../../common/PhotoPickerModel';
import {getMerchantId, kbScrollToTop} from '../../common/utils';
import classnames from 'classnames';
const FormItem = Form.Item;

const CommonCreate = React.createClass({
  propTypes: {
    params: PropTypes.object,
    form: PropTypes.object,
  },

  getInitialState() {
    window.parent.postMessage({'showPidSelect': false}, '*');
    this.merchantId = getMerchantId();
    const {info} = this.props.params;
    const initialList = info ? [{...JSON.parse(decodeURIComponent(info))}] : [];

    return {
      photoModal: true,
      initialList,
      commonList: initialList.length ? [initialList[0].fileId] : [],
      submitting: false,
      loadedShops: false,
    };
  },

  onSubmit() {
    if (!this.state.loadedShops) {
      return message.error('请先选择门店');
    }
    this.props.form.validateFieldsAndScroll((err, fileds) => {
      if (!err && !this.state.submitting) {
        this.setState({submitting: true});
        const {info} = this.props.params;
        const {commonList, initialList} = this.state;
        const params = {goodsType: this.props.params.type};
        if (info) {
          params.goodsId = initialList[0].id;
        }
        params.list = JSON.stringify(commonList.map(fileId => {
          return {name: fileds[fileId], fileId};
        }));
        if (info) {
          const fileId = commonList[0];
          params.name = fileds[fileId];
          params.fileId = fileId;
        }
        params.shopIds = fileds.shopIds.join(',');
        params.op_merchant_id = this.merchantId;
        params.merchantId = this.merchantId;
        ajax({
          url: info ? '/shop/modifyShopGoodsPics.json' : '/shop/createShopGoodsPics.json',
          data: params,
          method: 'post',
          success: (res) => {
            if (res.status === 'succeed') {
              this.setState({submitting: false});
              message.success('提交成功');
              this.goBack();
            }
          },
          error: (error, msg) => {
            message.error(msg);
            this.setState({submitting: false});
          },
        });
      }
    });
  },

  goBack() {
    kbScrollToTop();
    window.parent.postMessage({'showPidSelect': true}, '*');
    const {categoryId, type} = this.props.params;
    window.location.hash = `#/decoration/${categoryId}/${type}`;
  },

  addFiles(fileList) {
    const initialList = fileList.map((v, i) => {
      return {
        id: i + '',
        name: v.name.indexOf('.') > 0 ? v.name.split('.')[0] : v.name,
        url: v.url,
        fileId: v.sourceId,
      };
    });
    this.setState({
      photoModal: false,
      initialList,
      commonList: initialList.map(item => item.fileId),
    });
  },

  removeItem(fileId) {
    const {commonList} = this.state;
    this.setState({
      commonList: commonList.filter(v => v !== fileId),
    });
  },

  createFormList(shopItem) {
    const {typeName, info} = this.props.params;
    const {getFieldProps} = this.props.form;
    const {commonList, initialList} = this.state;
    return initialList.map((item, i) => {
      const {name, url, id, fileId} = item;
      const hasItem = !!~commonList.indexOf(fileId);
      return (<div key={id} style={!hasItem ? {display: 'none'} : {}} className={classnames({'create-form-item': true, 'form-hover': commonList.length > 1})}>
        <a className="remove" onClick={() => this.removeItem(fileId)}>删除</a>
        <div className="img-wrap">
          <div className="kb-photo-picker-list-item">
            <img src={url} />
          </div>
        </div>
        <div className={classnames({'form-wrap': true, 'item-middle': !info})}>
          <FormItem key={i} labelCol={{span: 5}} wrapperCol={{span: 15}} label={`${typeName}名称`}>
            <Input className="name-input" {...getFieldProps(`${fileId}`, {
              initialValue: name,
              rules: hasItem ? [{
                required: true,
                message: `请填写${typeName}名称`,
              }, {
                max: 20,
                message: '最多不超过20个字符',
              }] : [],
            })} placeholder="不超过12个字" />
          </FormItem>
          {info && shopItem}
        </div>
      </div>);
    });
  },

  dealData(result) {
    const { shopCountGroupByCityVO = [], selectedCityShops = [] } = result.result ? result.result : result;
    const newSelected = Object.keys(selectedCityShops).map(item => selectedCityShops[item]);
    return { shopCountGroupByCityVO, selectedCityShops: newSelected };
  },

  render() {
    const {typeName, categoryId, info} = this.props.params;
    const {photoModal, commonList, submitting, initialList} = this.state;
    const {getFieldProps} = this.props.form;
    const adjustItem = (<FormItem label="适用门店：" labelCol={{span: 5}} wrapperCol={{span: 15}} >
      <ShopItem {...getFieldProps('shopIds', {
        rules: [{
          min: 1,
          required: true,
          type: 'array',
          message: '请选择适用门店',
        }],
      })}
      afterLoad={(selected) => {
        let selectedShops = [];
        selected.forEach(item => {
          selectedShops = selectedShops.concat(item.shops.map(shop => shop.shopId));
        });
        this.props.form.setFieldsValue({shopIds: selectedShops});
        this.setState({'loadedShops': true});
      }}
      dealData={(result) => { return this.dealData(result); }}
      url={info ? `/shop/queryGoodsDetail.json?categoryId=${categoryId}&goodsId=${initialList[0].id}` : `/goods/itempromo/getShops.json?categoryId=${categoryId}`}
      subUrl="/goods/itempromo/getShopsByCity.json" />
    </FormItem>);

    return (<div className="dish-create environment-create">
      <div className="app-detail-header">
        <Breadcrumb separator=">">
          <Breadcrumb.Item style={{cursor: 'pointer'}} onClick={() => {this.goBack();}} >{typeName}</Breadcrumb.Item>
          <Breadcrumb.Item>{!info ? '新建' : '修改'}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="app-detail-content-padding create-form-wrap">
        <Form form={this.props.form} horizontal>
          {!info && <div className="shop-select">
              {adjustItem}
          </div>}
          <div className="dish-edit-modal">
            {commonList.length ? this.createFormList(adjustItem) : null}
          </div>
          <div className="create-form-button">
            <FormItem label=" " labelCol={{span: 5}} wrapperCol={{span: 15}} className="kb-without-colon">
              <Button type="primary" onClick={this.onSubmit} loading={submitting}>提交</Button>
              <Button style={{marginLeft: '10px'}} onClick={() => {this.goBack();}}>取消</Button>
            </FormItem>
          </div>
        </Form>
      </div>
      {!info && <PhotoPickerModal
        listParams={{op_merchant_id: this.merchantId, materialType: 'img'}}
        uploadParams={{op_merchant_id: this.merchantId}}
        visible={photoModal}
        modalTitle={`添加${typeName}`}
        listUrl="/material/materialComponent.json"
        uploadUrl = "/material/picUpload.json"
        limitText={`一次最多可添加10个${typeName}图`}
        max={10}
        multiple
        onOk={this.addFiles}
        onCancel={this.goBack}/>}
    </div>);
  },
});

export default Form.create()(CommonCreate);
