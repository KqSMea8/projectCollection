import React from 'react';
import Dishes from './Dishes';

const DishesMenus = React.createClass({ // 去掉目录
  getInitialState() {
    return {
      button: null,
    };
  },
  setButton(button) {
    this.setState({
      button: button,
    });
  },
  render() {
    return (<div style={{padding: '0 16px 32px'}}>
      {this.state.button}
      <Dishes setButton={this.setButton} />
    </div>);
  },
});

export default DishesMenus;
