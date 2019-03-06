import React, {PropTypes} from 'react';
import {message, Spin, Pagination, Button, Modal, Checkbox} from 'antd';
import ajax from '../../../../common/ajax';
import EnvironmentRemoveAction from './EnvironmentRemoveAction';
import Clamp from '../../common/MultiCamp';
import EnvPicViewer from '../../common/EnvPicViewer';
import {getMerchantId, getCategoryId} from '../../common/utils';

const EnvironmentList = React.createClass({
  propTypes: {
    reviewState: PropTypes.string,
    setEnvironment: PropTypes.func,
    batchMode: PropTypes.bool,
    endBatch: PropTypes.func,
  },
  getInitialState() {
    this.merchantId = getMerchantId();
    return {
      hasEnvironment: true,
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
    if (this.props.reviewState !== prevProps.reviewState) {
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
    const {setEnvironment, reviewState} = this.props;
    const {current, pageSize} = this.state.pagination;
    this.setState({
      loading: true,
    });
    const params = {
      current,
      pageSize,
      op_merchant_id: this.merchantId,
      reviewState: reviewState === '1' ? 'ENABLE' : 'AUDIT_DENY',
    };
    if (this.merchantId) params.merchantId = this.merchantId;
    ajax({
      url: '/shop/kbshopenv/pageQuery.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          const paper = this.state.pagination;
          paper.total = result.count;
          this.setState({
            hasEnvironment: !!result.count,
            data: result.list,
            loading: false,
            pagination: paper,
            selectId: [],
          });
          setEnvironment(!!result.count);
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
      idList = data.map(v => v.id);
    }
    this.setState({
      selectId: idList,
    });
  },
  edit(id) {
    const {selectId} = this.state;
    window.location.hash = '/decoration/' + getCategoryId() + '/environment/edit/' + (id ? id : selectId);
  },
  render() {
    const {reviewState, batchMode, endBatch} = this.props;
    const {hasEnvironment, data, loading, pagination, selectId} = this.state;
    const list = data.map((v, i) => {
      return (<li key={v.id} className={i % 5 === 0 ? 'no-margin' : ''}>
        <span className="img-wrap">
          <EnvPicViewer id={v.id}>
            <a className="kb-photo-picker-list-item">
              <img src={v.url} title={v.name} />
            </a>
          </EnvPicViewer>
          {reviewState === '0' ? <span className="bg-detail">
            <span className="bg-detail-title">审核不通过</span>
            <span className="bg-detail-reason"><Clamp clamp={ 6 } ellipsis={ <span>...<a onClick={() => this.showReason(v.reason)}>查看</a></span> }>{v.reason}</Clamp></span>
          </span> : null}
          <span className={'img-btn' + (batchMode ? '' : ' hover-show' )}>
            {reviewState !== '0' ? <Button size="small" onClick={() => this.edit(v.id)} style={{marginRight: '5px'}}>修改</Button> : null}
            <EnvironmentRemoveAction environmentId={v.id} refresh={this.refresh} reviewState={reviewState} />
          </span>
          {batchMode ? <span className="img-checkbox">
            <Checkbox checked={selectId.indexOf(v.id) > -1} onChange={() => this.select(v.id)} />
          </span> : null}
        </span>
        <span className="detail">
          <span className="name">{v.name}</span>
          <span>适用于{v.shopCount}家门店</span>
        </span>
      </li>);
    });
    let listContent;
    if (loading) {
      listContent = <Spin />;
    } else if (hasEnvironment) {
      listContent = (<div className="dish-list environment-list clearfix">
        {batchMode ? <div className="batch-btn">
          <Checkbox checked={selectId.length === data.length} onChange={this.selectAll}>已选({selectId.length})</Checkbox>
          <EnvironmentRemoveAction batchMode={batchMode} environmentIdList={selectId} refresh={this.refresh} reviewState={reviewState} />
          <Button onClick={endBatch}>退出操作</Button>
        </div> : null}
        <ul className="dish-list-ul">{list}</ul>
        <Pagination {...pagination} onChange={this.onChange} onShowSizeChange={this.onShowSizeChange} />
        {batchMode ? <div className="batch-btn">
          <Checkbox checked={selectId.length === data.length} onChange={this.selectAll}>已选({selectId.length})</Checkbox>
          <EnvironmentRemoveAction batchMode={batchMode} environmentIdList={selectId} refresh={this.refresh} reviewState={reviewState} />
          <Button onClick={endBatch}>退出操作</Button>
        </div> : null}
      </div>);
    } else if (reviewState === '0') {
      listContent = (<div className="no-content">
        <p>无审核不通过图片</p>
      </div>);
    } else {
      listContent = (<div className="no-content no-content-bg-arrow">
        <p>这里空空的，快来添加环境图吧～</p>
      </div>);
    }
    return listContent;
  },
});

export default EnvironmentList;
