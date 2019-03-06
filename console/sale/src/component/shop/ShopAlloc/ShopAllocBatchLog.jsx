import React, {PropTypes}from 'react';
import BatchResultList from '../../../common/BatchResultList';
import * as antd from 'antd';
import { Link } from 'react-router';

const Breadcrumb = antd.Breadcrumb;
const BItem = Breadcrumb.Item;

const ShopAllocBatchLog = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  render() {
    return (
      <div className="kb-tabs-main" style={{ position: 'relative' }}>
        <div style={{ borderBottom: 0, padding: '24px 16px 8px' }} className="app-detail-header">门店分配</div>
        <BatchResultList bizType={this.props.params.bizType} style={{ margin: '0 16px' }}>
          <div style={{ margin: '15px 0' }}>
            <Breadcrumb separator=">">
              <BItem><Link to={'/shop-alloc'}>门店分配</Link></BItem>
              {
                this.props.params.bizType === 'ALLOCATE_SHOP' ? <BItem>分配进度</BItem> : <BItem>创建人店关系</BItem>
              }
            </Breadcrumb>
          </div>
        </BatchResultList>
      </div>
      );
  },
});
export default ShopAllocBatchLog;

