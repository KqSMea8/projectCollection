import React from 'react';
import { Modal, Button, Radio} from 'antd';
import classnames from 'classnames';

const RadioGroup = Radio.Group;

class SelectCommodityModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }
  onChange = (e) => {
    const selectedCommodity = e.target.value;
    this.props.onChange(selectedCommodity);
  }
  handleOk = () => {
    this.props.onOk(this.props.selectedCommodity);
  }
  handleCancel = () => {
    this.props.onCancel();
  }
  render() {
    const {visible, list, selectedCommodity} = this.props;
    return (<Modal
          visible={visible}
          title="选择应用"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" size="large" onClick={this.handleOk} disabled={!selectedCommodity} loading={this.props.loading}>
              确认
            </Button>,
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>
          ]}
        >
        <div style={{padding: '0px 40px'}}>
          <p>请选择一个商品管理应用，</p>
          <p>选择后，商品将归属于该应用下统一管理</p>
          <RadioGroup style={{display: 'block'}} onChange={this.onChange} value={selectedCommodity}>
            {list.map((item) => <Radio className={classnames('selectcommoditymodal-item', {'selectcommoditymodal-item-checked': item === selectedCommodity})} value={item} >
                <div className="item-content">
                  <img src={item.logoUrl} />
                  <div className="item-title">
                    {item.title} {item.isWaitConfirm ? <span className="status">待商户确认</span> : null}
                  </div>
                </div>
              </Radio>)}
          </RadioGroup>
        </div>
        </Modal>);
  }
}

export default SelectCommodityModal;
