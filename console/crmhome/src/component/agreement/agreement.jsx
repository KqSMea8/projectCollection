import React from 'react';
import {Button, message} from 'antd';
import ajax from '../../common/ajax';
import './style.less';


const agreement = React.createClass({
  getInitialState() {
    return {
      isSigned: '',
    };
  },
  componentDidMount() {
    this.checkMerchantSign();
  },
  fetch() {
    const params = {
      alias: '20171212-1',
    };
    this.setState({
      loading: true,
    });
    const url = '/merchant/merchantSign.json';
    ajax({
      url: url,
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          message.info('签约成功！', 3);
          this.setState({
            isSigned: result.data,
          });
        }
      },
    });
  },
  checkMerchantSign() {
    const params = {
      alias: '20171212-1',
    };
    const checkUrl = '/merchant/merchantSignCheck.json';
    ajax({
      url: checkUrl,
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          this.setState({
            isSigned: result.data && result.data === true,
          });
        }
      },
    });
  },
  render() {
    return (
      <div>
        <div style={{width: '1000px', paddingTop: 50, lineHeight: 5}}>
          <div className="agreement-main">
            <div className="header" style={{lineHeight: 2.5}}>
            <h4>
              <span style={{color: 'red'}}>【审慎阅读】</span>您邮件回复同意本确认函之前，应当认真阅读本确认函。当您邮件回复确认后，即表示您已充分阅读、理解并接受本确认函的全部内容。
            </h4>

          </div>
          <h3 style={{textAlign: 'center'}}>参加“双十二活动”确认函</h3>
            <h5>致口碑（上海）信息技术有限公司：</h5>
            <p style={{textIndent: '2em'}}>贵我双方一直保持着良好的合作关系，且双方共同努力发展本地生活的O2O服务。对于贵方即将于2017年12月份开展针对口碑用户的大型线下活动（以下简称“双十二活动”），我方确认如下：</p>
            <div className="serial">
              <div className="subserial-left">1、</div>
              <div className="subserial-right">我方同意参加口碑开展的2017年“双十二活动”系列活动，具体活动方案、资源投入等由贵我双方另行协商确定。</div>
            </div>
            <div className="serial">
              <div className="subserial-left">2、</div>
              <div className="subserial-right">
                <p>双十二活动期间，我方没有和第三方开展其他类似活动的打算；从消费者体验和安保能力等方面考虑，我方也会一心一意和支付宝及口碑共同做好双十二活动。为使用户在双十二活动期间拥有美好体验，我方保证向用户提供品质最优、价格最优惠的产品和服务。</p>
                <p>为免歧义，本条款中所指的我方所有门店，是指我方名下所有开通了支付宝当面付服务的门店。</p>
              </div>
            </div>
            <div className="serial">
              <div className="subserial-left">3、</div>
              <div className="subserial-right">在合作过程中，贵方（含贵方员工、服务商、ISV等）提供给我方的关于口碑“双十二活动”所有资料（包括但不限于活动方案、活动规则、投入预算、活动商户等），在口碑未通过公开渠道公布前，我方均会严格保密。其中，资料的载体包括但不限于PPT、邮件、纸质文档、口头描述、培训视频、培训直播、即时通讯记录等。</div>
            </div>
            <h5 style={{marginLeft: 8}}>
              <span className="submit-button">特此确认！</span>
            </h5>
            <h5 className="footer">承诺人：口碑商户</h5>
            <div className="button-wrapper">
            <Button type={this.state.isSigned ? 'ghost' : 'primary'} disabled={this.state.isSigned } onClick={this.fetch}>{this.state.isSigned ? '已确认' : '确认'}</Button>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default agreement;
