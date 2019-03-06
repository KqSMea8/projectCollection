import React, {PropTypes} from 'react';
import {Modal, Button} from 'antd';
import DishModal from './DishModal';
import DishPicViewer from './DishPicViewer';

const DishItem = React.createClass({
  propTypes: {
    checked: PropTypes.array,
  },
  getInitialState() {
    return {
      showDishModal: false,
      dishes: this.props.value || [],
      showViewModal: false,
      viewData: null,
      dishesModalVisible: false,
    };
  },
  onChange(dishes) {
    this.setState({
      dishes,
      showDishModal: false,
    });
    this.props.onChange(dishes);
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
  showDishModal() {
    this.hideMoreDishes();
    this.setState({
      showDishModal: true,
    });
  },
  closeDishModal() {
    this.setState({
      showDishModal: false,
    });
  },
  render() {
    const {dishes, showDishModal, dishesModalVisible} = this.state;
    const dishItems = [];
    let dishesList = [];
    if (!!dishes.length) {
      const dishesListRow = [];
      dishes.forEach((v, i) => {
        if (i < 9) {
          dishItems.push(<div className={'dishes' + (dishes.length > 9 && i === 8 ? ' last' : '')} key={v.dishId}>
            {i !== 0 ? <span>、</span> : null}
            <DishPicViewer dishId={v.dishId}>
              <a>{v.dishName}</a>
            </DishPicViewer>
            {dishes.length > 9 && i === 8 ? <span>...</span> : null}
          </div>);
        } else if (i === 9) {
          dishItems.push(<span key="more">
            <a className="more" onClick={this.showMoreDishes}>查看更多</a>
            <span className="division">｜</span>
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
    return (<div>
      {dishes.length
        ? <div className="item-wrap-break-word">
            {dishItems}
            <a className="modify" onClick={this.showDishModal}>修改</a>
          </div>
        : <a onClick={this.showDishModal}>选择菜品</a>}
      <DishModal onOk={this.onChange} targetKeys={dishes.map(v => v.dishId)} visible={showDishModal} onCancel={this.closeDishModal}/>
      <Modal title="菜品" visible={dishesModalVisible} footer={[
        <Button key="modify" size="large" onClick={this.showDishModal}>修改</Button>,
      ]} width="700" onCancel={this.hideMoreDishes}>
        <div className="menu-detail-dishes-list">
          <table>
            <tbody>{dishesList}</tbody>
          </table>
        </div>
      </Modal>
    </div>);
  },
});

export default DishItem;
