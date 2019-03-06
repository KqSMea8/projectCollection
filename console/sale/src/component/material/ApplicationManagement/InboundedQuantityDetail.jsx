import React, {PropTypes} from 'react';
import {Form} from 'antd';
import ajax from 'Utility/ajax';

const InboundedQuantityDetail = React.createClass({
  propTypes: {
    id: PropTypes.any,
    index: PropTypes.any,
  },
  getInitialState() {
    return ({
      display: 'block',
      loading: true,
      detail: [],
    });
  },
  componentDidMount() {
    this.fetchData();
  },
  fetchData() {
    const params = {
      orderId: this.props.id,
    };
    ajax({
      url: '/sale/asset/stuffStockActionSummary.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        const detailList = res.stuffInStockSummary.stuffInStockSummaryVoList;
        this.setState({
          loading: true,
          detail: detailList[this.props.index].inStockItemVoList,
        });
      },
    });
  },
  render() {
    const {detail} = this.state;
    let curQuantity = 0;
    let damageQuantity = 0;
    (detail || []).map((item)=> {
      curQuantity += item.curQuantity;
      damageQuantity += item.damageQuantity;
    });
    return (<div>
      <table>
        <tbody>
          <tr>
            <td>
              <div style={{width: 488, height: 240, overflowY: 'scroll'}}>
                <table className="approval-content">
                  <tbody>
                    <tr>
                      <td>已入库总数</td>
                      <td style={{color: 'red'}}>{curQuantity}件</td>
                      <td>已报损总数</td>
                      <td style={{color: 'green'}}>{damageQuantity}件</td>
                    </tr>
                    {
                      (detail || []).map((item, i)=> {
                        return (
                          <tr key={i + 1}>
                            <td>入库{i + 1}</td>
                            <td>{item.curQuantity}</td>
                            <td>已报损{i + 1}</td>
                            <td>{item.damageQuantity}</td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>);
  },
});
export default Form.create()(InboundedQuantityDetail);
