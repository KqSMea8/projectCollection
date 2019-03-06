import React from 'react';
import PropTypes from 'prop-types';
import { Result, Icon, Button } from '@alipay/qingtai';
import { popPage } from '@alipay/kb-m-biz-util';
import { toAbsoluteUrl } from '../../common/util';
import { spmNavBarSubmitSucFinish } from '../spm.config';
import './submit-result.less';

export default class extends React.Component {
  static propTypes = {
    recordId: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    visitTime: PropTypes.string.isRequired,
    merchantName: PropTypes.string.isRequired,
  };

  componentDidMount() {
    kBridge.call('setNavigationBar', '提交结果');
    kBridge.call('setOptionButton', {
      items: [{ title: '完成' }],
      onClick: () => {
        if (window.Tracert && Tracert.click) Tracert.click(spmNavBarSubmitSucFinish);
        popPage(true);
      },
    });
    kBridge.call('onBack', () => {
      popPage(true);
    });
    kBridge.call('allowBack', false);
  }

  onClickAddContinue = () => {
    kBridge.call('setOptionButton', { items: [] });
    kBridge.call('setNavigationBar', '添加拜访');
    window.location.reload();
  };

  onClickShare = () => {
    const { recordId, userName, visitTime, merchantName } = this.props;
    dd.biz.util.share({
      type: 1, // 分享类型，0:全部组件 默认； 1:只能分享到钉钉；2:不能分享，只有刷新按钮
      url: toAbsoluteUrl(`./tka-visit-detail.html?id=${recordId}`),
      title: `【${userName}的拜访小记记录】`,
      content: `【拜访商户：${merchantName}，拜访时间：${visitTime}】`,
    });
  };

  render() {
    return (<div className="submit-result">
      <Result title="提交成功" img={<Icon type="check-circle" style={{ fill: '#1F90E6' }} />} />
      <div className="action-btns">
        <Button className="btn-continue" inline size="small" onClick={this.onClickAddContinue}>继续添加拜访</Button>
        <Button className="btn-share" inline size="small" type="primary" onClick={this.onClickShare}>分享</Button>
      </div>
            </div>);
  }
}
