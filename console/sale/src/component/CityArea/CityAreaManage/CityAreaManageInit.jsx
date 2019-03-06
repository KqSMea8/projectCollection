import './CityAreaManage.less';
import React, {PropTypes} from 'react';
import { Icon } from 'antd';

const CityAreaManageInit = React.createClass({
  propTypes: {
    addCity: PropTypes.func,
  },
  getInitialState() {
    return null;
  },
  onClick() {
    this.props.addCity('init');
  },
  render() {
    return (
      <div className="right-init-panel">
          <p className="right-init-p">当前城市尚未创建网格，及时管理，更针对性帮助业务成长。</p>
          <div className="right-init-plus" onClick={this.onClick}><Icon type="plus-circle-o" /> 新增下级网格</div>
      </div>
    );
  },
});

export default CityAreaManageInit;
