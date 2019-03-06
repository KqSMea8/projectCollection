import React from 'react';
import ajax from 'Utility/ajax';
import { Spin, Row, Col, Icon } from 'antd';
import TodoCard from './common/TodoCard';

const TodoModule = React.createClass({
  getInitialState() {
    return {
      loading: true,
      data: [],
      timeout: false,
    };
  },

  componentDidMount() {
    ajax({
      url: `${window.APP.antprocessUrl}/ticket/pendingTask.json`,
      method: 'get',
      type: 'jsonp',
      jsonpCallback: 'callback',
      data: {pageSize: 3, pageNo: 1},
      success: (res) => {
        if (res.success && res.data && res.data.pagination) {
          this.setState({data: res.data.pagination.data, loading: false});
        }
      }, error: ()=> {
        this.setState({loading: false});
      },
    });
    setTimeout(() => {
      if (this.state.loading) {
        this.setState({timeout: true});
      }
    }, 10000);
  },

  caculatePad(index) {
    if (index === 0 ) {
      return {paddingRight: 6};
    } else if (index === 1) {
      return {padding: '0 3px'};
    }
    return {paddingLeft: 6};
  },

  render() {
    const {loading, timeout} = this.state;
    if (loading) {
      return <div style={{marginBottom: 19}}><Spin />{timeout ? <div className="kb-index-no-panel"><Icon type="smile"/><span className="kb-index-warn-info">由于您可见的数据范围较大,我们正在努力加载,请耐心等待哦</span></div> : null}</div>;
    }

    const TodoList = this.state.data.length ? (<div style={{'textAlign': 'justify'}}>
        {this.state.data.slice(0, 3).map((item, index) => {
          const todoPad = this.caculatePad(index);
          return <Col span="8" key={index} style={todoPad}><TodoCard dataSource={item} itemIndex={index} /></Col>;
        })}
      </div>) : <Col span="8"><TodoCard /></Col>;

    return (<div className="kb-todo-panel">
    <h3>待办事项<a href={`${window.APP.antprocessUrl}/middleground/koubei.htm#/pending-task`}>更多</a></h3>
    <div style={{marginTop: '10px'}}>
      <Row>
        {!this.state.loading ? TodoList : null}
      </Row>
    </div>
  </div>);
  },
});

export default TodoModule;
