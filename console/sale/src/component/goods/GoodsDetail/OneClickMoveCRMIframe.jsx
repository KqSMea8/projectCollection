import React from 'react';
import { message, Breadcrumb, Button } from 'antd';
import FeedbackErrorModal from './Modals/FeedbackErrorModal';
import { getQueryFromURL, getElementOffset } from '../../../common/utils';
import ajax from '../../../common/utility/ajax';

let messageHandler = null;
let scrollHandler = null;

export default class OneClickMoveCRMIframe extends React.PureComponent {
  static propTypes = {
    history: React.PropTypes.object,
    location: React.PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      height: '2000',
      width: '100%',
      visible: false
    };
  }

  componentDidMount() {
    messageHandler = e => { // eslint-disable-line
      const postData = JSON.parse(e.data);
      const action = postData.action;
      switch (action) {
      case 'scrollTop': {
        if (postData.scrollTop !== undefined) {
          window.document.body.scrollTop = postData.scrollTop;
        }
        break;
      }
      case 'scrollTopByValidate': {
        if (postData.scrollTop !== undefined) {
          const iframeOffset = getElementOffset(this.frame);
          // console.log(`iframeTop-${iframeOffset.top}`);
          window.document.body.scrollTop = postData.scrollTop + (iframeOffset.top || 126);
        }
        break;
      }
      case 'iframeHeight': {
        this.setState({
          height: postData.height || 2000
        });
        break;
      }
      case 'iframeWidth': {
        this.setState({
          width: postData.width || '100%'
        });
        break;
      }
      case 'warning':
      case 'warn': {
        message.warn(postData.message);
        break;
      }
      case 'error': {
        message.error(postData.message);
        break;
      }
      case 'goback': {
        const params = getQueryFromURL(this.props.location.search); // fromUrl 覆盖掉所有跳转逻辑
        const fromUrl = params.fromUrl;
        if (fromUrl) {
          location.href = fromUrl;
        } else if (postData.url && postData.url.indexOf('#/') === 0) {
          location.hash = postData.url;
        } else if (postData.url) {
          location.href = postData.url;
        } else {
          this.props.history.goBack();
        }
        break;
      }
      case 'success': {
        message.success(postData.message);
        break;
      }
      default:
      }
    };
    scrollHandler = () => {
      if (this.frame && this.frame.contentWindow) {
        const win = this.frame.contentWindow;
        win.postMessage(JSON.stringify({ scrollTop: document.body.scrollTop }), '*');
      }
    };

    window.addEventListener('message', messageHandler);
    window.addEventListener('scroll', scrollHandler);
  }

  componentWillUnmount() {
    if (messageHandler) {
      window.removeEventListener('message', messageHandler);
    }
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler);
    }
  }

  onCancel() {
    this.setState({
      visible: false,
    });
  }

  onOk() {
    const params = getQueryFromURL(this.props.location.search);
    const { leadsId, pid } = params;
    ajax({
      url: window.APP.kbservcenterUrl + `/proxy.json`,
      method: 'post',
      data: {
        partnerId: pid,
        leadsId: leadsId,
        mappingValue: 'kbcateringprod.manualRefreshLeads',
        testUrl: window.APP.kbcateringprod
      },
      success: (resp) => {
        if (resp.status === 'succeed') {
          message.success('反馈成功', 1);
        } else {
          message.error(resp.resultMsg || '系统异常', 1);
        }
      },
      error: (e) => {
        message.error(e.resultMsg || '系统异常', 1);
      },
    });

    this.setState({
      visible: false,
    });
  }

  FeedbackError() {
    this.setState({
      visible: true
    });
  }

  /* eslint-disable */
  get iframeUrl() {
    /* eslint-enable */
    const isCatering = this.props.location.pathname === '/catering/oneclickmove';
    const isCateringProd = ['/catering/detail', '/catering/edit', '/catering/new'].indexOf(this.props.location.pathname) !== -1;
    const params = getQueryFromURL(this.props.location.search);
    const baseUrl = `${window.APP.crmhomeUrl}/main.htm.kb?op_merchant_id=${params.pid}`;
    if (isCatering) {
      // 餐饮 - 智能商品库
      if (params.itemType === 'ITEM' && params.type === 'detail') {
        return `${baseUrl}#/catering/detail?leadsId=${params.leadsId}`;
      } else if (params.itemType === 'ITEM' && params.type === 'edit') {
        return `${baseUrl}#/catering/edit?leadsId=${params.leadsId}`;
      } else if (params.itemType === 'MANJIAN' && params.type === 'edit') {
        return `${baseUrl}#/catering/offwhenover?leadsId=${params.leadsId}`;
      } else if (params.itemType === 'RATE' && params.type === 'edit') {
        return `${baseUrl}#/catering/discount?leadsId=${params.leadsId}`;
      } else if (params.itemType === 'VOUCHER' && params.type === 'edit') {
        return `${baseUrl}#/catering/cashdiscount?leadsId=${params.leadsId}`;
      } else if (params.type === 'detail') {
        return `${baseUrl}#/catering/promodetail?leadsId=${params.leadsId}`;
      }
    } else if (isCateringProd) {
      // 餐饮 - 商品
      const fromUrl = `${location.protocol}//${location.hostname}${location.port ? ':' : ''}${location.port}${location.pathname}#/catering/list`;
      if (this.props.location.pathname === '/catering/new') {
        return `${baseUrl}#${this.props.location.pathname}?fromUrl=${encodeURIComponent(fromUrl)}`;
      }
      if (this.props.location.pathname === '/catering/detail' && ['MANJIAN', 'VOUCHER', 'RATE'].indexOf(params.itemType) !== -1 && params.campid) {
        return `${window.APP.crmhomeUrl}/goods/itempromo/newPromoDetail.htm.kb?campId=${params.campid}&op_merchant_id=${params.pid}`;
      }
      return `${baseUrl}#${this.props.location.pathname}?sequenceId=${params.sequenceId || ''}&itemId=${params.itemId || ''}&fromUrl=${encodeURIComponent(fromUrl)}`;
    } else {
      // 泛行业
      if (params.type === 'detail') {
        return `${baseUrl}#/oneclickmove-generic/gooddetail?leadsId=${params.leadsId}`;
      } else if (params.type === 'shelvedGoodsDetail') {// 已上架查看详情
        return `${baseUrl}#/oneclickmove-generic/shelvedgooddetail?itemId=${params.itemId}`;
      } else if (params.type === 'edit') {
        return `${baseUrl}#/oneclickmove-generic/editproduct/${params.leadsId}?partnerName=${encodeURIComponent(params.partnerName)}`;
      }
    }
  }

  goBack = () => {
    this.props.history.goBack();
  }

  get breadCrumb() {
    const pathname = this.props.location.pathname;
    const search = this.props.location.search;
    const params = getQueryFromURL(search);
    if (pathname.indexOf('catering/edit') >= 0 && search.indexOf('sequenceId') >= 0
      || pathname.indexOf('catering/new') >= 0
      || pathname.indexOf('catering/detail') >= 0
    ) {
      const fromUrl = params.fromUrl;
      return (
        <Breadcrumb.Item><a onClick={() => {
          if (fromUrl) {
            location.href = fromUrl;
          } else {
            this.props.history.push('/catering/list');
          }
        }}>{params.breadcrumb || '商品管理'}</a></Breadcrumb.Item>
      );
    }
    return <Breadcrumb.Item><a onClick={this.goBack}>智能商品库</a></Breadcrumb.Item>;
  }

  render() {
    const params = getQueryFromURL(this.props.location.search);
    const { visible } = this.state;
    return (
      <div>
        <div className="app-detail-header">
          {params.itemType === 'ITEM' && params.type === 'edit' && params.status === 'INIT' && (
            <Button onClick={this.FeedbackError.bind(this)} style={{ float: 'right' }}>
              反馈报错
            </Button>
          )}
          <Breadcrumb separator=">">
            {this.breadCrumb}
            <Breadcrumb.Item>{params.subbreadcrumb || (params.type === 'detail' ? '在线购买商品详情' : '在线购买商品')}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <FeedbackErrorModal
          visible={visible}
          key={visible}
          onCancel={this.onCancel.bind(this)}
          onOk={this.onOk.bind(this)}
        />
        <iframe ref={dom => this.frame = dom}
          id="oneclickframe"
          src={this.iframeUrl}
          width={this.state.width}
          width="100%" height={this.state.height} scrolling="no" frameBorder="0">
        </iframe>
      </div>
    );
  }
}
