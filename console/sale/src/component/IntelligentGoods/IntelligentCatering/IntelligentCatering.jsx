import React, { PropTypes } from 'react';
import { Tabs, Button, message } from 'antd';
import AlreadyPutaway from './AlreadyPutaway';
import WaitingPutaway from './WaitingPutaway';
import { getQueryFromURL, appendOwnerUrlIfDev } from '../../../common/utils';
import '../intelligentgoods.less';
import ajaxWithCache from 'Common/AjaxWithCache';

const TabPane = Tabs.TabPane;

export default class IntelligentGoodsList extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    location: PropTypes.object.isRequired,
  }
  state = {
    showBtn: false,
    tabLocations: {
      stayputaway: {
        query: {},
        search: ''
      },
      putaway: {
        query: {},
        search: ''
      }
    }
  };

  componentWillMount() {
    this.updateTabLocation(this.props);
  }

  componentDidMount() {
    const pid = getQueryFromURL(this.props.location.search).partnerId;
    if (pid) {
      this.checkCreateBtn(pid);
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextPid = getQueryFromURL(nextProps.location.search).partnerId;
    if (nextPid !== getQueryFromURL(this.props.location.search).partnerId) {
      this.checkCreateBtn(nextPid);
    }
    if (nextProps.location !== this.props.location) {
      this.updateTabLocation(nextProps);
    }
  }

  onChange = (key) => {
    const search = this.state.tabLocations[key].search;
    window.location.hash = `/intelligentcatering/list/${key}${search}`;
  }
  setTabLocation(location, key) {
    const { tabLocations } = this.state;
    tabLocations[key] = {
      query: location.query,
      search: location.search
    };
    // console.log(key);
    // console.log(tabLocations);
    this.setState({
      tabLocations
    });
  }
  getActivityKey(props) {
    const { children } = props;
    let activeKey = 'stayputaway';
    if (!children || children.type === WaitingPutaway) {
      activeKey = 'stayputaway';
    } else if (children.type === AlreadyPutaway) {
      activeKey = 'putaway';
    }
    return activeKey;
  }

  updateTabLocation(props) {
    const activeKey = this.getActivityKey(props);
    this.setTabLocation(props.location, activeKey);
  }

  // onChange = (key) => {
  //   const searchParams = getQueryFromURL(this.props.location.search);
  //   if (key === 'stayputaway' && searchParams.partnerId) {
  //     window.location.hash = `/intelligentcatering/list/${key}?partnerId=${searchParams.partnerId}&name=${searchParams.name}`;
  //   } else if (key === 'putaway' && searchParams.partnerId) {
  //     window.location.hash = `/intelligentcatering/list/${key}?partnerId=${searchParams.partnerId}&name=${searchParams.name}`;
  //   } else {
  //     window.location.hash = `/intelligentcatering/list/${key}`;
  //   }
  // }

  checkCreateBtn = (pid) => {
    this.setState({
      showBtn: false,
    });
    if (!pid) {
      return;
    }
    ajaxWithCache({
      url: appendOwnerUrlIfDev(`/proxy.json?mappingValue=kbcateringprod.checkCreateItemBtn&pid=${pid}`),
      method: 'GET',
      success: res => {
        this.setState({
          showBtn: res && res.data && res.data.data && res.data.data.createItemBtnSwitch === 'ON',
        });
      },
      error: () => { },
    });
  }

  gotoCreate = () => {
    const searchParams = getQueryFromURL(this.props.location.search);
    if (!searchParams.partnerId) {
      message.warning('请先选择商户');
      return;
    }
    this.props.history.push(`/catering/new?pid=${searchParams.partnerId}&fromUrl=${encodeURIComponent(window.location.href)}&breadcrumb=${encodeURIComponent('智能商品库')}`);
  }

  render() {
    // const children = this.props.children;
    // let activeKey = 'stayputaway';
    const searchParams = getQueryFromURL(this.props.location.search);
    // if (searchParams.name) {
    //   searchParams.name = decodeURIComponent(searchParams.name);
    // }
    // if (children && children.type === WaitingPutaway) {
    //   activeKey = 'stayputaway';
    // } else if (children && children.type === AlreadyPutaway) {
    //   activeKey = 'putaway';
    // }
    const { tabLocations } = this.state;
    const activeKey = this.getActivityKey(this.props);
    return (<div className="intelligentgoods-list">
      <div className="app-detail-header" style={{ borderBottom: 0 }}>
        智能商品库
      </div>
      {this.state.showBtn && (
        <Button
          disabled={!searchParams.partnerId}
          type="primary"
          size="large"
          className="topbtn"
          onClick={this.gotoCreate}
        >
          新建商品
        </Button>
      )}
      <div className="kb-tabs-main">
        <Tabs
          onChange={this.onChange}
          activeKey={activeKey}
        >
          <TabPane tab="待上架" key="stayputaway">
            <WaitingPutaway searchParams={getQueryFromURL(tabLocations.stayputaway.search)} activeKey={activeKey} location={tabLocations.stayputaway}/>
          </TabPane>
          <TabPane tab="已上架" key="putaway">
            <AlreadyPutaway searchParams={getQueryFromURL(tabLocations.putaway.search)} activeKey={activeKey} location={tabLocations.putaway}/>
          </TabPane>
        </Tabs>
      </div>
    </div>);
  }
}
