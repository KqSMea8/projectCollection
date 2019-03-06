import React, { PropTypes } from 'react';
import { Modal } from 'antd';
import './detail.less';

class PackageDeatailModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    resData: PropTypes.any,
    hide: PropTypes.func.isRequired,
  }
  static defaultProps = {
    visible: false,
    resData: null,
  }
  // 商品详情和使用须知公用
  getNotesChildren(children) {
    return children && children.map(item => {
      return (<p>{item}</p>);
    });
  }

  // 商品详情和使用须知公用
  getNotes(notes) {
    return notes && notes.map(item => {
      return (<div><p style={{color: '#878787'}}>{item.title}</p>{this.getNotesChildren(item.details)}</div>);
    });
  }
  render() {
    const { resData } = this.props;
    const goodsDetail = resData.itemDesc && resData.itemDesc.filter(item => item.type === '' || item.type === undefined);
    if (!resData) {
      return (
        <div className="ant-table-placeholder" style={{ height: 300 }}><span><i className=" anticon anticon-frown" />
          <span>暂无数据</span></span></div>);
    }
    return (<Modal footer={null}
      title="商品详情"
      visible={this.props.visible}
      onCancel={this.props.hide}>
      <div className="shop-details-modal" style={{ height: 500, overflow: 'auto' }}>
        <div className="detail-modal-title">
          <h3 className="kb-page-sub-title-package">详细内容</h3>
          <i />
        </div>
        <div>{/* 此处为老的商品详情（若有则展示，无则不展示） */}
        {resData.itemDesc && this.getNotes(goodsDetail) || '--'}
        {resData.itemDetailUrl && <div>{resData.itemDetailUrl}</div>}
        </div>
        <div className="detail-modal-title">
          <h3 className="kb-page-sub-title-package">商品内容</h3>
          <i />
        </div>
        <div>
          {(resData.content || []).map((content, idx) => (
            <div key={idx} style={{ display: 'table', width: '100%' }}>
              <div style={{ paddingTop: '10px', display: 'table-row' }}>
                <div style={{ width: '40%', color: '#666', wordBreak: 'break-word', overflow: 'hidden', display: 'table-cell' }}><span>{content.title}</span></div>
                <div style={{ width: '20%', color: '#666', textAlign: 'right', wordBreak: 'break-word', overflow: 'hidden', display: 'table-cell' }}>{idx === 0 && '单价'}</div>
                <div style={{ width: '20%', color: '#666', textAlign: 'right', wordBreak: 'break-word', overflow: 'hidden', display: 'table-cell' }}>{idx === 0 && '份数'}</div>
                <div style={{ width: '20%', color: '#666', textAlign: 'right', wordBreak: 'break-word', overflow: 'hidden', display: 'table-cell' }}>{idx === 0 && '小计'}</div>
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
          {resData.content && resData.content.length &&
            <div offset={14} style={{ textAlign: 'right' }}>
              价值：{resData.totalPrice}元
            </div>
          }
        </div>
        <div className="details-modal-ol">
          <ol>
            {
              (resData.remarks && resData.remarks.filter(d => !!d) || []).map((key) => {
                return (
                  <li>{key}</li>
                );
              })
            }
          </ol>
        </div>
        {resData.itemDesc && resData.itemDesc.length > 0 && (
          <div>
            <div className="detail-modal-title">
              <h3 className="kb-page-sub-title-package">详情图片</h3>
              <i />
            </div>
            {(resData.itemDesc).map((item) => (
              item.type === 'ITEM_DISH' &&
                <div className="detail-modal-img">
                  <div>
                    <p>{item.title}</p>
                    {item.details &&
                      (item.details || []).map(subItem =>{
                        return <p>{subItem}</p>;
                      })
                    }
                  </div>
                  {item.itemImgDtos && item.itemImgDtos.length &&
                    <ul>
                      {item.itemImgDtos.map(subItem => (
                        <a href={subItem.imgUrl} target="_blank">
                          <img src={subItem.imgUrl} width="100%" />
                        </a>
                      ))}
                    </ul>
                  }
                </div>
            ))}
          </div>
        )}
        {resData.itemDesc && resData.itemDesc.length > 0 && (
          <div>
            <div className="detail-modal-title">
              <h3 className="kb-page-sub-title-package">商家介绍</h3>
              <i />
            </div>
            {
              (resData.itemDesc).map((item) => (
                item.type === 'PARTNER_INTRO' &&
                  <div className="detail-modal-img">
                    <div>
                      <p>{item.title}</p>
                    </div>
                    {item.itemImgDtos && item.itemImgDtos.length &&
                      <ul>
                        {item.itemImgDtos.map(subItem => (
                          <a src={subItem.imgUrl} target="_blank">
                            <img src={subItem.imgUrl} width="100%" />
                          </a>
                        ))}
                      </ul>
                    }
                    <div>
                      {item.details &&
                        (item.details || []).map(subItem =>{
                          return <p>{subItem}</p>;
                        })
                      }
                    </div>
                  </div>
              ))
            }

          </div>
        )}
      </div>
    </Modal>);
  }
}

export default PackageDeatailModal;
