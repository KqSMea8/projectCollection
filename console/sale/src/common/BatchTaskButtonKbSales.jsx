import React from 'react';
import { Button } from 'antd';
import BatchTaskModalForKBSales from '../component/shop/common/BatchTaskModalForKBSales';

// 请求 kbsales 系统的批处理按钮
export default class BatchTaskButtonForKbSales extends React.Component {
  static propTypes = {
    modalTitle: React.PropTypes.string,
    scene: React.PropTypes.string.isRequired,
    maxImportCountText: React.PropTypes.number, // 最大上传数量
  };

  static defaultProps = {
    modalTitle: '批处理',
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
    return (<Button
      type="primary"
      size="large"
      onClick={() => this.showEditModal()}>
      {this.props.children}
      <BatchTaskModalForKBSales
        modalTitle={this.props.modalTitle}
        scene={this.props.scene}
        visible={visible}
        maxImportCountText={this.props.maxImportCountText}
        onCancel={() => this.setState({visible: false})}
        onFinish={() => this.setState({visible: false})}
      />
    </Button>);
  }
}
