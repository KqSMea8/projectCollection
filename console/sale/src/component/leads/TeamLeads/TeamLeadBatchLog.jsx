import React from 'react';
import BatchResultList from '../../../common/BatchResultList';
import * as antd from 'antd';
import { Link } from 'react-router';

const Breadcrumb = antd.Breadcrumb;
const BItem = Breadcrumb.Item;

export default (props) => (
  <div className="kb-tabs-main" style={{ position: 'relative' }}>
    <div style={{ borderBottom: 0, padding: '24px 16px 8px' }} className="app-detail-header">门店分配</div>
    <BatchResultList bizType={'ALLOCATE_LEADS'} style={{ margin: '0 16px' }}>
      <div style={{ margin: '15px 0' }}>
        <Breadcrumb separator=">">
          <BItem><Link to={'/team-leads'}>团队Leads</Link></BItem>
          <BItem>分配进度</BItem>
        </Breadcrumb>
      </div>
    </BatchResultList>
  </div>
);
