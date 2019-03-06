import React from 'react';
import { Alert } from 'antd';
import { InfoModal } from 'hermes-react';
import log, {SubType} from '../../common/log';

const imgRevenue = 'https://gw.alipayobjects.com/zos/rmsportal/vfBQCzLKFKzZapiSADBa.png';
const imgCompany = 'https://gw.alipayobjects.com/zos/rmsportal/pKDuGlrPDxFZImzNtyoK.png';
const BillGuideModal = () => {
  return (
    <div style={{display: 'inline-block'}} onClick={() => log(SubType.FILLOUT_INVOICE_MUST_READ_CLICK)}>
      <InfoModal
        trigger="正确发票填写示例"
        width={900}
        title="正确发票填写示例"
        footer={[]}>
        <div className="modal-p-notice">
          <Alert message="线上填写请与纸质发票信息保持一致" type="warning" showIcon/>
          <p>由税务局代开的发票填写示例：</p>
          <a href={imgRevenue} target="_blank">
            <img src={imgRevenue} width="800"/>
          </a>
          <p>由本公司自己开具发票填写示例：</p>
          <a href={imgCompany} target="_blank">
            <img src={imgCompany} width="800"/>
          </a>
        </div>
      </InfoModal>
    </div>
  );
};

export default BillGuideModal;
