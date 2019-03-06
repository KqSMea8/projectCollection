import React, {PropTypes} from 'react';
import { Tabs } from 'antd';
import KoubeiTemplateList from './KoubeiTemplateList';
import AlipayTemplateList from './AlipayTemplateList';
import permission from '@alipay/kb-framework/framework/permission';

const TabPane = Tabs.TabPane;

const TemplateIndex = React.createClass({
  propTypes: {
    children: PropTypes.any,
  },
  getInitialState() {
    return {};
  },

  onChange(key) {
    window.location.hash = `/material/TemplateManage/${key}`;
  },

  render() {
    const {children} = this.props;
    let activeKey = 'koubei';
    let createBtn;
    const tabs = [];
    if (permission('STUFF_TEMPLATE_MANAGE_KOUBEI')) {
      tabs.push(
        <TabPane tab="口碑物料模版" key="koubei">
          <KoubeiTemplateList />
        </TabPane>
        );
    }
    if (permission('STUFF_TEMPLATE_MANAGE_ALIPAY')) {
      tabs.push(
        <TabPane tab="支付宝物料模版" key="alipay">
          <AlipayTemplateList />
        </TabPane>
        );
    }
    if (!permission('STUFF_TEMPLATE_MANAGE_KOUBEI') && !permission('STUFF_TEMPLATE_MANAGE_ALIPAY')) {
      tabs.push(
        <TabPane tab="暂无权限" key="koubei" />
        );
    }
    if (permission('STUFF_TEMPLATE_MANAGE_ALIPAY') && children.type.displayName === 'AlipayTemplateList') {
      activeKey = 'alipay';
      createBtn = <a className="ant-btn-primary ant-btn" style={{position: 'absolute', right: 16, zIndex: 2}} target="_blank" href="#/material/templatemanage/createtemplate?tab=alipay">新建模板</a>;
    } else if (permission('STUFF_TEMPLATE_MANAGE_KOUBEI') && children.type.displayName === 'KoubeiTemplateList') {
      activeKey = 'koubei';
      createBtn = <a className="ant-btn-primary ant-btn" style={{position: 'absolute', right: 16, zIndex: 2}} target="_blank" href="#/material/templatemanage/createtemplate?tab=koubei">新建模板</a>;
    }
    return (<div className="kb-tabs-main">
      <Tabs defaultActiveKey=""
        activeKey={activeKey}
        onChange={this.onChange}
        tabBarExtraContent={createBtn}>
        {tabs}
      </Tabs>
    </div>);
  },
});
export default TemplateIndex;
