// 明细下载
import React, { Component } from 'react';
import { Layout } from 'antd';
const { Content } = Layout;

class MxLoad extends Component {
    constructor (props) {
        super(props)
    }
    render () {
        return (
            <div className="mxLoad" style={{width:'100%', height:'100%'}}>
                <Content style={{ width:'100%',height:'800px', margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                    明细下载
                </Content>
            </div>
        )
    }
}
export default {
    MxLoad,
    component:MxLoad,
    path:'/mxLoad'
}