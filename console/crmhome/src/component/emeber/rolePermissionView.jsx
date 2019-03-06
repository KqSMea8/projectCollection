import React, { Component } from 'react';
import { Button, Table, message } from 'antd';
import SecurityModal from './securityModal';
import ajax from '../../common/ajax';
import './emeber.less';

class RolePermissionView extends Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '产品',
      dataIndex: 'product',
      key: 'product',
      width: '25%',
      render: (_, record, index) => {
        return !index ? '口碑商家中心' : '';
      },
    }, {
      title: '一级功能',
      dataIndex: 'showName',
      key: 'showName',
      width: '25%',
      render(text, record) {
        return record.childName ? '' : text;
      },
    }, {
      title: '二级功能',
      dataIndex: 'childName',
      key: 'childName',
      width: '25%',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record)=>{
        if (!record.store) {
          return '';
        }
        return <a onClick={this.goDetail.bind(this, record.functionCode, record.id, record.showName || record.childName)}>查看功能详情</a>;
      },
      width: '25%',
    }];
    this.rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        try {
          const featureDelete = [];
          const deletItems = [];
          selectedRows.forEach(row => {
            const {functionCode, orderCommodity, cardNo, commodityId} = row;
            if (orderCommodity && commodityId && cardNo) {
              featureDelete.push({functionCode, commodityId, cardNo, orderCommodity, select: true, endStatus: false});
            } else {
              deletItems.push({functionCode, select: true, endStatus: false});
            }
          });
          this.setState({ deletItems: JSON.stringify(deletItems), featureDelete: JSON.stringify(featureDelete) });
        } catch (e) {
          console.log(e);
        }
      },
      getCheckboxProps: record => {
        return {
          disabled: !record.store,   // 收银员不展示删除
        };
      },
    };
    this.state = {
      tableData: [],
      deletItems: '[]',
      featureDelete: '[]',
      loading: true,
      showAddPermission: false,
      showDeletePermission: false,
    };
  }
  componentWillMount() {
    const {roleId, roleCode} = this.props.params;
    ajax({
      url: `/staff/queryPermissions.json?principalId=${roleId}${roleCode && roleCode !== 'null' ? `&roleCode=${roleCode}` : ''}&principalType=ROLE&channel=CRMHOME`,
      method: 'get',
      type: 'json',
      success: (result)=>{
        if (result.permissionList) {
          const list = result.permissionList.filter(item => {
            const children = item.children ? item.children.filter(child => child.select).map(child => { child.childName = child.showName; return child;}) : [];
            item.children = children; // 利用反射进，不是很好
            return item.select || children.length;
          });
          this.setState({
            loading: false,
            tableData: this.padResult(list),
          });
        } else {
          this.setState({loading: false});
          message.error(result.resultMsg || '系统繁忙请稍后再试');
        }
      },
    });
  }
  padResult(data) {
    let refactorData = [];
    data.forEach(item => {
      refactorData = refactorData.concat(item.children ? [item, ...item.children.map(child => {
        const cpData = {...child, showName: null, childName: child.showName};
        delete cpData.children;
        return cpData;
      })] : [item]);
      delete item.children;
    });
    return refactorData;
  }
  // 跳转详情方法
  goDetail(code, id, title) {
    const {roleId, roleCode} = this.props.params;
    window.location.hash = `/prodAuthOperatorListView/${roleId}${roleCode && roleCode !== 'null' ? `/${roleCode}` : ''}?functionCode=${code}&id=${id}&title=${encodeURIComponent(title)}`;
  }

  render() {
    const {roleName, roleId, roleCode = '', desc = ''} = this.props.params;
    const {showAddPermission, showDeletePermission, deletItems, loading, featureDelete} = this.state;
    const {crmhomeUrl, ememberUrl} = window.APP;
    const disableDelete = (!deletItems || !deletItems.length || deletItems === '[]') && (!featureDelete || !featureDelete.length || featureDelete === '[]');

    return (
      <div className="emeber-rolePermissionView">
        <div className="head-title">
          <h3>角色详情</h3>
          <a onClick={() => { location.href = `${ememberUrl}/console/queryRoleList.htm`; }}>{'<返回首页'}</a>
        </div>
        <div className="content">
          <div className="content-title">
            <h3>{roleName}</h3>
            <p>{desc}</p>
          </div>
          <div className="content-tabs">
              <ul>
                <li>
                  <a onClick={() => { window.location.href = `${ememberUrl}/console/queryRoleInfo.htm?roleId=${roleId}`; }}>操作员</a>
                </li>
                <li className="active">
                  <a>业务权限</a>
                </li>
              </ul>
          </div>
          <div className="permissions-button">
            <Button type="primary" onClick={() => { this.setState({showAddPermission: true}); }}>
              添加权限
            </Button>
            <Button disabled={disableDelete} onClick={() => { this.setState({showDeletePermission: true}); }}>
              删除权限
            </Button>
          </div>
          <Table loading={loading} columns={this.columns} dataSource={this.state.tableData} rowSelection={this.rowSelection} rowKey={r => r.id}/>
          {showAddPermission ? <SecurityModal needReload innerSubmit="#form-submit" title="加权限" width={600} frameProps={{style: {height: 480}}} onCancel={() => { this.setState({showAddPermission: false}); }} visible src={`${crmhomeUrl}/staff/productFunctionAuthRoleDialog.htm#/roleDialog/${roleId}${roleCode && roleCode !== 'null' ? `/${roleCode}` : ''}`} /> : null}
          {showDeletePermission ? <SecurityModal needReload innerSubmit="#form-submit" title="删除权限" width={600} frameProps={{style: {height: 200}}} onCancel={() => { this.setState({showDeletePermission: false}); }} visible src={`${crmhomeUrl}/staff/productFunctionUnAuthRoleDialog.htm#/roleUnAuthDialog/${roleId}/${deletItems}/${featureDelete}`} /> : null}
        </div>
      </div>
    );
  }
}

export default RolePermissionView;
