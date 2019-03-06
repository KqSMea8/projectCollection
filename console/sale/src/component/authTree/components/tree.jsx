/* eslint-disable */
import React, {PropTypes,PureComponent} from 'react';
import { Tree ,message} from 'antd';
import Modal from './modal.jsx';
import {deleteAuth} from '../service'
const TreeNode = Tree.TreeNode;
export default class TreeComponent extends PureComponent {
  static propTypes= {
    data: PropTypes.array,
    reload:PropTypes.func
  }
  state = {
    modalVisible:false,
    modalType:'add',
    item:{}
  }
  async deleteAuthHandle(permissionCode){
    console.log(permissionCode)
    let res = await deleteAuth({
      permissionCode
    })
    if(res.status === 'succeed'){
      if(res.data && res.data.success){
        message.success('删除成功')
        this.props.reload()
      }else{
        message.error(res.data.errorMsg);
      }
    }
  }
  renderTreeNode(data) {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            key = {item.id}
            title={
              <div>
                <div className ="show-name-group">
                  <span className="show-name">{item.showName}</span>
                  <span className="show-name">{` (${item.permissionCode})`}</span>
                  <span className="show-name">{` (${item.functionCode})`}</span>
                </div>
                <span className="operate" onClick={this.toggleModal.bind(this,true,'add',item)}>新增</span>
                <span className="operate" onClick={this.toggleModal.bind(this,true,'modify',item)}>编辑</span>
                <span className="operate" onClick={this.deleteAuthHandle.bind(this,item.permissionCode)}>删除</span>
              </div>
            }
            dataRef={item}>
            {this.renderTreeNode(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });
  }
  toggleModal(isShow,modalType,item){
    this.setState({modalVisible:isShow})
    this.setState({modalType})
    this.setState({item})
  }
  render() {
    const {data,permissionGroup} = this.props;
    const {modalVisible,modalType,id,item} = this.state
    if (!data) return null;
    return (
      <div className="tree">
        <Tree showLine defaultExpandedKeys={['root']}>
          <TreeNode
            key="root"
            title={
              <div>
                <span className="show-name">根级</span>
                <span className="operate" onClick={this.toggleModal.bind(this,true,'add',{})}>新增</span>
              </div>
            }>
            {this.renderTreeNode(data)}
          </TreeNode>
        </Tree>
        <Modal
          {...this.props}
          visible={modalVisible}
          modalType = {modalType}
          item={item}
          onCancel={this.toggleModal.bind(this,false,modalType,{})} >
       </Modal>
      </div>
     );
  }
}


