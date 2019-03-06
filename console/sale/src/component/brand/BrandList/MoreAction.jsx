import React, {PropTypes} from 'react';
import {Menu} from 'antd';
import TakeOffModal from './TakeOffModal';

const MoreAction = React.createClass({
  propTypes: {
    item: PropTypes.object,
    pid: PropTypes.string,
    index: PropTypes.number,
    refresh: PropTypes.func,
  },

  getInitialState() {
    return {
      showOffModal: false,
      showMarketing: false,
    };
  },

  componentWillMount() {
    this.buildMenu(this.props.item);
  },

  componentWillReceiveProps(nextProps) {
    this.buildMenu(nextProps.item);
  },

  onCancel() {
    this.setState({
      showOffModal: false,
      showMarketing: false,
    });
  },

  buildMenu(item) {
    const { activityStatus } = item;

    this.Menuitems = [];

    this.showDownModal = false;

    this.menu = (
        <Menu>
          {this.Menuitems}
        </Menu>
    );

    const comfirmDown = (
        <Menu.Item key="comfirmDown">
          <a href="#" onClick={this.showTakeOff}>下架</a>
        </Menu.Item>
    );

    if (activityStatus === 'STARTED' || activityStatus === 'PLAN_GOING' || activityStatus === 'PLAN_ENDING') {
      this.Menuitems.push(comfirmDown);
      this.showDownModal = true;
    }
  },

  showTakeOff(event) {
    event.preventDefault();

    this.setState({
      showOffModal: true,
    });
  },

  render() {
    const { activityId } = this.props.item;

    return (
        <div>
          <a target="_blank" href={'#/brand/detail/' + this.props.pid + '/' + activityId}>查看</a>

          {/*
            this.Menuitems && this.Menuitems.length > 0 ? (
                <Dropdown overlay={ this.menu }>
                  <span style={{color: '#2db7f5'}} className="ant-dropdown-link"> | 操作<Icon type="down" /></span>
                </Dropdown>
            ) : null
          */}

          { this.showDownModal ? (<TakeOffModal item={this.props.item} pid={this.props.pid} onCancel={this.onCancel} show={this.state.showOffModal} refresh={this.props.refresh}/>) : null}

        </div>
    );
  },
});

export default MoreAction;
