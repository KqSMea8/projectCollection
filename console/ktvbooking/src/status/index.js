import React, { PureComponent } from 'react';
import { object, func, bool, array, string, number } from 'prop-types';
import { page } from '@alipay/page-wrapper';
import { Table, Button, Popover, Popconfirm, Form, Radio, InputNumber, Alert, Icon } from 'antd';
import moment from 'moment';
import { keyBy as _keyBy } from 'lodash';

import ShopSelectFormItem from '../common/components/shop-select/form-item';
import Page from '../common/components/page';
import NoPlan from '../common/components/no-plan';

import { WEEKS, TIME_MODELS, TIME_TYPES } from '../plan/constants';
import { INVENTORY_STATUS, SALE_STATUS } from './constants';

import store from './store';
import spmConfig from './spm.config';
import './style.less';

@page({
  store, spmConfig,
  auth: { menu: '4102' },
})
@Form.create()
export default class Status extends PureComponent {
  static propTypes = {
    loading: bool,
    listErr: bool,
    dispatch: func,
    history: object,
    form: object,
    shopId: string,
    hasPlan: bool,
    activeIndex: number,
    inventoryList: array,
  }

  state = {
    visiblePopconfirm: null, // 指定单元格气泡确认框是否显示{timeId, resourceId}
    saleStatusVal: '', // Popconfirm表单中售卖状态
    remnantStockVal: '', // Popconfirm表单中当前剩余库存 如果不修改库存就不填值
  }

  onShopChange = (shopId) => {
    const { dispatch } = this.props;
    if (shopId) {
      dispatch({ type: 'setState', payload: { shopId } });
      dispatch({ type: 'querySevenDaysInventoryInfo', payload: {} });
    }
  }

  onBtnClick =(disabled, activeIndex) => {
    const { dispatch } = this.props;
    if (!disabled) {
      dispatch({ type: 'setState', payload: {
        activeIndex,
      } });
    }
  }

  renderTabs() {
    const { inventoryList, activeIndex } = this.props;
    const today = moment().format('MM-DD');
    const btns = inventoryList.map((inventory, index) => {
      const { status, unReservationDay, week, date } = inventory;
      const active = index === activeIndex;
      const disabled = unReservationDay;
      const btn = (
        <Button key={week} className={!active && disabled ? 'disabled' : ''} style={{ width: 138 }}
          type={active ? 'primary' : 'default'} onClick={this.onBtnClick.bind(this, disabled, index)}>
          <div style={{ textAlign: 'center' }}>
            <span>{date} {date === today ? '今天' : WEEKS[week]}</span>
            <div className={status === 'MER_STOP_SALE' ? 'c-red' : ''}>{disabled ? '不可预约' : INVENTORY_STATUS[status]}</div>
          </div>
        </Button>
      );
      const html = (disabled ? (
        <Popover key={week} placement="bottom" arrowPointAtCenter
          content="当前日期已在预订方案中设置为不可预约" overlayStyle={{ width: 180 }}>
          {btn}
        </Popover>) : btn
      );
      return html;
    });
    return (
      <Button.Group size="large" style={{ marginBottom: 8 }}>
        {btns}
      </Button.Group>
    );
  }

  onSaleStatusChange = (e) => {
    this.setState({
      saleStatusVal: e.target.value,
    });
  }

  onRemnantStockChange = (e) => {
    let remnantStockVal = 0;
    try {
      remnantStockVal = e.target.value;
    } catch (err) {
      remnantStockVal = e;
    }
    this.setState({
      remnantStockVal,
    });
  }

  toggleVisiblePopconfirm = (inventoryInfo) => {
    if (inventoryInfo !== true) {
      let visiblePopconfirm = null;
      let saleStatusVal = '';
      let remnantStockVal = '';
      if (inventoryInfo && inventoryInfo !== false) {
        const { timeId, resourceId, saleStatus, remnantStock } = inventoryInfo;
        visiblePopconfirm = { timeId, resourceId };
        saleStatusVal = saleStatus;
        remnantStockVal = remnantStock;
      }
      this.setState({
        visiblePopconfirm,
        saleStatusVal,
        remnantStockVal,
      });
    }
  }

  onPopConfirm = (inventoryInfo) => {
    const { dispatch, loading } = this.props;
    const { saleStatusVal: saleStatus, remnantStockVal: remnantStock } = this.state;
    if (!loading) {
      const { serviceId: reservationId, cyclePropertyId, date } = inventoryInfo;
      dispatch({
        type: 'modifyRoomStatusAndInventory',
        payload: {
          reservationId,
          cyclePropertyId,
          saleStatus,
          date,
          remnantStock: saleStatus === 'SYSTEM_AUTO_ORDER' ? remnantStock : '',
        },
      }).then(() => {
        this.toggleVisiblePopconfirm(null);
      });
    }
  }

  renderTable() {
    const { inventoryList, loading, activeIndex } = this.props;
    const { visiblePopconfirm, saleStatusVal, remnantStockVal } = this.state;
    const { reservationTimes, reservationResources, weekInventoryInfos } =
      inventoryList[activeIndex] ||
      { reservationTimes: [], reservationResources: [], weekInventoryInfos: [] };
    const inventoryInfosKeyById = _keyBy(weekInventoryInfos, ({ timeId, resourceId }) => `${timeId}-${resourceId}`);
    const columns = [{
      title: '时段',
      width: 100,
      render: (_, row) => {
        const { startTime, startTimeType, endTime, endTimeType, timeModel } = row;
        return `[${TIME_MODELS[timeModel]}] ${TIME_TYPES[startTimeType]}${startTime}~${TIME_TYPES[endTimeType]}${endTime}`;
      },
    }, ...reservationResources.map((resource) => {
      const { resourceId, resourceName } = resource;
      return {
        title: `${resourceName}`,
        width: 100,
        render: (_, row) => {
          const { timeId } = row;
          const inventoryInfo = inventoryInfosKeyById[`${timeId}-${resourceId}`];
          if (!inventoryInfo) {
            return '--';
          }
          const { saleStatus, salesVolume, remnantStock } = inventoryInfo;
          const visible = visiblePopconfirm
            && visiblePopconfirm.timeId === timeId && visiblePopconfirm.resourceId === resourceId;
          const title = (
            <div>
              <Form.Item label="售卖状态" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <Radio.Group onChange={this.onSaleStatusChange} value={saleStatusVal}>
                  {saleStatus === 'SYSTEM_AUTO_ORDER' && <Radio key="SYSTEM_AUTO_ORDER" value="SYSTEM_AUTO_ORDER">有房</Radio>}
                  {saleStatus === 'MER_ORDER' && <Radio key="MER_ORDER" value="MER_ORDER">接单中</Radio>}
                  <Radio key="MER_STOP_SALE" value="MER_STOP_SALE">满房</Radio>
                  {saleStatus === 'MER_STOP_SALE' && <Radio key="MER_ORDER" value="MER_ORDER">接单中</Radio>}
                </Radio.Group>
              </Form.Item>
              {saleStatusVal === 'SYSTEM_AUTO_ORDER' ? (
                <Form.Item size="default" label="调整剩余量" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  <InputNumber size="small" min={1} max={999} value={remnantStockVal} onChange={this.onRemnantStockChange} />
                </Form.Item>
              ) : (
                <Alert type="info" showIcon
                  message={saleStatusVal === 'MER_STOP_SALE' ? '设为满房后将不再接受线上预订' : '用户预付下单后，商家选择是否接单'} />
              )}
            </div>
          );
          return (
            <Popconfirm overlayClassName="status-page-popover"
              placement="bottom" arrowPointAtCenter title={title} visible={visible}
              onConfirm={this.onPopConfirm.bind(this, inventoryInfo)}
              onCancel={this.toggleVisiblePopconfirm.bind(this, null)}
              onVisibleChange={this.toggleVisiblePopconfirm}>
              <div className="td-status">
                <Icon type="setting" onClick={this.toggleVisiblePopconfirm.bind(this, inventoryInfo)} />
                {saleStatus === 'MER_STOP_SALE' ? (
                  <span className="c-red">{SALE_STATUS[saleStatus]}</span>
                ) : ((saleStatus === 'MER_ORDER' && SALE_STATUS[saleStatus]) || (
                  <span>剩余 {remnantStock}</span>
                ))}
                <div>已售 {salesVolume}</div>
              </div>
            </Popconfirm>
          );
        },
      };
    })];

    return (
      <Table rowKey="timeId" dataSource={reservationTimes} columns={columns}
        pagination={false} bordered size="middle" loading={loading} />
    );
  }

  reloadList = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'querySevenDaysInventoryInfo', payload: {} });
  }

  render() {
    const { form, hasPlan, listErr } = this.props;
    const header = (
      <a href="https://render.alipay.com/p/f/jg663mug/index.html" target="_blank" rel="noopener noreferrer">房态管理常见问题</a>
    );
    return (
      <Page id="status" title="房态管理" header={header}>
        <ShopSelectFormItem form={form} required onChange={this.onShopChange} />
        <NoPlan {...this.props} />
        {hasPlan === true && (
          <div>
            {this.renderTabs()}
            {this.renderTable()}
          </div>
        )}
        {listErr && (
          <Button icon="reload" type="primary" size="large" onClick={this.reloadList}>刷新</Button>
        )}
      </Page>
    );
  }
}
