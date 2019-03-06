import React from 'react';
import ajax from '../../common/ajax';
import './dishes.less';
import AutoFrame from './AutoFrame';
import {Button, message} from 'antd';
/* 未订购 扫码点菜 */

const qrOrder = React.createClass({
  getInitialState() {
    return {
      commodityList: [],
      successExamples: [],
      status: '',
      vistorUrl: '',
      useDesc: '',
    };
  },

  componentDidMount() {
    ajax({
      url: '/dish/scanDish.json',
      method: 'get',
      data: {
        commodityId: this.props.params.id,
        requestTarget: 'qrOrder',
      },
      type: 'json',
      success: (res) => {
        if (res.isSuccess === false) {
          message.error(res.message);
        }
        if (res && res.status === 'yes') {
          this.setState({
            vistorUrl: res.vistorUrl,
          });
        }
        if (res && res.status === 'no') {
          this.setState({
            commodityList: res.commodityList,
            status: res.status,
            vistorUrl: res.vistorUrl,
            useDesc: res.commodityList[0].useDesc,
          });
        }
      },
    });
  },

  handClick(url) {
    window.open(url, '_self');
  },

  mouseEnter(i) {
    const {commodityList} = this.state;
    if (commodityList) {
      this.setState({
        successExamples: commodityList[i].successExample,
        useDesc: commodityList[i].useDesc,
      });
    }
  },

  statusNo() {
    const {commodityList, successExamples} = this.state;
    let Sweep;
    let Successful;
    if (commodityList.length > 0) {
      Sweep = commodityList.map((item, i) => {
        return (
          <div key={i} onMouseEnter={() => this.mouseEnter(i)}>
            <div>
              <img src={item.logoUrl} alt=""/>
            </div>
            <div>
              <p title={item.title}>{item.title}</p>
              <p title={item.subtitle}>{item.subtitle}</p>
              <p><span>服务售价：</span><span>{item.priceDesc}</span></p>
            </div>
            <div>
              <Button type="primary" className="button-left" onClick={() => this.handClick(item.url)}>立即订购</Button>
            </div>
          </div>
        );
      });
    }
    if (successExamples.length > 0) {
      Successful = successExamples.map((item, i) => {
        return (
          <li className="clearfix" key={i}>
            <img src={item.pic}/>
            <div><span>{item.desc}</span></div>
          </li>
        );
      });
    } else if (commodityList.length > 0) {
      Successful = commodityList[0].successExample.map((item, i) => {
        return (
          <li className="clearfix" key={i}>
            <img src={item.pic}/>
            <div><span>{item.desc}</span></div>
          </li>
        );
      });
    }

    return (
      <div className="qr-order">
        <div className="content-title">
          <p>扫码点菜</p>
        </div>
        <div className="content-subjet">

          <div className="_title">
            <span>扫码点菜&nbsp;&nbsp;提升服务效率</span>
            <span>订购专属服务，监测更多菜品数据</span>
          </div>

          {/* 推荐菜品 */}
          <div className="content-subjet-img clearfix">
            <div>
              <img src="https://zos.alipayobjects.com/rmsportal/JUVnoYEZlXUcvwvjZcay.jpg"/>
              <div>
                <span>推荐菜品，精准营销</span>
                <br/>
                <span>投其所好，比服务员更懂顾客!</span>
              </div>
            </div>
            <div>
              <img src="https://zos.alipayobjects.com/rmsportal/HklJrPJpKgIGOLvAXvgT.jpg"/>
              <div>
                <span>释放人力，节省开支</span>
                <br/>
                <span>少请几名服务员，把钱花在刀刃上 </span>
              </div>
            </div>
            <div className="last-div">
              <img src="https://zos.alipayobjects.com/rmsportal/aYqqsTDNNptUPhYEAmCu.jpg"/>
              <div>
                <span>自主点菜，快捷轻松</span>
                <br/>
                <span>顾客点菜、加菜、买单一条龙搞定</span>
              </div>
            </div>
          </div>
          {/* 第三方 */}
          <div className="_title">
            <span>触手可得的优质服务 </span>
            <span>以下服务由服务商提供</span>
          </div>
          {/* 扫码点菜 */}
          <div className="Sweep clearfix">
            {Sweep}
          </div>
          {/* 成功案例 */}
          <div className="Successful">
            <div className="Successful-text">
              <span>成功案例 {this.state.useDesc} </span>
            </div>
            <ul>
              {Successful}
            </ul>
          </div>
        </div>
      </div>
    );
  },

  statusYes() {
    return (
      <AutoFrame target={this.state.vistorUrl}/>
    );
  },


  render() {
    return (
      this.state.status === 'no' ? this.statusNo() : this.statusYes()
    );
  },
});


export default qrOrder;
