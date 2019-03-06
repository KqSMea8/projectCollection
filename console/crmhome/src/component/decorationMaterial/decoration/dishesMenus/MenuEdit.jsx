import React, {PropTypes} from 'react';
import {message, Spin, Breadcrumb, Button, Form, Input, Icon, Modal} from 'antd';
import DishItem from '../../common/DishItem';
import ShopItem from '../../common/ShopItem';
import ajax from '../../../../common/ajax';
import {getMerchantId, getCategoryId} from '../../common/utils';

const FormItem = Form.Item;

const MenuEdit = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },
  getInitialState() {
    window.parent.postMessage({'showPidSelect': false}, '*');
    this.merchantId = getMerchantId();
    const {menuId} = this.props.params;
    return {
      isCreate: !menuId,
      helpModalVisible: false,
      loading: true,
      data: {},
      saveLoading: false,
    };
  },
  componentDidMount() {
    const {menuId} = this.props.params;
    const {isCreate} = this.state;
    if (!isCreate) {
      const params = {
        menuId,
      };
      if (this.merchantId) params.op_merchant_id = this.merchantId;
      ajax({
        url: '/shop/kbmenu/detailQuery.json',
        method: 'get',
        data: params,
        type: 'json',
        success: (result) => {
          if (result.status === 'success') {
            this.props.form.setFieldsValue({
              'dishes': result.menuDetailVO.menuDishRelation,
              'shopIds': result.menuDetailVO.menuShopIds,
            });
            this.setState({
              data: result.menuDetailVO,
              loading: false,
            });
          } else {
            message.error(result.resultMsg);
          }
        },
        error: (_, msg) => {
          message.error(msg);
        },
      });
    }
  },
  onSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      this.save(values);
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
  save(values) {
    const {menuId} = this.props.params;
    const {isCreate} = this.state;
    const {title, dishes, shopIds} = values;
    this.setState({
      saveLoading: true,
    });
    const params = {
      title,
      dishes: dishes.map(v => v.dishId).join(','),
      shopIds: shopIds.join(','),
    };
    if (this.merchantId) params.op_merchant_id = this.merchantId;
    if (!isCreate) params.menuId = menuId;
    ajax({
      url: `/shop/kbmenu/${isCreate ? 'create' : 'edit'}.json`,
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'success') {
          message.success('提交成功');
          this.goTo('/decoration/' + getCategoryId() + '/menu/menu');
        } else {
          message.error(result.resultMsg);
        }
        this.setState({
          saveLoading: false,
        });
      },
      error: (_, msg) => {
        message.error(msg);
        this.setState({
          saveLoading: false,
        });
      },
    });
  },
  openHelpModal() {
    this.setState({
      helpModalVisible: true,
    });
  },
  closeHelpModal() {
    this.setState({
      helpModalVisible: false,
    });
  },
  goBack(hash) {
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
  render() {
    const {menuId} = this.props.params;
    const {getFieldProps} = this.props.form;
    const {helpModalVisible, isCreate, loading, saveLoading} = this.state;
    const formItemLayout = {
      labelCol: {span: '6'},
      wrapperCol: {span: '14'},
    };
    const data = isCreate ? {} : this.state.data || {};
    const titleProps = getFieldProps('title', {
      initialValue: data.title,
      rules: [
        { required: true, message: '请填写菜单名称' },
        (rule, value, callback) => {
          if (value && value.length > 12) {
            callback(new Error('已超过' + (value.length - 12) + '个字'));
          }
          callback();
        },
      ],
    });
    const dishExtra = (<p>
      配置的菜品将同时展示在客户端的"口碑推荐"和"商家相册"里&nbsp;&nbsp;
      <a onClick={this.openHelpModal}>
        <Icon onClick={this.openHelpModal} style={{color: '#2db7f5'}} type="info-circle" />
      </a>
    </p>);
    return (<div className="menu-edit">
      <div className="app-detail-header">
        <Breadcrumb separator=">">
          <Breadcrumb.Item onClick={() => {this.goBack('#/decoration/' + getCategoryId() + '/menu');}} href={null}>菜品管理</Breadcrumb.Item>
          <Breadcrumb.Item onClick={() => {this.goBack('#/decoration/' + getCategoryId() + '/menu/menu');}} href={null}>菜单管理</Breadcrumb.Item>
          <Breadcrumb.Item>{isCreate ? '新建' : '修改'}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="app-detail-content-padding">
        {!isCreate && loading ? <Spin /> : <div>
          <div className="sample-image-wrap">
            <img width="288" height="370" src="https://zos.alipayobjects.com/rmsportal/tUmFByFXirzhMDL.png" />
            <i className="sample-image-tip" src="https://zos.alipayobjects.com/rmsportal/VuxZdmpbPEFRxTs.png"></i>
            <p>口碑展示界面<br />示例图</p>
          </div>
          <div className="edit-form-wrap">
            <Form form={this.props.form} horizontal>
              <FormItem {...formItemLayout} label="菜单名称：">
                <Input {...titleProps} placeholder="不超过12个字" />
              </FormItem>
              <FormItem {...formItemLayout} label="配置菜品：" required extra={dishExtra}>
                <DishItem {...getFieldProps('dishes', {
                  initialValue: data.menuDishRelation,
                  rules: [{
                    man: 1,
                    required: true,
                    type: 'array',
                    message: '请选择菜品',
                  }],
                })} />
              </FormItem>
              <FormItem {...formItemLayout} label="适用门店：" required>
                <ShopItem {...getFieldProps('shopIds', {
                  rules: [{
                    min: 1,
                    required: true,
                    type: 'array',
                    message: '请选择适用门店',
                  }],
                })} menuId={menuId ? menuId : null} url="/shop/kbmenu/shopQuery.json" subUrl="/shop/kbmenu/getShopsByCity.json" />
              </FormItem>
              <FormItem {...formItemLayout} label=" " className="kb-without-colon">
                <Button loading={saveLoading} type="primary" onClick={this.onSubmit}>提交</Button>
                <Button style={{marginLeft: '10px'}} onClick={() => this.goBack()}>取消</Button>
              </FormItem>
            </Form>
          </div>
        </div>}
      </div>
      <Modal width="878" title="帮助" visible={helpModalVisible} onCancel={this.closeHelpModal} footer="">
        <img width="846" height="394" src="https://zos.alipayobjects.com/rmsportal/KKWJobyiWdRibfv.jpg" />
      </Modal>
    </div>);
  },
});

export default Form.create()(MenuEdit);
