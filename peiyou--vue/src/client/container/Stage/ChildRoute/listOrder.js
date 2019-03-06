import React, { Component } from 'react';
import { Layout } from 'antd';
const { Content } = Layout;

class ListOrder extends Component {
    constructor (props) {
        super(props)
    }
    render () {
        return (
            <div className="listOrder" style={{width:'100%', height:'100%'}}>
                <Content style={{ width:'100%',height:'800px', margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                    目录管理
                </Content>
            </div>
        )
    }
}
export default {
    ListOrder:ListOrder,
    component:ListOrder,
    path:'/listOrder'
};