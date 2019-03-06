import React from 'react';
import {Icon} from 'antd';
import CommissionQueryForm from './CommissionQueryForm';
import CommissionQueryTable from './CommissionQueryTable';

const CommissionQuery = React.createClass({
  getInitialState() {
    return {};
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },

  render() {
    return (<div>
      <div className="app-detail-header" style={{position: 'relative'}}>
        返佣查询
        <p style={{fontSize: '12px', position: 'absolute', right: '20px', top: '30px'}}>
          <Icon type="paper-clip" />
          口碑城市服务商验收及结算规范（2016年4月－12月）
          <a href="https://os.alipayobjects.com/rmsportal/MDkAlmZEIQverqk.docx">下载</a>
        </p>
      </div>
      <div className="app-detail-content-padding">
        <CommissionQueryForm onSearch={this.onSearch}/>
        <CommissionQueryTable params={this.state.params}/>
      </div>
    </div>);
  },
});

export default CommissionQuery;
