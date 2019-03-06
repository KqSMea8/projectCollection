import React, {PropTypes} from 'react';
import RecordEditorForm from './RecordEditorForm';
import RecordEditorTable from './RecordEditorTable';
import RecordEditorLeadsTable from './RecordEditorLeadsTable';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import { Tabs, message, Spin } from 'antd';
import queryIsPosSale from '../../../common/queryIsPosSale';

const TabPane = Tabs.TabPane;

const RecordEditorIndex = React.createClass({
  propTypes: {
    children: PropTypes.any,
    params: PropTypes.object,
    location: PropTypes.any,
  },
  getInitialState() {
    return {
      typeMap: {},
      typeList: [],
      role: [],
      userType: '',
      isExportVisitRecord: true, // 由后端控制是否展示 导出拜访小记 按钮
      isPosSale: null,
    };
  },

  componentDidMount() {
    this.fetch();
    this.fetchMaterialTypeList();
    queryIsPosSale().then(isPosSale => {
      this.setState({ isPosSale });
    });
  },

  onSearch(params) {
    const {role} = this.state;
    if (role[1] === 'bd') {
      params.customerType = 'SHOP';
      if (this.props.children) {
        if (this.props.children.key === 'leads') {
          params.customerType = 'PRIVATE_LEADS';
        } else if (this.props.children.key === 'shop') {
          params.customerType = 'SHOP';
        } else if (this.props.children.key === 'pos_leads') {
          params.customerType = 'POS_LEADS';
        }
      }
    } else {
      params.customerType = 'BRAND';
    }
    this.setState({ params });
  },
  newRequest(key) {
    window.location.hash = '/record/' + key;
    let customerType = 'shop';
    if (key === 'leads') {
      customerType = 'PRIVATE_LEADS';
    } else if (key === 'shop') {
      customerType = 'SHOP';
    } else if (key === 'pos_leads') {
      customerType = 'POS_LEADS';
    }
    this.setState({ params: {customerType: customerType} });
  },

  fetch() {
    ajax({
      url: '/sale/visitrecord/queryLoginRole.json',
      method: 'get',
      success: (result) => {
        this.setState({
          role: result.data,
          userType: result.userChannel,
          isExportVisitRecord: result.isExportVisitRecord === 'Y',
        });
      },
    });
  },

  fetchMaterialTypeList() {
    ajax({
      url: '/sale/visitrecord/queryStuffTypeList.json',
      method: 'get',
      type: 'json',
      success: (results) => {
        if (results.status === 'succeed') {
          const typeList = [];
          for (const p in results.data) {
            if (results.data.hasOwnProperty(p)) {
              typeList.push({key: p, value: results.data[p]});
            }
          }
          this.setState({
            typeList: typeList,
            typeMap: results.data
          });
        } else {
          message.error(results.resultMsg, 3);
        }
      },
    });
  },

  render() {
    const children = this.props.children;
    const {role, userType, typeList, typeMap, isPosSale} = this.state;
    if (isPosSale === null) return <Spin><div style={{ height: 100 }}/></Spin>;
    let activeKey = 'shop';
    let type;
    if (role[1] === 'bd') {
      type = 'SHOP';
      if (children && children.key === 'shop') {
        activeKey = 'shop';
        type = 'SHOP';
      } else if (children && children.key === 'leads') {
        activeKey = 'leads';
        type = 'PRIVATE_LEADS';
      } else if (children && children.key === 'pos_leads') {
        activeKey = 'pos_leads';
        type = 'POS_LEADS';
      }
    } else if (role[1] === 'kaBd' ) {
      type = 'BRAND';
    }
    return (
      <div>
        { role[1] === 'bd' ? <div className="kb-detail-main">
          { permission('VISITRECORD_ADD_PC') ? <a className="ant-btn-primary ant-btn" style={{position: 'absolute', right: 16, zIndex: 2}} target="_blank" href={`#/record/newrecord/${type}/${isPosSale ? 'true' : 'false'}`}>新增</a> : null }
          <Tabs
            onChange={this.newRequest}
            activeKey={activeKey}
            >
            <TabPane tab="门店" key="shop">
              {role.length > 0 &&
              <RecordEditorForm isPosSale={isPosSale} typeList={typeList} onSearch={this.onSearch} type={type} params={this.props.params} day={this.props.location.query.day} role={role} shopId={this.props.location.query.shopId} leadsId={this.props.location.query.leadsId} userType={userType} isExportVisitRecord={isPosSale ? false : this.state.isExportVisitRecord}/>
              }
              <RecordEditorTable isPosSale={isPosSale} typeMap={typeMap} params={this.state.params} type={type}/>
            </TabPane>
            {!isPosSale ? <TabPane tab="leads" key="leads">
              {role.length > 0 &&
              <RecordEditorForm isPosSale={isPosSale} typeList={typeList} onSearch={this.onSearch} type={type} params={this.props.params} day={this.props.location.query.day} role={role} shopId={this.props.location.query.shopId} leadsId={this.props.location.query.leadsId} userType={userType} isExportVisitRecord={this.state.isExportVisitRecord}/>
              }
              <RecordEditorLeadsTable isPosSale={isPosSale} typeMap={typeMap} params={this.state.params} type={type} />
            </TabPane> : []}
            {isPosSale ? <TabPane tab="POS Leads" key="pos_leads">
              {role.length > 0 &&
              <RecordEditorForm isPosSale={isPosSale} typeList={typeList} onSearch={this.onSearch} type={type} params={this.props.params} day={this.props.location.query.day} role={role} shopId={this.props.location.query.shopId} leadsId={this.props.location.query.leadsId} userType={userType} isExportVisitRecord={false}/>
              }
              <RecordEditorLeadsTable isPosSale={isPosSale} typeMap={typeMap} params={this.state.params} type={type} />
            </TabPane> : []}
          </Tabs>
        </div> : (
            <div>
              <div className="app-detail-header">拜访小记
                { permission('VISITRECORD_ADD_PC') ? <a className="ant-btn-primary ant-btn" style={{position: 'absolute', right: 16, zIndex: 2}} target="_blank" href={`#/record/newrecord/${type}/${isPosSale ? 'true' : 'false'}`}>新增</a> : null }
              </div>
              <div className="app-detail-content-padding">
                {role.length > 0 &&
                  <RecordEditorForm isPosSale={isPosSale} onSearch={this.onSearch} type={type} params={this.props.params} day={this.props.location.query.day} role={role} shopId={this.props.location.query.shopId} leadsId={this.props.location.query.leadsId} userType={userType} isExportVisitRecord={this.state.isExportVisitRecord}/>
                }
                <div className="kb-detail-main">
                  <RecordEditorTable isPosSale={isPosSale} typeMap= {typeMap} params={this.state.params} type={type}/>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  },
});

export default RecordEditorIndex;
