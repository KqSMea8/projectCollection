import React, { Component } from 'react';
import { Button, Tabs, Table, Select, message, Spin} from 'antd';
import ajax from '../../common/ajax';
import SecurityModal from './securityModal';
import './emeber.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class ProdAuthOperatorListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      functionCode: this.props.location.query.functionCode,
      hdTitle: this.props.location.query.title,
      loading: true,
      status: '',
      dataLength: 0,
      tabelData: [],
      total: 0,
      pageNo: 1,
      showLock: false,
      showRelease: false,
      operatorId: null,
      treeDom: [],
    };
    this.columns = [{
      title: '别名',
      dataIndex: 'loginName',
      key: 'loginName',
      width: '20%',
    }, {
      title: '真实姓名',
      dataIndex: 'name',
      key: '',
      width: '20%',
    }, {
      title: '部门',
      dataIndex: 'branch',
      key: '',
      width: '20%',
    }, {
      title: <Select defaultValue="" style={{ width: 80 }} onChange={this.statusChange.bind(this)}>
              <Option value="">全部状态</Option>
              <Option value="T">正常</Option>
              <Option value="U">锁定</Option>
              <Option value="W">待激活</Option>
             </Select>,
      dataIndex: 'status',
      width: '20%',
      render: (text)=>{
        if (text === 'T') {
          return '正常';
        } else if (text === 'U') {
          return '锁定';
        } else if (text === 'W') {
          return '待激活';
        }
      },
    }, {
      title: <div style={{textAlign: 'center'}}>操作</div>,
      render: (text, record)=>{
        let addtionnalBtn;
        if (record.status === 'T') {
          addtionnalBtn = <a onClick={() => { this.setState({showLock: true, operatorId: record.id}); }}>锁定</a>;
        } else if (record.status === 'U') {
          addtionnalBtn = <a onClick={() => { this.setState({showRelease: true, operatorId: record.id}); }}>解锁</a>;
        }
        return (
          <div style={{textAlign: 'center'}}>
            {addtionnalBtn ? <span>{addtionnalBtn}<span style={{margin: '0 5px'}}>|</span></span> : null}
            <a onClick={() => { location.href = `${window.APP.ememberUrl}/console/queryOperatorDetail.htm?operatorId=${record.id}`; }}>查看详情</a>
          </div>
        );
      },
      width: '20%',
    }];
  }
  componentDidMount() {
    this.getTable();
    this.getTree();
  }
  // 获取树结构数据
  getTree() {
    const {roleCode, roleId} = this.props.params;
    ajax({
      url: `/staff/queryPermissions.json?principalId=${roleId}&principalType=ROLE&channel=CRMHOME${roleCode ? `&roleCode=${roleCode}` : ''}`,
      method: 'get',
      type: 'json',
      success: (res)=>{
        if (res.permissionList) {
          this.setState({data: res.permissionList.reduce((memo, item) => {
            return memo.concat(item.children && item.children.length ? [item, ...item.children.map(child => { child.childName = child.showName; return child;})] : [item]);
          }, [])});
        } else {
          this.setState({loading: false});
          message.error(res.resultMsg || '系统繁忙，请稍后再试');
        }
      },
    });
  }
  // 获取表格数据方法
  getTable() {
    this.setState({loading: true});
    const {functionCode, status = '', pageNo = 1} = this.state;
    ajax({
      url: `/staff/prodAuthOperatorListView.json?productCode=CRMHOME_O2O_OPERATION&status=${status}&functionCode=${functionCode}&pageNo=${pageNo}`,
      method: 'get',
      type: 'json',
      success: (res)=>{
        if (res.operatorLists) {
          this.setState({total: parseFloat(res.operatorSize)});
          const list = res.operatorLists.map((item, i)=>{
            return {
              key: i,
              ...item.alipayOperator,
            };
          });
          this.setState({tabelData: list, loading: false, dataLength: res.operatorSize || 0});
        } else {
          this.setState({loading: false});
        }
      },
    });
  }
  // 树型下拉框选择事件回调方法
  treeChange(value) {
    this.setState({functionCode: value, pageNo: 1, status: '', hdTitle: this.state.data.find(item => item.functionCode === value).showName}, () => {
      this.getTable();
    });
  }
  // 状态切换方法
  statusChange(value) {
    this.setState({status: value, pageNo: 1}, () => {
      this.getTable();
    });
  }
  // 翻页触发方法
  pageChange(pageNo) {
    this.setState({pageNo}, ()=>{
      this.getTable();
    });
  }
  // 查看详情链接跳转方法

  render() {
    const {operatorId, showLock, showRelease, data, loading, dataLength, tabelData, total, pageNo, hdTitle} = this.state;
    const {ememberUrl} = window.APP;
    const {functionCode} = this.props.location.query;
    const time = (new Date()).getTime();
    // 表格表头
    return (
      <div className="emeber-prodAuthOperatorListView">
        <div className="head-title">
          <h3>产品</h3>
          <a onClick={() => { location.href = `${ememberUrl}/console/queryRoleList.htm`; }}>{'<返回首页'}</a>
        </div>
        <div className="content">
          <div className="header-info">
            <Button>
                口碑商家中心
            </Button>
            {data && data.length ? <Select defaultValue={functionCode} style={{ width: 200 }} onChange={(value) => { this.treeChange(value); }}>
                {data.map((item) => {
                  const {functionCode: code, id, showName, childName} = item;
                  return <Option value={code} key={`${id}.${code}`}>{childName ? <span style={{paddingLeft: 20}}>{childName}</span> : showName}</Option>;
                })}
              </Select> : <Spin style={{marginLeft: 20}}/> }
          </div>
          <div className="tabTitle">
            {hdTitle}
          </div>
          <Tabs defaultActiveKey="1">
            <TabPane tab={`分配给的操作员(${dataLength})`} key="1">
              <Table columns={this.columns} loading={loading} dataSource={tabelData} pagination={{showQuickJumper: true, total, current: pageNo, onChange: this.pageChange.bind(this)}} />
            </TabPane>
          </Tabs>
          {showLock ? <SecurityModal needSpin title="提示" innerSubmit="#J_confirmBtn" frameProps={{style: {height: 100}}} onCancel={() => { this.setState({showLock: false}); }} hideALl visible src={`${ememberUrl}/console/lockOperator.htm?operatorId=${operatorId}&t=${time}`} /> : null}
          {showRelease ? <SecurityModal needSpin title="解锁操作员" innerSubmit="#J_confirmBtn" frameProps={{style: {height: 100}}} onCancel={() => { this.setState({showRelease: false}); }} hideALl visible src={`${ememberUrl}/console/unlockOperator.htm?operatorId=${operatorId}&t=${time}`} /> : null}
        </div>
      </div>
    );
  }
}
export default ProdAuthOperatorListView;
