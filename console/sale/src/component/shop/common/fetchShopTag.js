import fetch from '@alipay/kb-fetch';

let fetchingPromise;
function fetchShopTagData() {
  if (fetchingPromise) return fetchingPromise;
  fetchingPromise = fetch({
    url: 'kbsales.cspiShopLabelQueryService.querySupportLabels',
    param: {
      pageType: 'LIST',
      platform: 'SALES',
    },
  }).then(res => {
    return res.data;
  });
  return fetchingPromise;
}

// 返回 [{labelList: [{ labelCode, labelName }]}]
export function fetchShopTagGroupList() {
  return fetchShopTagData().then(data => {
    return data.labelGroupList;
  });
}

// 返回 {labelCode: labelName}
export function fetchShopTagMap() {
  return fetchShopTagData().then(data => {
    const shopTagMap = {};
    if (data.kaLabelList) {
      data.kaLabelList.forEach((item) => {
        shopTagMap[item.labelCode] = item.labelName;
      });
    }
    if (data.labelGroupList) {
      data.labelGroupList.forEach(group => {
        group.labelList.forEach(item => {
          shopTagMap[item.labelCode] = item.labelName;
        });
      });
    }
    return shopTagMap;
  });
}
