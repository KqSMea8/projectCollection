import React from 'react';

const renderDrop = (obj) => {
  const data = obj.voucherVOs || [];
  const isIframe = window.top !== window;
  if (data.length === 0) {
    return (<div>数据为空</div>);
  }
  const ctn = data.map((val, index)=>{
    return (
          <tr key={index}>
              <td>{val.name}</td>
              <td>{val.voucherType}</td>
              <td>{val.voucherType === '商品' ? '售卖：' : '发券：'}{val.voucherCount}</td>
              <td>{val.voucherType === '商品' ? '核销：' : '核券：'}{val.totalUsedCnt}</td>
              {
                !isIframe && <td>
                {val.voucherType !== '商品' && <a target="_blank" href={`${val.mdataprodServer}/report/crmhome_report.htm?myreports=v2&pageUri=pageUri1515557326174&url=report&analysis=camp`}>查看活动效果</a>}
                {val.voucherType !== '商品' && <span key="ft-bar" className="ft-bar">|</span>}
                <form style={{display: 'inline'}} action="/goods/discountpromo/downloadBill.htm" method="post" target="_blank">
                    <input type="hidden" name="campId" value={val.campId} />
                    <button className="button-a">下载对账单</button>
                </form>
              </td>
              }
          </tr>
      );
  });
  return (<table>
        <tbody>
            {ctn}
        </tbody>
    </table>);
};

export default renderDrop;
