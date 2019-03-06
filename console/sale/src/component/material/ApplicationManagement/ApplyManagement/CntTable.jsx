import React, {PropTypes} from 'react';
import './index.less';

const ApplyDetail = React.createClass({
  propTypes: {
    title: PropTypes.any,
    data: PropTypes.any,
  },
  renderCtn(data = []) {
    if (data.length > 0) {
      return data.map((val, index)=>{
        const url = `#/material/inventory/register/${val.expressCompanyCode}/${val.expressNo}/${val.id}`;
        return (
          <tr key={index}>
                        <td className="tb-bd">{val.purchaseQuantity}</td>
                        <td className="tb-bd">{val.expressCompany}<br/>{val.expressNo}<br/>{val.expressStatusDesc}</td>
                        <td className="tb-bd"><a href={url}>入库</a></td>
                      </tr>);
      });
    }
  },
  render() {
    const ctn = this.props.data || [];
    if (ctn.length === 0) {
      return (<p>无数据</p>);
    }
    return (<table>
                  <tbody>
                    <tr>
                      <td className="tb-hd">发货数量</td>
                      <td className="tb-hd">物流信息</td>
                      <td className="tb-hd">操作</td>
                    </tr>
                    {
                      this.renderCtn(ctn)
                    }
                  </tbody>
                </table>);
  },
});
export default ApplyDetail;
