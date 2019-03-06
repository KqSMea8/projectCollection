import React from 'react';
import { Tabs, Row, Col } from 'antd';
import MicroblogForm from './MicroblogForm';
import MicroblogTable from './MicroblogTable';
import TreasureForm from './TreasureForm';
import TreasureTable from './TreasureTable';
import { fetUserInfo, fechUnBind } from './service';
import './style.less';

const TabPane = Tabs.TabPane;

class MicroblogList extends React.Component {
  state = {
    params: {},
    treasureParams: {},
    userInfo: {},
  };

  componentDidMount() {
    fetUserInfo().then((res) => {
      this.setState({
        userInfo: res.data.weibo_info,
      });
    });
  }

  onSearch = (params) => {
    this.setState({
      params,
    });
  }

  treasureOnSearch = (treasureParams) => {
    this.setState({
      treasureParams,
    });
  }

  unBindBlog() {
    fechUnBind().then(() => {
      window.location.href = '/merchant/weiboManage.htm';
    });
  }

  render() {
    const { userInfo } = this.state;
    return (
      <div className="m-microblog-header">
        <Row className="kb-page-title" style={{border: 0}}>
          <Col span={18}>
            微博推广
          </Col>
          <Col span={6}>
            <Row>
              <Col span={8}>
                <div className="img-container">
                  <img src={userInfo.avatarImg} alt ="" />
                </div>
              </Col>
              <Col span={16}>
                <p className="name">{userInfo.displayName || ''}</p>
                <p className="link"><a href={`http://weibo.com/u/${userInfo.weiboId}`}>登陆微博</a><a className="symble">|</a><a onClick={this.unBindBlog.bind(this)}>解除绑定</a></p>
              </Col>
            </Row>
          </Col>
        </Row>
        <Tabs>
          <TabPane tab="优惠券" key="coupons">
            <MicroblogForm onSearch={this.onSearch}/>
            <MicroblogTable params={this.state.params}/>
          </TabPane>
          <TabPane tab="宝贝" key="treasure">
            <TreasureForm onSearch={this.treasureOnSearch} />
            <TreasureTable params={this.state.treasureParams}/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default MicroblogList;
