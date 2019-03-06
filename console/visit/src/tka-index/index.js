import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import TouchScroll from 'rmc-touchscroll';
import { page } from '@alipay/page-wrapper';
import { TabBar } from '@alipay/qingtai';
import TabMy from './component/tab-my';
import TabTeam from './component/tab-team';

import store from './store';
import spmConfig from './spm.config';
import './style.less';

@page({ store, spmConfig })
class Index extends PureComponent {
  static propTypes = {
    selectedTab: PropTypes.string,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    document.querySelector('.am-tabs-tab-bar-wrap').ontouchmove = TouchScroll.TouchMovePrevent;
  }

  tryInitMyTab() {
    if (this.props.selectedTab !== 'my') return null;
    this.tabMy = <TabMy className="tab-content" />;
    return this.tabMy;
  }

  tryInitTeamTab() {
    if (this.props.selectedTab !== 'team') return null;
    this.tabTeam = <TabTeam className="tab-content" />;
    return this.tabTeam;
  }

  changeTab(tab) {
    this.props.dispatch({ type: 'doChangeTab', payload: tab });
  }

  render() {
    return (<div id="tka-index">
      <TabBar>
        <TabBar.Item key="我的拜访"
          title="我的拜访"
          tintColor="#328ee9"
          icon={<div className="tab-icon-my" />}
          selectedIcon={<div className="tab-icon-my selected" />}
          selected={this.props.selectedTab === 'my'}
          onPress={this.changeTab.bind(this, 'my')}>
          {this.tabMy || this.tryInitMyTab()}
        </TabBar.Item>
        <TabBar.Item key="团队拜访"
          title="团队拜访"
          tintColor="#328ee9"
          icon={<div className="tab-icon-team" />}
          selectedIcon={<div className="tab-icon-team selected" />}
          selected={this.props.selectedTab === 'team'}
          onPress={this.changeTab.bind(this, 'team')}>
          {this.tabTeam || this.tryInitTeamTab()}
        </TabBar.Item>
      </TabBar>
            </div>);
  }
}

kBridge.ready(() => {
  ReactDOM.render(
    <Index />,
    document.querySelector('main'),
  );
});
