import React, {PropTypes} from 'react';
import {Button, Radio, message, Checkbox, Pagination, Spin, Modal} from 'antd';
import ajax from '../../../../common/ajax';
import {getMerchantId, kbScrollToTop} from '../../common/utils';
import classnames from 'classnames';
import PicViewer from '../../common/PicViewer';
import Clamp from '../../common/MultiCamp';
const RadioGroup = Radio.Group;

const CommonList = React.createClass({
  propTypes: {
    type: PropTypes.string,
    typeName: PropTypes.string,
    categoryId: PropTypes.string,
  },

  getInitialState() {
    this.merchantId = getMerchantId();
    return {
      status: 'EFFECTIVE',
      batch: false,
      data: [],
      selectId: [],
      loading: false,
      showPicView: false,
      picViewInfo: {},
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共${total}个记录`,
        current: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },


  componentDidMount() {
    this.componentDidUpdate();
  },

  componentDidUpdate() {
    const {type, categoryId} = this.props;
    if (type !== this.type || categoryId !== this.categoryId) {
      this.type = type;
      this.categoryId = categoryId;
      this.updateList();
    }
  },

  reviewChange(e) {
    if (this.state.status !== e.target.value) {
      const {pagination} = this.state;
      this.setState({
        status: e.target.value,
        batch: false,
        selectId: [],
        pagination: {...pagination, current: 1},
      }, this.updateList);
    }
  },

  pageChange(pageIndex) {
    this.updateList({pageIndex});
  },

  sizeChane(pageIndex, pageSize) {
    this.updateList({pageIndex, pageSize});
  },

  updateList(params) {
    const {type, categoryId} = this.props;
    const {status, pagination, loading} = this.state;
    const {pageSize, current, total} = pagination;
    const maxPageIndex = Math.ceil(total / pageSize) || 1;

    if (!loading) {
      this.setState({loading: true});
      ajax({
        url: '/shop/queryShopGoodsPics.json',
        method: 'get',
        data: { pageSize, pageIndex: maxPageIndex < current ? maxPageIndex : current, goodsType: type, rootCategoryId: categoryId, goodsStatus: status, op_merchant_id: this.merchantId, ...params},
        type: 'json',
        success: (res) => {
          const { data, totalSize, currentPage } = res;
          if (res.status === 'succeed') {
            this.setState({data, loading: false, selectId: [], pagination: {...pagination, pageSize: res.pageSize, total: currentPage === 1 ? totalSize : total, current: currentPage}});
          }
        },
        error: (_, msg) => {
          message.error(msg);
          this.type = null;
          this.categoryId = null;
        },
      });
    }
  },

  reqDelete(lists) {
    ajax({
      url: '/shop/deleteShopGoodsPics.json',
      method: 'post',
      data: { lists, op_merchant_id: this.merchantId },
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const {pagination} = this.state;
          setTimeout(() => {
            this.setState({
              pagination: {...pagination, total: pagination.total - lists.split(',').length},
            }, this.updateList);
          }, 400);
        }
      },
    });
  },

  showDeleteConfirm(id) {
    if (id) {
      Modal.confirm({
        title: '是否删除',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          this.reqDelete(id);
        },
      });
    }
  },

  select(id) {
    const selectId = [...this.state.selectId];
    const selectIndex = selectId.indexOf(id);
    if (selectIndex > -1) {
      selectId.splice(selectIndex, 1);
    } else {
      selectId.push(id);
    }
    this.setState({selectId});
  },

  toggleAllSelect() {
    const {selectId, data} = this.state;
    let newSelectId = [];
    if (selectId.length !== data.length) {
      newSelectId = data.map(item => item.id);
    }
    this.setState({selectId: newSelectId});
  },

  showReason(reason) {
    Modal.info({
      title: '审核不通过原因',
      content: reason,
    });
  },

  edit(info) {
    kbScrollToTop();
    const {typeName, categoryId, type} = this.props;
    window.parent.postMessage({'showPidSelect': false}, '*');
    window.location.hash = `/decoration/${categoryId}/${type}/${typeName}/${encodeURIComponent(JSON.stringify(info))}/edit`;
  },

  render() {
    const {batch, status, selectId, data, pagination, loading, picViewInfo, showPicView} = this.state;
    const {typeName, categoryId, type} = this.props;

    return (<div style={{ padding: '0 16px 32px' }}>
      <div className="content-head">
        {!batch ? <div style={{position: 'absolute', top: 0, right: 16, zIndex: 1}}>
          <Button type="primary" onClick={() => {
            window.location.hash = `decoration/${categoryId}/${type}/${window.encodeURIComponent(typeName)}/create`;
          }}>{`添加${typeName}`}</Button>
          { data && data.length ? <Button style={{ marginLeft: '8px' }} onClick={() => { this.setState({batch: true}); }}>批量管理</Button> : null}
        </div> : null}
        <RadioGroup value={status} onChange={this.reviewChange}>
          <Radio value="EFFECTIVE">审核通过</Radio>
          <Radio value="INVALID">审核不通过</Radio>
        </RadioGroup>
      </div>
      {showPicView ? <PicViewer url={`/material/view.htm?fileId=${picViewInfo.fileId}&zoom=original`} onClose={() => {this.setState({showPicView: false});}}>
        <div className="pic-detail">
          <div>{picViewInfo.name}</div>
          <div>适用于{picViewInfo.shopCount}家门店</div>
        </div>
      </PicViewer> : null}
      <div className="dish-list environment-list clearfix">
        {loading ? <Spin /> :
          <div>
            {batch ? <div className="batch-btn">
              <Checkbox checked={selectId.length === data.length} onChange={() => { this.toggleAllSelect(); }}>已选({selectId.length})</Checkbox>
              <Button disabled={!selectId.length} onClick={() => {this.showDeleteConfirm(selectId.join(','));}} >删除</Button>
              <Button onClick={() => { this.setState({batch: false, selectId: []}); }}>退出操作</Button>
            </div> : null}
            { data && data.length ? <div><ul className="dish-list-ul">
              {data.map((item, i) => {
                const {id, name, url, shopCount, fileId, reason} = item;
                return (<li key={id} className={classnames({'no-margin': i % 5 === 0})}>
                  <span className="img-wrap">
                    <div className="kb-photo-picker-list-item" onClick={() => {
                      if (status !== 'INVALID') {
                        setTimeout(() => {
                          this.setState({
                            showPicView: true,
                            picViewInfo: {name, url, shopCount, fileId},
                          });
                        }, 200);
                      }
                    }} >
                      <img src={url} title={name} />
                      {status === 'INVALID' ? <span className="bg-detail">
                        <span className="bg-detail-title">审核不通过</span>
                        <span className="bg-detail-reason" style={{lineHeight: 1.5}}><Clamp clamp={ 6 } ellipsis={ <span>...<a onClick={() => this.showReason(reason)}>查看</a></span> }>{reason}</Clamp></span>
                      </span> : null}
                    </div>
                    <span className="detail">
                      <span className="name">{name}</span>
                      <span>适用于{shopCount}家门店</span>
                    </span>
                    {batch ? <span className="img-checkbox">
                      <Checkbox checked={selectId.indexOf(id) > -1} onChange={() => this.select(id)} />
                    </span> : <span className={classnames({'img-btn': true, 'hover-show': !batch})}>
                      {status === 'EFFECTIVE' ? <Button size="small" onClick={() => this.edit(item)} style={{marginRight: '5px'}}>修改</Button> : null }
                      <Button onClick={() => {this.reqDelete(id);}} size="small">删除</Button>
                    </span>}
                  </span>
                </li>);
              })}
            </ul>
            <Pagination {...pagination} onChange={this.pageChange} onShowSizeChange={this.sizeChane}/></div> : <div className="no-content">
              <p>无审核{status === 'INVALID' ? '不' : ''}通过图片</p>
            </div>}
          </div>}
      </div>
    </div>);
  },
});

export default CommonList;
