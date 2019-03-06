import React, { Component } from 'react';
import { Button, Tag, Table, message, Icon} from 'antd';
import ajax from '../../common/ajax';
import SecurityModal from './securityModal';
import './emeber.less';
class OperatorPermissionView extends Component {
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
      title: '资金操作权限/门店',
      dataIndex: 'jurisdiction',
      key: 'jurisdiction',
      width: '16%',
      render: () => {
        return '该功能无需设置';
      },
    }, {
      title: '操作',
      key: 'operation',
      render: ()=>{
        return '';
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
              featureDelete.push({functionCode, orderCommodity, cardNo, commodityId, select: true, endStatus: false});
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
        const {operator} = this.state;
        const isCashier = operator && operator.roleCode === 'CASHIER';
        return {
          disabled: (isCashier && ['000|06|04|02', '000|06|04|03'].indexOf(record.functionCode) === -1) || !record.store,    // 退款权限才能选且删除 退款（仅退该员工个人收的）（000|06|04|02) 退款（可退门店所有交易）（000|06|04|03）
        };
      },
    };
    this.state = {
      lockShow: false,
      deleteShow: false,
      editRoleShow: false,
      showRelease: false,
      addRole: false,
      deleteChoose: [],
      loading: true,
      deletItems: '[]',
      featureDelete: '[]',
      hasPosAuth: false,
    };
  }
  componentDidMount() {
    const {operatorId} = this.props.params;
    ajax({
      url: `${window.APP.ememberUrl}/console/queryOperatorDetail.json?operatorId=${operatorId}`,
      success: (res) => {
        if (res.operator) {
          this.setState({operator: res.operator});
          this.setState({hasPosAuth: res.hasPosAuth});
        } else {
          message.error(res.resultMsg || '系统繁忙，请稍后再试');
        }
      },
    });
    ajax({
      url: `/staff/queryPermissions.json?principalType=OPERATOR&principalId=${operatorId}&channel=CRMHOME`,
      // url: 'http://pickpost.alipay.net/mock/staff/staff/queryPermissions.json',
      success: (res) => {
        if (res.permissionList) {
          const list = res.permissionList.filter(item => {
            const children = item.children ? item.children.filter(child => child.select).map(child => { child.childName = child.showName; return child;}) : [];
            item.children = children; // 利用反射进，不是很好
            return item.select || children.length;
          });
          this.setState({
            data: this.padResult(list),
            loading: false,
          });
        } else {
          this.setState({loading: false});
          message.error(res.resultMsg || '系统繁忙，请稍后再试');
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
  createLockBtn() {
    const {operator = {}} = this.state;
    if (operator.status === 'U') {
      return <Button size="small" style={{marginLeft: 10}} onClick={() => { this.setState({showRelease: true}); }}>解锁</Button>;
    }
    if (operator.status === 'T') {
      return <Button size="small" style={{marginLeft: 10}} onClick={() => { this.setState({lockShow: true}); }}>锁定</Button>;
    }
    return '';
  }
  /*eslint-disable */
  render() {
    const {operatorId} = this.props.params;
    const {ememberUrl, epsecuritycenterUrl, uemprodUrl, crmhomeUrl} = window.APP;
    const {operator = {}, lockShow, editRoleShow, deletItems, deleteShow, loading, showRelease, addRole, featureDelete, hasPosAuth} = this.state;
    const time = (new Date()).getTime();
    const isCashier = operator && operator.roleCode === 'CASHIER';
    const isCraft = operator && operator.roleCode === 'CRAFTMAN';
    const isNoRole = operator.roleId === '0';
    const disableDelete = (!deletItems || !deletItems.length || deletItems === '[]') && (!featureDelete || !featureDelete.length || featureDelete === '[]');
    return (
      <div className="emeber-operatorPermissionView">
        <div className="head-title">
          <h3>操作员详情</h3>
          <a onClick={() => { location.href = `${ememberUrl}/console/queryRoleList.htm`; }}>{'<返回首页'}</a>
        </div>
        <div className="content">
          <div className="userInfoTitle">
            <h3>
              <b>{operator.realName}</b>
              <span>{operator.aliasName}</span>
            </h3>
            {operator.status === 'W' ? <Tag color="#ccc">
              {operator.statusName}
            </Tag> : null}
            {operator.status === 'U' ? <Icon type="lock" style={{color: '#c2c2c2', fontSize: 10}}/> : null}
          </div>
          <div className="userInfoAmend">
            <div style={{margin: '5px 0'}}>
              <label>
                {operator.roleName}
              </label>
              {isNoRole ? <Button type="dashed" size="small" style={{marginRight: 5}} onClick={() => { this.setState({addRole: true}); }}>+ 加角色</Button> : null}
              {isNoRole || isCashier || isCraft || hasPosAuth ? null : <Button size="small">
                <a onClick={ () => { this.setState({addRole: true}); }}>
                  修改角色
                </a>
              </Button>}
            </div>

            <div style={{ margin: `10px 0`}}>
              <Button size="small">
                <a onClick={() => { location.href = `${ememberUrl}/console/queryOperator.htm?operatorId=${operatorId}`; }}>
                  修改个人信息
                </a>
              </Button>
              {this.createLockBtn()}
            </div>
          </div>
          <div className="content-tabs">
            <ul>
              <li className="active">
                <a>业务权限</a>
              </li>
              <li>
                <a onClick={() => { location.href = `${ememberUrl}/console/viewOperatorShop.htm?operatorId=${operatorId}`;}}>门店配置</a>
              </li>
              <li>
                <a onClick={() => { location.href = `${uemprodUrl}/permission/resourcePermissionView.htm?operatorId=${operatorId}`;}}>服务权限</a>
              </li>
              <li>
                <a onClick={() => { location.href = `${epsecuritycenterUrl}/sc/securitySet.htm?operatorId=${operatorId}`;}}>安全设置</a>
              </li><li>
                <a onClick={() => { location.href = `${ememberUrl}/console/queryOperatorDetail.htm?operatorId=${operatorId}`;}}>个人信息</a>
              </li>
            </ul>
          </div>
          {isCashier || isNoRole ? <div>
            <div className="emember-btn-group"> <Button type="primary" onClick={() => {
              this.setState({editRoleShow: true});
            }}>添加权限</Button><Button disabled={disableDelete} onClick={() => { this.setState({deleteShow: true}); }}>删除权限</Button></div>
            </div> : null}
            <Table loading={loading} columns={this.columns} dataSource={this.state.data} rowSelection={isCashier || isNoRole ? this.rowSelection : null} rowKey={r => r.id} />
        </div>
        {editRoleShow ? <SecurityModal title="添加权限" innerSubmit="#form-submit" needReload width={600} frameProps={{style: {height: 480}}} onCancel={() => { this.setState({editRoleShow: false}); }} visible src={`${crmhomeUrl}/staff/productFunctionAuthOperatorDialog.htm#/operatorDialog/${operatorId}${operator.roleCode ? `/${operator.roleCode}` : ''}`} /> : null}
        {deleteShow ? <SecurityModal title="删除角色" innerSubmit="#form-submit" needReload width={600} frameProps={{style: {height: 200}}} onCancel={() => { this.setState({deleteShow: false}); }} visible src={`${crmhomeUrl}/staff/productFunctionUnAuthOperatorDialog.htm#/operatorUnAuthDialog/${operatorId}/${deletItems}/${featureDelete}`} /> : null}
        {addRole ? <SecurityModal needSpin title="修改角色" innerSubmit="#J_submitBtn input" needReload width={520} frameProps={{style: {height: 320}}} onCancel={() => { this.setState({addRole: false}); }} visible src={`${ememberUrl}/console/changeOperatorRole.htm?operatorIdList=${operatorId}&roleId=0&hiddenClose=true`} /> : null}
        {lockShow ? <SecurityModal needSpin title="提示" innerSubmit="#J_confirmBtn" onCancel={() => { this.setState({lockShow: false}); }} frameProps={{style: {height: 100}}} visible={lockShow} src={`${ememberUrl}/console/lockOperator.htm?operatorId=${operatorId}&hiddenClose=true&t=${time}`} /> : null}
        {showRelease ? <SecurityModal needSpin title="解锁操作员" innerSubmit="#J_confirmBtn" onCancel={() => { this.setState({showRelease: false}); }} frameProps={{style: {height: 100}}} visible src={`${ememberUrl}/console/unlockOperator.htm?operatorId=${operatorId}&t=${time}`} /> : null}
      </div>
    );
  }
}
// lock http://emembercenter.stable.alipay.net/console/lockOperator.htm?operatorId=2088301101331436&hiddenClose=true&t=1501248463736
// http://emembercenter.stable.alipay.net/console/changeOperatorRole.htm?operatorIdList=2088301101331436&roleId=20415051724&hiddenClose=true&_iframe=true&t=1501248384830
export default OperatorPermissionView;
