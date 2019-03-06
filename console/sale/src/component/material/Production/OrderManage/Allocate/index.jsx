import React, { Component } from 'react';
import { Button, message } from 'antd';
import PageLayout from 'Library/PageLayout';
import PurchaseInfo from '../common/PurchaseInfo';
import TemplateInfo from '../common/TemplateInfo';
import ApplyItemsTable from './ApplyItemsTable';
import { SubmitStatus } from 'Utility/ajax';
import { getOrderDetail, allocateProduction } from '../../../common/api';

export default class Allocate extends Component {
  constructor() {
    super();
    this.state = {
      order: null,
      items: [],
      submitStatus: SubmitStatus.INIT
    };
  }

  componentDidMount() {
    const orderId = this.props.params.id;
    getOrderDetail(orderId)
      .then(res => {
        this.setState({
          order: res.data
        });
      })
      .catch(() => {});
  }

  handleSelectedOk = (items) => this.setState({items});

  handleSubmit = () => {
    const { order, items } = this.state;
    // validate
    if (items.length === 0) {
      message.warn('请先勾选申请单明细进行分配');
      return;
    }
    this.setState({submitStatus: SubmitStatus.SUBMITTING});
    allocateProduction({
      produceOrderId: order.produceOrderId,
      itemIds: JSON.stringify(items.map(({orderId, itemId}) => ({orderId, itemId})))
    })
      .then(() => {
        this.setState({
          submitStatus: SubmitStatus.DONE
        });
        this.props.history.replace('/material/production/order-manage');
      })
      .catch(() => {
        this.setState({
          submitStatus: SubmitStatus.FAILED
        });
      });
  };

  render() {
    const { order, submitStatus, items } = this.state;
    const Footer = () => (
      <Button
        type="primary"
        onClick={this.handleSubmit}
        loading={submitStatus === SubmitStatus.SUBMITTING}
        disabled={submitStatus === SubmitStatus.DONE}
      >确定</Button>
    );
    const getShowOrder = () => {
      const totalAllocated = items.reduce((total, i) => total + i.applyQuantity, 0);
      return {
        ...order,
        stockQuantity: order.stockQuantity - totalAllocated,
        assignedQuantity: totalAllocated + order.assignedQuantity
      };
    };
    const breadcrumb = [
      {title: '预采购单管理', link: '#/material/production/order-manage'},
      {title: '分配'},
    ];
    return (
      <PageLayout
        breadcrumb={breadcrumb}
        title="分配生产单"
        spinning={!order}
        footer={<Footer/>}>
        {order && <PurchaseInfo data={getShowOrder()}/>}
        {order && <TemplateInfo data={order}/>}
        {order && <ApplyItemsTable order={order} onSelectedOk={this.handleSelectedOk}/>}
      </PageLayout>
    );
  }
}
