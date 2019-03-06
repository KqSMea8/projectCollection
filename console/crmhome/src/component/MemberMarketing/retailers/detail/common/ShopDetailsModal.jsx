import React, { PropTypes } from 'react';
import { Modal } from 'antd';
import { getImageById } from '../../../../../common/utils';
import './details.less';

class ShopListModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    modify: PropTypes.bool,
    repastData: PropTypes.any,
    hide: PropTypes.func.isRequired,
  }
  static defaultProps = {
    visible: false,
    repastData: null,
  }
  render() {
    const { repastData, modify } = this.props;
    if (!repastData) {
      return (
        <div className="ant-table-placeholder" style={{ height: 300 }}><span><i className=" anticon anticon-frown" />
          <span>暂无数据</span></span></div>);
    }
    return (<Modal footer={null}
      title={modify ? '修改前商品详情' : '商品详情'}
      visible={this.props.visible}
      onCancel={this.props.hide}>
      <div className="shop-details-modal" style={{ height: 500, overflow: 'auto' }}>
        <div className="detail-modal-title">
          <h3 className="kb-page-sub-title">商品内容</h3>
          <i />
        </div>
        <div>
          {(repastData.contents || []).map((content, idx) => (
            <div key={idx} style={{ display: 'table', width: '100%' }}>
              <div style={{ paddingTop: '10px', display: 'table-row' }}>
                <div style={{ width: '40%', color: '#666', wordBreak: 'break-word', overflow: 'hidden', display: 'table-cell' }}>
                  <span style={{ fontSize: 14, fontWeight: 400 }}>{content.title}</span></div>
                <div style={{ width: '20%', color: '#666', textAlign: 'right', wordBreak: 'break-word', overflow: 'hidden', display: 'table-cell', fontSize: 14, fontWeight: 400 }}>
                  {idx === 0 && '单价'}</div>
                <div style={{ width: '20%', color: '#666', textAlign: 'right', wordBreak: 'break-word', overflow: 'hidden', display: 'table-cell', fontSize: 14, fontWeight: 400 }}>
                  {idx === 0 && '份数'}</div>
                <div style={{ width: '20%', color: '#666', textAlign: 'right', wordBreak: 'break-word', overflow: 'hidden', display: 'table-cell', fontSize: 14, fontWeight: 400 }}>
                  {idx === 0 && '小计'}</div>
              </div>
              {(content.itemUnits || []).map((item, i) => (
                <div key={i} style={{ height: '28px', display: 'table-row' }}>
                  <div style={{ width: '40%', wordBreak: 'break-word', overflow: 'hidden', display: 'table-cell' }}>{item.name}</div>
                  <div style={{ width: '20%', textAlign: 'right', wordBreak: 'break-word', overflow: 'hidden', display: 'table-cell' }}>{item.price}元</div>
                  <div style={{ width: '20%', textAlign: 'right', wordBreak: 'break-word', overflow: 'hidden', display: 'table-cell' }}>{item.amount}{item.unit}{item.spec && `(${item.spec})`}</div>
                  <div style={{ width: '20%', textAlign: 'right', wordBreak: 'break-word', overflow: 'hidden', display: 'table-cell' }}>{item.total}元</div>
                </div>
              ))}
            </div>
          ))}
          {repastData.contents && repastData.contents.length &&
            <div offset={14} style={{ textAlign: 'right' }}>
              价值：{repastData.totalPrice}元
            </div>
          }
        </div>
        <div className="details-modal-ol">
          <ol>
            {
              (repastData.remarks && repastData.remarks.filter(d => !!d) || []).map((key) => {
                return (
                  <li>{key}</li>
                );
              })
            }
          </ol>
        </div>
        {repastData.dishes && repastData.dishes.length > 0 && (
          <div>
            <div className="detail-modal-title">
              <h3 className="kb-page-sub-title">详情图片</h3>
              <i />
            </div>
            {(repastData.dishes).map((item) => (
              <div className="detail-modal-img">
                <div>
                  <p style={{ fontSize: 14, fontWeight: 400 }}>{item.title}</p>
                  <p>{item.desc}</p>
                </div>
                {item.imageUrls && item.imageUrls.length &&
                  <ul>
                    {item.imageUrls.map(imgUrl => (
                      <img src={getImageById(imgUrl)} width="100%" />
                    ))}
                  </ul>
                }
              </div>
            ))}
          </div>
        )}
        {repastData.introductions && repastData.introductions.length > 0 && (
          <div>
            <div className="detail-modal-title">
              <h3 className="kb-page-sub-title">商家介绍</h3>
              <i />
            </div>
            {
              (repastData.introductions).map((item) => {
                return (
                  <div className="detail-modal-img">
                    <div>
                      <p>{item.title}</p>
                    </div>
                    {item.imageUrls && item.imageUrls.length &&
                      <ul>
                        {item.imageUrls.map(imgUrl => (
                          <img src={getImageById(imgUrl)} width="100%" />
                        ))}
                      </ul>
                    }
                  </div>
                );
              })
            }
          </div>
        )}
      </div>
    </Modal>);
  }
}

export default ShopListModal;
