import React, {PropTypes} from 'react';
import {Button} from 'antd';

const DashBoard = React.createClass({
  propTypes: {
    items: PropTypes.array,
  },

  render() {
    const {items} = this.props;
    const dataItems = items.map((v, i) => {
      return (
        <div className="item" key={i} style={i === 3 ? {marginRight: 0} : {}}>
          {v.logo ? <img src={v.logo} /> : null}
          {v.mainTitle ? <div className="main-text">{v.mainTitle}</div> : null}
          {v.subTitle ? <div className="sub-text">{v.subTitle}</div> : null}
          {v.btnText ? <Button size="large" type="ghost" onClick={v.btnCb}>{v.btnText}</Button> : null}
        </div>
      );
    });

    return (
      <div className="index-memberboard-wrap">
         <div className="index-title">
          <div className="kb-form-sub-title-icon"></div>
          触手可得的优质营销服务
          <p className="index-sub-title">（以下服务由服务商CRM系统提供）</p>
        </div>
        <div className="index-sceneboard-container">
          {dataItems}
        </div>
      </div>
    );
  },
});

export default DashBoard;
