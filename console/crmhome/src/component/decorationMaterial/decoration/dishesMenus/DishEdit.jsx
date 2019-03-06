import React, {PropTypes} from 'react';
import {Breadcrumb, Form, Button, Modal, Spin, message} from 'antd';
import DishEditForm from './DishEditForm';
import DishSingleEditForm from './DishSingleEditForm';
import ajax from '../../../../common/ajax';
import PhotoPickerModal from '../../common/PhotoPickerModel';
import {getMerchantId, kbScrollToTop, getCategoryId} from '../../common/utils';
import {keepSession} from '../../../../common/utils';
// import PhotoPickerPageModal from '../../common/PhotoPickerPageModal'; TODO: 分页接入时间不够

const FormItem = Form.Item;

const DishEdit = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },
  getInitialState() {
    window.parent.postMessage({'showPidSelect': false}, '*');
    this.merchantId = getMerchantId();
    const {dishIdList} = this.props.params;
    return {
      isCreate: !dishIdList,
      hasMenus: false,
      getValue: 0,
      formsData: [],
      formInitialData: [],
      dishTagSet: [],
      loading: !!dishIdList,
      saveLoading: false,
      showPicModal: !dishIdList,
    };
  },
  componentDidMount() {
    const {dishIdList} = this.props.params;
    if (dishIdList) {
      this.fetch(dishIdList);
    }
    this.fetchMenus();
    keepSession();
  },
  onSave() {
    const {formInitialData, formsData} = this.state;
    if (formsData.length === formInitialData.length) {
      this.save(formsData);
    }
  },
  onSubmit() {
    this.setState({
      getValue: Math.random() + 1,
      formsData: [],
    });
  },
  getValueCallBack(formData) {
    const {formsData} = this.state;
    formsData.push(formData);
    this.setState({
      formsData,
    });
    this.onSave();
  },
  getDishTagSet() {
    const params = {};
    if (this.merchantId) params.op_merchant_id = this.merchantId;
    return ajax({
      url: '/shop/kbdish/queryAllTags.json',
      method: 'get',
      data: params,
      type: 'json',
      error: (_, msg) => {
        message.error(msg);
      },
    });
  },
  fetchMenus() {
    const params = {
      pageNo: 1,
      pageSize: 1,
    };
    if (this.merchantId) params.op_merchant_id = this.merchantId;
    ajax({
      url: '/shop/kbmenu/pageQuery.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'success') {
          this.setState({
            hasMenus: !!result.totalSize,
          });
        }
      },
    });
  },
  goTo(hash) {
    window.parent.postMessage({'showPidSelect': true}, '*');
    if (hash) {
      window.location.hash = hash;
    } else {
      window.history.back();
    }
  },
  goBack(hash) {
    kbScrollToTop();
    Modal.confirm({
      title: '是否放弃提交',
      content: '',
      okText: '是',
      cancelText: '否',
      onOk: () => {
        if (hash) {
          window.location.hash = hash;
        } else {
          window.history.back();
        }
      },
    });
  },
  fetch(dishIdList) {
    const params = {
      dishIds: dishIdList,
    };
    if (this.merchantId) params.op_merchant_id = this.merchantId;
    ajax({
      url: '/shop/kbdish/queryByIds.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          this.setState({
            loading: false,
            formInitialData: result.data,
            dishTagSet: result.dishTagSet,
          });
        } else {
          message.error(result.resultMsg);
        }
      },
      error: (_, msg) => {
        message.error(msg);
      },
    });
  },
  save(formsData) {
    const {isCreate, hasMenus, formInitialData} = this.state;
    const isSingle = formInitialData && formInitialData.length === 1;
    this.setState({
      saveLoading: true,
    });
    const singleForm = formsData[0];
    const params = isSingle ? {
      goodsType: 'DISH',
      list: JSON.stringify([{desc: singleForm.desc, name: singleForm.dishName, fileId: singleForm.fileId, price: singleForm.price, tagString: JSON.stringify(singleForm.dishTagList)}]),
      shopIds: singleForm.shopIds.join(','),
    } : {
      dishForms: JSON.stringify(formsData),
    };
    if (this.merchantId) params.op_merchant_id = this.merchantId;

    ajax({
      url: isSingle ? `/shop/${isCreate ? 'create' : 'modify'}ShopGoodsPics.json` : `/shop/kbdish/batch${isCreate ? 'Create' : 'Modify'}.json`,
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          if (isCreate) {
            if (hasMenus) {
              Modal.success({
                title: '提交成功',
                onOk: () => {
                  this.goTo('/decoration/' + getCategoryId() + '/menu/dish');
                },
              });
            } else {
              Modal.success({
                title: '提交成功',
                iconType: 'check-circle color-green',
                onOk: () => {
                  this.goTo('/decoration/' + getCategoryId() + '/menu/dish');
                },
              });
            }
          } else {
            message.success('提交成功');
            setTimeout(() => this.goTo('/decoration/' + getCategoryId() + '/menu/dish'), 500);
          }
        } else {
          Modal.error({
            title: '提交失败',
            content: result.resultMsg,
          });
        }
        this.setState({
          saveLoading: false,
        });
        kbScrollToTop();
      },
      error: (_, msg) => {
        message.error(msg);
        this.setState({
          saveLoading: false,
        });
        kbScrollToTop();
      },
    });
  },
  removeItem(id) {
    const {formInitialData} = this.state;
    if (formInitialData.length === 1) return;
    this.setState({
      formInitialData: formInitialData.filter(v => v.dishId !== id),
    });
  },
  closePicModal() {
    this.setState({
      showPicModal: false,
    });
  },
  closePicModalAndGoBack() {
    this.closePicModal();
    setTimeout(() => window.history.back(), 500);
  },
  addFiles(fileList) {
    this.closePicModal();
    const formInitialData = fileList.map((v, i) => {
      return {
        dishId: i + '',
        pictureName: v.name,
        dishName: v.name.indexOf('.') > 0 ? v.name.split('.')[0] : v.name,
        pictureURL: v.url,
        fileId: v.sourceId,
      };
    });
    this.setState({
      loading: true,
    });
    this.getDishTagSet().then((result) => {
      if (result.status === 'succeed') {
        this.setState({
          loading: false,
          formInitialData,
          dishTagSet: result.data,
        });
      } else {
        message.error(result.resultMsg);
      }
    });
  },
  render() {
    const {isCreate, getValue, formInitialData, saveLoading, showPicModal, loading, dishTagSet} = this.state;
    let forms = null;
    if (formInitialData && formInitialData[1]) {
      forms = formInitialData.map((v) => {
        return (<div key={v.dishId} className={'create-form-item' + (isCreate && formInitialData.length > 1 ? ' form-hover' : '')}>
          <a className="remove" onClick={() => this.removeItem(v.dishId)}>删除</a>
          <DishEditForm isCreate={isCreate} getValue={getValue} getValueCallBack={this.getValueCallBack} dishId={v.dishId} data={v} dishTagSet={dishTagSet} />
        </div>);
      });
    } else if (formInitialData && formInitialData[0]) { // 门店关联创建暂时只支持单个，不支持批量创建
      const v = formInitialData[0];
      forms = (<div key={v.dishId} className={'create-form-item' + (isCreate && formInitialData.length > 1 ? ' form-hover' : '')}>
        <a className="remove" onClick={() => this.removeItem(v.dishId)}>删除</a>
        <DishSingleEditForm isCreate={isCreate} getValue={getValue} getValueCallBack={this.getValueCallBack} dishId={v.dishId} data={v} dishTagSet={dishTagSet} />
      </div>);
    }
    const formItemLayout = {
      labelCol: {span: '6'},
      wrapperCol: {span: '14'},
    };
    return (<div className="dish-create">
      <div className="app-detail-header">
        <Breadcrumb separator=">">
          <Breadcrumb.Item onClick={() => this.goBack('#/decoration/' + getCategoryId() + '/menu')} href={null}>菜品管理</Breadcrumb.Item>
          <Breadcrumb.Item onClick={() => this.goBack('#/decoration/' + getCategoryId() + '/menu/dish')} href={null}>菜品管理</Breadcrumb.Item>
          <Breadcrumb.Item>{isCreate ? '添加菜品' : '批量修改'}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="app-detail-content-padding create-form-wrap">
        <div className="dish-edit-modal">
          {loading ? <Spin /> : forms}
        </div>
        {!loading && forms ? <div className="create-form-button">
          <FormItem {...formItemLayout} label=" " className="kb-without-colon">
            <Button type="primary" loading={saveLoading} onClick={this.onSubmit}>提交</Button>
            <Button style={{marginLeft: '10px'}} onClick={() => this.goBack()}>取消</Button>
          </FormItem>
        </div> : null}
      </div>
      {showPicModal ? <PhotoPickerModal
        listParams={{op_merchant_id: this.merchantId, materialType: 'img'}}
        uploadParams={{op_merchant_id: this.merchantId}}
        visible={showPicModal}
        modalTitle="添加菜品"
        noticeInfo="图片大小不低于200kb，不超过2.9M。格式为bmp、png、jpeg、jpg、gif"
        listUrl="/material/materialComponent.json"
        uploadUrl = "/material/picUpload.json"
        max={20}
        limitText="一次最多可添加20个菜品"
        onOk={this.addFiles}
        onCancel={this.closePicModalAndGoBack} /> : null}
    </div>);
  },
});

export default DishEdit;
