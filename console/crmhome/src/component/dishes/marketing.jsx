import React from 'react';
import ajax from '../../common/ajax';
import './dishes.less';
import AutoFrame from './AutoFrame';
import {Button, message} from 'antd';

/* 菜品营销-未订购 */

const dishMarketing = React.createClass({

  getInitialState() {
    return {
      commodityList: [],
      successExamples: [],
      status: '',
      vistorUrl: '',
    };
  },

  componentDidMount() {
    ajax({
      url: '/dish/scanDish.json',
      method: 'get',
      data: {
        commodityId: this.props.params.id,
        requestTarget: 'dishMarketing',
      },
      type: 'json',
      success: (res) => {
        if (res.isSuccess === false) {
          message.error(res.message);
        }
        this.setState({
          commodityList: res.commodityList,
          status: res.status,
          vistorUrl: res.vistorUrl,
        });
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
      });
    }
  },

  statusNo() {
    const {commodityList, successExamples} = this.state;
    let service;
    let Successful;
    if (commodityList) {
      service = commodityList.map((item, i) => {
        return (
          <div className="service-show" onMouseEnter={() => this.mouseEnter(i)} key={i}>
            <div>
              <img src={item.logoUrl}/>
            </div>
            <div className="service-content">
              <p>{item.title}</p>
              <p>{item.subtitle}</p>
              <p>服务售价：<span className="services-prix">{item.priceDesc}</span></p>
              <p>已为{item.orderCount}家商户提供服务</p>
            </div>
            <div>
              <Button type="primary" className="button-left" onClick={()=>this.handClick(item.url)}>
                立即订购
              </Button>
            </div>
          </div>
        );
      });
    }

    if (successExamples.length > 0) {
      Successful = successExamples.map((item, i) => {
        return (
          <li className="clearfix" key={i}>
            <div className="img">
              <img src={item.pic}/>
            </div>
            <div className="left-text">
              <p>{item.shopName}</p>
              <span id="describe">{item.desc}</span>
            </div>
          </li>
        );
      });
    } else if (commodityList.length > 0) {
      Successful = commodityList[0].successExample.map((item, i) => {
        return (
          <li className="clearfix" key={i}>
            <div className="img">
              <img src={item.pic} alt=""/>
            </div>
            <div className="left-text">
              <p>{item.shopName}</p>
              <span id="describe">{item.desc}</span>
            </div>
          </li>
        );
      });
    }
    return (
      <div className="marketing">
        {/* title */}
        <div className="content-title">
          <p>菜品经营</p>
        </div>

        <div className="item1">
          <p>
            <span>单品精准营销</span>
            <span>订购专属服务，监测更多营销数据</span>
          </p>
        </div>
        <div className="content-subjet">
          <div className="content-subjet-img clearfix">
            <div>
              <img src="https://zos.alipayobjects.com/rmsportal/STDHRorScXuiJYceyVsD.png"/>
              <div>
                <span>菜品营销，低成本</span>
                <br/>
                <span>无需全场折扣，单品营销成本低</span>
              </div>
            </div>
            <div>
              <img src="https://zos.alipayobjects.com/rmsportal/tpRpxtAxpBObMuUCsXku.png"/>
              <div>
                <span>打爆款推新品</span>
                <br/>
                <span>热销菜品或新品优惠，吸引顾客到店</span>
              </div>
            </div>
            <div className="last-div">
              <img src="https://zos.alipayobjects.com/rmsportal/hUFOSOgkUxBcErqGxaJU.png"/>
              <div>
                <span>提升笔单价</span>
                <br/>
                <span>高毛利菜做营销，轻松提升顾客消费额</span>
              </div>
            </div>
          </div>
        </div>
        <div className="item2">
          <p>
            <span>触手可得的优质营销服务</span>
            <span>以下服务由服务商系统提供</span>
          </p>
        </div>
        {/* 点菜服务 */}
        <div className="service clearfix">
          {service}
        </div>
        {/* 成功案例 */}
        <div className="Successful">
          <div className="Successful-text">
            <span>成功案例</span>
          </div>
          <ul>
            {Successful}
          </ul>
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

export default dishMarketing;
