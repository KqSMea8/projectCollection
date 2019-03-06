/**
 * 自营销通用的详情页 iframe 嵌套
 * 传入参数：url=http...
 */
import React, {PropTypes} from 'react';
import { message } from 'antd';
import { getQueryFromURL, keepSessionAlive } from '../../../common/utils';
import './common.less';

let messageHandler = null;

const MarketingDetail = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },

  getInitialState() {
    return {
      hideCrmhomePage: true,
      url: '',
    };
  },

  componentWillMount() {
    const id = this.props.params.id;
    const url = `${window.APP.crmhomeUrl}/main.htm.kb#/marketing-activity/catering-discount/detail/${id}`;
    this.setState({
      hideCrmhomePage: false,
      url,
    });
  },

  componentDidMount() {
    keepSessionAlive();
    messageHandler = e => { // eslint-disable-line
      try {
        const postData = JSON.parse(e.data);
        const action = postData.action;
        switch (action) {
        case 'warning':
        case 'warn': {
          message.warn(postData.message);
          break;
        }
        case 'error': {
          message.error(postData.message);
          break;
        }
        case 'success': {
          message.success(postData.message);
          break;
        }
        case 'goback': {
          console.log(33333);
          const params = getQueryFromURL(this.props.location.search); // fromUrl 覆盖掉所有跳转逻辑
          const fromUrl = params.fromUrl;
          if (fromUrl) {
            location.href = fromUrl;
          } else if (postData.url && postData.url.indexOf('#/') === 0) {
            location.hash = postData.url;
          } else if (postData.url) {
            location.href = postData.url;
          } else {
            console.log(2222);
            this.props.history.goBack();
          }
          break;
        }
        default:
        }
      } catch (err) {console.log(err);}
    };
    window.addEventListener('message', messageHandler);
  },

  componentWillUnmount() {
    if (messageHandler) {
      window.removeEventListener('message', messageHandler);
    }
  },

  render() {
    return (
      <div className="marking-detail">
        <div className="app-detail-header">
          营销活动 > 活动详情
        </div>
        {/* <iframe src={this.state.url} style={{display: this.state.hideCrmhomePage ? 'none' : 'block'}} width="100%" height="1273" scrolling="no" border="0" frameBorder="0"/> */}
      </div>
    );
  },
});

export default MarketingDetail;
