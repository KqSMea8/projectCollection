import React from 'react';
import { Button } from 'antd';
import ajax from '../../../common/ajax';
import { saveJumpTo } from '../../../common/utils';

export default class CreateBtn extends React.Component {
  state = {
    showCreateBtn: false,
  };

  componentDidMount() {
    ajax({
      url: '/goods/catering/checkCreateItemBtn.json',
      success: res => {
        this.setState({
          showCreateBtn: res.createItemBtnSwitch === 'ON',
        });
      },
      err: () => { },
    });
  }

  gotoCreate = () => {
    saveJumpTo('#/catering/new');
  }

  render() {
    return this.state.showCreateBtn ? <Button onClick={this.gotoCreate} type="primary">新建商品</Button> : null;
  }
}
