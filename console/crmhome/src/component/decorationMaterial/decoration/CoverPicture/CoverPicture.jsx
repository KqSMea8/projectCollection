import React from 'react';
import { message, Button, Spin, Table } from 'antd';
import ajax from '../../../../common/ajax';
import CoverRemoveAction from './CoverRemoveAction';
import { getCategoryId } from '../../common/utils';
import { kbScrollToTop } from '../../../../common/utils';
import PicViewer from '../../common/PicViewer';
import CoverShopTreeModal from '../../common/CoverShopTreeModal';

const CoverPicture = React.createClass({
  getInitialState() {
    return {
      hasCoverPicture: false,
      loading: true,
      tableLoading: false,
      button: null,
      data: [],
      pagination: {
        showSizeChangeer: true,
        showQuickJumper: true,
        showTotal: total => `共${total}个记录`,
        current: 1,
        pageSize: 10,
        total: 0,
      },
      showViewModal: false,
      fileId: '',
      showShopTreeModal: false,
      fileGroupId: '',
    };
  },
  componentDidMount() {
    this.fetch();
  },
  componentDidUpdate(prevProps, prevState) {
    const { hasCoverPicture } = this.state;
    if (prevState.hasCoverPicture !== hasCoverPicture) {
      this.setButton();
    }
  },
  onTableChange(pagination) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    this.fetch();
  },
  setButton() {
    const { hasCoverPicture } = this.state;
    const button = hasCoverPicture ? (
      <div style={{ position: 'absolute', top: 0, right: 16, zIndex: 1 }}>
        <Button type="primary" onClick={this.goCreate}>
          添加封面图
        </Button>
      </div>
    ) : null;
    if (window.location.hash.indexOf('/cover') > -1) {
      this.setState({
        button,
      });
    }
  },
  getColumns() {
    const { goEdit, refresh, showViewModal, showShopTreeModal } = this;
    const columns = [
      {
        title: '列表图',
        width: 360,
        dataIndex: 'cover',
        render(text) {
          return (
            <a onClick={() => showViewModal(text.fileId)} className="kb-photo-picker-list-item">
              <img src={text.picUrl} />
            </a>
          );
        },
      },
      {
        title: '创建时间',
        width: 160,
        dataIndex: 'createTime',
      },
      {
        title: '适用门店',
        render(text, record) {
          let res;
          if (!record.relatedShopsCount) {
            res = '';
          } else if (record.relatedShopsCount > 1) {
            res = (
              <a onClick={() => showShopTreeModal(record.fileGroupId)}>
                {record.relatedShops}等{record.relatedShopsCount}家
              </a>
            );
          } else if (Number(record.relatedShopsCount) === 1) {
            res = (
              <a onClick={() => showShopTreeModal(record.fileGroupId)}>{record.relatedShops}</a>
            );
          }
          return res;
        },
      },
      {
        title: '操作',
        width: 100,
        render(text, record) {
          return (
            <div>
              <a style={{ marginRight: 10 }} onClick={() => goEdit(record.fileGroupId)}>
                修改
              </a>
              <CoverRemoveAction fileGroupId={record.fileGroupId} refresh={refresh} />
            </div>
          );
        },
      },
    ];
    return columns;
  },
  showViewModal(id) {
    this.setState({
      showViewModal: true,
      fileId: id,
    });
  },
  hideViewModal() {
    this.setState({
      showViewModal: false,
    });
  },
  showShopTreeModal(id) {
    kbScrollToTop();
    this.setState({
      showShopTreeModal: true,
      fileGroupId: id,
    });
  },
  hideShopTreeModal() {
    this.setState({
      showShopTreeModal: false,
    });
  },
  fetch() {
    const { pagination } = this.state;
    const { current, pageSize } = pagination;
    this.setState({
      tableLoading: true,
    });
    const params = {
      categoryCode: getCategoryId(),
      pageNum: current,
      pageSize,
    };
    ajax({
      url: '/shop/shopsurface/pageQuery.json',
      method: 'get',
      data: params,
      type: 'json',
      success: data => {
        if (data.status === 'succeed') {
          const result = data.result;
          result.ShopSurfaceVO.forEach(v => (v.key = v.fileGroupId));
          pagination.total = result.count;
          this.setState({
            hasCoverPicture: !!result.count && result.count > 0,
            data: result.ShopSurfaceVO,
            loading: false,
            tableLoading: false,
            pagination,
          });
        } else {
          message.error(data.resultMsg);
        }
      },
      error: (_, msg) => {
        message.error(msg);
      },
    });
  },
  refresh(type, delectCount) {
    const { current, pageSize, total } = this.state.pagination;
    if (
      type === 'remove' &&
      current > 1 &&
      current === Math.ceil(total / pageSize) &&
      total % pageSize === delectCount
    ) {
      const paper = this.state.pagination;
      paper.current = paper.current - 1;
      this.setState({
        pagination: paper,
      });
    }
    setTimeout(() => {
      this.fetch();
    }, 500);
  },
  goCreate() {
    kbScrollToTop();
    window.location.hash = '/decoration/' + getCategoryId() + '/cover/create';
  },
  goEdit(id) {
    kbScrollToTop();
    window.location.hash = '/decoration/' + getCategoryId() + '/cover/edit/' + id;
  },
  render() {
    const {
      hasCoverPicture,
      loading,
      tableLoading,
      button,
      data,
      pagination,
      fileGroupId,
      showViewModal,
      showShopTreeModal,
      fileId,
    } = this.state;
    let content;
    if (!loading) {
      if (tableLoading || hasCoverPicture) {
        content = (
          <div className="cover-list">
            <div className="content-head">{button}</div>
            <Table
              columns={this.getColumns()}
              dataSource={data}
              loading={tableLoading}
              pagination={pagination}
              onChange={this.onTableChange}
            />
            {showShopTreeModal ? (
              <CoverShopTreeModal fileGroupId={fileGroupId} onCancel={this.hideShopTreeModal} />
            ) : null}
            {showViewModal ? (
              <PicViewer
                url={'/material/view.htm?fileId=' + fileId + '&zoom=original'}
                onClose={this.hideViewModal}
              />
            ) : null}
          </div>
        );
      } else {
        content = (
          <div className="cover-no-content">
            <div className="button-wrap">
              <Button type="primary" size="large" onClick={this.goCreate}>
                添加封面图
              </Button>
            </div>
            <div className="divide" />
            <div className="img-wrap">
              <div className="l">
                <p>列表图将展示在“支付宝APP-口碑-列表”</p>
                <img
                  width="250"
                  src="https://zos.alipayobjects.com/rmsportal/YGPKxkZahsGwpytlfSAE.jpg"
                />
              </div>
            </div>
          </div>
        );
      }
    } else {
      content = <Spin />;
    }
    return <div style={{ padding: '0 16px 32px' }}>{content}</div>;
  },
});

export default CoverPicture;
