import React, {PropTypes} from 'react';
import {Breadcrumb, Form, Button, Modal, Spin, message} from 'antd';
import EnvironmentEditForm from './EnvironmentEditForm';
import ajax from '../../../../common/ajax';
import PhotoPickerModal from '../../common/PhotoPickerModel';
import {getMerchantId, kbScrollToTop, getCategoryId} from '../../common/utils';
import ShopItem from '../../common/ShopItem';

const FormItem = Form.Item;

const EnvironmentEdit = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },
  getInitialState() {
    this.merchantId = getMerchantId();
    window.parent.postMessage({'showPidSelect': false}, '*');
    const {environmentIdList} = this.props.params;
    return {
      isCreate: !environmentIdList,
      getValue: 0,
      formsData: [],
      formInitialData: [],
      loading: !!environmentIdList,
      saveLoading: false,
      showPicModal: !environmentIdList,
    };
  },
  componentDidMount() {
    const {environmentIdList} = this.props.params;
    if (environmentIdList) {
      this.fetch(environmentIdList);
    }
  },
  onSave() {
    const {isCreate, formInitialData, formsData} = this.state;
    if (formsData.length === formInitialData.length) {
      if (isCreate) {
        this.props.form.validateFieldsAndScroll((errors, values) => {
          if (!!errors) return;
          this.save(formsData, values.shopIds);
        });
      } else {
        const shopIds = formsData[0].shopIds;
        formsData.forEach(v => delete v.shopIds);
        this.save(formsData, shopIds);
      }
    }
  },
  onSubmit() {
    const {isCreate} = this.state;
    this.setState({
      getValue: Math.random() + 1,
      formsData: [],
    });
    if (isCreate) this.props.form.validateFieldsAndScroll();
  },
  getValueCallBack(obj) {
    const {formsData} = this.state;
    formsData.push(obj);
    this.setState({
      formsData,
    });
    this.onSave();
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
        this.goTo(hash);
      },
    });
  },
  fetch(environmentIdList) {
    const params = {
      id: environmentIdList,
    };
    if (this.merchantId) params.op_merchant_id = this.merchantId;
    ajax({
      url: '/shop/kbshopenv/detailQuery.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          this.setState({
            loading: false,
            formInitialData: [result.data],
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
  save(formsData, shopIds) {
    this.setState({
      saveLoading: true,
    });
    const params = {
      list: JSON.stringify(formsData),
      shopIds: shopIds.join(','),
      op_merchant_id: this.merchantId,
    };
    if (this.merchantId) params.merchantId = this.merchantId;
    ajax({
      url: '/shop/kbshopenv/save.json',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          if (result.opType === 'ASYNC') {
            Modal.success({
              title: '提交成功',
              content: '本次提交的环境图及门店数量较多，需要一段时间处理，请耐心等待几分钟后刷新页面查看。',
              onOk: () => {
                this.goTo('/decoration/' + getCategoryId() + '/environment');
              },
            });
          } else {
            message.success('提交成功');
            this.goTo('/decoration/' + getCategoryId() + '/environment');
          }
        } else {
          message.error('提交失败');
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
      formInitialData: formInitialData.filter(v => v.id !== id),
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
        id: i + '',
        name: v.name.indexOf('.') > 0 ? v.name.split('.')[0] : v.name,
        url: v.url,
        fileId: v.sourceId,
      };
    });
    this.setState({
      formInitialData,
    });
  },
  render() {
    const {getFieldProps} = this.props.form;
    const {isCreate, getValue, formInitialData, saveLoading, showPicModal, loading} = this.state;
    const forms = formInitialData ? formInitialData.map((v) => {
      return (<div key={v.id} className={'create-form-item' + (isCreate && formInitialData.length > 1 ? ' form-hover' : '')}>
        <a className="remove" onClick={() => this.removeItem(v.id)}>删除</a>
        <EnvironmentEditForm isCreate={isCreate} getValue={getValue} getValueCallBack={this.getValueCallBack} id={v.id} data={v} />
      </div>);
    }) : null;
    const formItemLayout = {
      labelCol: {span: '5'},
      wrapperCol: {span: '15'},
    };
    return (<div className="dish-create environment-create">
      <div className="app-detail-header">
        <Breadcrumb separator=">">
          <Breadcrumb.Item onClick={() => this.goBack('#/decoration/' + getCategoryId() + '/environment')} href={null}>门店环境</Breadcrumb.Item>
          <Breadcrumb.Item>{isCreate ? '新建' : '修改'}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="app-detail-content-padding create-form-wrap">
        {!loading && forms && forms.length && isCreate ? <div className="shop-select">
          <Form form={this.props.form} horizontal>
            <FormItem {...formItemLayout} label="适用门店：" required>
              <ShopItem {...getFieldProps('shopIds', {
                rules: [{
                  min: 1,
                  required: true,
                  type: 'array',
                  message: '请选择适用门店',
                }],
              })}
              url="/shop/kbshopenv/getShops.json"
              subUrl="/shop/kbshopenv/getShopsByCity.json" />
            </FormItem>
          </Form>
        </div> : null}
        <div className="dish-edit-modal">
          {loading ? <Spin /> : forms}
        </div>
        {!loading && forms && forms.length ? <div className="create-form-button">
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
        modalTitle="添加环境图"
        noticeInfo="环境图可以上传内景照（如包间、大厅、特色附加设施）或外景照（如店外有花园、临湖等特色环境）"
        listUrl="/material/materialComponent.json"
        uploadUrl = "/material/picUpload.json"
        multiple
        max={10}
        limitText="一次最多可添加10个环境图"
        onOk={this.addFiles}
        onCancel={this.closePicModalAndGoBack}/> : null}
    </div>);
  },
});

export default Form.create()(EnvironmentEdit);
