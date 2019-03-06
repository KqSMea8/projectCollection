import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Alert, Breadcrumb } from 'antd';
import '../../common/common.less';

const { object } = PropTypes;
export default class ReportSuccess extends PureComponent {
  static propTypes = {
    match: object,
  }

  renderLink = (id) => (
    <div>
      <div style={{ marginTop: 6 }}>等待系统服务商(ISV)回流订单信息后进行匹配</div>
      <div style={{ color: '#bbb', paddingTop: 6 }}>
        <Link to={`/managereport/report-detail/${id}`}>返回销售订单详情</Link>
        <span> | </span>
        <Link to="/managereport">销售报单管理</Link>
      </div>
    </div>
  )

  render() {
    const id = this.props.match.params.id;
    return (
      <div className="integral">
        <div className="kb-detail-main" style={{ padding: '16px 0' }}>
          <div className="app-detail-header">
            <Breadcrumb separator=">">
              <Breadcrumb.Item key="1" href="#/shop/my" style={{ fontSize: '16px', fontWeight: 600 }}><Link to="/managereport">一体机销售报单管理</Link></Breadcrumb.Item>
              <Breadcrumb.Item key="2" style={{ fontSize: '18px', fontWeight: 'normal' }}>
                销售报单结果页
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div style={{ padding: '10px 16px' }}>
          <Alert className="success-icon" message="提交成功, 等待订单匹配"
            description={this.renderLink(id)}
            type="success"
            showIcon />
        </div>
      </div>
    );
  }
}
