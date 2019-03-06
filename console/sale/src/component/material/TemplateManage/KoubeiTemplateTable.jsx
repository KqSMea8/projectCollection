import React, {PropTypes} from 'react';
import Table from '../../../common/Table';
import ajax from 'Utility/ajax';
import { Button, message} from 'antd';
import {MaterialPropertiesMap} from '../common/MaterialLogMap';
import {appendOwnerUrlIfDev} from '../../../common/utils';
import {format, formatTimeHm} from '../../../common/dateUtils';
import permission from '@alipay/kb-framework/framework/permission';
import MoreDown from './MoreDown';

const KoubeiTemplateTable = React.createClass({
  propTypes: {
    location: PropTypes.object,
    params: PropTypes.any,
  },
  getInitialState() {
    return {
      show: false,
      visible: false,
      data: [],
      loading: true,
      selectedRowKeys: [],
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
    };
  },

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    }
  },//  搜索初始化调用

  onTableChange(pagination) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
    };
    this.fetch(params);
  },   // onClick调用改变当前页

  onSelectChange(selectedRowKeys) {
    this.setState({
      selectedRowKeys: selectedRowKeys,
    });
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
      mappingValue: 'kbasset.pageQueryTemplate',
      domain: 'KOUBEI',
    };
    this.setState({
      loading: true,
    });
    ajax({
      // url: appendOwnerUrlIfDev('/sale/asset/stuffTemplateList.json'),
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          if (result.data.values.length === 0) {
            message.error('暂无数据', 3);
            return;
          }
          const data = result.data.values || [];
          const pagination = {...this.state.pagination};
          pagination.total = result.data.pager.totalSize;
          this.onSelectChange('');
          this.setState({
            loading: false,
            data: data || [],
            pagination,
          });
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
      error: () => {
        const pagination = {...this.state.pagination};
        pagination.total = 0;
        this.setState({
          loading: false,
          data: [],
          pagination,
        });
      },
    });
  },
  showModal() {
    window.open('#/material/applicationManagement/applyMaterial?ids=' + this.state.selectedRowKeys);
  },
  render() {
    const TempStatus = {
      EFFECTIVE: '生效中',
      INVALID: '已失效',
    };
    const changeTableData = this.fetch;
    const columns = [
      {
        title: '模板名称/ID',
        width: 95,
        dataIndex: 'name',
        render(name, r) {
          return (<div><p>{name}</p><p><span>ID:</span><span>{r.id}</span></p></div>);
        },
      }, {
        title: '模板状态',
        width: 95,
        dataIndex: 'status',
        render(status) {
          return <span>{TempStatus[status]}</span>;
        },
      }, {
        title: '模板创建人&时间',
        width: 95,
        dataIndex: 'gmtCreate',
        render(gmtCreate, r) {
          return (<div><p>{r.creatorName}</p><p>{format(new Date(gmtCreate))} {formatTimeHm(new Date(gmtCreate))}</p></div>);
        },
      }, {
        title: '物料属性/类型/尺寸',
        width: 95,
        dataIndex: 'stuffType',
        render(stuffType, r) {
          return (<p><span>{MaterialPropertiesMap[stuffType]}</span><span>/</span><span>{r.stuffAttrName}</span><span>/</span><span>{r.sizeName}</span></p>);
        },
      }, {
        title: '示例图',
        width: 95,
        dataIndex: 'opId',
        render(id, r) {
          let num = 0;
          const tabPicList = r.resourceIds && r.resourceIds.map((key, index) => {
            const isPic = key.indexOf('=jpg&') > 0 || key.indexOf('=png&') > 0 || key.indexOf('=jpeg&') > 0;
            if (isPic && num < 1) {
              num++;
              return (<a key={index} target="blank" href={appendOwnerUrlIfDev('/sale/asset/saleFileDownload.resource?resourceId=' + encodeURIComponent(key))}
                style={{margin: '0 8px'}} className="kouBeiTempInfoimgsize">
                <img src={appendOwnerUrlIfDev('/sale/asset/saleFileDownload.resource?resourceId=' + encodeURIComponent(key))} />
              </a>);
            }
          });
          return tabPicList;
        },
      }, {
        title: '操作',
        width: 95,
        dataIndex: 'id',
        render(id, r) {
          return <MoreDown currentPage="tabList" changeTableData={changeTableData} status={TempStatus[r.status]} id={id} />;
        },
      }];
    const {loading, data, pagination, selectedRowKeys} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps(record) {
        return {
          disabled: (record.status === 'INVALID'),
        };
      },
    };
    const buttonArea = (
        permission('STUFF_APPLY_ORDER_SUBMIT') && !loading && data && data.length > 0 && (<div style={{marginBottom: 16}}>
              <span style={{marginRight: 12}}>已选({selectedRowKeys.length})</span>
              <Button type="primary" onClick={this.showModal}>
                申请物料
              </Button>
            </div>
        )
    );
    return (
        <div>
          {buttonArea}
          <Table columns={columns}
                 rowKey={r => r.id}
                 rowSelection={rowSelection}
                 dataSource={data}
                 loading={loading}
                 pagination={pagination}
                 firstShow={!this.props.params}
                 onChange={this.onTableChange} />
        {buttonArea}
        </div>
    );
  },
});

export default KoubeiTemplateTable;
