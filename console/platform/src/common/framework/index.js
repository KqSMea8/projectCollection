import React, { Component } from 'react';
import { Menu, Icon, Select, Button } from 'antd';
import fetch from '@alipay/kobe-fetch';
import { getSystemUrl } from '@alipay/kb-systems-config';
import { queryEnvCode } from '../api';
// import { Link } from 'react-router-dom';

import './style.less';

const SubMenu = Menu.SubMenu;
const Option = Select.Option;

const envCodeObj = {
  DEV: '开发环境',
  TEST: '测试环境',
  PREPUB: '预发环境',
  PROD: '生产环境',
  UNKNOWN: '未知环境',
};

const optionCodeObj = {
  DEV: '开发环境',
  TEST: '测试环境',
  PROD: '线上环境', // 蹩脚的文案,这里要注意一下,列表展示不一样
};

const urlObj = {
  DEV: 'http://ikbservcenter.stable.alipay.net',
  TEST: 'https://ikbservcenter.test.alipay.net',
  PROD: 'https://ikbservcenter.alipay.com',
};

const colorObj = {
  DEV: 'green',
  TEST: 'purple',
  PREPUB: 'yellow',
  PROD: 'red',
  UNKNOWN: '',
};

const envCodeItems = ['DEV', 'TEST', 'PROD'];

// 左侧菜单里需要展示的路由都要在这里配置一下
const menuKeyObj = {
  spi: ['#/spi'],
};

export default () => (InnerComponent) => {
  class Page extends Component {
    state = {
      envCode: '',
      nickName: '',
      ownerPic: '',
      showPic: false,
    };

    componentWillMount = () => {
      const { hash } = window.location;
      let selectedHash = (hash || '').split('?')[0];
      if (selectedHash) {
        const selectedSub = (selectedHash.split('/')[1] || '');
        if ((menuKeyObj[selectedSub] || '').indexOf(selectedHash) === -1) {
          selectedHash = `#/${selectedSub}`;
        }
        this.setState({ selectedHash, selectedSub });
      }
    }

    componentDidMount = () => {
      queryEnvCode().then(res => {
        this.setState({ envCode: res.data.envCode });
      });
      fetch.ajax({
        url: `${getSystemUrl('buserviceUrl')}/pub/getLoginUser.json`,
        data: {
          userDefineSourceUrl: window.location.href,
        },
        type: 'jsonp',
      }).then(res => {
        const { outUserNo, nickName } = res.data;
        if (outUserNo) {
          const ownerPic = `https://work.alibaba-inc.com/photo/${outUserNo}.50x50.jpg`;
          this.setState({ ownerPic });
        }
        if (nickName) {
          this.setState({ nickName });
        }
      });
    };

    onSelect = (value) => {
      // const { hash } = window.location;
      if (urlObj[value]) {
        // window.location.href = `${urlObj[value]}/confreg/index.htm${hash}`;
        window.location.href = `${urlObj[value]}/confreg/index.htm#/`;
      }
    };

    redirectUrl = (val) => {
      if (val) {
        window.location.hash = val;
      }
    };

    onPic = (val) => {
      this.setState({
        showPic: val,
      });
    };

    render() {
      const { envCode, ownerPic, nickName, selectedSub, selectedHash, showPic } = this.state;
      envCodeItems.forEach((val, index) => {
        if (val === envCode) {
          envCodeItems.splice(index, 1);
        }
      });
      // 预发环境下不展示线上环境的切换入口
      if (envCode === 'PREPUB') {
        envCodeItems.forEach((val, index) => {
          if (val === 'PROD') {
            envCodeItems.splice(index, 1);
          }
        });
      }
      return (
        <div id="frame-work">
          <div className="frame-header">
            <div className="frame-logo-bar">
              <div className="viewport">
                <div className="logo" />
                <div className="name">中台基础</div>
              </div>
            </div>
            <div className="frame-top-bar">
              <div className="viewport">
                <div className="right">
                  <div className={`message ${colorObj[envCode] || ''}
                    ${envCode === 'PREPUB' ? 'black' : 'white'}`}>{envCode && envCodeObj[envCode]}
                  </div>
                  <span>
                    <Select className="select" value="切换到" onSelect={this.onSelect}>
                      {envCodeItems.map((val) => <Option key={val}>{optionCodeObj[val]}</Option>)}
                    </Select>
                  </span>
                  <span>
                    欢迎{nickName ? `, ${nickName}` : ''}{ownerPic && <img alt="ownerPic" className="owner-pic" src={ownerPic} />}
                  </span>
                  <span className="code-span">
                    <img alt="code" className="code-pic"
                      onMouseOver={() => this.onPic(true)}
                      onMouseOut={() => this.onPic(false)}
                      onFocus={() => 0}
                      onBlur={() => 0}
                      src="https://gw.alipayobjects.com/zos/rmsportal/IwMmOKnsLeldsCrSPnrz.jpg" />
                    {
                      showPic &&
                      <img alt="code" className="code-pic-big"
                        src="https://gw.alipayobjects.com/zos/rmsportal/IwMmOKnsLeldsCrSPnrz.jpg" />
                    }
                  </span>
                  <span>
                    <Button>
                      <a href="https://lark.alipay.com/kbmiddle/kbservcore/vxcyw2" target="_blank" rel="noopener noreferrer">
                        帮助
                      </a>
                    </Button>
                  </span>
                </div>
              </div>
            </div>

          </div>
          <div className="frame-body">
            <div className="frame-menu">
              <Menu mode="inline"
                defaultOpenKeys={[selectedSub]}
                selectedKeys={[selectedHash]}>
                <SubMenu key="spi" title={
                  <span><Icon type="appstore" />
                    <span>SPI管理</span>
                  </span>}>
                  <Menu.Item key="#/spi">
                    <div onClick={() => this.redirectUrl('#/spi')}>SPI列表</div>
                  </Menu.Item>
                </SubMenu>
              </Menu>
            </div>
            <div className="frame-content">
              <InnerComponent {...this.props} />
            </div>
          </div>
        </div>);
    }
  }
  return Page;
};
