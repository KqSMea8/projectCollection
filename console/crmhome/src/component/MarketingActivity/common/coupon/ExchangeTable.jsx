import React, {PropTypes} from 'react';
import {formatAvailableVoucherTime, formatForbiddenVoucherTime} from '../../../../common/utils';
import ShopListLabel from '../ShopListLabel';

export default React.createClass({
  propTypes: {
    data: PropTypes.object,
  },

  render() {
    const {data} = this.props;
    return (
      <table className="kb-detail-table-2">
        <tbody>
          <tr>
            <td className="kb-detail-table-label">券类型</td>
            <td>单品优惠</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">券种类</td>
            <td>兑换券</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">券名称</td>
            <td>{data.name}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">品牌名称</td>
            <td>{data.subTitle}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">券logo</td>
            <td>
              <a href={data.logo && data.logo.replace(/&amp;/g, '&')} target="_blank">
                <img style={{width: '60px', height: '60px'}} src={data.logo && data.logo.replace(/&amp;/g, '&')}/>
              </a>
            </td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">核销方式</td>
            <td>扫码核销</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">券有效期</td>
            <td>{data.relativeTime ? <span>领取后{data.relativeTime}日内有效</span> : data.startTime + '-' + data.endTime}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">券适用门店</td>
            <td>
              {data.cityShopVOs.length === 0 ? '同活动门店' : <ShopListLabel shopLen={data.shopIds.length} shopList={data.cityShopVOs}/>}
            </td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">发放总量</td>
            <td>{data.voucherCount === '999999999' ? '不限制' : data.voucherCount}</td>
          </tr>
          {data.relativeTime &&// 相对时间才展示是否"当日是否可用"
          <tr>
            <td className="kb-detail-table-label">领取当日是否可用</td>
            <td>{data.effectDayFlag === 'true' ? '是' : '否'}</td>
          </tr>
          }
          <tr>
            <td className="kb-detail-table-label">是否可以转赠</td>
            <td>{data.donateFlag === 'true' ? '是' : '否'}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">券可用时段</td>
            <td>{(data.availableVoucherTime.length !== 0) ? formatAvailableVoucherTime(data.availableVoucherTime) : '不限制'}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">不可用日期</td>
            <td>{data.forbiddenVoucherTime ? formatForbiddenVoucherTime(data.forbiddenVoucherTime) : '不限制'}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">使用说明</td>
            <td>
              {
                (data.useInstructions || []).map((p, i) => {
                  return <p key={i}>{p}</p>;
                })
              }
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
});
