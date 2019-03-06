import React from 'react';
import {Button, message} from 'antd';
import ajax from '../../common/ajax';
import './style.less';


const secrecy = React.createClass({
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
      alias: '20171212-2',
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
      alias: '20171212-2',
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
              <span style={{color: 'red'}}>【审慎阅读】</span>您在点击同意本确认函之前，应当认真阅读本协议。当您使用您的支付宝账户确认本确认函后，即表示您已充分阅读、理解并接受本确认函的全部内容。
            </h4>

          </div>
          <h3 style={{textAlign: 'center'}}>双十二活动保密承诺函</h3>
            <h5>致口碑（上海）信息技术有限公司：</h5>
            <p style={{textIndent: '2em'}}>我方有意参加口碑（上海）信息技术有限公司及其关联公司（以下简称“口碑”）开展的<u>“2017年双十二活动”</u>。在洽谈、合作关于“2017年双十二活动”过程中，我方在此同意严格遵守以下各条款：</p>
            <div className="serial">
              <div className="subserial-left">1、</div>
              <div className="subserial-right">在合作过程中，口碑（含贵司员工、服务商、ISV等）提供给我方的关于“双十二活动”的所有资料及信息（包括但不限于活动方案、活动规则、投入预算、活动商户等，以下简称“保密信息”），在口碑未通过公开渠道公布前，我方将严格保密。其中，资料的载体包括但不限于PPT、邮件、文档、口头描述、培训视频、培训直播、即时通讯记录等。</div>
            </div>
            <div className="serial">
              <div className="subserial-left">2、</div>
              <div className="subserial-right">我方同意只在口碑事先许可的范围内使用上述信息，对于上述保密信息，我方同意：1）应有意识地保护此等保密信息，并采取所有必要的保密措施；2）不向公众披露此等保密信息或向第三方披露此等保密信息；3）未经口碑事先书面同意不得在任何情形下使用或许可他人使用此等保密信息。如我方无法确认某些信息是否为保密信息，我方亦将这些信息作为保密信息进行保护。</div>
            </div>
            <div className="serial">
              <div className="subserial-left">3、</div>
              <div className="subserial-right">我方将采取合理的防范措施，至少以等同于保护自己的保密信息时所持之谨慎（至少是合理程度的谨慎保护）保护此等保密信息。未经口碑事先书面同意，我方将不会以任何形式对保密信息进行复制（含以纸张或软件或电子文档形式）、传播。</div>
            </div>
            <div className="serial">
              <div className="subserial-left">4、</div>
              <div className="subserial-right">如此等保密信息未经授权而被使用或披露，或我方有任何违反本承诺的行为，我方将立即书面告知口碑，并会以各种形式协助口碑收回保密信息，制止保密信息被进一步侵害、传播。我方同意应口碑请求归还保密信息和/或销毁全部保密信息副本。</div>
            </div>
            <div className="serial">
              <div className="subserial-left">5、</div>
              <div className="subserial-right">我方将对保密信息给予保密，直至该保密信息被口碑公开。</div>
            </div>
            <div className="serial">
              <div className="subserial-left">6、</div>
              <div className="subserial-right">为了避免不必要的争议，保密信息中不包括：（a）不违反本承诺而已为公众普遍知晓的信息；（b）其他法律规定的情形。</div>
            </div>
            <div className="serial">
              <div className="subserial-left">7、</div>
              <div className="subserial-right">我方在此确认未经授权而进行保密信息使用或披露都将给口碑造成不能挽回的损失和重大的侵害。上述未经授权的披露将使我方或构成不正当竞争的第三方对口碑造成的损害都将是不可挽回的损害。除所有法定的赔偿外，口碑将有权基于合理的判断而对任何实际或可能发生的违反本承诺的行为，向有杭州市西湖区人民法院申请禁止令或适当的救济。我方同意就违反本承诺的行为或强制性义务或未经授权使用或披露保密信息行为而对口碑可能受到的实际损失、侵害，进行赔偿。</div>
            </div>
            <div className="serial">
              <div className="subserial-left">8、</div>
              <div className="subserial-right">若本承诺任一条款因违反法律法规而无效或无法履行，则除该无效或无法履行部分以外，本承诺的其他部分仍然有效。</div>
            </div>
            <div className="serial">
              <div className="subserial-left">9、</div>
              <div className="subserial-right">本承诺自我方邮件回复确认之日起生效。</div>
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

export default secrecy;
