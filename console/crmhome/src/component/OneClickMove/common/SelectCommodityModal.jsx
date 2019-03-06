import React from 'react';
import { Modal, Button, Radio, Tooltip } from 'antd';
import classnames from 'classnames';

const RadioGroup = Radio.Group;

class SelectCommodityModal extends React.Component {
  static defaultProps = {
    top: 100,
  }
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      items: [],
      selectedCommodity: null,
    };
  }
  componentWillMount() {
    this.update(this.props);
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.update(this.props);
    }
  }
  onChange = (e) => {
    const selectedCommodity = e.target.value;
    this.setState({
      selectedCommodity,
    });
  }
  update(props) {
    this.setState({
      visible: props.visible,
      selectedCommodity: null,
    });
  }
  handleOk = () => {
    this.props.onOk(this.state.selectedCommodity);
  }
  handleCancel = () => {
    this.props.onCancel();
  }
  loadDom = data => {
    let title = data.title || '';
    if (title && data.isWaitConfirm && title.length > 14) {
      title = title.slice(0, 14) + '...';
    } else if (title && !data.isWaitConfirm && title.length > 20) {
      title = title.slice(0, 20) + '...';
    }
    return (<div className="item-content">
      <img src={data.logoUrl} />
      <div className="item-title">
        <Tooltip title={data.title}><span>{title}</span></Tooltip> {data.isWaitConfirm ? <span className="status">待商户确认</span> : null}
      </div>
    </div>);
  }
  render() {
    const {list} = this.props;
    const {selectedCommodity} = this.state;
    return (<Modal
          visible={this.state.visible}
          title="选择应用"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          style={{top: this.props.top}}
          footer={[
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" size="large" onClick={this.handleOk} disabled={!selectedCommodity}>
              确认
            </Button>,
          ]}
        >
        <div style={{padding: '0px 30px'}}>
          <div style={{paddingLeft: 11}}>
            <p>请选择一个商品管理应用，</p>
            <p>选择后，商品将归属于该应用下统一管理</p>
          </div>
          <RadioGroup style={{display: 'block'}} onChange={this.onChange} value={selectedCommodity}>
            {list.map(item => (
              <Radio key={item.commodityId} className={classnames('selectcommoditymodal-item', {'selectcommoditymodal-item-checked': item === selectedCommodity})} value={item} >
                {this.loadDom(item)}
              </Radio>
            ))}
          </RadioGroup>
        </div>
        </Modal>);
  }
}

export default SelectCommodityModal;
