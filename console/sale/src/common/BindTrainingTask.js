/**
 * 钉钉扫码完成任务(任务绑定) 门店 和leads
 */
import ajax from 'Utility/ajax';
import confirm from 'antd/lib/modal/confirm';
import React from 'react';
import QRCode from 'qrcode.react';

const config = (examTaskDetailAppURL, noticeTitle, noticeSubtitle) => ({
  iconClassName: 'null',
  okCancel: false,
  closable: false,
  okText: '知道了',
  iconType: 'null',
  width: 400,
  onOk: () => { location.href = '/sale/index.htm#/'; },
  visible: true,
  content: (
    <div style={{ marginLeft: '-37px', textAlign: 'center' }}>
      <QRCode style={{ marginBottom: '15px' }} size={160} value={examTaskDetailAppURL} />
      {
        noticeTitle ? <h1>{noticeTitle}</h1> : null
      }
      {
        noticeSubtitle ? <p style={{ marginTop: '15px'}}>{noticeSubtitle}</p> : null
      }
    </div>
  ),
});

export default () => {
  let BIND_TYPE;
  const hash = location.hash;
  if (hash.indexOf('/shop') > 0 || hash.indexOf('/decoration') > 0 || hash.indexOf('/photo') > 0) {
    BIND_TYPE = 'SHOP_MANAGE';
  } else if (hash.indexOf('-leads') > 0) {
    BIND_TYPE = 'LEADS_MANAGE';
  }
  ajax({
    url: '/support/examTask/getExamTaskPcDetail.json',
    method: 'get',
    data: {permCode: BIND_TYPE},
    success: res => {
      if (res.status === 'succeed') {
        let examTaskDetailAppURL;
        let noticeTitle;
        let noticeSubtitle;
        const {data = {}} = res;
        if (data[BIND_TYPE] !== undefined) {
          examTaskDetailAppURL = data[BIND_TYPE].examTaskDetailAppURL;
          noticeTitle = data[BIND_TYPE].noticeTitle;
          noticeSubtitle = data[BIND_TYPE].noticeSubtitle;
          if (examTaskDetailAppURL !== undefined) {
            confirm(config(examTaskDetailAppURL, noticeTitle, noticeSubtitle));
          }
        }
      }
    },
  });
};
