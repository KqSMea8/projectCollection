import React, { PropTypes } from 'react';
import { Modal, Row, Col } from 'antd';
import { retailersDeliveryChannels } from '../../../config/AllStatus';

const modalTop = window.top !== window ? 0 : 100;

function onlyExternalMedia(publishChannels) {
  return publishChannels.every((ch) => {
    return ch.type === 'EXTERNAL_MEDIA' || ch.type === 'TRAFFIC_CHANNEL';
  });
}

function calcColSpan(cols) {
  return Math.floor(24 / cols);
}

class TabsBottom extends React.Component {
  state = {
    showPreviewModal: false,
  };

  showPreview = () => {
    this.setState({
      showPreviewModal: true,
    });
  }

  closePreview = () => {
    this.setState({
      showPreviewModal: false,
    });
  }

  render() {
    const publishChannels = this.props.data.publishChannels || [];
    return (<table className="kb-detail-table">
      <tbody>
        <tr>
        <td className="kb-detail-table-label">投放渠道</td>
        <td className="kb-detail-table-value" colSpan="5">
          {publishChannels.map(ch => ch.name).join(', ')}
          {(publishChannels.length > 0 && !onlyExternalMedia(publishChannels)) ? (
            <div style={{ display: 'inline-block', marginLeft: 10 }}>
              <a onClick={this.showPreview}>预览</a>
              <Modal ref="modal"
                style={{ top: modalTop }}
                visible={this.state.showPreviewModal}
                onCancel={this.closePreview}
                title="投放渠道预览"
                width="800"
                footer={[]}>
                <Row type="flex" justify="space-around">
                  {publishChannels.map((item, index) => (
                    (retailersDeliveryChannels[item.type] && retailersDeliveryChannels[item.type].img !== '') ? (
                      <Col key={index} span={calcColSpan(publishChannels.length)}>
                        {retailersDeliveryChannels[item.type].label}
                        <img width="90%" src={retailersDeliveryChannels[item.type].img} />
                      </Col>
                    ) : (
                      <Col key={index} span={calcColSpan(publishChannels.length)}>
                        {retailersDeliveryChannels[item.type] ? retailersDeliveryChannels[item.type].label : null}
                        {item.type === 'QR_CODE' && item.extInfoObj &&
                          <img width="90%" src={item.extInfoObj[item.type]} />
                        }
                        {item.type === 'SHORT_LINK' && item.extInfoObj &&
                          <p>{item.extInfoObj[item.type]}</p>
                        }
                      </Col>
                    ))
                  )}
                </Row>
              </Modal>
            </div>
            ) : null
           }
        </td>
        </tr>
      </tbody>
    </table>);
  }
}

TabsBottom.propTypes = {
  data: PropTypes.any,
};

export default TabsBottom;
