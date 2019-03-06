import React, { PropTypes} from 'react';
import classnames from 'classnames';

const TodoCard = React.createClass({
  propTypes: {
    dataSource: PropTypes.object,
    key: PropTypes.number,
    isCatering: PropTypes.string,
  },

  getInitialState() {
    return {
      choosed: false,
    };
  },

  checkTodoItem(e) {
    e.preventDefault();
    this.props.checkTodoItem(this.props.dataSource);
  },

  render() {
    const data = this.props.dataSource;
    if (this.props.isCatering === 'catering') {// 餐饮
      if (this.props.env === 'alreadyPutaway') {// 已上架
        return (<div className="todo-card">
          <div className="todo-title detail-ellipsis">{data.partnerName}</div>
          <a className="float-right" href={`#/intelligentcatering/list/putaway?partnerId=${data.partnerId}&name=${data.partnerName}`} id={data.partnerId}>立即处理</a>
          <div className="todo-num">
            <p>优惠异动 <span className={classnames({'color_red': data.priceChange > 0})}>{data.priceChange}</span></p>
            <p>门店异动 <span className={classnames({'color_red': data.shopChange > 0})}>{data.shopChange}</span></p>
          </div>
      </div>);
      }
      return (<div className="todo-card">
        <div className="todo-title detail-ellipsis">{data.partnerName}</div>
        <a className="float-right" href={`#/intelligentcatering/list/stayputaway?partnerId=${data.partnerId}&name=${data.partnerName}`} id={data.partnerId}>立即处理</a>
        <div className="todo-num">
          <p>待完善 <span className={classnames({'color_red': data.toBeCompletedNum > 0})}>{data.toBeCompletedNum}</span></p>
          <p>待上架 <span className={classnames({'color_red': data.toBeShelvedNum > 0})}>{data.toBeShelvedNum}</span></p>
          <p>已退回 <span className={classnames({'color_red': data.returnedItemNum > 0})}>{data.returnedItemNum}</span></p>
        </div>
    </div>);
    }
    if (this.props.env === 'shelved') {// 已上架(泛行业)
      return (<div className="todo-card">
        <div className="todo-title detail-ellipsis">{data.merchantName}</div>
        <a className="float-right" onClick={this.checkTodoItem} id={data.merchantPid}>立即处理</a>
        <div className="todo-num">
          <p>优惠异动 <span className={classnames({'color_red': data.priceChangeItemCount > 0})}>{data.priceChangeItemCount}</span></p>
          <p>门店异动 <span className={classnames({'color_red': data.shopChangeItemCount > 0})}>{data.shopChangeItemCount}</span></p>
        </div>
    </div>);
    }
    return (<div className="todo-card">
        <div className="todo-title detail-ellipsis">{data.merchantName}</div>
        <a className="float-right" onClick={this.checkTodoItem} id={data.id}>立即处理</a>
        <div className="todo-num">
          <p>待完善 <span className={classnames({'color_red': data.initLeadsCount > 0})}>{data.initLeadsCount}</span></p>
          <p>待上架 <span className={classnames({'color_red': data.preparedLeadsCount > 0})}>{data.preparedLeadsCount}</span></p>
          <p>已退回 <span className={classnames({'color_red': data.rejectedLeadsCount > 0})}>{data.rejectedLeadsCount}</span></p>
        </div>
    </div>);
  },
});

export default TodoCard;

