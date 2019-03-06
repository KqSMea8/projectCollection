import React from 'react';
import { Icon, message } from 'antd';
import ajax from '../../../../common/ajax';

const member = {
  member_pay: false,
  member_card: false,
  member_fwc: false,
};
class GroupsAddTarget extends React.Component {
  static propTypes = {
    handleTarget: React.PropTypes.func,
    handleCheck: React.PropTypes.func,
    isContainThridTag: React.PropTypes.bool,
  }

  state = {
    member_pay: false,
    member_card: false,
    member_fwc: false,
    checkTarget: true,
    memberNumber: {},
    loading: false,
    payCount: '',
    cardCount: '',
    fwcCount: '',
  }
  componentDidMount() {
    ajax({
      url: '/promo/queryMemberNumber.json',
      method: 'GET',
      type: 'json',
      error: (res, errorMsg) => {
        message.error(errorMsg, 3);
        this.setState({ loading: true });
        this.handleAjax('member_pay');
        this.handleAjax('member_card');
        this.handleAjax('member_fwc');
      },
    }).then(({status, data, errorMsg}) => {
      if (status === 'success') {
        this.setState({
          memberNumber: data,
          loading: true,
        });
        if (data.pam_cnt === '-1') {
          this.props.handleCheck();
        } else {
          this.handleAjax('member_pay');
          this.handleAjax('member_card');
          this.handleAjax('member_fwc');
        }
      } else if (errorMsg) {
        message.error(errorMsg, 3);
        this.setState({ loading: true });
      }
    });
  }
  onClick(text) {
    const memberArray = [];
    const { handleTarget } = this.props;
    member[text] = !member[text];
    this.setState({
      ...member,
      checkTarget: false,
    });
    if (member.member_pay) {
      memberArray.push('member_pay');
    }
    if (member.member_card) {
      memberArray.push('member_card');
    }
    if (member.member_fwc) {
      memberArray.push('member_fwc');
    }
    if (!memberArray.join(',')) {
      this.setState({checkTarget: true});
    }
    handleTarget(memberArray.join(','));
  }
  handleAjax(type) {
    const parameter = {
      crowdCondition: [{
        tagCode: 'pam_member_type',
        op: 'IN',
        value: type,
      }],
    };
    if (this.props.isContainThridTag) {
      parameter.isContainThridTag = true;
    }
    ajax({
      url: '/promo/merchant/crowd/calculation.json',
      method: 'POST',
      data: {
        jsonDataStr: JSON.stringify(parameter),
      },
      type: 'json',
      success: response => {
        let data = response.data;
        if (data === 0) {
          data = '0';
        }
        if (type === 'member_pay') {
          this.setState({ payCount: data });
        } else if (type === 'member_card') {
          this.setState({ cardCount: data });
        } else if (type === 'member_fwc') {
          this.setState({ fwcCount: data });
        }
      },
    });
  }
  render() {
    const {checkTarget, payCount, cardCount, fwcCount, loading, memberNumber} = this.state;
    let targetClass = 'groups-target1';
    let targetError = '';
    if (!payCount || !cardCount || !fwcCount) {
      targetClass = 'groups-target2';
      targetError = ' groups-target2-error';
    }
    return (<div>{ loading && memberNumber.pam_cnt !== '-1' ?
        <groups-add-target>
          <div className={(checkTarget && targetClass) + targetError}>
            <div onClick={this.onClick.bind(this, 'member_pay')} className={this.state.member_pay ? 'target' : ''}>
              <h5>支付会员</h5>
              <span className="c9">共 {payCount || '-'} 人</span>
              <Icon type={this.state.member_pay ? 'check-circle' : 'check-circle-o'} className="icon-check" />
            </div>
            <div onClick={this.onClick.bind(this, 'member_card')} className={this.state.member_card ? 'target' : ''}>
              <h5>会员卡会员</h5>
              <span className="c9">共 {cardCount || '-'} 人</span>
              <Icon type={this.state.member_card ? 'check-circle' : 'check-circle-o'} className="icon-check" />
            </div>
            <div onClick={this.onClick.bind(this, 'member_fwc')} className={this.state.member_fwc ? 'target' : ''}>
              <h5>服务窗粉丝</h5>
              <span className="c9">共 {fwcCount || '-'} 人</span>
              <Icon type={this.state.member_fwc ? 'check-circle' : 'check-circle-o'} className="icon-check" />
            </div>
          </div>
        </groups-add-target> : null}
      </div>
    );
  }
}

export default GroupsAddTarget;
