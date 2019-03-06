import React, {PropTypes} from 'react';
import {message, Spin, Pagination, Button, Modal, Checkbox, Tag} from 'antd';
import ajax from '../../../../common/ajax';
import DishEditModal from './DishEditModal';
import DishRemoveAction from './DishRemoveAction';
import Clamp from '../../common/MultiCamp';
import DishPicViewer from '../../common/DishPicViewer';
import {getMerchantId, getCategoryId} from '../../common/utils';

const DishList = React.createClass({
  propTypes: {
    reviewState: PropTypes.string,
    sourceValue: PropTypes.string,
    searchName: PropTypes.string,
    setDishes: PropTypes.func,
    batchMode: PropTypes.bool,
    endBatch: PropTypes.func,
  },
  getInitialState() {
    this.merchantId = getMerchantId();
    return {
      hasDishes: true,
      loading: true,
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共${total}个记录`,
        current: 1,
        pageSize: 10,
        total: 0,
      },
      editDishId: null,
      showEditModal: false,
      selectId: [],
    };
  },
  componentDidMount() {
    this.fetch();
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.batchMode !== this.props.batchMode) {
      this.setState({
        selectId: [],
      });
    }
  },
  componentDidUpdate(prevProps) {
    if (this.props.reviewState !== prevProps.reviewState
      || this.props.sourceValue !== prevProps.sourceValue
      || this.props.searchName !== prevProps.searchName) {
      this.onListChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    }
  },
  onListChange(pagination) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    this.fetch();
  },
  onChange(current) {
    const {pageSize} = this.state.pagination;
    this.onListChange({
      current,
      pageSize,
    });
  },
  onShowSizeChange(current, pageSize) {
    this.onListChange({
      current,
      pageSize,
    });
  },
  fetch() {
    const {setDishes, reviewState, sourceValue, searchName} = this.props;
    const {current, pageSize} = this.state.pagination;
    this.setState({
      loading: true,
    });
    const params = {
      pageNum: current,
      pageSize,
      status: reviewState === '1' ? 'ENABLE' : 'AUDIT_DENY',
      source: sourceValue,
      name: searchName,
    };
    if (this.merchantId) params.op_merchant_id = this.merchantId;
    ajax({
      url: '/shop/kbdish/pageQuery.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          const paper = this.state.pagination;
          paper.total = result.totalSize;
          this.setState({
            hasDishes: !!result.totalSize,
            data: result.data,
            loading: false,
            pagination: paper,
            selectId: [],
          });
          setDishes(!!result.totalSize);
        } else {
          message.error(result.resultMsg);
        }
      },
      error: (_, msg) => {
        message.error(msg);
      },
    });
  },
  refresh(type, delectCount) {
    const {current, pageSize, total} = this.state.pagination;
    if (type === 'remove'
      && current > 1
      && current === Math.ceil(total / pageSize)
      && total % pageSize === delectCount) {
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
  showEditModal(id) {
    this.setState({
      showEditModal: true,
      editDishId: id,
    });
  },
  hideEditModal() {
    this.setState({
      showEditModal: false,
    });
  },
  showReason(reason) {
    Modal.info({
      title: '审核不通过原因',
      content: reason,
    });
  },
  select(id) {
    const {selectId} = this.state;
    const i = selectId.indexOf(id);
    if (i > -1) {
      selectId.splice(i, 1);
    } else {
      selectId.push(id);
    }
    this.setState({
      selectId,
    });
  },
  selectAll() {
    const {selectId, data} = this.state;
    let idList = [];
    if (selectId.length !== data.length) {
      idList = data.map(v => v.dishId);
    }
    this.setState({
      selectId: idList,
    });
  },
  batchEdit() {
    const {selectId, data} = this.state;
    const innerSourceSelectId = selectId.filter(v => data.filter(vv => vv.dishId === v)[0].dataSource !== 'WEST');
    if (innerSourceSelectId.length !== selectId.length) {
      Modal.info({
        title: '从外部导入的图片不支持批量修改',
        onOk() {
          if (innerSourceSelectId.length) {
            window.location.hash = '/decoration/' + getCategoryId() + '/menu/dish-edit/' + innerSourceSelectId;
          }
        },
      });
    } else {
      window.location.hash = '/decoration/' + getCategoryId() + '/menu/dish-edit/' + selectId;
    }
  },
  render() {
    const {reviewState, batchMode, endBatch, sourceValue, searchName} = this.props;
    const {hasDishes, data, loading, pagination, showEditModal, selectId, editDishId} = this.state;
    const inFilterState = sourceValue !== '' || searchName !== '';
    const list = data.map((v, i) => {
      const tags = v.dishTagList.map((vv, ii) => {
        return vv.type ? <Tag key={ii} color={vv.type === '菜属性' ? 'red' : 'green'}>{vv.value}</Tag> : null;
      });
      return (<li key={v.dishId} className={i % 5 === 0 ? 'no-margin' : ''}>
        <span className="img-wrap">
          <DishPicViewer dishId={v.dishId} shopCount={v.shopCount}>
            <a className="kb-photo-picker-list-item">
              <img src={v.pictureURL} title={v.dishName} />
            </a>
          </DishPicViewer>
          {v.dsName ? <span className="bg-source">来自{v.dsName}</span> : null}
          {reviewState === '0' ? <span className="bg-detail">
            <span className="bg-detail-title">审核不通过</span>
            <span className="bg-detail-reason"><Clamp clamp={ 6 } ellipsis={ <span>...<a onClick={() => this.showReason(v.memo)}>查看</a></span> }>{v.memo}</Clamp></span>
          </span> : null}
          <span className={'img-btn' + (batchMode ? '' : ' hover-show' )}>
            {reviewState !== '0' && v.dataSource !== 'WEST' ? <Button size="small" onClick={() => this.showEditModal(v.dishId)} style={{marginRight: '5px'}}>修改</Button> : null}
            <DishRemoveAction dishId={v.dishId} refresh={this.refresh} reviewState={reviewState} />
          </span>
          {batchMode ? <span className="img-checkbox">
            <Checkbox checked={selectId.indexOf(v.dishId) > -1} onChange={() => this.select(v.dishId)} />
          </span> : null}
        </span>
        <span className="detail">
          <span className="name">{v.dishName}</span>
          <span className="price">{v.price !== undefined ? v.price + '元' : ''}</span>
          {v.shopCount ? <span className="name">适用于{v.shopCount}家门店</span> : null}
          {tags.length ? <span className="tags">{tags}</span> : null}
        </span>
      </li>);
    });
    let listContent;
    if (loading) {
      listContent = <Spin />;
    } else if (hasDishes) {
      listContent = (<div className="dish-list clearfix">
        {batchMode ? <div className="batch-btn">
          <Checkbox checked={selectId.length === data.length} onChange={this.selectAll}>已选({selectId.length})</Checkbox>
          <DishRemoveAction batchMode={batchMode} dishIdList={selectId} refresh={this.refresh} reviewState={reviewState} />
          {reviewState !== '0' ? <Button disabled={!selectId.length} onClick={this.batchEdit}>修改</Button> : null}
          <Button onClick={endBatch}>退出操作</Button>
        </div> : null}
        <ul className="dish-list-ul">{list}</ul>
        <Pagination {...pagination} onChange={this.onChange} onShowSizeChange={this.onShowSizeChange} />
        {showEditModal ? <DishEditModal hideModal={this.hideEditModal} dishId={editDishId} refresh={this.refresh} /> : null}
        {batchMode ? <div className="batch-btn">
          <Checkbox checked={selectId.length === data.length} onChange={this.selectAll}>已选({selectId.length})</Checkbox>
          <DishRemoveAction batchMode={batchMode} dishIdList={selectId} refresh={this.refresh} reviewState={reviewState} />
          {reviewState !== '0' ? <Button disabled={!selectId.length} onClick={this.batchEdit}>修改</Button> : null}
          <Button onClick={endBatch}>退出操作</Button>
        </div> : null}
      </div>);
    } else if (reviewState === '0') {
      listContent = (<div className="no-content">
        <p>无审核不通过图片</p>
      </div>);
    } else {
      listContent = (<div className={`no-content${!inFilterState ? ' no-content-bg-arrow' : ''}`}>
        <p>这里空空的，快来添加菜品吧～</p>
      </div>);
    }
    return listContent;
  },
});

export default DishList;
