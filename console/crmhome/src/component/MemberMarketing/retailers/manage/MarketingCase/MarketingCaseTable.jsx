import {message, Tag, Tooltip} from 'antd';
import Table from '../../../../../common/Table';
// import {format} from '../../../../common/dateUtils';
import React, { PropTypes } from 'react';
import TableActions from '../../../../../common/TableActions';
import ajax from '../../../../../common/ajax';
import ReactMixin from 'react-mixin';
import renderDrop from './MarketingCaseDropMenu';
import MarketingCaseAction from './MarketingCaseAction';

/**
 * 任务列表
 */
@ReactMixin.decorate(TableActions)
export default class EventListTable extends React.Component {
  constructor(props) {
    super(props);
    const self = this;
    this.state = {
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        onShowSizeChange: this.onShowSizeChange.bind(this),
        current: 1,
      },
      loading: false,
    };
    this.columns = [{
      title: '营销方案名称',
      width: 170,
      dataIndex: 'plansName',
      render: (text, obj) => {
        if (obj.isDual12 === 'Y') {
          return (<div>{text}<Tag color="red">1212</Tag></div>);
        } else if (obj.isAdvertising === 'Y') {
          const {allowOfflineConfirm, allowOnlineConfirm, allowModify, allowModifyConfirm} = obj;
          let btn = 'none';
          if (allowOnlineConfirm) {
            btn = 'online';
          } else if (allowOfflineConfirm) {
            btn = 'offline';
          } else if (allowModify) {
            btn = 'modify';
          } else if (allowModifyConfirm) {
            btn = 'modifyConfirm';
          }
          const node = document.getElementById('J_isFromKbServ');
          const isFromKb = node && node.value === 'true';
          let url = `#/marketing/brands/detail/${obj.smartPromoId}/${btn}?`;
          let msg = '请到口碑掌柜中升级双12营销方案';
          if (isFromKb) {
            msg = '请到钉钉中帮商户升级双12营销方案';
            url += 'system=sale';
          } else {
            url += 'system=crmhome';
          }
          return (<div>
            {text}
            {obj.status === 'UPGRADE_WAIT_CONFIRM' ? <a href={url} target={!isFromKb ? '_blank' : '_self'}><Tag color="yellow">1212待升级</Tag></a> : <Tooltip title={msg}><Tag color="yellow">1212待升级</Tag></Tooltip>}
          </div>);
        }
        return text;
      },
    }, {
      title: '适用门店',
      width: 110,
      dataIndex: 'suitableShopTimes',
      render: (text) => {
        return `${text}家`;
      },
    }, {
      title: '方案时间',
      width: 120,
      dataIndex: 'sampleName',
      render: (_, obj)=> {
        return `${obj.beginTime} 至${obj.endTime}`;
      },
    }, {
      title: '方案状态',
      width: 150,
      dataIndex: 'displayStatusName',
    }, {
      title: '操作',
      width: 110,
      render(_, obj) {
        return (<MarketingCaseAction data={obj} refresh={self.refresh.bind(self)}/>);
      },
    }];

    // 如果是嵌入服务工作台，在【方案时间】后加入【方案来源】
    if (window.parent !== window) {
      this.columns.splice(4, 0, {
        title: '方案来源',
        width: 150,
        dataIndex: 'sourceName',
      });
    }
  }
  onShowSizeChange = (_, pageSize)=>{
    this.onTableChange({
      current: 1,
      pageSize,
    });
  }
  fetch = (pageParams = {})=>{
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    if (params.current) {
      params.pageNum = params.current;
    }
    this.setState({loading: true});
    ajax({
      url: '/goods/kbsmartplan/queryPageSmartPlans.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const pagination = {...this.state.pagination};
          pagination.total = Number(res.data.page.totalSize);
          this.setState({
            loading: false,
            data: res.data.plansList,
            pagination,
          });
        } else {
          message.error(res.resultMsg);
        }
      },
      error: (res) => {
        this.setState({
          loading: false,
          data: [],
        }, () => {
          message.error(res.resultMsg);
        });
      },
    });
  }

  render() {
    const {data, pagination, loading} = this.state;
    return (
      <div>
        <div>
          <Table columns={this.columns}
             rowKey={record => record.uid}
             dataSource={data}
             expandedRowRender={renderDrop.bind(this)}
             pagination={pagination}
             loading={loading}
             onChange={this.onTableChange.bind(this)}/>
        </div>
      </div>
    );
  }
}

EventListTable.propTypes = {
  params: PropTypes.any,
};
