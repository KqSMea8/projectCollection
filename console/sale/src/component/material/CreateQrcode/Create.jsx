import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import Merchant from './Merchant';
import ajax from 'Utility/ajax';
// import ToBindTab from './ToBindTab';
// import ApplyRecordTab from './ApplyRecordTab';

// const TabPane = Tabs.TabPane;
// const FormItem = Form.Item;
const prompt = 'PID重复，同一PID的商户只需生成一个码';

const createsErrors = {
  FLOW_UPLOAD_FAILD: '物料信息上传失败',
  GENERATE_FAILD: '码生成请求失败',
  QRCODE_QUERY_FAILD: '码查询失败',
  QRCODE_ALREADY_EXIST: '商户码已经生成',
};
/**
 * 物料管理/口碑码管理
 */
class Create extends Component {
  constructor(props) {
    super(props);
    // this.onTabChange = this.onTabChange.bind(this);
  }
  state = {
    modalVisivle: false,
    merchantList: [],
  }
  componentWillMount() {
    this.merchantAppend();
  }
  getData = [] // 获取merchantList 列表 form 里面的数据
  modalChange() {
    this.setState({ modalVisivle: !this.state.modalVisivle });
  }
  merchantAppend() {
    const { merchantList } = this.state;
    merchantList.push({ key: Math.random() });
    this.setState({ merchantList });
  }
  merchantRemove(index) {
    const { merchantList } = this.state;
    // console.log(index, merchantList)

    // this.getDate[index] = null;
    // merchantList[index] = null;
    this.getData.splice(index, 1);
    merchantList.splice(index, 1);
    // console.log(index, merchantList)
    this.setState({ merchantList });
    this.checkData();
  }
  checkData() {
    if (!this.submitted) return false;
    const { merchantList } = this.state;
    let release = true;

    this.getData.map((callback, index) => {
      if (!callback) return false;
      callback(values => {
        Object.assign(merchantList[index], values);
        if (!values) {
          release = false;
        }
      });
    });


    // 重复检测

    if (merchantList.length > 1) {
      const merchantListNew = merchantList.concat();
      merchantListNew.sort((a, b) => {
        a.pid = a.pid || 0;
        b.pid = b.pid || 0;
        if (a.pid && a.pid === b.pid) {
          // a.prompt = prompt;
          b.prompt = prompt;
          b.type = 'error';
          release = false;
        } else {
          // a.prompt = null;
          b.prompt = null;
        }
        return a.pid - b.pid;
      });
    }
    if (merchantList[0]) {
      merchantList[0].prompt = null;
    }

    this.setState({ merchantList });
    return { release, merchantList };
  }
  create(list, index) {
    if (index < list.length) {
      for (let i = index; i < list.length; i++) {
        const item = list[i];
        if (item.pid) {
          // 生成口碑码
          item.prompt = '等待生成';
          item.type = 'wait';
        }
      }
      list[index].prompt = '正在生成。。。';
      list[index].type = 'active';
      this.setState({ merchantList: list });
      ajax({
        url: `${window.APP.kbretailprodUrl}/qrcodeManage.json?action=/qrcode/create`,
        method: 'get',
        type: 'json',
        data: {
          data: JSON.stringify({
            merchantPid: list[index].pid,
            merchantName: list[index].merchantName,
            remark: list[index].remark,
          }),
        },
      }).then((res) => {
        if (res.success) {
          list[index].prompt = '成功';
          list[index].type = 'success';
        } else {
          list[index].prompt = res.errorMsg || createsErrors[res.errorCode] || '返回异常';
          list[index].type = 'error';
        }
        this.setState({ merchantList: list });
        this.create(list, index + 1);
      }).catch((err) => {
        list[index].prompt = err || '请求错误';
        list[index].type = 'error';
        this.setState({ merchantList: list });
        this.create(list, index + 1);
      });
    }
  }
  handleSubmit() {
    this.submitted = true;
    const { release, merchantList } = this.checkData();
    if (release) {
      // console.log('输入正确');
      // console.log(merchantList);
      this.create(merchantList, 0);

      this.setState({ merchantList });
    }
  }
  render() {
    const { modalVisivle, merchantList } = this.state;
    return (
      <div>
      {modalVisivle &&
        <Modal title="口碑码示例" visible onCancel={::this.modalChange} footer="" width="300" style={{textAlign: 'center'}} >
          <img style={{ width: 200, height: 200 }} src="https://zos.alipayobjects.com/rmsportal/ZsPSXxntxzpcAiOvdKjR.png" />
          <div style={{margin: 20}}>生成的口碑码样式如图</div>
        </Modal>
      }
        请填写商户信息以生成对应口碑码，1个商户将生成1条制码记录
        <a style={{marginLeft: 15}} onClick={::this.modalChange}>查看口碑码示例</a>
        {
          merchantList.map((item, index) => <Merchant key={item.key} index={index} parent={this} data={item} checkData={::this.checkData} remove={::this.merchantRemove} length={merchantList.length}/>)
        }
        {merchantList.length < 10 && <div style={{ marginTop: 20 }}>
          <Button size="large" onClick={() => {this.merchantAppend();}}>新增商户</Button>
        </div>}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Button size="large" type="primary" disabled={merchantList.length === 0} onClick={() => {this.handleSubmit();}}>生成口碑码</Button>
        </div>
      </div>
    );
  }
}

export default Create;
