/* eslint-disable */
import React, {PropTypes,Component} from 'react';
import {queryAuth} from './service';
import {Input, Button ,Col,Form,Table} from 'antd';
import './queryAuth.less';

const FormItem =Form.Item
export default class authTree extends Component{

  state =  {
    value:'',
    authData:{}
  }

  componentDidMount() {
  }

  async queryAuth(){
    console.log('-----')
    const {value} = this.state
    let res = await queryAuth({operatorId:value})
    this.setState({authData:res.data})
  }
  columns = [{
    title: '权限',
    dataIndex: 'permissionName',
    key: 'permissionName',
  }, {
    title: '权限码',
    dataIndex: 'permissionCode',
    key: 'permissionCode',
  },{
    title: '权限码值',
    dataIndex: 'sourcePermissionCode',
    key: 'sourcePermissionCode',
  }, {
    title: '权限分组',
    dataIndex: 'domain',
    key: 'domain',
  }];
  render() {
    const {value,authData} = this.state;
    return (
      <div className="queryAuth">
      <Form onSubmit={this.queryAuth.bind(this)}  >
        <FormItem>
          <Col span="6">
            <Input 
              value ={value} 
              onChange={e=>{this.setState({value:e.target.value})}}/>
          </Col>
          <Col span="2" offset={1}>
            <Button type="primary" 
              onClick={this.queryAuth.bind(this)}
            >
              查询
            </Button>
          </Col> 
        </FormItem>
       
      </Form>
      <h1>角色：{authData.roleName || '--'}</h1>
      <Table 
        pagination ={{pageSize:'20'}}
        dataSource={authData.permissions} 
        columns={this.columns}
        size="middle"
        bordered
      />
      </div>
    );
  }
};


