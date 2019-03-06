import React, {PropTypes} from 'react';
import {message} from 'antd';
import ajax from '../../../common/ajax';
import PicViewer from './PicViewer';
import {getMerchantId} from './utils';

const EnvPicViewer = React.createClass({
  propTypes: {
    children: PropTypes.element,
    id: PropTypes.string,
    fileId: PropTypes.string,
  },
  getInitialState() {
    this.merchantId = getMerchantId();
    const {fileId} = this.props;
    return {
      showViewModal: false,
      viewData: null,
      fileId: fileId ? fileId : '',
    };
  },
  showViewModal(id) {
    if (id) {
      const params = {
        id: id,
        op_merchant_id: this.merchantId,
      };
      if (this.merchantId) params.merchantId = this.merchantId;
      ajax({
        url: '/shop/kbshopenv/detailQuery.json',
        method: 'get',
        data: params,
        type: 'json',
        success: (result) => {
          if (result.status === 'succeed') {
            this.setState({
              showViewModal: true,
              viewData: result.data,
              fileId: result.data ? result.data.fileId : '',
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
      });
    }
  },
  hideViewModal() {
    this.setState({
      showViewModal: false,
    });
  },
  render() {
    const {children, id} = this.props;
    const {showViewModal, viewData, fileId} = this.state;
    const picUrl = '/material/view.htm?fileId=' + fileId + '&zoom=original';
    let picviewer = null;
    if (showViewModal) {
      picviewer = (<PicViewer url={picUrl} onClose={this.hideViewModal}>
        {viewData ? <div className="pic-detail">
          <div>{viewData.name}</div>
          <div>适用于{viewData.shopCount}家门店</div>
        </div> : null}
      </PicViewer>);
    }
    return (<div style={{display: 'inline-block'}}>
      <div style={{display: 'inline-block'}} onClick={() => this.showViewModal(id)}>{children}</div>
      {picviewer}
    </div>);
  },
});

export default EnvPicViewer;
