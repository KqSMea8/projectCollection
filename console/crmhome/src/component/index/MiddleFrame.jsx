import React from 'react';
import FramePage from './FramePage';
import Index from './Index';
import RetailersIndex from '../MemberMarketing/retailers/index/Index';
import MallIndex from './Mall/Index';

const MiddleFrame = React.createClass({
  render() {
    const {isOrderPlugin, isCommon, isCatering, merchantIndexLink, isMall} = window.APP;
    const { history } = this.props;

    const isKbInput = document.getElementById('J_isFromKbServ');
    const isParentFrame = isKbInput && isKbInput.value === 'true';

    if (isOrderPlugin === 'true') {
      return <FramePage />; // 服务商
    } else if (isCommon === 'true') {
      return <RetailersIndex history={history} />; // 通用 快消
    } else if (isCatering === 'true') {
      if (isParentFrame) {
        return <FramePage />; // 如果是中台还走服务商
      }
      return <Index history={history}/>;
    } else if (isMall === 'true') {
      return <MallIndex />;
    }

    window.location.href = merchantIndexLink;  // eslint-disable-line no-location-assign
  },
});

export default MiddleFrame;
