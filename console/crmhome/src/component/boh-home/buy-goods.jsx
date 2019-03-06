import React from 'react';
import {Button, Row, Col} from 'antd';

import './buy-goods.less';

export default function BuyGoods(props) {
  const {purchases = []} = props;

  return purchases.length > 0 ? (
    <div className="mod-content">
      <h3 className="mod-title"><span className="mod-title-box">购买链接</span></h3>
      {
        purchases.map((purchase, index) => {
          const {img, name, desc, link} = purchase;
          return (
            <div key={index} className="buy-good">
              <Row gutter={16} type="flex" align="middle">
                <Col span={4}>
                  <div className="good-img">
                    <img src={img} width={200} />
                  </div>
                </Col>
                <Col span={16}>
                  <div className="good-info">
                    <h4 className="good-name">{name}</h4>
                    <p className="good-intro">{desc}</p>
                  </div>
                </Col>
                <Col span={4} className="good-action">
                  <Button href={link} size="large">立即购买</Button>
                </Col>
              </Row>
            </div>
          );
        })
      }
    </div>
  ) : <div></div>;
}
