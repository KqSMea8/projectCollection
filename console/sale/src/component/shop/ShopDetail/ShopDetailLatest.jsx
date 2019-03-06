import React from 'react';
import {Row, Col, Icon, Tag, Alert} from 'antd';

const ShopDetailLatest = React.createClass({

  render() {
    return (
      <div className="kb-detail-base">
        <Row>
          <Col span="16">
            <Tag color="red">审核中</Tag>
          </Col>
          <Col span="8" style={{textAlign: 'right'}}>
            修改时间：2015-12-12 13:14
          </Col>
        </Row>
        <Row>
          <Alert
            message="驳回原因"
            description="驳回原因显示在这里啊这里啊驳回原因显示在这里啊这里啊驳回原因显示在这里啊这里啊驳回原因显示在这里啊这里啊驳回原因显示在这里啊这里啊"
            type="warning"
            showIcon />
        </Row>
        <Row style={{overflow: 'hidden'}}>
          <Col span="16">
            <div className="kb-logo"><img src="https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png"/></div>
            <div className="kb-info">
              <div className="kb-name">门店名称显示在这里(分店名)</div>
            </div>
          </Col>
        </Row>
        <table className="col6-table">
          <tbody>
            <tr>
              <td className="kb-odd">门店联系方式</td>
              <td>13411993535/0571-2435362</td>
              <td className="kb-odd">品牌</td>
              <td>外婆家</td>
              <td className="kb-odd">默认收款方式</td>
              <td>顾客扫码付款</td>
            </tr>
            <tr>
              <td className="kb-odd">门店地址</td>
              <td>江苏省-常州市-钟楼区 会馆浜路怀南苑</td>
              <td className="kb-odd">来源</td>
              <td>商家自主开店</td>
              <td className="kb-odd">门店ID</td>
              <td>123456789009876543213456</td>
            </tr>
            <tr>
              <td className="kb-odd">商户室内景照片</td>
              <td colSpan="5">
                <img src="https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png"/>
                <img src="https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png"/>
                <img src="https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png"/>
                <img src="https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png"/>
              </td>
            </tr>
            <tr>
              <td className="kb-odd">营业执照</td>
              <td><img src="https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png"/></td>
              <td className="kb-odd">营业执照有效期</td>
              <td>2016-12-12 <span className="red"><Icon type="exclamation-circle" /> 即将过期</span></td>
              <td className="kb-odd">营业执照名称<br/>编号</td>
              <td>浙江省行业开发有限公司<br/>(NO.12345678909876543211234)</td>
            </tr>
            <tr>
              <td className="kb-odd">餐饮服务许可证</td>
              <td><img src="https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png"/></td>
              <td className="kb-odd">餐饮服务许可证<br/>有效期</td>
              <td>长期有效</td>
              <td className="kb-odd"></td>
              <td></td>
            </tr>
            <tr>
              <td className="kb-odd">授权函</td>
              <td><img src="https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png"/></td>
              <td className="kb-odd">其他资质证明</td>
              <td>无</td>
              <td className="kb-odd"></td>
              <td></td>
            </tr>
            <tr>
              <td className="kb-odd">竞对信息</td>
              <td colSpan="5">
                竞对信息显示在这里
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  },

});

export default ShopDetailLatest;
