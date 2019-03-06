import React, {PropTypes} from 'react';
import {message, Table, Menu, Dropdown, Icon, Popover, Button, Modal} from 'antd';
import ajax from '../../../../common/ajax';
import MenuRemoveAction from './MenuRemoveAction';
import {getMerchantId, getCategoryId} from '../../common/utils';

const MenuList = React.createClass({
  propTypes: {
    fetchShops: PropTypes.func,
    setMemus: PropTypes.func,
  },
  getInitialState() {
    this.merchantId = getMerchantId();
    this.getColumns();
    return {
      hasMenus: true,
      loading: true,
      data: [],
      pagination: {
        showSizeChangeer: true,
        showQuickJumper: true,
        showTotal: (total) => `共${total}个记录`,
        current: 1,
        pageSize: 10,
        total: 0,
      },
      showModal: false,
    };
  },
  componentDidMount() {
    this.fetch();
  },
  onTableChange(pagination) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    this.fetch();
  },
  getColumns() {
    const {goDetail, goEdit, refresh} = this;
    this.columns = [{
      title: '菜单名称',
      dataIndex: 'title',
    }, {
      title: '菜品数量',
      dataIndex: 'dishCount',
    }, {
      title: '配置门店数',
      dataIndex: 'shopCount',
    }, {
      title: '状态',
      dataIndex: 'status',
      render(text) {
        const icon = (<Popover placement="bottomRight" content={text === 'PROCESS' ? '本次提交的菜品及门店数量较多，需要一段时间处理，请耐心等待。' : '该菜单审核不通过，建议删除后重新创建。'}>
          <Icon style={{marginLeft: '3px', color: '#2db7f5'}} type="info-circle" />
        </Popover>);
        let result = <span>已生效</span>;
        if (text === 'INIT') {
          result = <span>审核不通过{icon}</span>;
        } else if (text === 'PROCESS') {
          result = <span>处理中{icon}</span>;
        }
        return result;
      },
    }, {
      title: '操作',
      render(text, record) {
        const menu = (
          <Menu>
            <Menu.Item key="0">
              <a disabled={record.status !== 'EFFECT'} onClick={() => goEdit(record.menuId)}>修改</a>
            </Menu.Item>
            <Menu.Item key="1">
              <MenuRemoveAction menuId={record.menuId} refresh={refresh} />
            </Menu.Item>
          </Menu>
        );
        return (<div>
          <a style={{marginRight: '10px'}} onClick={() => goDetail(record.menuId)}>查看</a>
          <Dropdown overlay={ menu } trigger={[ 'click' ]}>
            <a className="ant-dropdown-link">
              操作 <Icon type="down" />
            </a>
          </Dropdown>
        </div>);
      },
    }];
  },
  showModal() {
    this.setState({
      showModal: true,
    });
  },
  hideModal() {
    this.setState({
      showModal: false,
    });
  },
  createMenu() {
    window.location.hash = '/decoration/' + getCategoryId() + '/menu/menu-create';
  },
  goDetail(id) {
    window.location.hash = '/decoration/' + getCategoryId() + '/menu/menu-detail/' + id;
  },
  goEdit(id) {
    window.location.hash = '/decoration/' + getCategoryId() + '/menu/menu-edit/' + id;
  },
  fetch() {
    const {pagination} = this.state;
    const {current, pageSize} = pagination;
    this.setState({
      loading: true,
    });
    const params = {
      pageNo: current,
      pageSize,
    };
    if (this.merchantId) params.op_merchant_id = this.merchantId;
    ajax({
      url: '/shop/kbmenu/pageQuery.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'success') {
          result.menuVO.forEach((v) => v.key = v.menuId);
          pagination.total = result.totalSize;
          this.setState({
            hasMenus: !!result.totalSize,
            data: result.menuVO,
            loading: false,
            pagination,
          });
          this.props.setMemus(!!result.totalSize);
        } else {
          message.error(result.resultMsg);
        }
      },
      error: (_, msg) => {
        message.error(msg);
      },
    });
  },
  refresh(type, delectCount) {
    const {current, pageSize, total} = this.state.pagination;
    if (type === 'remove'
      && current > 1
      && current === Math.ceil(total / pageSize)
      && total % pageSize === delectCount) {
      const paper = this.state.pagination;
      paper.current = paper.current - 1;
      this.setState({
        pagination: paper,
      });
    }
    setTimeout(() => {
      this.fetch();
      this.props.fetchShops();
    }, 500);
  },
  render() {
    const {hasMenus, data, loading, pagination, showModal} = this.state;
    let listContent;
    if (hasMenus) {
      listContent = (<div className="menu-list">
        <div className="tips"><Icon style={{marginRight: '3px', color: '#2db7f5'}} type="info-circle" />如果不想将外部导入的菜品在口碑店铺详情页上展示，可在菜品管理中将其删除。</div>
        <Table columns={this.columns}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={this.onTableChange} />
      </div>);
    } else {
      listContent = (<div className="no-menu-content">
        <div className="wrapper">
            <p>想要向顾客展示店里的菜单？麻烦按照以下步骤进行设置：</p>
            <div className="step1 disable">
              <div className="step-title"><Icon style={{color: '#00b7f4', fontSize: 24, position: 'absolute', top: 0, left: -34}} type="check-circle-o" />添加菜品</div>
              <div className="step-detail">先将菜品上传到"门店图片"，<br />便于后续统一管理</div>
            </div>
            <div className="step2">
              <div className="step-title"><div className="step-icon">2</div>新建菜单模板</div>
              <div className="step-detail">将"门店图片"中的菜品添加到菜单中，<br />顾客就可以在客户端的"<a onClick={this.showModal}>口碑推荐</a>"<br />中看到这些菜品</div>
              <Button style={{marginTop: 12}} type="primary" onClick={this.createMenu}>新建菜单模板</Button>
            </div>
          </div>
          {showModal ? <Modal title="帮助" footer={null} onCancel={this.hideModal} visible>
            <div style={{textAlign: 'center'}}>
              <img src="https://zos.alipayobjects.com/rmsportal/ZeIzLhKvzXkUAkS.jpg" width="478" height="366" />
            </div>
          </Modal> : null}
      </div>);
    }
    return listContent;
  },
});

export default MenuList;
