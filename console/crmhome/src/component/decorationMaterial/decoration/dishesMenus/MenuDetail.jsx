import React, {PropTypes} from 'react';
import {message, Button, Breadcrumb, Spin, Form, Modal, Icon, Popover} from 'antd';
import ajax from '../../../../common/ajax';
import DishPicViewer from '../../common/DishPicViewer';
import ShopTreeView from '../../common/ShopTreeView';
import {getMerchantId, getCategoryId} from '../../common/utils';

const FormItem = Form.Item;

const MenuDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },
  getInitialState() {
    window.parent.postMessage({'showPidSelect': false}, '*');
    this.merchantId = getMerchantId();
    return {
      loading: true,
      data: [],
      dishesModalVisible: false,
    };
  },
  componentDidMount() {
    this.fetch();
  },
  fetch() {
    const {menuId} = this.props.params;
    this.setState({
      loading: true,
    });
    const params = {
      menuId,
    };
    if (this.merchantId) params.op_merchant_id = this.merchantId;
    ajax({
      url: '/shop/kbmenu/detailQuery.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'success') {
          this.setState({
            data: result.menuDetailVO,
            loading: false,
          });
        } else {
          message.error(result.resultMsg);
        }
      },
      error: (_, msg) => {
        message.error(msg);
      },
    });
  },
  goEdit() {
    const {menuId} = this.props.params;
    window.location.hash = '/decoration/' + getCategoryId() + '/menu/menu-edit/' + menuId;
  },
  showMoreDishes() {
    this.setState({
      dishesModalVisible: true,
    });
  },
  hideMoreDishes() {
    this.setState({
      dishesModalVisible: false,
    });
  },
  goToBread(url) {
    window.location.hash = url;
  },
  render() {
    const {loading, data, dishesModalVisible} = this.state;
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 16},
    };
    const dishes = [];
    let dishesList = [];
    if (!!data.dishCount) {
      const dishesListRow = [];
      data.menuDishRelation.forEach((v, i) => {
        if (i < 9) {
          dishes.push(<span className={data.menuDishRelation.length > 9 && i === 8 ? 'last' : ''} key={v.dishId}>
            {i !== 0 ? <span>、</span> : null}
            <DishPicViewer dishId={v.dishId}>
              <a>{v.dishName}</a>
            </DishPicViewer>
          </span>);
        } else if (i === 9) {
          dishes.push(<span key="more">
            <a onClick={this.showMoreDishes}>查看更多</a>
          </span>);
        }
        if (!dishesListRow[parseInt(i / 6, 10)]) {
          dishesListRow[parseInt(i / 6, 10)] = [];
        }
        dishesListRow[parseInt(i / 6, 10)].push(<td key={v.dishId}>
          <DishPicViewer dishId={v.dishId}>
            <a>{v.dishName}</a>
          </DishPicViewer>
        </td>);
      });
      dishesList = dishesListRow.map((v, i) => <tr key={i}>{v}</tr>);
    }
    const popoverContent = (<span>
      <Icon style={{marginRight: '3px', color: '#2db7f5'}} type="info-circle" />
      菜单正在处理中，不能修改，请耐心等待。
    </span>);
    const button = data.status === 'EFFECT'
    ? <Button style={{position: 'absolute', top: 16, right: 16, zIndex: 1}} size="large" onClick={this.goEdit}>修改</Button>
    : <Popover visible placement="bottomRight" content={popoverContent} overLay={popoverContent}>
      <Button disabled style={{position: 'absolute', top: 16, right: 16, zIndex: 1}} size="large" onClick={this.goEdit}>修改</Button>
    </Popover>;
    return (<div className="menu-detail">
      <div className="app-detail-header">
        <Breadcrumb separator=">">
          <Breadcrumb.Item onClick={() => {this.goToBread('#/decoration/' + getCategoryId() + '/menu');}} href={null}>菜品管理</Breadcrumb.Item>
          <Breadcrumb.Item onClick={() => {this.goToBread('#/decoration/' + getCategoryId() + '/menu/menu');}} href={null}>菜单管理</Breadcrumb.Item>
          <Breadcrumb.Item>查看</Breadcrumb.Item>
        </Breadcrumb>
        {loading ? null : button}
      </div>
      <div className="app-detail-content-padding">
        {loading ? <Spin /> : <div className="menu-detail-form">
          <Form horizontal>
            <FormItem {...formItemLayout} label="菜单名称">
              <p>{data.title}</p>
            </FormItem>
            <FormItem {...formItemLayout} label="菜品数量">
              <p>{data.dishCount}</p>
            </FormItem>
            <FormItem {...formItemLayout} label="菜品">
              <div className="dishes item-wrap-break-word">{dishes}</div>
            </FormItem>
            <FormItem {...formItemLayout} label="适用门店">
              <div className="item-wrap-break-word">
                <ShopTreeView menuId={this.props.params.menuId} />
              </div>
            </FormItem>
          </Form>
        </div>}
      </div>
      <Modal title="菜品" visible={dishesModalVisible} footer="" width="700" onCancel={this.hideMoreDishes}>
        <div className="menu-detail-dishes-list">
          <table>
            <tbody>{dishesList}</tbody>
          </table>
        </div>
      </Modal>
    </div>);
  },
});

export default MenuDetail;
