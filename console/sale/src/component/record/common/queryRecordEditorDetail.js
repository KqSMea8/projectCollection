import ajax from 'Utility/ajax';

export const queryRecordEditorDetail = params => {
  return new Promise((resolve) => {
    ajax({
      url: `${window.APP.kbservcenterUrl}/sale/visitrecord/queryDetailInfo.json`,
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          resolve(res);
        }
      }
    });
  }).then((res) => {
    return res.data;
  });
};
