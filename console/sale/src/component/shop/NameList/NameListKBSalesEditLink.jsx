import React from 'react';
import BatchTaskModalForKBSales from '../common/BatchTaskModalForKBSales';

export default class extends React.Component {

  static propTypes = {
    scene: React.PropTypes.string.isRequired,
    maxImportCountText: React.PropTypes.number,
  };

  static defaultProps = {
    maxImportCountText: 1000,
  };

  state = {
    visible: false,
  };

  showEditModal() {
    this.setState({
      visible: true,
    });
  }

  render() {
    const { visible } = this.state;
    return (<div>
      <a href="#" onClick={(e) => { e.preventDefault(); this.showEditModal(); }}>修改</a>
      <BatchTaskModalForKBSales
        modalTitle="编辑名单"
        scene={this.props.scene}
        visible={visible}
        maxImportCountText={this.props.maxImportCountText}
        onCancel={() => this.setState({visible: false})}
        onFinish={() => this.setState({visible: false})}
      />
    </div>);
  }
}
