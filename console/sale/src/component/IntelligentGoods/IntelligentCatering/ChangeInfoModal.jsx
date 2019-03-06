import React from 'react';
import { Modal, Button, Icon, Table } from 'antd';
import STATUS_ENUM from './DisplayStatusMap';
import { getCateringPriceChangeStatus } from '../common/utils';

class CateringChangeInfoModal extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '新增门店名称',
        width: 200,
        dataIndex: 'shopName'
      },
      {
        title: '城市',
        width: 200,
        dataIndex: 'city'
      }
    ];
  }
  handleOk = () => {
    this.props.onOk();
  }
  handleCancel = () => {
    this.props.onCancel();
  }
  tableChange = (pagination) => {
    this.props.tableChange(pagination);
  }
  render() { // eslint-disable-line
    const { visible, submitChangeInfoing, pagination, changeInfo, changeShopListLoading, record } = this.props;
    const { priceChangeInfo, shopNumBefore, shopNumAfter, actionType, changeShopList } = changeInfo;
    const { type, changePriceBefore, changePriceAfter } = priceChangeInfo;
    let priceChange = null;
    let thresholdChange = null;
    let capAmountChange = null;
    const priceChangeStatus = getCateringPriceChangeStatus(type, changePriceBefore, changePriceAfter);
    if (priceChangeStatus.priceChanged) {
      if (type === 'ITEM') {
        // 商品
        priceChange = (<div className="text">
          优惠异动：<span className="color-orange">{`原优惠价${changePriceBefore.price}元，修改为优惠价${changePriceAfter.price}元。`}</span>
        </div>);
      } else if (type === 'MANJIAN') {
        // 全场每满减
        priceChange = (<div className="text">
          优惠异动：<span className="color-orange">{`原每消费${changePriceBefore.threshold}元立减${changePriceBefore.discountAmount}元，修改为每消费${changePriceAfter.threshold}元立减${changePriceAfter.discountAmount}元。`}</span>
        </div>);
      } else if (type === 'VOUCHER') {
        // 全场代金券
        priceChange = (<div className="text">
          优惠异动：<span className="color-orange">{`原券面额${changePriceBefore.discountAmount}元，修改为券面额${changePriceAfter.discountAmount}元。`}</span>
        </div>);
      } else if (type === 'RATE') {
        // 全场折扣
        priceChange = (<div className="text">
          优惠异动：<span className="color-orange">{`原折扣力度${changePriceBefore.rate}折，修改为折扣力度${changePriceAfter.rate}折。`}</span>
        </div>);
      }
    }
    if (priceChangeStatus.thresholdChanged) {
      thresholdChange = (<div className="text">
        最低消费异动: <span className="color-orange">{`原最低消费${changePriceBefore.threshold === '不限制' ? '不限制' : (changePriceBefore.threshold + '元')}，修改为${changePriceAfter.threshold === '不限制' ? '不限制' : (changePriceAfter.threshold + '元')}。`}</span>
      </div>);
    }
    if (priceChangeStatus.capAmountChanged) {
      capAmountChange = (<div className="text">
        最高优惠异动: <span className="color-orange">{`原最高优惠${changePriceBefore.capAmount === '不限制' ? '不限制' : (changePriceBefore.capAmount + '元')}，修改为${changePriceAfter.capAmount === '不限制' ? '不限制' : (changePriceAfter.capAmount + '元')}。`}</span>
      </div>);
    }
    let title = null;
    if (actionType === 'handle') {
      title = <div className="title"><Icon className="icon" type="exclamation-circle" /> {type === 'ITEM' ? <p>请仔细核对异动修改内容，并提交商户确认。</p> : <div><p>请仔细核对异动修改内容，并提交商户确认。</p><p>商户确认后将生成一个新活动，商户可选择对老活动进行下架.</p></div>}</div>;
    } else {
      title = <div className="title"><Icon className="icon" type="exclamation-circle" />该商品/活动{STATUS_ENUM[record.displayStatus]}，暂不支持修改。</div>;
    }
    return (<Modal
          className="catering-changeinfo-modal"
          visible={visible}
          title={title}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={actionType === 'handle'
            ?
            [
              <Button key="submit" type="primary" size="large" onClick={this.handleOk} loading={submitChangeInfoing}>
                确认修改
              </Button>,
              <Button key="back" size="large" onClick={this.handleCancel} disabled={submitChangeInfoing}>取消</Button>
            ]
            :
            null
          }
        >
        <div className="content">
          { priceChange }
          { thresholdChange }
          { capAmountChange }
          { shopNumBefore !== undefined && shopNumAfter !== undefined &&
            shopNumBefore !== shopNumAfter
            ?
            <div className="text">门店异动：<span className="color-orange">{`原${shopNumBefore}家适用门店，修改为${shopNumAfter}家适用门店。`}</span></div>
            :
            null
          }
          { changeShopList && changeShopList.length ? <Table
            columns={this.columns}
            dataSource={changeShopList}
            scroll={{ y: 240 }}
            bordered
            pagination={pagination}
            onChange={this.tableChange}
            loading={changeShopListLoading}
           /> : null }
        </div>
        </Modal>);
  }
}

export default CateringChangeInfoModal;
