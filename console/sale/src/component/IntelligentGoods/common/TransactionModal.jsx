import React from 'react';
import ajax from '@alipay/kb-framework/framework/ajax';
import { Modal, Button, Icon } from 'antd';
import { getGenericChangeStatus } from '../common/utils';

const disabledLabelStyle = {
  display: 'inline-block', borderRadius: '4px', padding: '3px 4px',
  color: '#fff', backgroundColor: 'orange', lineHeight: '12px',
  marginLeft: '5px',
};

class TransactionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionShops: [],
    };
  }
  componentWillMount() {
    const { itemId, changeBrief = {} } = this.props.data;
    const { shopLastChangeDate } = changeBrief;
    this.requestTransactionShops({
      itemId,
      shopLastChangeDate,
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.data.itemId !== this.props.data.itemId) {
      const { itemId, changeBrief = {} } = this.props.data;
      this.requestTransactionShops({
        itemId,
        shopLastChangeDate: changeBrief.shopLastChangeDate
      });
    }
  }
  requestTransactionShops(params) {
    if (!params.shopLastChangeDate) {
      this.setState({
        transactionShops: [],
      });
    } else {
      ajax({
        url: window.APP.kbservindustryprodUrl + '/item/leads/change/queryShopsByItemId.json',
        // url: 'http://pickpost.alipay.net/mock/kb-sale/item/leads/change/queryShopsByItemId.json',
        method: 'post',
        data: params,
        type: 'json',
        success: (result) => {
          if (result && result.status === 'succeed') {
            this.setState({
              transactionShops: result.data || [],
            });
          }
        }
      }).catch(() => {
        this.setState({
          transactionShops: [],
        });
      });
    }
  }
  handleOk = () => {
    this.props.onOk();
  }
  handleCancel = () => {
    this.props.onCancel();
  }
  render() {
    const { visible, data } = this.props;
    const { transactionShops } = this.state;
    const { changeBrief = {} } = data;
    const changeStatus = getGenericChangeStatus(changeBrief);
    return (<Modal
          className="transaction-modal"
          visible={visible}
          title={<span className="title" style={{visibility: data.viewStatus === 'INIT' ? 'visible' : 'hidden'}}><Icon className="icon" type="exclamation-circle" /> 请仔细核对异动修改内容，并提交商户确认。</span>}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={data.viewStatus === 'INIT' ? [
            <Button key="submit" type="primary" size="large" onClick={this.handleOk} loading={this.props.loading}>
              确认修改
            </Button>,
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>
          ] : null}
        >
        <div className="content">
          {changeStatus.priceChanged ? <div className="text">优惠异动：<span className="color-orange">{`原优惠价${data.price}元，修改后优惠价${changeBrief.priceCurrent}元。`}</span></div> : null}
          {changeStatus.shopChanged ? <div className="text">门店异动：<span className="color-orange">{`原${data.saleShopCount}家适用门店，修改后${data.saleShopCount + parseInt(changeBrief.shopRecentIncreaseCount, 10)}家适用门店。`}</span></div> : null}
          {transactionShops.length ?
          <div>
          <div className="shop-list-header">本次新增门店（普通无证门店暂不支持异动更新）</div>
          <div className="check-shop-list">
          {transactionShops.map((item, key) => {
            return (
                <dl key={`city${key}`}>
                  <dt>{item.cityName}</dt>
                  {
                    item.shops.map((shop, i) => {
                      let noLicense = null;
                      if (shop.ext) {
                        if (shop.ext.shopLicenseUnpublished === '1') {
                          noLicense = <span style={disabledLabelStyle}>{shop.ext.shopCanNotPubItem === '1' ? '无证' : '无证(90天试用)'}</span>;
                        }
                      }
                      return (
                        <dd key={`shop${i}`}>
                          {shop.shopName}
                          {noLicense}
                        </dd>
                      );
                    })
                  }
                </dl>
              );
          })
          }
          </div>
          </div>
          :
          null
          }
        </div>
        </Modal>);
  }
}

export default TransactionModal;
