import React from 'react';
import {Button, message} from 'antd';
import ajax from 'Utility/ajax';
import './agreement20171212.less';

const agreement = React.createClass({
  getInitialState() {
    return {
      isSigned: '',
    };
  },
  componentDidMount() {
    this.checkMerchantSign();
  },
  onClickConfirmed() {
    const params = {
      alias: 'kb20171212',
    };
    this.setState({
      loading: true,
    });
    const url = window.APP.crmhomeUrl + '/merchant/koubei/sign.json.kb';
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
      alias: 'kb20171212',
    };
    const checkUrl = window.APP.crmhomeUrl + '/merchant/koubei/merchantSignCheck.json.kb';
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
      <div className="agreement20171212">
        <div style={{width: '1000px', paddingTop: 50, lineHeight: 5}}>
          <div className="agreement-main">
            <div className="header" style={{lineHeight: 2.5}}>
            <h4>
              <span style={{color: 'red'}}>【签约主体】</span>您作为和口碑（上海）信息技术有限公司及其关联公司的合作伙伴（含合作伙伴的员工），在为口碑【2017 年双十二活动】提供服务过程中，您需要遵守相应保密义务。
            </h4>
            <h4>
              <span style={{color: 'red'}}>【审慎阅读】</span>您在点击同意本确认函之前，应当认真阅读本承诺函所有内容。当您使用您的支付宝账户确认本确认函后，即表示您已充分阅读、理解并接受本确认函的全部内容。
            </h4>

          </div>
          <h2 style={{textAlign: 'center', margin: '1em'}}>双十二活动保密承诺函</h2>
            <p style={{textIndent: '2em'}}>我方为口碑（上海）信息技术有限公司及其关联公司（以下简称“披露方”）的<u>“2017年双十二”活动提供相关服务</u>，在提供服务过程中，我方在此同意严格遵守以下各条款：</p>
            <div className="serial">
              <div className="subserial-left">1、</div>
              <div className="subserial-right">在合作过程中，披露方（含贵司员工或其他合作伙伴等）提供给我方的关于口碑“双十二活动”所有资料及信息（包括但不限于活动方案、活动规则、投入预算、活动商户等），在口碑未通过公开渠道公布前，我方均会严格保密。其中，资料的载体包括但不限于PPT、邮件、纸质文档、口头描述、培训视频、培训直播、<span style={{color: 'red'}}>即时通讯记录</span>等。</div>
            </div>
            <div className="serial">
              <div className="subserial-left">2、</div>
              <div className="subserial-right">
                <p>我方同意只在披露方事先许可的范围内使用上述信息，对于上述秘密信息，我方同意：1）应有意识地保护此等秘密信息，并采取所有必要的保密措施；2）不向公众披露此等秘密信息或向第三方披露此等秘密信息；3）未经披露方事先书面同意不得在任何情形下使用或许可他人使用此等秘密信息。<span style={{color: 'red'}}>4）不利用保密信息获取不正当利益，不进行侵害口碑或其他第三方合法权益的行为。</span>如我方无法确认某些信息是否为秘密信息，我方亦将这些信息作为秘密信息进行保护。</p>
              </div>
            </div>
            <div className="serial">
              <div className="subserial-left">3、</div>
              <div className="subserial-right">我方将采取合理的防范措施，至少以等同于保护自己的保密信息时所持之谨慎（至少是合理程度的谨慎保护）保护此等秘密信息。</div>
            </div>
            <div className="serial">
              <div className="subserial-left">4、</div>
              <div className="subserial-right">如此等秘密信息未经授权而被使用或披露，或我方有任何违反本承诺的行为，我方将立即书面告知披露方，并会以各种形式协助披露方收回秘密信息，制止秘密信息被进一步侵害。我方同意应披露方请求归还秘密信息和/或销毁全部秘密信息副本。</div>
            </div>
            <div className="serial">
              <div className="subserial-left">5、</div>
              <div className="subserial-right">我方有义务对秘密信息给予保密，直至该秘密信息被披露方公开。</div>
            </div>
            <div className="serial">
              <div className="subserial-left">6、</div>
              <div className="subserial-right">为了避免不必要的争议，秘密信息中不包括：（a）不违反本承诺而已为公众普遍知晓的信息；（b）其他法律规定的情形。</div>
            </div>
            <div className="serial">
              <div className="subserial-left">7、</div>
              <div className="subserial-right">我方在此确认未经授权而进行秘密信息使用或披露都将给披露方造成不能挽回的损失和重大的侵害。上述未经授权的披露将使我方或构成不正当竞争的第三方对披露方造成的损害都将是不可挽回的损害。除所有法定的赔偿外，披露方将有权基于合理的判断而对任何实际或可能发生的违反本承诺的行为，向有管辖权人民法院申请禁止令或适当的救济。我方同意就违反本承诺的行为或强制性义务或未经授权使用或披露秘密信息行为而对披露方可能受到的全部损失、侵害，有我方承担。</div>
            </div>
            <div className="serial">
              <div className="subserial-left">8、</div>
              <div className="subserial-right">若本承诺任一条款因违反法律法规而无效或无法履行，则除该无效或无法履行部分以外，本承诺的其他部分仍然有效。</div>
            </div>
            <div className="serial">
              <div className="subserial-left">9、</div>
              <div className="subserial-right">本承诺自我方签字之日起生效，受中华人民共和国法律管辖，不得与相关法律相抵触。因本承诺而产生或与本承诺有关的任何争议，披露方有权向杭州市西湖区人民法院提起诉讼。</div>
            </div>
            <h4 className="footer">承诺人：口碑合作伙伴（或口碑合作伙伴员工）</h4>
            <div className="button-wrapper">
            <Button type={this.state.isSigned ? 'ghost' : 'primary'} disabled={this.state.isSigned } onClick={this.onClickConfirmed}>{this.state.isSigned ? '已确认' : '确认'}</Button>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default agreement;
