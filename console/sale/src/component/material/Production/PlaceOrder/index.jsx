import React, { Component } from 'react';
import PageLayout from 'Library/PageLayout';
import AssignSupplierModal from './AssignSupplierModal';
import SelectTemplateModal from '../../common/SelectTemplateModal';
import TemplateEditTable from './TemplateEditTable';
import { Alert, Row, Col, message, Button } from 'antd';
import getLoginUser from '@alipay/kb-framework/framework/getLoginUser';
import { SubmitStatus } from 'Utility/ajax';
import {
  getRequestId,
  getStuffAttributeList,
  getSupplierList,
  getStuffUnitPrice,
  submitProduceOrder
} from '../../common/api';
import './style.less';

const calcTotalPrice = (unitPrice, quantity) => {
  if (!unitPrice || !quantity) {
    return 0;
  }
  return unitPrice.cent * quantity / unitPrice.centFactor;
};

export default class PlaceOrder extends Component {
  constructor() {
    super();
  }

  state = {
    requestId: '',
    stuffAttrList: [],  // 物料材质列表
    supplierList: [],   // 供应商列表
    isDataReady: false, // 基础数据加载完毕
    pickedSupplier: null, // 已选供应商
    pickingSupplier: false, // 正在选择供应商
    pickedTemplate: null, // 已选模板
    pickingTemplate: false, // 正在选择模板
    checkedMaterial: null,  // 已选材质
    unitPrice: null,  // 已选材质价格[对象]
    queryPriceStatus: SubmitStatus.INIT,
    applyQuantity: 0,  // 申请数量
    totalPrice: 0.0,    // 总价
    submitStatus: SubmitStatus.INIT
  };

  componentDidMount() {
    // 获取必要的数据
    Promise.all([getStuffAttributeList({bizSource: 'KOUBEI_ASSET'}), getSupplierList(), getRequestId()])
      .then(([res1, res2, res3]) => {
        this.setState({
          stuffAttrList: res1.data,
          supplierList: res2.data,
          requestId: res3.data.requestId,
          isDataReady: true
        });
      })
      .catch(() => { message.error('数据初始化失败，请刷新重试'); });
  }

  submitOrder = () => {
    const { requestId, pickedTemplate, pickedSupplier, checkedMaterial, applyQuantity, unitPrice, totalPrice, queryPriceStatus } = this.state;
    // validate
    const errorMsgMap = {
      pickedTemplate: '请选择模板',
      checkedMaterial: '请选择材质',
      unitPrice: '该物料材质暂不支持申请',
      applyQuantity: '请填写数量',
      pickedSupplier: '请选择供应商'
    };
    if (queryPriceStatus === SubmitStatus.FAILED) {
      message.error('物料材料价格查询失败');
      return;
    }
    for (const k in errorMsgMap) {
      if (!this.state[k]) {
        message.error(errorMsgMap[k]);
        return;
      }
    }
    this.setState({submitStatus: SubmitStatus.SUBMITTING});
    submitProduceOrder({
      requestId,
      templateId: pickedTemplate.templateId,
      supplierId: pickedSupplier.id,
      materialCode: checkedMaterial.code,
      materialName: checkedMaterial.name,
      purchaseQuantity: applyQuantity,
      budgetUnitPrice: unitPrice.amount,
      budgetTotalPrice: totalPrice
    })
      .then(() => {
        this.setState({
          submitStatus: SubmitStatus.DONE,
          requestId: ''
        });
        location.hash = '#/material/production/order-manage';
      })
      .catch(() => {
        this.setState({submitStatus: SubmitStatus.FAILED});
      });
  };

  handleClickPickTemplate = () => {
    this.setState({
      pickingTemplate: true
    });
  };

  handleClickAssignSupplier = () => {
    this.setState({pickingSupplier: true});
  };

  handlePickTemplateFromModal = template => {
    this.setState({
      pickedTemplate: template,
      checkedMaterial: null,    // reset
      unitPrice: 0,  // reset
      totalPrice: 0             // reset
    });
    this.closeSelectTemplateModal();
  };

  handlePickSupplierFromModal = supplier => {
    this.setState({pickedSupplier: supplier});
    this.closeAssignSupplierModal();
  };

  handleMaterialChange = (material) => {
    const { pickedTemplate, applyQuantity } = this.state;
    this.setState({
      checkedMaterial: material,
      queryPriceStatus: SubmitStatus.SUBMITTING,
      unitPrice: null
    });
    getStuffUnitPrice({
      stuffAttrId: pickedTemplate.stuffAttrId,
      sizeCode: pickedTemplate.size,
      materialCode: material.code
    })
      .then( res => {
        const unitPrice = res.data ? res.data.budgetPrice : null;
        this.setState({
          unitPrice: unitPrice,
          queryPriceStatus: SubmitStatus.DONE,
          totalPrice: calcTotalPrice(unitPrice, applyQuantity)
        });
      })
      .catch( () => {this.setState({queryPriceStatus: SubmitStatus.FAILED});});
  };

  handleApplyQuantityChange = (e) => {
    const MIN = 0;
    const MAX = 100000;
    const applyQuantity = e.target.value;
    const notRound = num => {
      return isNaN(num) || num % 1 > 0;
    };
    // validate
    if (notRound(applyQuantity) || applyQuantity < MIN || applyQuantity > MAX) {
      message.error(`请输入${MIN} ~ ${MAX}之间的整数。`);
      return;
    }
    const { unitPrice } = this.state;
    this.setState({
      applyQuantity,
      totalPrice: calcTotalPrice(unitPrice, applyQuantity)
    });
  };

  closeSelectTemplateModal = () => {
    this.setState({pickingTemplate: false});
  };

  closeAssignSupplierModal = () => {
    this.setState({pickingSupplier: false});
  };

  render() {
    const user = getLoginUser();
    const { pickedSupplier, pickingSupplier, pickingTemplate, pickedTemplate, isDataReady, stuffAttrList,
      supplierList, applyQuantity, checkedMaterial, unitPrice, totalPrice, submitStatus, queryPriceStatus
    } = this.state;
    const Footer = () => (
      <Button
        loading={submitStatus === SubmitStatus.SUBMITTING}
        disabled={submitStatus === SubmitStatus.DONE}
        type="primary"
        onClick={this.submitOrder}>确定采购
      </Button>
    );
    const breadcrumb = [
      {title: '预采购', link: '#/material/production/order-manage'},
      {title: '新增采购单'}
    ];
    return (
      <PageLayout
        breadcrumb={breadcrumb}
        title="新增采购单"
        id="material-production-placeorder"
        footer={<Footer/>} spinning={!isDataReady}
      >
        <Alert message="城市集采，每次仅能选择一种物料模板" type="warning" showIcon/>
        <div className="label-detail">
          <Row>
            <Col span={3}><span className="label ant-form-item-required">采购明细：</span></Col>
            <Col span={21}>
              {
                pickedTemplate
                  ?
                  <TemplateEditTable
                    stuffAttrList={stuffAttrList}
                    data={pickedTemplate}
                    checkedMaterial={checkedMaterial}
                    quantity={applyQuantity}
                    price={unitPrice}
                    totalPrice={totalPrice}
                    queryPriceStatus={queryPriceStatus}
                    onMaterialChange={this.handleMaterialChange}
                    onApplyQuantityChange={this.handleApplyQuantityChange}
                    onClickPickTemplate={this.handleClickPickTemplate}
                  />
                  :
                  <Button type="primary" onClick={this.handleClickPickTemplate}>选择模板</Button>
              }
            </Col>
          </Row>
          <Row>
            <Col span={3}><span className="label ant-form-item-required">分配供应商：</span></Col>
            <Col span={21}>
              {
                pickedSupplier
                  ?
                  <div><span>{pickedSupplier.supplierName}</span> <a onClick={this.handleClickAssignSupplier}>修改</a></div>
                  :
                  <Button type="primary" onClick={this.handleClickAssignSupplier}>分配供应商</Button>
              }
            </Col>
          </Row>
          <Row>
            <Col span={3}><span className="label ant-form-item-required">物料采购人：</span></Col>
            <Col span={21}>{user.nickName || user.realName || user.operatorName}</Col>
          </Row>
        </div>
        <AssignSupplierModal
          visible={pickingSupplier}
          list={supplierList}
          picked={pickedSupplier ? pickedSupplier.id : ''}
          close={this.closeAssignSupplierModal}
          onChange={this.handlePickSupplierFromModal}
        />
        <SelectTemplateModal
          visible={pickingTemplate}
          close={this.closeSelectTemplateModal}
          onChange={this.handlePickTemplateFromModal}
          selected={pickedTemplate ? pickedTemplate.templateId : ''}
        />
      </PageLayout>
    );
  }
}
