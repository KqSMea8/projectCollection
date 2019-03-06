import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import { Layout, Menu, Icon, Avatar } from 'antd';
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
import ChildRoute from './ChildRoute'
import ListOrder from './ChildRoute/listOrder'

class UserStage extends Component {
    constructor (props) {
        super(props)
    }
    state = {
        collapsed: false,
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    listOrderClick () {
        this.props.history.push('/userStage/listOrder')
    }
    render () {
        return (
            <div className="userStage">
                <Layout>
                    <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                    >
                    <div className="logo" />
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1" style={{height:'50px'}}>
                            <Avatar size="large" icon="user" />
                            <span>王小萌</span>
                            </Menu.Item>
                            <SubMenu
                            key="sub1"
                            title={<span><Icon type="mobile" /><span>IPS统计</span></span>}
                            >
                            <Menu.Item key="3">Tom</Menu.Item>
                            <Menu.Item key="4">Bill</Menu.Item>
                            <Menu.Item key="5">Alex</Menu.Item>
                            </SubMenu>
                            <Menu.Item key="2">
                            <Icon type="download" />
                            <span>明细下载</span>
                            </Menu.Item>
                            <SubMenu
                            key="sub2"
                            title={<span><Icon type="appstore-o" /><span>配置管理</span></span>}
                            >
                            <Menu.Item key="6">快捷添加用户</Menu.Item>
                            <Menu.Item key="8"><span onClick={this.listOrderClick.bind(this)}>报表管理</span></Menu.Item>
                            <Menu.Item key="7"><span onClick={this.listOrderClick.bind(this)}>目录管理</span></Menu.Item>
                            <Menu.Item key="9">用户管理</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout>
                    <Header style={{ background: '#fff', padding: '0 0 0 20px' }}>
                        <Icon
                        className="trigger"
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                        />
                        <span style={{marginLeft:'10px'}}>目录管理</span>
                    </Header>
                    {
                        ChildRoute.map((val, key) => {
                            return <Route key={key} path={val.path} component={val.component}></Route>
                        })
                    }
                    </Layout>
                </Layout>
            </div>
        )
    }
}
export default UserStage;