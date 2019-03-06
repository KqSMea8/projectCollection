// 用户管理
import React, { Component } from 'react';
import { Layout } from 'antd';
const { Content } = Layout;

class UserOrder extends Component {
    constructor (props) {
        super(props)
    }
    render () {
        return (
            <div className="userOrder" style={{width:'100%', height:'100%'}}>
                <Content style={{ width:'100%',height:'800px', margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                    用户管理
                </Content>
            </div>
        )
    }
}
export default {
    UserOrder,
    component:UserOrder,
    path:'/userOrder'
}