import React, { PropTypes } from 'react';
import ajax from 'Utility/ajax';
import { Spin, Row, Col, Pagination } from 'antd';
import { message } from 'antd';
import TodoList from '../common/TodoList';
import { appendOwnerUrlIfDev, getQueryFromURL } from '../../../common/utils';
// import {todoListRequestUrl} from '../common/IntelligentGoodsConfig';

class TodoListComponent extends React.Component {
  static propTypes = {
    isCatering: PropTypes.string,
    location: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      params: {
        pageSize: 6,
        pageNo: 1,
      },
      total: 0,
      loading: false,
    };
  }
  componentDidMount() {
    this.fetch();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.params !== prevState.params) {
      this.fetch();
    }
  }
  pageChange = (currentPage) => {
    this.setState({
      params: {
        pageSize: 6,
        pageNo: currentPage,
      }
    });
  }
  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.state.params,
    };
    this.setState({ loading: true });
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json?domain=KOUBEI&mappingValue=kbcateringprod.pageQueryTodoList'),
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.data.success && result.data.success === true) {
          this.setState({
            loading: false,
            data: result.data.data,
            total: result.data.totalSize
          });
          const searchParams = getQueryFromURL(this.props.location.search);
          if (searchParams.partnerId && searchParams.name) {  // 若 url 中指定了 pid 和 商户名称则不用跳转
            return;
          }
          // result.data.data 可能为 null
          if (result.data.data && result.data.data.length > 0) {
            this.checkTodoItem(result.data.data[0]);
          }
        } else {
          this.setState({ loading: false });
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
      error: (err) => {
        this.setState({ loading: false });
        if (err && err.resultMsg) {
          message.error(err.resultMsg, 2);
        }
      },
    });
  }
  checkTodoItem = (data) => {
    this.props.checkTodoItem(data);
  }
  render() {
    const { loading, params, total } = this.state;
    if (loading && total === 0) {// 初始
      return (<div >
        <p className="padleft-blue"><p>待处理商家<span className="color-red">({total})</span></p></p>
        <div style={{ marginTop: 20 }}><Spin /></div>
      </div>);
    }
    if (!loading && total === 0) {// 无待办事项
      return (<div>
        <p className="padleft-blue"><p>待处理商家<span className="color-red">({total})</span></p></p>
        <Row style={{ marginTop: 20 }}>
          <Col span="8"><p className="todocard-empty">太好了，暂无代办事项</p></Col>
        </Row>
      </div>);
    }
    return (<div>
      <p className="padleft-blue"><p>待处理商家<span className="color-red">({total})</span></p></p>
      <div>
        <Spin spinning={loading}>
          <TodoList dataSource={this.state.data} checkTodoItem={this.checkTodoItem} isCatering={this.props.isCatering} />
        </Spin>
      </div>
      <Row flex="end">
        <Col span="24"><Pagination className="float-right" onChange={this.pageChange} current={params.pageNo} total={total} pageSize={params.pageSize} /></Col>
      </Row>
    </div>
    );
  }
}
export default TodoListComponent;
