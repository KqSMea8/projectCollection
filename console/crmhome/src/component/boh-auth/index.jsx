import React from 'react';
import { Card, Tree, Spin, Row, Col } from 'antd';
import Postmsg from 'kb_postmsg';
import './index.less';
import { keepSession } from '../../common/utils';
import { fetchQueryPermissions, savePermission } from './service';
import { getUriParam } from '../../common/utils';
const TreeNode = Tree.TreeNode;

const userAuth = [];
function filterUserAuth(data, type) {
  for (const item of data) {
    // 记录当前角色拥有的权限ID集合
    if (type) {
      if (item.store && item.select) userAuth.push(item.functionCode);
    } else {
      if (item.select) userAuth.push(item.commodityId);
    }
    if (item.children && item.children.length) {
      filterUserAuth(item.children, true);
    }
    if (item.servicePermission && item.featurePermissionVOList && item.featurePermissionVOList.length) {
      filterUserAuth(item.featurePermissionVOList, false);
    }
  }
}

function getUserPermissions(data) {
  const rtn = data.filter((item) => {
    item.children = item.children.filter((itemInner) => {
      return itemInner.store && itemInner.select;
    });
    if (item.servicePermission && item.featurePermissionVOList) {
      item.featurePermissionVOList = item.featurePermissionVOList.filter((itemInner) => {
        return itemInner.select;
      });
    }
    return item;
  });
  return rtn.filter((item) => {
    if (item.servicePermission) {
      return item.select || item.featurePermissionVOList.length > 0;
    } else { // eslint-disable-line
      return item.select || item.children.length > 0;
    }
  });
}

export default class BohAuth extends React.Component {
  state = {
    checkable: false,
    loadEnd: false,
    authList: [], // 所有权限集合
    userAuthList: [], // 当前角色拥有的权限ID集合
    userPermissionList: [], // 当前角色拥有的权限集合
    roleId: '',
    roleCode: '',
  }

  componentDidMount() {
    const roleId = getUriParam('roleId');
    const roleCode = getUriParam('roleCode');
    const checkable = getUriParam('edit') === 'true' ? true : false;
    keepSession(0, 10000);
    this.initPostMessage();
    fetchQueryPermissions({
      url: `/staff/queryPermissions.json?principalId=${roleId}${roleCode && roleCode !== 'null' ? `&roleCode=${roleCode}` : ''}&principalType=ROLE&channel=CRMHOME`,
      // url: `https://pickpost.alipay.net/mock/crmhome/staff/queryPermissions.json?principalId=${roleId}${roleCode && roleCode !== 'null' ? `&roleCode=${roleCode}` : ''}&principalType=ROLE&channel=CRMHOME`,
    }).then((res) => {
      filterUserAuth(res.permissionList, true);
      const userPermissionList = getUserPermissions(JSON.parse(JSON.stringify(res.permissionList)));
      // console.log('userPermissionList:');
      // console.log(userPermissionList);
      this.setState({
        checkable,
        authList: res.permissionList,
        userAuthList: userAuth,
        userPermissionList,
        loadEnd: true,
        roleId,
        roleCode,
      });
    });
  }

  getSaveParam = (data, businessPermission, featurePermission, type) => {
    const { userAuthList } = this.state;
    for (const item of data) {
      if (type) {
        const {functionCode, store, select} = item;
        if (store) {
          businessPermission.push({functionCode, select, endStatus: userAuthList.indexOf(functionCode) !== -1});
        }
      } else {
        const {select, commodityId, cardNo} = item;
        const endStatus = userAuthList.indexOf(commodityId) !== -1;
        if (endStatus !== !!select) {
          featurePermission.push({
            cardNo,
            commodityId,
            select: !!select,
            endStatus,
          });
        }
      }
      if (item.children && item.children.length) {
        this.getSaveParam(item.children, businessPermission, featurePermission, true);
      }
      if (item.servicePermission && item.featurePermissionVOList && item.featurePermissionVOList.length) {
        this.getSaveParam(item.featurePermissionVOList, businessPermission, featurePermission, false);
      }
    }
  }

  save = () => {
    const _this = this;
    // 业务权限
    const businessPermission = [];
    // 服务权限
    const featurePermission = [];
    const { authList, roleId } = this.state;
    this.getSaveParam(authList, businessPermission, featurePermission, true);
    const params = {
      businessPermission: JSON.stringify(businessPermission),
      featurePermission: JSON.stringify(featurePermission),
      principalId: roleId,
      principalType: 'ROLE',
    };
    savePermission({
      data: params,
    }).then(() => {
      _this.posmsg.send('parent', {
        type: 'setState',
        value: 'saveSuccess',
      });
      _this.reload(true);
    }).catch(() => {
      _this.posmsg.send('parent', {
        type: 'setState',
        value: 'saveFailed',
      });
    });
  }

  reload = (status) => {
    const href = location.href.replace(/(&edit=true)|(&edit=false)/g, '');
    location.href = `${href}&edit=${status}`;
  }

  toggleEdit = () => {
    this.setState({checkable: !this.state.checkable});
  }

  initPostMessage() {
    const _this = this;
    this.posmsg = new Postmsg();
    this.posmsg.addTarget('parent', parent);
    this.posmsg.addHandleMessage((e) => {
      if (e && e.data) {
        const {type, value} = e.data;
        if (type === 'setState') {
          if (value === 'edit') {
            _this.reload(true);
          } else if (value === 'cancel') {
            _this.reload(false);
          } else if (value === 'save') {
            _this.save();
          }
        }
      }
    });
  }

  handleChange = (ids) => {
    this.setState({
      userAuthList: ids,
    });
  }

  renderTree = () => {
    const { authList, checkable, userAuthList, userPermissionList } = this.state;
    const permissions = checkable ? authList : userPermissionList;
    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode key={item.functionCode} title={`${item.showName}`}>
            {item.children.map((itemInner) => {
              return <TreeNode key={itemInner.functionCode} title={`${itemInner.showName}`} />;
            })}
          </TreeNode>
        );
      } else if (item.servicePermission && item.featurePermissionVOList && item.featurePermissionVOList.length) {
        return (
          <TreeNode key={item.functionCode} title={`${item.showName}`}>
            {item.featurePermissionVOList.map((itemInner) => {
              return (
                <TreeNode key={itemInner.commodityId}
                  className="m-server-tree-node"
                  title={
                    <Row className="m-server-row">
                      <Col span={3}>
                        <div className="img-wrapper">
                          <img src={itemInner.logoUrl} alt="" />
                        </div>
                      </Col>
                      <Col span={21}>
                        <p>{itemInner.title}</p>
                        <p>{itemInner.isvName}</p>
                      </Col>
                    </Row>
                  } />
              );
            })}
          </TreeNode>
        );
      }
      return <TreeNode key={item.functionCode} title={`${item.showName}`} />;
    });
    return (
      <Tree checkable={checkable}
        defaultExpandAll
        checkedKeys={checkable ? userAuthList : []}
        onCheck={this.handleChange}>
        {loop(permissions)}
      </Tree>
    );
  }

  render() {
    const {loadEnd, checkable, userAuthList} = this.state;

    return (
      <Spin spinning={!loadEnd}>
        <Card title="口碑权限"
          className="m-boh-auth">
          {loadEnd && this.renderTree()}
          {loadEnd && !checkable && userAuthList.length <= 0 && <div className="m-empty">
            暂无权限
          </div>}
        </Card>
      </Spin>
    );
  }
}
