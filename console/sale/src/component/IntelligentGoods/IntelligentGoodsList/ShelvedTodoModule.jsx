import React from 'react';
import ajax from '@alipay/kb-framework/framework/ajax';
import { Spin, Row, Col, Pagination } from 'antd';
import { message } from 'antd';
import TodoList from '../common/TodoList';
// import {todoListRequestUrl} from '../common/IntelligentGoodsConfig';

class TodoListComponent extends React.Component {
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
    this.setState({loading: true});
    ajax({
      url: window.APP.kbservindustryprodUrl + '/item/leads/change/queryMerchantBySpStaffId.json',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        this.setState({loading: false});
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed' && result.data) {
          this.setState({
            data: result.data,
            total: result.page.totalSize
          });
          // 请求完数据后判断是否有搜索的商家，如没有搜索的商家则搜索第一个商家
          // 判断方法，判断url上是否有partnerId和partnerName
          // 翻页不影响，此时url已有partnerId和partnerName
          const { partnerId, partnerName } = this.props.location.query;
          if ((!partnerId || !partnerName) && result.data.length) {
            this.checkTodoItem(result.data[0]);
          }
        } else {
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      }, error: ()=> {
        this.setState({loading: false});
      },
    });
  }
  checkTodoItem = (data) => {
    this.props.checkTodoItem(data);
  }
  render() {
    const { loading, params, data, total } = this.state;
    if (loading && total === 0) {// 初始
      return (<div >
          <p className="padleft-blue"><p>异动商家<span className="color-red">({total})</span></p></p>
          <div style={{marginTop: 20}}><Spin/></div>
        </div>);
    }
    if (!loading && total === 0) {// 无待办事项
      return (<div>
          <p className="padleft-blue"><p>异动商家<span className="color-red">({total})</span></p></p>
          <Row style={{marginTop: 20}}>
            <Col span="8"><p className="todocard-empty">太好了，暂无待办事项</p></Col>
          </Row>
       </div>);
    }
    return (<div>
        <p className="padleft-blue"><p>异动商家<span className="color-red">({total})</span></p></p>
        <div>
            <Spin spinning={loading}>
                <TodoList dataSource={data} checkTodoItem={this.checkTodoItem} env={this.props.env}/>
            </Spin>
        </div>
        <Row flex="end">
            <Col span="24"><Pagination className="float-right" onChange={this.pageChange} current={params.pageNo} total={total} pageSize={params.pageSize}/></Col>
        </Row>
    </div>
    );
  }
}
export default TodoListComponent;
