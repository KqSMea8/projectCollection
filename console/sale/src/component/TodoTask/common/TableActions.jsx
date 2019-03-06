export default {

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    }
  },

  onTableChange(pagination, filters) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
      ...filters,
    };
    this.fetch(params);
  },

  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    });
  },
};
