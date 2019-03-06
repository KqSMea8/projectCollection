
import React from 'react';
import { InfoModal } from 'hermes-react';
const BillCustomerNotice = () => {
  return (<InfoModal
    trigger="提交发票必读"
    width={632}
    title="提交发票必读"
    footer={[]}>
    <div className="modal-p-notice">
      <p>场景一：一张账单开多张发票，线上如何录入？</p>
      <p className="fn-mb15">勾选相应的账单填写完一张发票的信息提交后退出，然后重新勾选账单，重复以上操作增加发票直至全部发票录入完成；</p>
      <p>场景二：多张账单开一张发票，线上如何录入？</p>
      <p className="fn-mb15">同时勾选多笔账单，点击提交发票（或结算）进行发票录入。</p>
      <p>场景三：多张账单开多张发票，线上如何录入？</p>
      <p className="fn-mb15">同时勾选多笔账单，填写完一张发票信息后提交退出，然后重新勾选对应的账单重复以上操作直至全部发票录入完成。</p>
      <p>更多发票注意事项：<a href="https://cshall.alipay.com/takeaway/knowledgeDetail.htm?knowledgeId=201602055835" target="_blank">https://cshall.alipay.com/takeaway/knowledgeDetail.htm?knowledgeId=201602055835</a></p>
      <p className="fn-mt15">无票、普票申请操作步骤：<a href="https://cstraining.alipay.com/learn/learnCenterStartLearn.htm?materialId=11359&tntInstId=KOUBEI_SALE_TRAINING" target="_blank">https://cstraining.alipay.com/learn/learnCenterStartLearn.htm?materialId=11359&tntInstId=KOUBEI_SALE_TRAINING</a></p>
    </div>
  </InfoModal>
  );
};

export default BillCustomerNotice;
