import React from 'react';
import ajax from '../../../common/ajax';
import {Button, message, Checkbox} from 'antd';

const DataConfirm = React.createClass({
  getInitialState() {
    return {
      value: false,
    };
  },

  onCheckboxChange(e) {
    this.setState({ value: e.target.checked });
  },

  confirm() {
    ajax({
      url: window.APP.kbretailprod + '/gateway.htm?biz=mall.dataauth&action=/dataauth/confirm',
      type: 'json',
      data: {
        data: JSON.stringify({'authApplyId': this.props.params.id, 'shopId': this.props.params.shopId}),
      },
      success: (data) => {
        if (data.success) {
          message.success('确认成功');
          setTimeout(() => {
            window.location.href = '/main.htm#/mall';
          }, 3000);
        } else {
          if (data.errorMsg) {
            message.error(data.errorMsg || '确认失败', 3);
          }
        }
      },
      error: (result) => {
        if (result.errorMsg) {
          message.error(result.errorMsg, 3);
        }
      },
    });
  },

  render() {
    let typeHtml = <iframe src={'https://render.alipay.com/p/f/confirmShopOne/index.html'} width="720" height="450" scrolling="no" style={{border: 'none', margin: '20px auto'}}/>;
    if (this.props.params.type === '口碑活动数据') {
      typeHtml = <iframe src={'https://render.alipay.com/p/f/confirmShop/index.html'} width="720" height="450" scrolling="no" style={{border: 'none', margin: '20px auto'}}/>;
    }
    return (<div>
      <div className="app-detail-header">
        {this.props.params.type}
      </div>
      <div style={{marginLeft: 20, textAlign: 'center'}}>
        {typeHtml}
        <Checkbox onChange={this.onCheckboxChange} style={{marginRight: 50}}>同意</Checkbox>
        <Button type="primary" onClick={this.confirm} disabled={this.state.value ? false : true}>确认参加</Button>
      </div>
    </div>);
  },
});

export default DataConfirm;
