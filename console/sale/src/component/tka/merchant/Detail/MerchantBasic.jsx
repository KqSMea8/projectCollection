import React from 'react';
import {Block} from '@alipay/kb-framework-components/lib/layout';
import { DetailTable } from 'hermes-react';
import isArray from 'lodash/isArray';

class MerchantBasic extends React.PureComponent {
  render() {
    const { infoData, contactData, bdInfo } = this.props;
    const basicTableData = [
      { label: '商户MID', value: infoData.mid },
      ...(isArray(contactData.contractList) ? contactData.contractList.map(c => ({ label: '联系人', value: `${c.contractName}(${c.contractPosition}) ${c.contractNo}` })) : [])
    ];
    const bdTableData = [
      ...(isArray(bdInfo.bdName) ? bdInfo.bdName.map(n => ({ label: 'BD', value: n })) : [])
    ];
    const pStaffTableData = [
      ...(isArray(bdInfo.staff) ? bdInfo.staff.map(s => ({ label: '服务商小二', value: `${s.staffName}（${s.realName} | ${s.userName}）`, colSpan: 5 })) : [])
    ];
    return (
      <div>
        <Block title="基本信息">
          <DetailTable dataSource={basicTableData} columnCount={4}/>
        </Block>
        <Block title="归属信息">
          {bdTableData.length > 0 && <DetailTable dataSource={bdTableData} columnCount={6}/>}
          <br/>
          {pStaffTableData.length > 0 && <DetailTable className="staff-table" dataSource={pStaffTableData} columnCount={6}/>}
        </Block>
      </div>
    );
  }
}

export default MerchantBasic;
