import React, {PropTypes} from 'react';
import OrderServicer from './OrderServicer';
import {Modal} from 'antd';

const IsvModal = React.createClass({
  propTypes: {
    commodity: PropTypes.array,
    handleHide: PropTypes.func,
  },

  splitServices(serviceInfo) {
    let commodityLine = [];
    const commodityPanel = [];
    const resetArr = Array.from({length: serviceInfo.length > 2 ? serviceInfo % 2 : 0}).fill(' ');
    serviceInfo.concat(resetArr).forEach((item, i) => {
      const index = i + 1;
      commodityLine.push(item);
      if (!(index % 2) || index === serviceInfo.length) {
        commodityPanel.push(<div><div className="kb-service-bar">{commodityLine}</div></div>);
        commodityLine = [];
      }
    });
    return commodityPanel;
  },

  render() {
    const {commodity} = this.props;
    if (!commodity && !commodity.length) {
      return <div></div>;
    }

    const serviceInfo = commodity.map((item, i) => {
      return <OrderServicer handleHide={this.props.handleHide} key={i} data={item} />;
    });

    return (<Modal title="请选择想要订购的服务商" visible onCancel={this.props.handleHide} footer={null} >
        {this.splitServices(serviceInfo)}
    </Modal>);
  },
});

export default IsvModal;
