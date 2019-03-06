import React from 'react';
import {Alert, Steps, Button, Modal, message} from 'antd';
import './index.less';
import SingleTemplate from './vouchers/SingleTemplate';
import ajax from '../../../common/ajax';
const Step = Steps.Step;

const Index = React.createClass({
  getInitialState() {
    this.vouchersType = 'SINGLE';
    return {
      vouchersType: 'false',
      itemData: [],
      initData: {},
      vouchersList: 'true',
    };
  },

  componentWillMount() {
    this.getTemplateQuery();
  },

  getTemplateQuery(id) {
    ajax({
      method: 'get',
      url: window.APP.kbretailprod + '/gateway.htm?biz=supermarket.retailer&action=/template/query',
      data: {
        data: JSON.stringify({limit: 10}),
      },
      success: (res) => {
        if (res.success) {
          const data = res.templates;
          data.map((item, index) => {
            if (item.templateNo) {
              const bsnParamsList = JSON.parse(item.bsnParams);
              if (bsnParamsList.descList.indexOf(':-)') > 0) {
                bsnParamsList.descList = bsnParamsList.descList.split(':-)');
              } else {
                bsnParamsList.descList = [bsnParamsList.descList];
              }
              data[index].bsnParams = bsnParamsList;
              data[index].shopList = JSON.parse(item.shopList);
            }
          });

          const keys = localStorage.getItem('key');
          if (keys && res.templates.length > 0) {
            res.templates[keys].addClass = true;
            this.setState({
              vouchersType: 'true',
              initData: res.templates[keys],
            });
          }

          if (id) {
            let initList = {};
            res.templates.map((p) => {
              if (p.templateNo === id) {
                p.addClass = true;
                initList = p;
              } else {
                p.addClass = false;
              }
            });
            this.setState({
              vouchersType: 'true',
              itemData: res.templates,
              initData: initList,
            });
          } else {
            this.setState({
              itemData: res.templates,
            });
          }
        }
      },
    });
  },

  showTemplateModelOk() {
    const newList = this.state.itemData;
    newList.map((p) => {
      p.addClass = false;
    });
    this.setState({vouchersType: 'true', initData: {}, itemData: newList, vouchersList: false});

    localStorage.removeItem('key');
  },

  offVouchersType() {
    this.setState({
      vouchersType: 'false',
      vouchersList: 'true',
    });
  },
  deleteItem(index) {
    Modal.confirm({
      title: '确认删除模板？',
      content: ' ',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const {itemData} = this.state;
        const id = itemData[index].templateNo;
        delete itemData[index];
        const newList = [];
        itemData.map((item) => {
          newList.push(item);
        });
        this.setState({
          itemData: newList,
        });
        ajax({
          method: 'get',
          url: window.APP.kbretailprod + '/gateway.htm?biz=supermarket.retailer&action=/template/remove',
          data: {
            data: JSON.stringify({templateNos: [id]}),
          },
          success: (res) => {
            if (res.success) {
              message.success('模板删除成功！');
            }
          },
        });
      },
    });
  },
  openTemplate(index) {
    const newList = this.state.itemData;
    newList.map((p, i) => {
      if (i === index) {
        p.addClass = true;
      } else {
        p.addClass = false;
      }
    });
    this.setState({
      vouchersType: 'true',
      itemData: newList,
      initData: newList[index],
    });

    localStorage.setItem('key', index);
  },
  render() {
    const {itemData, vouchersList} = this.state;
    const steps = (<Steps status="wait">
    <Step title="创建模板" description="将需要发布的系列活动中，重复的活动规则创建成模板" />
    <Step title="使用模板" description="发布活动时，模板中的字段自动带出，不必再填写" />
    </Steps>);
    return (<div>
      <h2 className="kb-page-title">
        活动模板
      </h2>
      <div className="kb-detail-main">
        <div className="template-Steps">
          <Alert message="活动模板使用流程"
            description={steps}
            type="info"
            closable
            showIcon
          />
        </div>
      </div>
      { vouchersList && <div className="kb-template-list">
          <div className="kb-template-list-div" style={{width: Number(itemData && itemData.length) * 225 + 200}}>
            <div className="kb-template-list-item item-add" onClick={this.showTemplateModelOk}>
              <p><span style={{fontSize: 26}}>+</span><br/>创建模板</p>
            </div>
            {
              itemData.map((item, index) => {
                return (
                  item.templateName && <div className={item.addClass ? 'kb-template-list-item item-list-action' : 'kb-template-list-item item-list'}>
                    <div className="item-list-mask">
                      <i className="anticon anticon-delete" onClick={this.deleteItem.bind(this, index)} ></i>
                      <Button type="primary" onClick={this.openTemplate.bind(this, index)} >使用模版</Button>
                    </div>
                    <p style={{marginTop: 20}}>单品券-{item.bsnParams.itemDiscountType === 'MONEY' ? '代金券' : '折扣券'}</p>
                    <p>{item.templateName}</p>
                    <p>{item.gmtCreate} 创建</p>
                    {item.addClass && <div className="triangle-up"></div>}
                  </div>
                  );
              })
            }
          </div>
      </div>}

      <div className="kb-detail-main">
        {
          this.state.vouchersType === 'true' && <SingleTemplate renderType={this.offVouchersType} initData={this.state.initData} getList={this.getTemplateQuery} />
        }
      </div>
    </div>);
  },
});

export default Index;
