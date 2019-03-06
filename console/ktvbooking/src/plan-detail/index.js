import React, { PureComponent } from 'react';
import { object, func, bool, array, string } from 'prop-types';
import { page } from '@alipay/page-wrapper';
import { Button, Table, Row, Col, Tag, Form, Modal } from 'antd';
import { keyBy as _keyBy } from 'lodash';

import ShopSelectFormItem from '../common/components/shop-select/form-item';
import Page from '../common/components/page';
import NoPlan from '../common/components/no-plan';
import Block from '../common/components/block';
import { TIME_TYPES, PACKAGE_TYPES, PRICE_MODELS, WEEKS, TIME_MODELS } from '../plan/constants';

import IconWait from './svg/wait.svg';
import IconReady from './svg/ready.svg';
import IconOpen from './svg/open.svg';
import IconClosed from './svg/closed.svg';

import store from './store';
import spmConfig from './spm.config';
import './style.less';

@page({
  store, spmConfig,
  auth: { menu: '4104' },
})
@Form.create()
export default class PlanDetail extends PureComponent {
  static propTypes = {
    loading: bool,
    listErr: bool,
    form: object,
    dispatch: func,
    history: object,
    hasPlan: bool,
    shopId: string,
    planStatus: string,
    resourceList: array,
    timeList: array,
    packageList: array,
    cyclePriceList: array,
    unReservationDayList: array,
  }

  state = {
    selectedIndex: 0, // 当期选中的节目表索引
  }

  onEditClick = () => {
    const { history } = this.props;
    history.push('/plan');
  }

  onPlanStatusClick = () => {
    const { planStatus, dispatch } = this.props;
    const pStatus = planStatus === 'READY' ? 'CLOSED' : planStatus;
    const { title, showSwitch } = {
      OPEN: {
        title: '下架后客户端用户将无法购买',
        showSwitch: 'CLOSED',
      },
      CLOSED: {
        title: '上架后，预订信息将同步到店铺页展示',
        showSwitch: 'OPEN',
      },
    }[pStatus];

    Modal.confirm({
      title,
      onOk: () => dispatch({
        type: 'switchReservationPlan',
        payload: { showSwitch },
      }),
    });
  }

  onShopChange = (shopId) => {
    const { dispatch } = this.props;
    if (shopId) {
      dispatch({ type: 'setState', payload: { shopId } });
      dispatch({ type: 'queryReservationPlanDetail', payload: {} });
    }
  }

  reloadList = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'queryReservationPlanDetail', payload: {} });
  }

  render() {
    const { form, planStatus, hasPlan, listErr } = this.props;

    const header = hasPlan === true && planStatus && (
      <div>
        <Button type="ghost" size="large" onClick={this.onEditClick}>编辑</Button>
        <Button type="ghost" size="large" onClick={this.onPlanStatusClick} style={{ marginLeft: 12 }}
          className={planStatus === 'OPEN' ? 'S_btn-close' : 'S_btn-open'}>
          {{ OPEN: '下架', CLOSED: '上架', READY: '上架' }[planStatus]}
        </Button>
      </div>
    );

    return (
      <Page id="plan-detail" title="预订方案详情" header={header}>
        <ShopSelectFormItem form={form} required onChange={this.onShopChange} />
        <NoPlan {...this.props} />
        {hasPlan === true && (
          <div>
            <div className="plan-status">
              <img className="img-icon"
                src={{ OPEN: IconOpen, CLOSED: IconClosed, READY: IconReady, WAIT: IconWait }[planStatus]} alt="" />
              <div className="plan-status-text">{{ OPEN: '已上架', CLOSED: '已下架', READY: '待上架' }[planStatus]}</div>
            </div>
            {this.renderResourceTable()}
            {this.renderTimeTable()}
            {this.renderPackageTable()}
            {this.renderCyclePriceTable()}
          </div>
        )}
        {listErr && (
          <Button icon="reload" type="primary" size="large" onClick={this.reloadList}>刷新</Button>
        )}
      </Page>
    );
  }

  renderResourceTable() {
    const { resourceList, loading } = this.props;

    const columns = [{
      title: '包厢类型',
      width: 100,
      dataIndex: 'resourceName',
    }, {
      title: '容纳最小人数',
      width: 50,
      dataIndex: 'minUserNumbers',
    }, {
      title: '容纳最多人数',
      width: 50,
      dataIndex: 'maxUserNumbers',
    }];

    return (
      <Block title="设置包房">
        <Table style={{ width: 446 }} rowKey="resourceId"
          loading={loading}
          dataSource={resourceList} columns={columns}
          pagination={false} bordered size="middle" />
      </Block>
    );
  }

  renderTimeTable() {
    const { timeList, loading } = this.props;

    const packageTimeList = timeList.filter(time => time.timeModel === 'PACKAGE_MODE');
    const entryTimeList = timeList.filter(time => time.timeModel === 'ENTRY_MODE');
    const columns = [{
      title: '开始时段',
      width: 100,
      dataIndex: 'startTime',
      render: (startTime, row) => {
        const { startTimeType } = row;
        return `${TIME_TYPES[startTimeType]}${startTime}`;
      },
    }, {
      title: '结束时段',
      width: 100,
      dataIndex: 'endTime',
      render: (endTime, row) => {
        const { endTimeType } = row;
        return `${TIME_TYPES[endTimeType]}${endTime}`;
      },
    }];

    return (
      <Block title="设置时段">
        <Row gutter={48}>
          <Col span={12}>
            <div style={{ marginBottom: 10 }}>
              按包段模式
            </div>
            <Table rowKey="timeId" dataSource={packageTimeList} columns={columns}
              loading={loading} pagination={false} bordered size="middle" />
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 10 }}>
              按进场模式
            </div>
            <Table rowKey="timeId" dataSource={entryTimeList} columns={columns}
              loading={loading} pagination={false} bordered size="middle" />
          </Col>
        </Row>
      </Block>
    );
  }

  renderPackageTable() {
    const { timeList, resourceList, packageList, loading } = this.props;
    const timeListKeys = _keyBy(timeList, 'timeId');
    const resourceListKeys = _keyBy(resourceList, 'resourceId');
    const columns = [{
      title: '类型',
      width: 30,
      dataIndex: 'contentType',
      render(contentType) {
        return PACKAGE_TYPES[contentType];
      },
    }, {
      title: '套餐名称',
      width: 60,
      dataIndex: 'contentName',
      render(contentName, row) {
        const { contentType } = row;
        return contentType === 'PURE_SING' ? '--' : contentName;
      },
    }, {
      title: '套餐内容',
      width: 100,
      dataIndex: 'contentDesc',
      render(contentDesc, row) {
        const { contentType } = row;
        return contentType === 'PURE_SING' ? '--' : contentDesc;
      },
    }, {
      title: '适应时段',
      width: 100,
      dataIndex: 'timeIds',
      render(timeIds) {
        return (timeIds || []).map(timeId => {
          const { startTimeType, startTime, endTimeType, endTime } = timeListKeys[timeId];
          return `${TIME_TYPES[startTimeType]}${startTime}~${TIME_TYPES[endTimeType]}${endTime}`;
        }).join('、');
      },
    }, {
      title: '适用包房',
      width: 100,
      dataIndex: 'resourceIds',
      render(resourceIds) {
        return (resourceIds || []).map(resourceId => {
          const { resourceName } = resourceListKeys[resourceId];
          return resourceName;
        }).join('、');
      },
    }];

    return (
      <Block title="套餐类型">
        <Table rowKey="contentId" loading={loading}
          dataSource={packageList} columns={columns}
          pagination={false} bordered size="middle" />
      </Block>
    );
  }

  changeSelectedIndex =(selectedIndex) => {
    this.setState({
      selectedIndex,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resourceList.length === 0 && this.props.resourceList.length > 0) {
      const theads = document.querySelectorAll('.cycle-pricel-table .ant-table-thead');
      const len = theads.length;
      if (!len) {
        return;
      }
      const { resourceList } = this.props;
      let i = 0;
      while (i < len) {
        const thead = theads[i];
        const tr1 = thead.firstElementChild;
        const tr0 = document.createElement('tr');
        let j = 0;
        const childNodes = tr1.childNodes;
        while (j < 3) {
          const th = childNodes[0];
          th.setAttribute('rowSpan', 2);
          tr0.appendChild(th);
          j += 1;
        }
        if (len === 1 || i > 0) {
          resourceList.forEach(intiRes => {
            const th = document.createElement('th');
            th.setAttribute('colSpan', 3);
            th.innerHTML = intiRes.resourceName;
            tr0.appendChild(th);
          });
        }
        thead.insertBefore(tr0, tr1);
        tr1.style.height = '40px';
        tr0.style.height = '40px';
        i += 1;
      }
    }
  }

  renderCyclePriceTable() {
    const { cyclePriceList, resourceList,
      unReservationDayList, loading } = this.props;
    const { selectedIndex } = this.state;

    const { timePackageResourceList } = cyclePriceList[selectedIndex]
      || { timePackageResourceList: [] };

    /* // 将 时段-套餐-包厢 列表转为 套餐-时段-包厢 便于表格输出
    const packageTimeResourceList = timePackageResourceList
      .reduce((dataSource, timePackageResource, timePackageResourceIndex) =>
        dataSource.concat(timePackageResource.packageResourceList
          .map((packageResource, packageResourceIndex) => ({
            key: `${timePackageResourceIndex}-${packageResourceIndex}`,
            timePackageResource, timePackageResourceIndex,
            packageResource, packageResourceIndex,
          }))), []); */
    // 将 时段-套餐-包厢 列表转为 套餐-时段-包厢 便于表格输出
    // [{key:'',timePackageResource,timePackageResourceIndex,packageResource,packageResourceIndex}]
    const packageTimeResourceList = timePackageResourceList
      .reduce((dataSource, timePackageResource, timePackageResourceIndex) => {
        const { packageResourceList } = timePackageResource;
        if (packageResourceList && packageResourceList.length) {
          return dataSource.concat(packageResourceList
            .map((packageResource, packageResourceIndex) => ({
              key: `${timePackageResourceIndex}-${packageResourceIndex}`,
              timePackageResource, timePackageResourceIndex,
              packageResource, packageResourceIndex,
            })));
        }
        const packageResourceIndex = -1; // 时段未关联套餐或包厢
        return dataSource.concat({
          key: `${timePackageResourceIndex}-${packageResourceIndex}`,
          timePackageResource, timePackageResourceIndex,
          packageResource: null, packageResourceIndex,
        });
      }, []);

    const fixed = resourceList.length >= 3;
    const scroll = fixed ? { x: 321 + (212 * resourceList.length), y: false } : undefined;
    const columns = [{
      title: '时段',
      width: 136,
      fixed,
      key: 'planTimeVO',
      dataIndex: 'timePackageResource',
      render: (timePackageResource, row) => {
        const { planTimeVO: { startTime, startTimeType, endTime, endTimeType, timeModel },
          usableTimeLen, packageResourceList } = timePackageResource;
        const { packageResourceIndex } = row;
        if (packageResourceIndex === -1) {
          return (
            <div>
              <span>[{TIME_MODELS[timeModel]}]</span>
              <div>{TIME_TYPES[startTimeType]}{startTime}~{TIME_TYPES[endTimeType]}{endTime}</div>
            </div>
          );
        }
        let children = null;
        if (packageResourceIndex === 0) {
          children = (
            <div>
              <div>{`${TIME_TYPES[startTimeType]}${startTime}~${TIME_TYPES[endTimeType]}${endTime}`}</div>
              <div>{`[${TIME_MODELS[timeModel]}] ${usableTimeLen}小时`}</div>
            </div>
          );
        }
        return {
          children,
          props: {
            rowSpan: packageResourceIndex === 0 ? packageResourceList.length : 0,
          },
        };
      },
    }, {
      title: '价格类型',
      width: 68,
      fixed,
      key: 'priceModel',
      dataIndex: 'timePackageResource',
      render: (timePackageResource, row) => {
        const { packageResourceIndex } = row;
        if (packageResourceIndex === -1) {
          return '--';
        }
        const { priceModel, packageResourceList } = timePackageResource;
        let children = null;
        if (packageResourceIndex === 0) {
          children = `${PRICE_MODELS[priceModel]}`;
        }
        return {
          children,
          props: {
            rowSpan: packageResourceIndex === 0 ? packageResourceList.length : 0,
          },
        };
      },
    }, {
      title: '套餐',
      width: 116,
      fixed,
      key: 'contentName',
      dataIndex: 'packageResource',
      render: (packageResource, row) => {
        const { packageResourceIndex } = row;
        if (packageResourceIndex === -1) {
          return '--';
        }
        const { contentType, contentName } = packageResource;
        return contentType === 'PURE_SING' ? '纯欢唱' : `欢唱-${contentName}`;
      },
    }, ...resourceList.reduce((
      allColumns, resource,
      resourceIndex,
    ) => allColumns.concat([{
      title: '售价',
      width: 80,
      key: `price${resourceIndex}`,
      dataIndex: 'packageResource',
      render: (packageResource, row) => {
        const { timePackageResource: { priceModel }, packageResourceIndex } = row;
        if (packageResourceIndex === -1) {
          return '--';
        }
        const { resourcePriceSetList } = packageResource;
        const { resourceId } = resource;
        const resourcePriceSetIndex = resourcePriceSetList
          .findIndex(rps => rps.resourceId === resourceId);
        if (resourcePriceSetIndex === -1) {
          return '--';
        }
        const { price } = resourcePriceSetList[resourcePriceSetIndex];
        return price ? `${price} ${PRICE_MODELS[priceModel]}` : '不可售卖';
      },
    }, {
      title: '起订人数',
      width: 64,
      key: `minReservationNumbers${resourceIndex}`,
      dataIndex: 'packageResource',
      render: (packageResource, row) => {
        const { timePackageResource: { packageResourceList, priceModel },
          packageResourceIndex } = row;
        if (packageResourceIndex === -1) {
          return '--';
        }
        const { resourceId } = resource;
        let children = null;
        if (packageResourceIndex === 0) {
          children = '--';
          if (priceModel === 'YUAN_PER_PERSON') {
            const resourcePriceSetList = []; // 时段-包厢 下的所有起订人数resourcePriceSet列表
            packageResourceList.forEach((pkgRes) => {
              pkgRes.resourcePriceSetList.forEach((resPriceSet) => {
                if (resPriceSet.resourceId === resourceId) {
                  resourcePriceSetList.push(resPriceSet);
                }
              });
            });
            if (resourcePriceSetList.length > 0) {
              const { minReservationNumbers } = resourcePriceSetList[0];
              children = `${minReservationNumbers} 人`;
            }
          }
        }
        return {
          children,
          props: {
            rowSpan: packageResourceIndex === 0 ? packageResourceList.length : 0,
          },
        };
      },
    }, {
      title: '房间数',
      width: 64,
      key: `reserveStock${resourceIndex}`,
      dataIndex: 'packageResource',
      render: (packageResource, row) => {
        const { timePackageResource: { packageResourceList }, packageResourceIndex } = row;
        if (packageResourceIndex === -1) {
          return '--';
        }
        const { resourceId } = resource;
        let children = null;
        if (packageResourceIndex === 0) {
          children = '--';
          const resourcePriceSetList = []; // 时段-包厢 下的所有房间数resourcePriceSet列表
          packageResourceList.forEach((pkgRes) => {
            pkgRes.resourcePriceSetList.forEach((resPriceSet) => {
              if (resPriceSet.resourceId === resourceId) {
                resourcePriceSetList.push(resPriceSet);
              }
            });
          });
          if (resourcePriceSetList.length > 0) {
            const { reserveStock } = resourcePriceSetList[0];
            children = reserveStock ? `${reserveStock} 间` : '手工接单';
          }
        }
        return {
          children,
          props: {
            rowSpan: packageResourceIndex === 0 ? packageResourceList.length : 0,
          },
        };
      },
    }]), [])];

    const cycleTags = cyclePriceList.map((cyclePrice, index) => (
      <Tag key={cyclePrice.week || cyclePrice.specialDate} className="ant-tag-default" color={index === selectedIndex ? 'blue' : ''}
        onClick={this.changeSelectedIndex.bind(this, index)}>
        {(cyclePrice.week && WEEKS[cyclePrice.week]) || cyclePrice.specialDate}
      </Tag>
    ));
    const unReservationDayTags = unReservationDayList.map((unReservationDay) => (
      <Tag key={unReservationDay} className="ant-tag-default">
        {unReservationDay}
      </Tag>
    ));
    return (
      <Block title="价目表">
        <Form.Item label="选择日期" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} required>
          {cycleTags}
        </Form.Item>

        <Table className="cycle-pricel-table" dataSource={packageTimeResourceList} columns={columns}
          scroll={scroll} pagination={false} bordered size="middle" loading={loading} />

        <Form.Item style={{ marginTop: 24 }} label="不可预约日期" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
          <div style={{ marginLeft: 12 }}>
            {unReservationDayTags}
          </div>
        </Form.Item>
      </Block>
    );
  }
}
