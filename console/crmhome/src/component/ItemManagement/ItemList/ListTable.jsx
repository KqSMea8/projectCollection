import React, { PropTypes } from 'react';
import { Button, message, Pagination } from 'antd';
import ajax from '../../../common/ajax';

const ButtonGroup = Button.Group;

const ListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    brandList: PropTypes.array,
  },

  getInitialState() {
    return {
      data: [],
      pagination: {
        showSizeChanger: false,
        showQuickJumper: true,
        pageSize: 12,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
      loading: true,
      brandName: {},
    };
  },

  componentDidMount() {
    const {current, pageSize} = {...this.state.pagination};
    this.onPageChange({
      current,
      pageSize,
    });
  },

  componentWillReceiveProps(nextProps) {
    const brandName = {};
    if (nextProps.brandList.length > 0) {
      nextProps.brandList.map((item) => {
        brandName[item.brandCode] = item.name;
      });

      this.setState({
        brandName: brandName,
      });
    }
  },

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.onPageChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    }
  },

  onPageChange(pagination) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
    };
    this.fetch(params);
  },

  paginationChange(nextPage) {
    this.onPageChange({
      current: nextPage,
      pageSize: this.state.pagination.pageSize,
    });
  },

  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    });
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };

    this.setState({loading: true});

    ajax({
      url: '/goods/ic/queryItemInfo.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const data = res.data;
          const pagination = {...this.state.pagination};
          pagination.total = data.totalItems;
          this.setState({
            loading: false,
            data: data.data,
            pagination,
          });
        } else {
          message.error(res.resultMsg);
        }
      },
      error: (res) => {
        this.setState({
          loading: false,
          data: [],
        }, () => {
          message.error(res.resultMsg);
        });
      },
    });
  },

  delItem(index) {
    const tempData = this.state.data;

    tempData.splice(index, 1);

    this.setState({
      data: tempData,
      pagination: Object.assign(this.state.pagination, {
        total: --this.state.pagination.total,
      }),
    });
  },

  buttonClick(type, id) {
    window.location.hash = type === 'check' ? '#/item-management/detail-view/' + id : '#/item-management/detail-edit/' + id;
  },


  render() {
    const { data, pagination, brandName } = this.state;
    let emptyText;

    if (this.props.params) {
      emptyText = '搜不到结果，换下其他搜索条件吧~';
    } else {
      emptyText = '暂无数据，请输入查询条件搜索';
    }
    return (
      <div className="commodity">
        <div className="item-wrap">
          {
            data && data.length > 0 ? data.map((item, i) => {
              return (
                <div key={i} className="item">
                  <div className="hd">
                    <img src={item.picture}/>
                    <div className="addon">
                      <h4>{item.title}</h4>
                      <div className="info">
                        <p>国标码: {item.itemCode}</p>
                        <p>品牌: {brandName[item.brandCode]}</p>
                        <p>规格: {item.specification}</p>
                      </div>
                    </div>
                  </div>
                  <div className="operate">
                    <ButtonGroup style={{float: 'right'}}>
                      <Button type="ghost" onClick={this.buttonClick.bind(this, 'check', item.id)}>查看</Button>
                      <Button type="ghost" onClick={this.buttonClick.bind(this, 'edit', item.id)}>编辑</Button>
                    </ButtonGroup>
                  </div>
                </div>
              );
            }) : (<p className="no-result">{emptyText}</p>)
          }
        </div>
        <div className="clearfix">
          <Pagination onChange={this.paginationChange} {...pagination} />
        </div>
      </div>
    );
  },
});

export default ListTable;
