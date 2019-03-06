import React, {PropTypes} from 'react';
import { Row, Col } from 'antd';
import TodoCard from './TodoCard';

class TodoList extends React.Component {
  static propTypes = {
    isCatering: PropTypes.string,
  }
  checkTodoItem = (data) => {
    this.props.checkTodoItem(data);
  }
  caculatePad(index) {
    if (index === 0 || index === 3 ) {
      return {paddingRight: 6};
    } else if (index === 1 || index === 4 ) {
      return {padding: '0 3px'};
    }
    return {paddingLeft: 6};
  }
  render() {
    const data = this.props.dataSource;
    const Todo = (<div style={{'textAlign': 'justify'}}>
    {data.map((item, index) => {
      const todoPad = this.caculatePad(index);
      return <Col span="8" style={todoPad} key={index} ><TodoCard isCatering={this.props.isCatering} dataSource={item} itemIndex={index} checkTodoItem={this.checkTodoItem} env={this.props.env} /></Col>;
    })}
    </div>);
    return (<div>
        <Row>
            {Todo}
        </Row>
    </div>);
  }
}

export default TodoList;
