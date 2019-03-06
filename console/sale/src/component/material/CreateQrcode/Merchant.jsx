import React, { Component } from 'react';
import { Row, Col, Form, Input, Icon } from 'antd';
import ajax from 'Utility/ajax';
// import HasBindTab from './HasBindTab';
// import ToBindTab from './ToBindTab';
// import ApplyRecordTab from './ApplyRecordTab';
 // /sale/merchant/queryByName.json
const FormItem = Form.Item;

const rowStyle = {
  padding: '24px 10px 0',
  background: '#f5f5f5',
  marginTop: 5,
  marginRight: 50,
};
const formStyle = {
  marginTop: 10,
};
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const iconStyle = {
  position: 'absolute',
  right: -60,
  top: 0,
  lineHeight: '32px',
  width: 50,
  fontSize: '20px',
};

const colors = {
  error: '#f04134',
  active: '#108ee9',
  success: '#00a854',
  wait: '#a2a2a2',
};
class Merchant extends Component {
  constructor(props) {
    super(props);
    const { parent, index } = this.props;
    // merchantList[this.props.index] = (callback) => {
    //   this.getDate(callback);
    // }
    // this.props.parent.setState({ merchantList });
    parent.getData[index] = (callback) => {
      this.getData(callback);
    };
  }
  state = {
    merchantList: [],
    loading: true,
  }
  // componentWillMount() {
    // this.searchMerchant();
  // }
  onSelect(value) {
    const { merchantList } = this.state;
    merchantList.map(item => {
      if (item.label === value) {
        this.props.form.setFieldsValue({ pid: item.children[0].value });
      }
    });
  }
  getData(callback) {
    this.props.form.validateFields((err, values) => {
      callback(!err && values);
    });
  }
  searchMerchant(input) {
    this.setState({ loading: true });
    ajax({
      url: `${window.APP.kbservcenterUrl}/sale/merchant/queryByName.json`,
      method: 'get',
      type: 'json',
      data: {
        keyword: input,
        size: 100,
      },
    }).then((res) => {
      this.setState({
        merchantList: res.data || [],
        loading: false,
      });
    }).catch(() => {
      this.setState({
        merchantList: [],
        loading: false,
      });
    });
  }
  render() {
    const { getFieldProps } = this.props.form;
    const { data, checkData } = this.props;
    // const { merchantList, loading } = this.state;


    return (
      <Form style={formStyle} horizontal form={this.props.form}>
        商户{this.props.index + 1}
        <Row style={rowStyle}>
          <Col span="8">
            <FormItem label="商户名称：" {...layout} >
              <Input placeholder="输入商户名称，如家乐福"
                {...getFieldProps('merchantName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入商户名称',
                    },
                  ],
                })}
              />
            { /*
              <Select
                {...getFieldProps('merchantName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入商户名称',
                    },
                  ],
                })}
                showSearch
                style={{ width: 200 }}
                placeholder="Select a person"
                onSearch={e => { this.searchMerchant(e); }}
                filterOption={false}
                onSelect={e => this.onSelect(e)}
              >
                {
                  loading ?
                  <Option value="1">搜索中...</Option> :
                  merchantList.map((item, index) => <Option key={index} value={item.label}>{item.label}</Option>)
                }
              </Select>
            */ }
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="商户PID：" {...layout} >
              <Input placeholder="输入商户PID，如35224666"
              onInput={() => {
                setTimeout(checkData);
              }}
                {...getFieldProps('pid', {
                  rules: [
                    {
                      required: true,
                      message: '请输入商户PID',
                    },
                  ],
                })}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="备注：" {...layout} >
              <Input placeholder="可以输入码名称方便管理"
                {...getFieldProps('remark', {
                  rules: [
                    {
                      message: '请输入活动名称',
                    },
                  ],
                })}
              />
            </FormItem>
            {this.props.length > 1 && <Icon type="cross" onClick={ () => this.props.remove(this.props.index) } style={iconStyle} /> }
          </Col>
        </Row>
        <div style={{height: 25, lineHeight: '25px', color: colors[data.type] || '#666' }}>
          {data.prompt}
        </div>
      </Form>
    );
  }
}

export default Form.create()(Merchant);
