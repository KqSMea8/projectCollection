/**
 * 商品活动详情
 */
import React from 'react';
import { Breadcrumb, Button, Spin, Icon, message, Modal, Alert} from 'antd';
import {customLocation} from '../../../common/utils';
import { differenceBy } from 'lodash';
import { DetailTable } from 'hermes-react';
import moment from 'moment';
import ajax from '../../../common/ajax';
import './style.less';

const confirm = Modal.confirm;
// 被中台嵌入时重写 message
if (window.top !== window) {
  ['error', 'warn', 'success'].forEach(f => {
    message[f] = function iframeMessage(text) {
      window.parent.postMessage(JSON.stringify({ action: f, message: text }), '*');
    };
  });
}

function isEqualIgnoreOrder(a, b, keyName) {
  return differenceBy(a, b, keyName).length <= 0 && differenceBy(b, a, keyName).length <= 0;
}

class GoodsActivityDetail extends React.Component {
  state = {
    loading: false,
    data: [],
    currentActivity: {}, // 当前数据
    editInfo: {}, // 修改前数据
    enterData: [],
    allowConfirm: false,
    allowModifyConfirm: false,
    allowModify: false,
    allowOffline: false,
  }

  componentDidMount() {
    this.applyId = '';
    if (this.props.params.sceneType === 'edit') {
      this.applyId = this.props.params.id;
    }
    this.getDetail();
  }

  // 获取详情
  getDetail() {
    this.setState({
      loading: true,
    });
    let urlPath = '';
    let params = {};

    if (!this.props.params.sceneType || this.props.params.sceneType === 'create' || this.props.params.sceneType === 'hidebtn') {
      urlPath = '/merchantactivity/online/getActivityDetail.json';
      params = {activityId: this.props.params.id};
    } else if (this.props.params.sceneType === 'edit') {
      urlPath = '/merchantactivity/online/queryAgentEditActivityApplyInfo.json';
      params = {applyId: this.applyId};
    }

    // 运营中台查看详情的时候需要传入该参数，接口会忽略权限校验
    if (this.props.params.sceneType === 'hidebtn') {
      params.hideOperateButton = true;
    }

    ajax({
      url: window.APP.kbservindustryprodUrl + urlPath,
      method: 'get',
      data: {...params},
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed' && res.data) {
          const {currentActivity, editInfo, allowConfirm, allowModifyConfirm, allowModify, allowOffline} = res.data;

          // 对于后端来说   currentActivity   editInfo
          //   未修改          详情              X
          // 已修改待确认       源数据          修改后数据
          // 对前端来说：       主数据          修改前数据（弹层展示）
          // 如果存在editInfo，则代表是修改待确认。
          if (editInfo) {
            this.applyId = editInfo.applyId;
          }

          this.setState({
            currentActivity: editInfo ? editInfo : currentActivity,
            editInfo: editInfo ? currentActivity : null,
            allowConfirm,
            allowModifyConfirm,
            allowModify,
            allowOffline,
            loading: false,
          });
        } else {
          message.error(res.resultMsg || '系统错误', 2);
        }
      },
      error: (res) => {
        message.error(res.resultMsg || '查询商品信息失败', 2);
      },
    });
  }

  gotoGoodsDetailPage(itemId) {
    window.open(`#/catering/detail?itemId=${itemId}`);
  }

  originally(text) {
    confirm({
      iconType: 'info-circle',
      title: '修改前的内容',
      content: text,
      onOk() {
        console.log('确定');
      },
    });
  }
  // 下架
  close = ()=> {
    // this.props.params.id
    ajax({
      url: window.APP.kbservindustryprodUrl + `/merchantactivity/online/closeActivity.json`,
      method: 'post',
      data: {activityId: this.props.params.id.toString()},
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          message.success('操作成功', 1.5);
          setTimeout(()=>{
            customLocation('/goods/itempromo/activityList.htm');
          }, 1500);
        } else {
          message.error(res.resultMsg || '系统错误', 2);
        }
      },
      error: (res) => {
        message.error(res.resultMsg || '系统错误', 2);
      },
    });
  }

  // 跳转修改页面
  modify = ()=> {
    location.href = `#/marketing-activity/goods/edit/${this.props.params.id}`;
  }

  // 确认修改
  changeToConfirm = ()=> {
    ajax({
      url: window.APP.kbservindustryprodUrl + `/merchantactivity/online/passAgentEditActivity.json`,
      method: 'post',
      data: {applyId: this.applyId},
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          message.success('操作成功', 1.5);
          setTimeout(()=>{
            customLocation('/goods/itempromo/activityList.htm');
          }, 1500);
        } else {
          message.error(res.resultMsg || '系统错误', 2);
        }
      },
      error: (res) => {
        message.error(res.resultMsg || '系统错误', 2);
      },
    });
  }

  // 暂不修改
  dontChange = ()=> {
    ajax({
      url: window.APP.kbservindustryprodUrl + `/merchantactivity/online/rejectAgentEditActivity.json`,
      method: 'post',
      data: {applyId: this.applyId},
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          message.success('操作成功', 1.5);
          setTimeout(()=>{
            customLocation('/goods/itempromo/activityList.htm');
          }, 1500);
        } else {
          message.error(res.resultMsg || '系统错误', 2);
        }
      },
      error: (res) => {
        message.error(res.resultMsg || '系统错误', 2);
      },
    });
  }

  // 同意上架
  agreedOnline = ()=> {
    ajax({
      url: window.APP.kbservindustryprodUrl + `/merchantactivity/online/passAgentCreateActivity.json`,
      method: 'post',
      data: {activityId: this.props.params.id.toString()},
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          message.success('操作成功', 1.5);
          setTimeout(()=>{
            customLocation('/goods/itempromo/activityList.htm');
          }, 1500);
        } else {
          message.error(res.resultMsg || '系统错误', 2);
        }
      },
      error: (res) => {
        message.error(res.resultMsg || '系统错误', 2);
      },
    });
  }

  // 退回修改
  refusedOnline = ()=> {
    ajax({
      url: window.APP.kbservindustryprodUrl + `/merchantactivity/online/rejectAgentCreateActivity.json`,
      method: 'post',
      data: {activityId: this.props.params.id.toString()},
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          message.success('操作成功', 1.5);
          setTimeout(()=>{
            customLocation('/goods/itempromo/activityList.htm');
          }, 1500);
        } else {
          message.error(res.resultMsg || '系统错误', 2);
        }
      },
      error: (res) => {
        message.error(res.resultMsg || '系统错误', 2);
      },
    });
  }

  /*eslint-disable */
  render() {
    /*eslint-enable */
    const { currentActivity, editInfo, allowOffline, allowModify, allowConfirm, allowModifyConfirm, loading } = this.state;
    const {
      name, gmtStart, gmtEnd, crowd, items = [], countLimit, deductAmount, autoRenewal, memo,
    } = currentActivity;

    const hideBtn = this.props.params.sceneType === 'hidebtn';
    const modifiedView = !!editInfo; // 存在修改前数据，则要展示修改数据对比视图

    // <div className="edit">{name}<Icon type="edit" onClick={()=>{this.originally('xxx');}} /></div>
    const dataSource1 = [
      {
        label: '活动名称',
        value: (
          <div>
            {
              modifiedView && (name !== editInfo.name) ? (
                <div className="edit">
                  <div>{name}</div>
                  <a style={{ float: 'right' }} onClick={() => Modal.info({
                    title: '修改前的内容',
                    content: <div>{editInfo.name}</div>,
                  })}>
                    <img src="https://gw.alipayobjects.com/zos/rmsportal/BmsJkCOaeGqlabXYZyRl.jpg" />
                  </a>
                </div>
              ) : (
                <div className="info">{name}</div>
              )
            }
          </div>
        ),
        colSpan: 2,
      }, {
        label: '活动时间',
        value: (
          <div>
            {
              modifiedView && (gmtStart !== editInfo.gmtStart || gmtEnd !== editInfo.gmtEnd) ? (
                <div className="edit">
                  <div>{moment(gmtStart).format('YYYY-MM-DD HH:mm:ss')} ～ {moment(gmtEnd).format('YYYY-MM-DD HH:mm:ss')}</div>
                  <a style={{ float: 'right' }} onClick={() => Modal.info({
                    title: '修改前的内容',
                    content: <div>{moment(editInfo.gmtStart).format('YYYY-MM-DD HH:mm:ss')} ～ {moment(editInfo.gmtEnd).format('YYYY-MM-DD HH:mm:ss')}</div>,
                  })}>
                    <img src="https://gw.alipayobjects.com/zos/rmsportal/BmsJkCOaeGqlabXYZyRl.jpg" />
                  </a>
                </div>
              ) : (
                <div className="info">{moment(gmtStart).format('YYYY-MM-DD HH:mm:ss')} ～ {moment(gmtEnd).format('YYYY-MM-DD HH:mm:ss')}</div>
              )
            }
          </div>
        ),
        colSpan: 2,
      }, {
        label: '立减金额',
        value: (
          <div>
            {
              modifiedView && (deductAmount !== editInfo.deductAmount) ? (
                <div className="edit">
                  <div>{deductAmount}</div>
                  <a style={{ float: 'right' }} onClick={() => Modal.info({
                    title: '修改前的内容',
                    content: <div>{editInfo.deductAmount}</div>,
                  })}>
                    <img src="https://gw.alipayobjects.com/zos/rmsportal/BmsJkCOaeGqlabXYZyRl.jpg" />
                  </a>
                </div>
              ) : (
                <div className="info">{deductAmount}</div>
              )
            }
          </div>
        ),
        colSpan: 2,
      },
    ];
    const dataSource2 = [
      {
        label: '总份数',
        value: (
          <div>
            {
              modifiedView && editInfo.countLimit && (countLimit.total !== editInfo.countLimit.total) ? (
                <div className="edit">
                  <div>{countLimit && (countLimit.total === 0 ? '不限制' : countLimit.total)}</div>
                  <a style={{ float: 'right' }} onClick={() => Modal.info({
                    title: '修改前的内容',
                    content: <div>{editInfo.countLimit && (editInfo.countLimit.total === 0 ? '不限制' : editInfo.countLimit.total)}</div>,
                  })}>
                    <img src="https://gw.alipayobjects.com/zos/rmsportal/BmsJkCOaeGqlabXYZyRl.jpg" />
                  </a>
                </div>
              ) : (
                <div className="info">{countLimit && (countLimit.total === 0 ? '不限制' : countLimit.total)}</div>
              )
            }
          </div>
        ),
        colSpan: 2,
      }, {
        label: '每日发放份数',
        value: (
          <div>
            {
              modifiedView && editInfo.countLimit && (countLimit.perDay !== editInfo.countLimit.perDay) ? (
                <div className="edit">
                  <div>{countLimit && (countLimit.perDay === 0 ? '不限制' : countLimit.perDay)}</div>
                  <a style={{ float: 'right' }} onClick={() => Modal.info({
                    title: '修改前的内容',
                    content: <div>{editInfo.countLimit && (editInfo.countLimit.perDay === 0 ? '不限制' : editInfo.countLimit.perDay)}</div>,
                  })}>
                    <img src="https://gw.alipayobjects.com/zos/rmsportal/BmsJkCOaeGqlabXYZyRl.jpg" />
                  </a>
                </div>
              ) : (
                <div className="info">{countLimit && (countLimit.perDay === 0 ? '不限制' : countLimit.perDay)}</div>
              )
            }
          </div>
        ),
        colSpan: 2,
      }, {
        label: '活动人群',
        value: (
          <div>
            {
              modifiedView && (crowd !== editInfo.crowd) ? (
                <div className="edit">
                  <div>
                    {crowd === 'ONLINE_NEWCOMER' && '线上新客用户'}
                    {crowd === 'DEFAULT' && '全部用户'}
                  </div>
                  <a style={{ float: 'right' }} onClick={() => Modal.info({
                    title: '修改前的内容',
                    content: <div>{editInfo.crowd === 'ONLINE_NEWCOMER' && '线上新客用户'}{editInfo.crowd === 'DEFAULT' && '全部用户'}</div>,
                  })}>
                    <img src="https://gw.alipayobjects.com/zos/rmsportal/BmsJkCOaeGqlabXYZyRl.jpg" />
                  </a>
                </div>
              ) : (
                <div className="info">
                  {crowd === 'ONLINE_NEWCOMER' && '线上新客用户'}
                  {crowd === 'DEFAULT' && '全部用户'}
                </div>
              )
            }
          </div>
        ),
        colSpan: 2,
      }, {
        label: '自动续期',
        value: (
          <div>
            {
              modifiedView && (autoRenewal !== editInfo.autoRenewal) ? (
                <div className="edit">
                  <div>{autoRenewal ? '自动延长上架时间' : '否'}</div>
                  <a style={{ float: 'right' }} onClick={() => Modal.info({
                    title: '修改前的内容',
                    content: <div>{editInfo.autoRenewal ? '自动延长上架时间' : '否'}</div>,
                  })}>
                    <img src="https://gw.alipayobjects.com/zos/rmsportal/BmsJkCOaeGqlabXYZyRl.jpg" />
                  </a>
                </div>
              ) : (
                <div className="info">{autoRenewal ? '自动延长上架时间' : '否'}</div>
              )
            }
          </div>
        ),
        colSpan: 2,
      },
    ];
    const dataSource3 = [
      {
        label: '单用户活动期间可享优惠份数',
        value: (
          <div>
            {
              modifiedView && editInfo.countLimit && (countLimit.perUser !== editInfo.countLimit.perUser) ? (
                <div className="edit">
                  <div>{countLimit && (countLimit.perUser === 0 ? '不限制' : countLimit.perUser)}</div>
                  <a style={{ float: 'right' }} onClick={() => Modal.info({
                    title: '修改前的内容',
                    content: <div>{editInfo.countLimit && (editInfo.countLimit.perUser === 0 ? '不限制' : editInfo.countLimit.perUser)}</div>,
                  })}>
                    <img src="https://gw.alipayobjects.com/zos/rmsportal/BmsJkCOaeGqlabXYZyRl.jpg" />
                  </a>
                </div>
              ) : (
                <div className="info">{countLimit && (countLimit.perUser === 0 ? '不限制' : countLimit.perUser)}</div>
              )
            }
          </div>
        ),
        colSpan: 1,
      }, {
        label: '单用户每天可享优惠份数',
        value: (
          <div>
            {
              modifiedView && editInfo.countLimit && (countLimit.perUserPerDay !== editInfo.countLimit.perUserPerDay) ? (
                <div className="edit">
                  <div>{countLimit && (countLimit.perUserPerDay === 0 ? '不限制' : countLimit.perUserPerDay)}</div>
                  <a style={{ float: 'right' }} onClick={() => Modal.info({
                    title: '修改前的内容',
                    content: <div>{editInfo.countLimit && (editInfo.countLimit.perUserPerDay === 0 ? '不限制' : editInfo.countLimit.perUserPerDay)}</div>,
                  })}>
                    <img src="https://gw.alipayobjects.com/zos/rmsportal/BmsJkCOaeGqlabXYZyRl.jpg" />
                  </a>
                </div>
              ) : (
                <div className="info">{countLimit && (countLimit.perUserPerDay === 0 ? '不限制' : countLimit.perUserPerDay)}</div>
              )
            }
          </div>
        ),
        colSpan: 1,
      }, {
        label: '备注',
        value: <div className="info">{memo}</div>,
        colSpan: 3,
      },
    ];
    return (
      <div className="kb-groups-view">
        <div className="app-detail-header">
          <div className="buttous">
            {
              (allowModify && !hideBtn) && <Button onClick={this.modify}>修改</Button>
            }
            {
              (allowOffline && !hideBtn) && <Button type="primary" onClick={this.close}>下架</Button>
            }
          </div>
          <Breadcrumb separator=">">
            <Breadcrumb.Item>管理</Breadcrumb.Item>
            <Breadcrumb.Item>查看营销活动</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Spin spinning={loading}>
          <div className="app-detail-content-padding">
            {
              allowConfirm && <Alert message="上海口碑服务商有限公司提醒你，创建了以下营销活动，请仔细核对后确认上架。" type="info" showIcon />
            }
            {
              allowModifyConfirm && <Alert message="上海口碑服务商有限公司提醒你，创建了以下营销活动，请仔细核对后确认上架。" type="info" showIcon />
            }
            <div className="header">
              <h3>
                {name || '' }
              </h3>
              <p className="time">
                活动时间：{moment(gmtStart).format('YYYY-MM-DD HH:mm:ss')} ～ {moment(gmtEnd).format('YYYY-MM-DD HH:mm:ss')}
              </p>
              <p className="person">
                活动人群：
                {crowd === 'ONLINE_NEWCOMER' && '线上新客用户'}
                {crowd === 'DEFAULT' && '全部用户'}
              </p>
            </div>
            <div className="title">
              参与活动的商品
            </div>
            {
              (modifiedView && editInfo && !isEqualIgnoreOrder(items, editInfo.items, 'itemId')) && (
                <div className="goodsEdit">
                  参与活动的商品有新增或减少，请仔细确认。
                  <a style={{ float: 'right' }} onClick={() => Modal.info({
                    title: '修改前的内容',
                    content: <div>{editInfo.items.map(i => <p>{i.itemName}</p>)}</div>,
                  })}>
                    <img src="https://gw.alipayobjects.com/zos/rmsportal/BmsJkCOaeGqlabXYZyRl.jpg" style={{width: '25px', marginTop: '6px'}} />
                  </a>
                </div>
              )
            }
            <div className="addgoods">
              {
                items.map(item=>{
                  return (
                    <div className="goods" key={item.itemId}>
                      <div className="img">
                        <img src={item.imageUrl} />
                      </div>
                      <p>
                        {item.itemName}
                      </p>
                      <div className="text">
                        原价：{item.originalPrice}<br />
                        现价：{item.price}<br />
                        库存：{item.inventory}
                      </div>
                      <div className="operation">
                        <Icon type="eye-o" onClick={()=>{this.gotoGoodsDetailPage(item.itemId);}}>
                          查看
                        </Icon>
                      </div>
                    </div>
                  );
                })
              }
            </div>
            <div className="title">
              活动信息
            </div>
            <DetailTable
              dataSource={dataSource1}
              valueCellClassName="valueTd"
              columnCount={6}
            />
            <br />
            <DetailTable
              dataSource={dataSource2}
              columnCount={6}
            />
            <br />
            <DetailTable
              dataSource={dataSource3}
              columnCount={4}
            />
          </div>
          {(allowConfirm && !hideBtn) && <div style={{textAlign: 'center'}}>
            <Button style={{marginRight: 16}} onClick={this.refusedOnline}>退回修改</Button>
            <Button type="primary" onClick={this.agreedOnline}>同意上架</Button>
          </div>}
          {(allowModifyConfirm && !hideBtn) && <div style={{textAlign: 'center'}}>
            <Button style={{marginRight: 16}} onClick={this.dontChange}>暂不修改</Button>
            <Button type="primary" onClick={this.changeToConfirm}>确认修改</Button>
          </div>}
        </Spin>
      </div>
    );
  }
}

export default GoodsActivityDetail;
// export default decorators.formDecorator()(GoodsActivityDetail);
