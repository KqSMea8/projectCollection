import React from 'react';
import {Table, Switch, Modal, message, Button, Tooltip} from 'antd';
import ajax from '../../../../common/ajax';

const AutoInvitation = React.createClass({

  getInitialState() {
    this.columns = [{
      title: '编号',
      // dataIndex: 'activityName',
      width: 100,
      render: (text, record, i) => {
        return (<div>{i + 1}</div>);
      },
    }, {
      title: '品牌商名称',
      width: 250,
      render: (text) => {
        return (
          <div>
            {text.brandName}
          </div>
        );
      },
    }, {
      title: '是否自动接受活动邀约',
      // dataIndex: 'operation',
      width: 150,
      render: (r, d, i) => {
        const that = this;
        const checked = r.confirmStatus === 1;
        return (
          <Switch checked={checked} checkedChildren={'开'} unCheckedChildren={'关'} onChange={() => that.handChange(checked, r, d, i)}/>
        );
      },
    }];

    return {
      data: [],
      loading: true,
      visible: false,
      entryVisible: false,
      params: [],
    };
  },

  onOpenModel() {
    this.getData();
    this.setState({
      visible: true,
    });
  },

  getData() {
    ajax({
      url: '/promo/autoapply/queryBrandList.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status) {
          const data = res.brandList;
          data.map((item, i) => {
            item.key = i;
            return item;
          });
          this.setState({
            loading: false,
            data,
          });
        } else {
          this.setState({
            loading: false,
            data: [],
          });
          message.error(res.resultMsg);
        }
      },
      error: () => {
        this.setState({
          loading: false,
          data: [],
        });
        message.error('获取数据失败，请重新尝试');
      },
    });
  },

  handChange(checked, r, d, i) {
    const {data, params} = this.state;
    const status = d.confirmStatus === 1 ? 2 : 1;
    let operateType;
    if (checked === true) {
      operateType = 2;
    } else {
      operateType = 1;
    }
    data[i].confirmStatus = status;
    if (params.length > 0) {
      params.map((item) => {
        if (!item.brandPid || item.brandPid !== d.brandPid) {
          params.push({brandPid: d.brandPid, operateType: status});
        }
        return params;
      });
    } else {
      params.push({brandPid: d.brandPid, operateType: operateType});
    }

    this.setState({
      data,
      params,
    });
  },

  handleOk() {
    this.setState({loading: true});
    const {params} = this.state;
    ajax({
      url: '/promo/autoapply/retailerOperate.json',
      method: 'post',
      data: {
        jsonDataStr: JSON.stringify(params),
      },
      type: 'json',
      success: () => {
        message.success('设置成功');
        this.setState({
          visible: false,
          loading: false,
          params: [],
        });
      },
    });
  },

  handleCancel() {
    this.setState({
      visible: false,
    });
  },

  handClick() {
    this.setState({
      entryVisible: true,
    });
  },

  entryhandleOk() {
    this.setState({
      entryVisible: false,
    });
  },

  entryandleCancel() {
    this.setState({
      entryVisible: false,
    });
  },

  render() {
    const {data, loading} = this.state;
    this.i = 0;
    data.map((item) => {
      if (item.confirmStatus === 1 ) {
        this.i++;
      }
    });
    return (
      <div>
        <Button type="primary" onClick={this.onOpenModel}>设置自动接受邀约</Button>
        <Modal
          title="设置自动接受邀约"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div >
            <p>设置开启后，将自动接受该品牌商发起的活动邀约，当前已选择 <span style={{color: 'red'}}>{this.i}</span> 家</p>
            <div style={{height: 200, overflowY: 'auto'}}>
              <Table
                columns={this.columns}
                dataSource={data}
                loading={loading}
                pagination={false}
              />
            </div>
            开启后代表已同意 <a onClick={this.handClick}>《自动接受活动邀约协议》</a>
            <Modal title="活动邀约协议"
                   visible={this.state.entryVisible}
                   onOk={this.entryhandleOk}
                   onCancel={this.entryandleCancel}>
              <div>
              </div>
            </Modal>
          </div>
        </Modal>
        <Tooltip title="活动众多，确认邀约麻烦？试试开通自动接受邀约功能！">
          <p style={{
            float: 'right',
            borderRadius: '50%',
            border: '1px solid #ccc',
            width: 20,
            height: 20,
            textAlign: 'center',
            marginTop: 3,
          }}>?</p>
        </Tooltip>

      </div>

    );
  },
});

export default AutoInvitation;
