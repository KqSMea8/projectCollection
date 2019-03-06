import React from 'react';
import {Tabs, Row, Col, Button} from 'antd';
import fetch from '@alipay/kb-fetch';
import uniqueId from 'lodash/uniqueId';
import {Page} from '@alipay/kb-framework-components/lib/layout';
import {MyReportsFrame} from '@alipay/kb-framework-components/lib/frame';
import { selectProd } from '@alipay/kb-sign-deals';
import { hasSignPermisson } from '../../../../common/utils';

import TodoCards from './TodoCards';
import MerchantBasic from './MerchantBasic';

import './merchant.less';

const ShopAnalysisReportUrl = 'https://luopan.alipay.com/midoffice/index.htm#/data/midoffice_pc_shop_analysis';

const {TabPane} = Tabs;

class MerchantsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      infoData: {
        name: '加载中...',
        pid: '加载中...',
        mid: '加载中...',
        classificationKeyVal: null
      },
      todoData: {
        goodsNum: '',
        marketing: '',
        shopNum: '',
        taskCenter: '',
        toMarketing: '',
        visitRecord: ''
      },
      contactData: {
        contractList: [],
        contractNum: 0,
      },
      bdInfo: {
        bdCount: null,
        bdName: null, // Array
        staff: null, // Array [{staffName, userName, realName}]
        staffCount: null
      }
    };
    this.pid = props.params.pid;
  }

  componentDidMount() {
    this.getMerchantInfoVO();
    this.getMerchantContactVO();
    this.getMerchantTodoVO();
    this.getMerchantBdInfo();
  }

  getMerchantInfoVO() {
    fetch({
      url: 'kbsales.merchantSpiService.queryMerchantInfoByPid', // 头部信息
      param: {pid: this.pid}
    })
      .then((resp) => {
        this.setState({
          infoData: resp.data,
        });
      }).catch(() => {
        this.setState({
          infoData: {
            name: '加载失败',
            pid: '加载失败',
            mid: '加载失败',
            classificationKeyVal: null
          }
        });
      });
  }

  getMerchantContactVO() {
    fetch({
      url: 'kbsales.merchantSpiService.getMerchantContactVO',
      param: {pid: this.pid},
    })
      .then((resp) => {
        this.setState({
          contactData: resp.data,
        });
      });
  }

  getMerchantTodoVO() {
    fetch({
      url: 'kbsales.merchantSpiService.getMerchantTodoVO',
      param: {pid: this.pid}
    })
      .then((resp) => {
        this.setState({
          todoData: resp.data,
        });
      });
  }

  getMerchantBdInfo() {
    fetch({
      url: 'kbsales.merchantSpiService.queryMerchantBdInfo',
      param: {pid: this.pid}
    })
      .then((resp) => {
        this.setState({
          bdInfo: resp.data
        });
      });
  }

  pid = null;

  redirectToSummary = () => {
    window.open(`#/tka/merchant/summary-upload/${this.pid}`);
  };

  redirectToActivity = () => {
    window.open(`#/activity/marketingmanage?pid=${this.pid}`);
  };

  selectSignProd = () => {
    const { pid } = this.state.infoData;
    selectProd({
      pid,
      biz: 'tka-merchant-detail',
    }, '#sign-prod-modal').then(res => {
      if (!res) return;
      const { logonId, pname, kbSignCode } = res;
      window.open(`/p/contract-center/index.htm#/add?merchantPid=${pid}&merchantName=${pname}&kbSignCode=${kbSignCode}&contractAccount=${logonId}`);
    });
  }

  render() {
    const {infoData, todoData, contactData, bdInfo} = this.state;
    const breadcrumb = [
      {title: '商户管理', link: '#/tka/merchant/list'},
      {title: '商户详情'},
    ];
    const header = (
      <div style={{float: 'right'}}>
        {hasSignPermisson() && infoData.pid && <Button type="primary" onClick={this.selectSignProd}>签约</Button>}
        <Button type="primary" onClick={this.redirectToActivity} style={{marginLeft: 16}}>营销活动</Button>
        <Button type="primary" onClick={this.redirectToSummary} style={{marginLeft: 16}}>数据小结</Button>
      </div>
    );
    const todoCardItems = [
      {
        title: '待办事项',
        value: todoData.taskCenter,
        link: `#/task/todo?pid=${this.pid}`
      },
      {
        title: '商品(已上架开始)',
        value: todoData.goodsNum,
        link: `#/goods/list?pid=${this.pid}`
      },
      {
        title: '门店',
        value: todoData.shopNum,
        link: `${ShopAnalysisReportUrl}?pid=${this.pid}`
      }
    ];
    return (
      <Page breadcrumb={breadcrumb}>
        <div className="merchant-summary">
          <Row type="flex" align="middle">
            <Col span={8}>
              <div className="name">{infoData.name}</div>
              <div className="pid">{infoData.pid}</div>
              {infoData.classificationKeyVal && infoData.classificationKeyVal.length > 0 &&
              <div className="tags">
                <span className="title">商户标签</span>
                {infoData.classificationKeyVal.map(t => <span className="tag" key={uniqueId()}><span className="text">{t}</span></span>)}
              </div>}
            </Col>
            <Col span={16}>
                {header}
            </Col>
          </Row>
          <TodoCards items={todoCardItems}/>
        </div>
        <Tabs defaultActiveKey="kpi">
          <TabPane tab="商户业绩" key="kpi">
            <MyReportsFrame pageUri="ka_pid_detail" params={{partnerId: this.pid}}/>
          </TabPane>
          <TabPane tab="详细数据" key="details">
            <MyReportsFrame pageUri="pageUri1515556923711" params={{partnerId: this.pid}}/>
          </TabPane>
          <TabPane tab="基本信息" key="basic">
            <MerchantBasic {...{infoData, contactData, bdInfo}}/>
          </TabPane>
        </Tabs>
        <div id="sign-prod-modal" />
      </Page>
    );
  }
}

export default MerchantsDetail;
