import React, {PropTypes} from 'react';
import {Button} from 'antd';
import LeadsAllocModal from './LeadsAllocModal';

const LeadsAlloc = React.createClass({
  propTypes: {
    selectedIds: PropTypes.array,
    onEnd: PropTypes.func,
  },
  getInitialState() {
    return {
      showModal: false,
    };
  },
  onCancel() {
    this.setState({
      showModal: false,
    });
  },
  onOk() {
    setTimeout(()=> {
      this.setState({
        showModal: false,
      });
      this.props.onEnd();
    }, 300);
  },
  alloc() {
    this.setState({
      showModal: true,
    });
  },
  render() {
    const {selectedIds} = this.props;
    return (<div>
      <Button type="primary" onClick={this.alloc} disabled={selectedIds.length === 0}>分配</Button>
      {this.state.showModal ? <LeadsAllocModal onOk={this.onOk} onCancel={this.onCancel}/> : null}
    </div>);
  },
});

export default LeadsAlloc;
