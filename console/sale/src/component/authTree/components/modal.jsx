/* eslint-disable */
import React, {PropTypes,PureComponent} from 'react';
import { Modal,Button,Form,Input,Radio,Checkbox,message} from 'antd';
import {addAuth ,modifyAuth} from '../service'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

export default class authModal extends PureComponent {
  static propTypes= {
    modalType:PropTypes.string,
    item:PropTypes.object,
    permissionGroup:PropTypes.string,
    reload:PropTypes.func
  }
  state = {
    code:'',
    name:'',
    store:true,
    role:[],
    functionCode:''
  }

  checkBoxOptions = [
    { label: '店长', value: 'SHOPKEEPER' , disabled:false},
    { label: '运营', value: 'OPERATOR' , disabled:false},
    { label: '区域经理', value: 'RGMANAGER', disabled:false},
    { label: '财务', value: 'FINANCE', disabled:false},
    { label: '收银员', value: 'CASHIER', disabled:false},
    { label: '手艺人', value: 'CRAFTMAN', disabled:false},
    { label: '总经理', value: 'POS_GM', disabled:false},
    { label: '运营总监', value: 'POS_COO', disabled:false},
    { label: '管理员', value: 'ADMINISTRATORS', disabled:false},
    { label: '收银领班', value: 'HEAD_CASHIER', disabled:false},
    { label: '厨师长', value: 'HEAD_COOK', disabled:false},
    { label: '服务员', value: 'WAITER', disabled:false},
    { label: '库管', value: 'WAREHOUSE', disabled:false},
  ]
  componentWillReceiveProps(newProps){
    if(!newProps.visible){
        this.resetModal()
    }else{
      if(newProps.modalType === 'modify'){
        this.setState({
          name:newProps.item.showName,
          role:newProps.item.defaultRoles|| [],
        })
        let role = newProps.item.defaultRoles
        role && role.forEach(el=>{
          let item = this.checkBoxOptions.find(option =>option.value === el)
          item.disabled = true
        }) 
      }
    }
  }
  resetModal(){
    this.setState({
      code:'',
      name:'',
      store:true,
      role:[],
      functionCode:''
    })
    this.checkBoxOptions.forEach(el=>el.disabled =false)
  }
  confimHandle(){
    if(this.props.modalType === 'add'){
      this.addAuthHandle()
    }else{
      this.modifyAuthHandle()
    }
  }
  async addAuthHandle(){
    const {code,name,store,role,functionCode} = this.state
    const {permissionGroup,item} = this.props
    let res = await addAuth({
      "parentPermissionId":item.id,
      "parentPermissionCode":item.permissionCode,
      "permissionCode":code,
      "permissionName":name,
      "sourcePermissionCode": functionCode,
      "permissionGroup":permissionGroup,
      "store":store,
      "defaultRoleCodes":store?role:[]
    })
    if(res.data){
      this.props.onCancel()
      message.success('增加成功');
      this.props.reload()
    }
  }
  async modifyAuthHandle(){
    const {code,name,store,role} = this.state
    const {permissionGroup,item} = this.props
    let res = await modifyAuth({
      "permissionCode":item.permissionCode,
      "permissionName":name,
      "defaultRoles":role
    })
    if(res.data){
      this.props.onCancel()
      this.props.reload()
      message.success('修改成功');
    }
  }
  
  render() {
    const {code,name,store,role,functionCode} = this.state
    const {item} = this.props
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
    };
    let isAddModay = this.props.modalType === 'add'
    let showRole
    if(isAddModay && store){
      showRole = true
    }else if(!isAddModay && item.store){
      showRole = true
    }else{
      showRole = false
    }
    
    return (
      <Modal
        {...this.props}
        footer = {[
          <Button type="primary" onClick={this.confimHandle.bind(this)}>
            确认
          </Button>,
        ]}
      >
        <Form horizontal>
          <FormItem label="权限名称" {...formItemLayout}>
            <Input value={name} onChange={e=>{this.setState({name:e.target.value})}} placeholder="参考格式：员工管理（仅适用于一体机商户）"/>
          </FormItem>
          {isAddModay?(
            <div>
              <FormItem label="权限码" {...formItemLayout}>
                <Input value={code} onChange={e=>{this.setState({code:e.target.value})}} placeholder="参考格式：offline_staff_manage"/>
              </FormItem>
              <FormItem label="权限码值" {...formItemLayout}>
                <Input value={functionCode} onChange={e=>{this.setState({functionCode:e.target.value})}} placeholder="参考格式：000|43"/>
              </FormItem>
              <FormItem label="是否存储" {...formItemLayout}>
                <RadioGroup value={store} onChange={e=>{this.setState({store:e.target.value})}}>
                  <Radio key="a" value={true}>是</Radio>
                  <Radio key="b" value={false}>否</Radio>
                </RadioGroup>
              </FormItem>
            </div>
            ):''
          }
          {showRole && (
            <FormItem label="默认角色" {...formItemLayout}>
              <CheckboxGroup options={this.checkBoxOptions} value={role} onChange={e=>{this.setState({role:e})}}/>
            </FormItem>
          )}
        </Form>
      </Modal>
    );
  }
}


