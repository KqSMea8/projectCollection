// 报表管理
import React, { Component } from 'react';
import { Layout } from 'antd';
const { Content } = Layout;

class ReportOrder extends Component {
    constructor (props) {
        super(props)
    }
    render () {
        return (
            <div className="reportOrder" style={{width:'100%', height:'100%'}}>
                <Content style={{ width:'100%',height:'800px', margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                    报表管理
                </Content>
            </div>
        )
    }
}
export default {
    ReportOrder,
    component:ReportOrder,
    path:'/reportOrder'
}