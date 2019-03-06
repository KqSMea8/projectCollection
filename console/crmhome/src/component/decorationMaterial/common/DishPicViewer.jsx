import React, {PropTypes} from 'react';
import {message, Tag} from 'antd';
import ajax from '../../../common/ajax';
import PicViewer from './PicViewer';
import {getMerchantId} from './utils';

const DishPicViewer = React.createClass({
  propTypes: {
    children: PropTypes.element,
    dishId: PropTypes.string,
    fileId: PropTypes.string,
    shopCount: PropTypes.string,
  },
  getInitialState() {
    this.merchantId = getMerchantId();
    return {
      showViewModal: false,
      viewData: null,
    };
  },
  showViewModal(dishId) {
    const {fileId} = this.props;
    if (dishId) {
      const params = {
        dishIds: [dishId],
      };
      if (this.merchantId) params.op_merchant_id = this.merchantId;
      ajax({
        url: '/shop/kbdish/queryByIds.json',
        method: 'get',
        data: params,
        type: 'json',
        success: (result) => {
          if (result.status === 'succeed') {
            this.setState({
              showViewModal: true,
              viewData: result.data[0],
              fileId: result.data[0] ? result.data[0].pictureFileId : '',
            });
          } else {
            message.error(result.resultMsg);
          }
        },
        error: (_, msg) => {
          message.error(msg);
        },
      });
    } else {
      this.setState({
        showViewModal: true,
        fileId: fileId ? fileId : '',
      });
    }
  },
  hideViewModal() {
    this.setState({
      showViewModal: false,
    });
  },
  render() {
    const {children, dishId, shopCount} = this.props;
    const {showViewModal, viewData, fileId} = this.state;
    const picUrl = '/material/view.htm?fileId=' + fileId + '&zoom=original';
    let picviewer = null;
    if (showViewModal) {
      const tags = viewData && viewData.dishTagList.map((v, i) => {
        return v.type ? <Tag key={i} color={v.type === '菜属性' ? 'red' : 'green'}>{v.value}</Tag> : null;
      });
      picviewer = (<PicViewer url={picUrl} onClose={this.hideViewModal}>
        {viewData ? <div className="pic-detail">
          <div>{viewData.dishName}</div>
          {viewData.price !== undefined ? <span className="price">{viewData.price}元</span> : null}
          {shopCount ? <div>适用于{shopCount}家门店</div> : null}
          {tags.length ? <div>{tags}</div> : null}
          {viewData.desc !== undefined ? <div>{viewData.desc}</div> : null}
        </div> : null}
      </PicViewer>);
    }
    return (<div style={{display: 'inline-block'}}>
      <div style={{display: 'inline-block'}} onClick={() => this.showViewModal(dishId)}>{children}</div>
      {picviewer}
    </div>);
  },
});

export default DishPicViewer;
