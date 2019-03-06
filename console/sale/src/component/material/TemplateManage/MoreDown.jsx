import React, {PropTypes} from 'react';
import { Menu, Dropdown, Icon, message} from 'antd';
import ajax from 'Utility/ajax';
import {appendOwnerUrlIfDev} from '../../../common/utils';
import InvalidModel from './InvalidModel';
const MoreDown = React.createClass({
  propTypes: {
    id: PropTypes.any,
    show: PropTypes.bool,
    handleCancel: PropTypes.func,
    stuffCheckId: PropTypes.any,
    currentPage: PropTypes.any,
    changeTableData: PropTypes.func,
    status: PropTypes.any,
    params: PropTypes.any,
    getChangeList: PropTypes.func,
  },
  getInitialState() {
    return {
      visible: false,
      id: '',
    };
  },
  showModal(e) {
    e.preventDefault();
    this.setState({
      visible: true,
    });
  },
  handleOk() {
    this.setState({
      visible: false,
    });
  },
  handleCancel() {
    this.setState({
      visible: false,
    });
  },
  // 把失效的改为生效中
  changeStatus(e) {
    e.preventDefault();
    const params = {
      mappingValue: 'kbasset.updateStatusTemplate',
      domain: 'KOUBEI',
      templateId: this.props.id,
      status: 'EFFECTIVE',
    };
    ajax({
      // url: appendOwnerUrlIfDev('/sale/asset/stuffTemplateEdit.json'),
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          message.success('已生效', 3);
          if (this.props.getChangeList) {
            this.props.getChangeList();
          }
          this.props.changeTableData();
        }
      },
    });
  },
  render() {
    const id = this.props.id;
    const {status, currentPage} = this.props;
    const menu = (
      <Menu>
        <Menu.Item key="0">
          {status === '生效中' && <a onClick={this.showModal} id={id}>失效</a>}
          {status === '已失效' && <a onClick={this.changeStatus} id={id}>生效</a>}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">
          <a target="_blank" href={'#/material/templatemanage/createtemplate?tab=koubei&id=' + id}>复制</a>
        </Menu.Item>
      </Menu>
    );
    return (<div>
      {currentPage === 'tabList' ?
        ( <div><a target="_blank" href={'#/material/templatemanage/tempinfo/' + id} style={{margin: '0 8px'}}>详情　| </a>
          <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link" href="#">更多 <Icon type="down" /></a>
          </Dropdown></div>) : null}

      {currentPage === 'tempInfo' ?
        (<div style={{position: 'absolute', right: 16, zIndex: 2}}>
        <a className="ant-btn-primary ant-btn" target="_blank" href={'#/material/templatemanage/createtemplate?tab=koubei&id=' + id} style={{margin: '0 8px'}}>复制</a>
          {status === 'EFFECTIVE' && <a className="ant-btn-primary ant-btn" onClick={this.showModal} id={id}>失效</a>}
          {status === 'INVALID' && <a className="ant-btn-primary ant-btn" onClick={this.changeStatus} id={id}>生效</a>}
      </div>) : null }
      <InvalidModel
        id={id}
        currentPage={currentPage}
        status={status}
        changeTableData={this.props.changeTableData}
        show={this.state.visible}
        handleCancel={this.handleCancel}
        getChangeList={this.props.getChangeList}
        handleOk={this.handleOk}/>
    </div>
    );
  },
});
export default MoreDown;
