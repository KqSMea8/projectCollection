import React from 'react';
import ajax from 'Utility/ajax';
import {Spin, Row, message} from 'antd';

const GoodsServiceDetail = React.createClass({
  getInitialState() {
    return {
      frameHeight: 600,
      loading: true,
    };
  },

  componentDidMount() {
    const isKbInput = document.getElementById('J_isFromKbServ');
    const isParentFrame = isKbInput && isKbInput.value === 'true' && window.parent;
    if (isParentFrame) {
      window.parent.addEventListener('scroll', this.handleScroll.bind(this, window.parent), false);
    } else {
      window.addEventListener('scroll', this.handleScroll.bind(this, window), false);
    }

    window.addEventListener('message', (e) => {
      if (e.data && typeof e.data === 'string') {
        const data = JSON.parse(e.data);
        const {pageHeight, scrollTop } = data;
        if (pageHeight) {
          this.setState({frameHeight: pageHeight});
        }
        if (!isNaN(Number(scrollTop))) {
          if (isParentFrame) {
            window.parent.scrollTo(0, scrollTop);
          } else {
            window.scrollTo(0, scrollTop);
          }
        }
      }
    }, false);

    if (this.props.location.query.commodityId && this.props.location.query.op_merchant_id) {
      this.getServiceDetail(this.props.location.query.commodityId, this.props.location.query.op_merchant_id);
    }
  },

  componentWillUnmount() {
    const isKbInput = document.getElementById('J_isFromKbServ');
    if (isKbInput && isKbInput.value === 'true' && window.parent) {
      window.parent.removeEventListener('scroll', this.handleScroll.bind(this, window.parent), false);
    } else {
      window.removeEventListener('scroll', this.handleScroll.bind(this, window), false);
    }
  },

  // 获取内嵌页面的详细信息
  getServiceDetail(commodityId, pid) {
    ajax({
      url: window.APP.crmhomeUrl + '/goods/getIsvLink.json.kb?commodityId=' + commodityId + '&op_merchant_id=' + pid,
      success: (result) => {
        if (result.status === 'succeed') {
          if (result.result.redirectUrl) {
            this.setState({
              redirectUrl: result.result.redirectUrl,
              loading: false,
            });
          } else {
            this.setState({
              loading: false,
            });
            message.error('暂无数据', 3);
          }
        }
      },
      error: (err) => {
        this.setState({
          loading: false,
        });
        message.error(err.resultMsg, 3);
      },
    });
  },


  handleScroll(win) {
    if (this.frame) {
      this.frame.contentWindow.postMessage(`{"scrollTop": ${win.pageYOffset || win.document.body.scrollTop}, "windowHeight": ${win.document.documentElement.clientHeight}}`, '*');
    }
  },

  render() {
    return (
      <div>
        {
          this.state.loading && <Row style={{textAlign: 'center', marginTop: 80}}><Spin/></Row>
        }
        {
          this.state.redirectUrl &&
          <div>
            <iframe ref={dom => this.frame = dom} src={this.state.redirectUrl} width="100%" height="1273" scrolling="no" border="0" frameBorder="0" style={{height: this.state.frameHeight}}></iframe>
          </div>
        }
      </div>
    );
  },
});

export default GoodsServiceDetail;
