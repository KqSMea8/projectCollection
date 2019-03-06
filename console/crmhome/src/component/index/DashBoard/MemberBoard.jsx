import React, {PropTypes} from 'react';
import {Button} from 'antd';

const MemberBoard = React.createClass({
  propTypes: {
    items: PropTypes.array,
    goToOrder: PropTypes.func,
    isOrder: PropTypes.bool,
  },
  render() {
    const {items, goToOrder, isOrder} = this.props;
    const dataItems = items.map((v, i) => {
      return (
        <div className="item" key={i}>
          <div className="info">
            <div className="main">{v.mainTitle}</div>
            <div className="sub">{v.subTitle}</div>
          </div>
          <div><a onClick={v.goToOrder}>{v.btnText}</a></div>
        </div>
      );
    });

    let orderTitle = '以下服务由服务商CRM系统提供';
    const {commodities} = this.props;
    if (!isOrder && commodities && commodities.length && commodities.length === 1) {
      const {title, logoUrl} = commodities[0];
      orderTitle = <span>以下服务由<img className="kb-logo-pic" src={logoUrl} />{title}提供</span>;
    }

    if (typeof isOrder !== 'boolean') {
      return <div></div>;
    }

    return (
      <div className="index-dashboard-wrap">
        <div className="index-title">
          {isOrder ? <Button type="ghost" size="large" onClick={goToOrder} style={{marginTop: 4}}>立即进入</Button> : <Button type="primary" size="large" onClick={goToOrder} style={{marginTop: 5, fontSize: 18}}>立即订购第三方服务</Button>}
          <div className="kb-form-sub-title-icon"></div>
          {isOrder ? <span>会员精准营销</span> : <span>订购专属服务，免费享受会员精准营销及场景营销服务</span>}
          <p className="index-sub-title">{orderTitle}</p>
        </div>
        <div className="index-memberboard-container">
          {!isOrder ? <p className="container-title">会员精准营销</p> : null}
          <div className="items-wrap">
            {dataItems}
          </div>
        </div>
      </div>
    );
  },
});

export default MemberBoard;
