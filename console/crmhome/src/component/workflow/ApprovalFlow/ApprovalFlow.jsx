import React, {PropTypes} from 'react';
import ShopCreateOrModify from './ShopCreateOrModify';
import ShopAllocOrAuth from './ShopAllocOrAuth';


const ApprovalWorkflow = React.createClass({
  propTypes: {
    params: PropTypes.object,
    children: PropTypes.any,
    routes: PropTypes.array,
  },

  render() {
    const orderId = this.props.params.orderId;
    const action = this.props.params.action;
    const activeKey = this.props.routes[this.props.routes.length - 1].path;
    let activeChild = (
      <ShopCreateOrModify id={orderId} action={action}/>
    );
    if (activeKey === 'shop-alloc') {
      activeChild = (
        <ShopAllocOrAuth id={orderId} action={action}/>
      );
    }
    return (<div>
      <div className="app-detail-header">流水详情</div>
      <div className="kb-detail-main" style={{minHeight: 500}}>
        {activeChild}
      </div>
    </div>);
  },
});

export default ApprovalWorkflow;
