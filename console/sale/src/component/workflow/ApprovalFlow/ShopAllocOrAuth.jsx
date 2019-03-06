import React, {PropTypes} from 'react';
import {Row, Spin} from 'antd';
import ajax from 'Utility/ajax';
import {padding} from '../../../common/dateUtils';
import {logResultMap, logSourceMap, logChannelMap, logShopActionMap} from '../../../common/OperationLogMap';

export function format(d) {
  return d ? d.getFullYear() + '-' + padding(d.getMonth() + 1) + '-' + padding(d.getDate() + ' ' + padding(d.getHours()) + ':' + padding(d.getMinutes())) : '';
}

const ShopAllocOrAuth = React.createClass({
  propTypes: {
    id: PropTypes.string,
    action: PropTypes.string,
  },

  getInitialState() {
    return {
      data: [],
      loading: true,
    };
  },

  componentDidMount() {
    this.fetch();
  },

  fetch() {
    const params = {
      id: this.props.id,
      action: this.props.action,
    };
    this.setState({
      loading: true,
    });
    const url = window.APP.crmhomeUrl + '/shop/koubei/shopOrderDetail.json';
    ajax({
      url: url,
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        this.setState({
          loading: false,
          data: result,
        });
      },
    });
  },

  render() {
    const {data, loading} = this.state;
    const order = data.order;
    return (
      <div>
        {
          loading && <Row style={{textAlign: 'center', marginTop: 80}}><Spin/></Row>
        }
        {
          !loading && (
            <div>
              <table className="kb-detail-table-4">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">门店名称</td>
                    <td>{order.shopName || ''}</td>
                    <td className="kb-detail-table-label">{order.isKbPublish === 'true' ? '处罚事件ID' : '关系关联对象'}</td>
                    {!(order.isKbPublish === 'true') ? <td>{order.toOpName || ''}{order.toOpNickName && ('(' + order.toOpNickName + ')')}</td> : <td>{order.complaintId}</td>}
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">操作人</td>
                    <td>{order.opName || ''}{order.opNickName && ('(' + order.opNickName + ')')}</td>
                    <td className="kb-detail-table-label">操作结果</td>
                    <td>{logResultMap[order.status || ''] || order.status || ''}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">操作时间</td>
                    <td>{format(new Date(order.createTime))}</td>
                    <td className="kb-detail-table-label">操作来源</td>
                    <td>{[logSourceMap[order.source], logChannelMap[order.channel]].filter(r => r).join('-')}</td>
                  </tr>
                  {order.roleType && order.roleType.length > 0 && (<tr>
                    <td className="kb-detail-table-label">{order.isKbPublish === 'true' ? '操作类型' : '权限类型'}</td>
                    <td>{!(order.isKbPublish === 'true') ? order.roleType.join('、') : logShopActionMap[order.action]}</td>
                    <td className="kb-detail-table-label"></td>
                    <td></td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    );
  },

});

export default ShopAllocOrAuth;
