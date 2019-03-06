import React, { Component } from 'react';
import { Table } from 'antd';
import ajax from 'Utility/ajax';

const status = {
  PROCESS: ['正在生成...', '#ffa800'],
  COMPLETED: ['完成', '#000'],
  INIT: ['初始化...', '#ffa800'],
};

let columns;

class Manage extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    tableList: [],
    pageSize: 10,
    current: 1,
    total: 10,
  }
  componentWillMount() {
    columns = [{
      title: '制码时间',
      dataIndex: 'createTime',
    }, {
      title: '制码批次号',
      dataIndex: 'dataId',
    }, {
      title: '制码人',
      dataIndex: 'createUser',
    }, {
      title: '商户PID',
      dataIndex: 'merchantPid',
    }, {
      title: '商户名称',
      dataIndex: 'merchantName',
    }, {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
    }, {
      title: '码数量',
      dataIndex: 'num',
    }, {
      title: '状态',
      dataIndex: 'status',
      width: 150,
      render: item => {
        const statu = status[item];
        return statu && <span style={{ color: statu[1] || '#000' }}>{statu[0]}</span> || item;
      },
    }, {
      title: '下载口碑码',
      dataIndex: 'downloadUrl',
      render: (url, item) => <a href={url} disabled={item.status !== 'COMPLETED'} download target="_blank">下载</a>
    }];

    this.search(1);
  }
  componentWillUnmount() {
    this.timeoutList.map(clearTimeout);
  }
  search(pageNum, pageSize2) {
    const { pageSize } = this.state;
    const size = pageSize2 || pageSize;

    ajax({
      url: `${window.APP.kbretailprodUrl}/qrcodeManage.json?action=/qrcode/list`,
      method: 'get',
      type: 'json',
      data: {
        data: JSON.stringify({
          pageSize: size,
          pageNum,
        }),
      },
    }).then((res) => {
      const tableList = res.modelList || [];
      this.setState({
        tableList,
        total: res.totalSize,
        current: res.pageNum,
        pageSize: res.pageSize,
      });

      this.timeoutList.map(clearTimeout);
      this.checkStatusLoop(tableList);
      // console.log(res)
    }).catch((err) => {
      console.log(err);
    });
  }
  timeoutList = []
  checkSingle(item) {
    ajax({
      url: `${window.APP.kbretailprodUrl}/qrcodeManage.json?action=/qrcodeUrl/query`,
      method: 'get',
      type: 'json',
      data: {
        data: JSON.stringify({
          dataId: item.dataId,
        }),
      },
    }).then((res) => {
      if (res.success) {
        item.status = 'COMPLETED';
        item.downloadUrl = res.downloadUrl;
        this.setState({});
      }
      // console.log(res);
    });
    // .catch((err) => {
      // console.log(err);
    // });
  }
  checkStatusLoop(tableList) {
    let continueNext;

    this.timeoutList.length = 0;

    tableList.map((item, index) => {
      if (item.status !== 'COMPLETED') {
        continueNext = true;
        this.timeoutList.push(setTimeout(() => {
          this.checkSingle(item);
        }, index * 300));
      }
    });

    if (continueNext) {
      this.timeoutList.push(setTimeout(() => {
        this.checkStatusLoop(tableList);
      }, 8000));
    }
    // console.log(this.timeoutList.length);
  }
  render() {
    const { tableList, pageSize, current, total } = this.state;

    const pagination = {
      total,
      current,
      pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: e => {
        this.setState({current: e});
        this.search(e);
      },
      onShowSizeChange: (pageCurrent, size) => {
        this.setState({ pageSize: size });
        this.search(1, size);
      }
    };

    return (
      <div className="create-qrcode-create">
        <Table dataSource={tableList}
          columns={columns}
          rowKey={(item, index) => index}
          pagination={pagination}
        />
      </div>
    );
  }
}

export default Manage;
