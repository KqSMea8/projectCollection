// webpack打包
webpack --config build/webpack/webpack.dll.js
// npm start  localhost:7788




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
                            <Menu.Item key="8">报表管理</Menu.Item>
                            <Menu.Item key="7">目录管理</Menu.Item>
                            <Menu.Item key="9">用户管理</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>