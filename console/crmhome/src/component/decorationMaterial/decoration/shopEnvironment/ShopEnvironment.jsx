import React from 'react';
import {Button, Radio} from 'antd';
import EnvironmentList from './EnvironmentList';
import {getCategoryId} from '../../common/utils';

const RadioGroup = Radio.Group;

const ShopEnvironment = React.createClass({
  getInitialState() {
    return {
      button: null,
      hasEnvironment: false,
      reviewState: '1',
      batchMode: false,
    };
  },
  componentDidMount() {
    this.setButton();
  },
  componentDidUpdate(prevProps, prevState) {
    const {hasEnvironment, batchMode} = this.state;
    if (prevState.hasEnvironment !== hasEnvironment
      || prevState.batchMode !== batchMode) {
      this.setButton();
    }
  },
  setButton() {
    const {hasEnvironment, batchMode} = this.state;
    const button = (!batchMode ? <div style={{position: 'absolute', top: 0, right: 16, zIndex: 1}}>
      <Button type="primary" onClick={this.addEnvironment}>添加环境图</Button>
      {hasEnvironment ? <Button style={{ marginLeft: '8px' }} onClick={this.startBatch}>批量管理</Button> : null}
    </div> : null);
    if (window.location.hash.indexOf('/environment') > -1) {
      this.setState({
        button: button,
      });
    }
  },
  setEnvironment(hasEnvironment) {
    this.setState({
      hasEnvironment,
    });
  },
  addEnvironment() {
    window.parent.postMessage(false, '*');
    window.location.hash = '/decoration/' + getCategoryId() + '/environment/create';
  },
  startBatch() {
    this.setState({
      batchMode: true,
    });
  },
  endBatch() {
    this.setState({
      batchMode: false,
    });
  },
  reviewChange(e) {
    if (e.target.value !== this.state.reviewState) {
      this.setState({
        reviewState: e.target.value,
        batchMode: false,
      });
    }
  },
  render() {
    const {button, hasEnvironment, reviewState, batchMode} = this.state;
    let listContent;
    listContent = <EnvironmentList reviewState={reviewState} batchMode={batchMode} endBatch={this.endBatch} setEnvironment={this.setEnvironment} />;
    return (<div style={{ padding: '0 16px 32px' }}>
      <div className="content-head">
        {button}
        {hasEnvironment || reviewState === '0' ? <span>
          <RadioGroup defaultValue={reviewState} onChange={this.reviewChange}>
            <Radio value="1">审核通过</Radio>
            <Radio value="0">审核不通过</Radio>
          </RadioGroup>
        </span> : null}
      </div>
      {listContent}
    </div>);
  },
});

export default ShopEnvironment;
