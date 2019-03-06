import React, {PropTypes} from 'react';


/**
 * 配置报名商品/商品报名信息浮层
 */

const ConfigModal = React.createClass({
  propTypes: {
    data: PropTypes.object,
  },

  render() {
    return (<div className="kb-main-center">
      <div className="error-page orange">
        <div className="icon"><i className="anticon anticon-smile-circle"></i></div><div className="sep"></div>
        <div className="description">
          <div className="title">无权限</div>
          <div className="shift">请先申请权限</div>
        </div>
      </div>
    </div>);
  },
});

export default ConfigModal;
