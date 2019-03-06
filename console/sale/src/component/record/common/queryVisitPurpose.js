import ajax from 'Utility/ajax';

let loadPromise;
export function queryOriginVisitPurposeData() {
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject) => {
    ajax({
      url: '/wireless/visitrecord/queryVisitPurposeList.json',
      success: (res) => {
        if (res.data) {
          resolve(res.data);
        } else {
          reject(false);
        }
      },
      error: (e) => {
        reject(e);
      },
    });
  });
  return loadPromise;
}

const oldPurpose = {
  SIGN_CONTRACT: '签约',
  LAYING_MATERIAL: '物料铺设',
  SUPPLY_LICENCE: '补证',
  IMPLEMENT_SELL: '机具售卖',
  IMPLEMENT_MAINTENANCE: '机具维护',
  SOLVE_PRODUCT_PROBLEM: '产品问题解决',
  BUSINESS_TALK: '商务洽谈',
  SHOP_VISIT: '巡店',
  TRAINING: '驻店培训',
  SHOP_NO_SALE: '门店无动销',
  TKA_SHOP_UNWILLINGNESS_LAYING_MATERIAL: 'TKA门店不愿意铺设物料',
  PRE_VISIT: '预拜访',
  MGS_SIGN: '“莫干山”方案签约',
  OTHER: '其他',
};

// 返回: [{ label: '铺设物料类型', value: 'LAYING_MATERIAL' }, { label: '“莫干山”方案签约', value: 'MGS_SIGN' }, ...]
export function queryPurposeOptionData(searchMode) {
  return queryOriginVisitPurposeData().then(groupData => {
    const purposeOptionData = [];
    const filteredOldPurpose = {...oldPurpose};
    for (const group of groupData) {
      if (group.code === 'LAYING_MATERIAL') {
        purposeOptionData.push({ label: '物料铺设', value: 'LAYING_MATERIAL' });
        delete filteredOldPurpose[group.code];
      } else if (group.code === 'SIGN_CONTRACT') {
        purposeOptionData.push({ label: '开店签约/改签约', value: 'SIGN_CONTRACT' });
        delete filteredOldPurpose[group.code];
      } else {
        purposeOptionData.push({
          label: group.title,
          value: group.code,
          children: group.childList.map(child => { // eslint-disable-line
            delete filteredOldPurpose[child.code];
            return { label: child.title, value: child.code };
          }),
        });
      }
    }
    if (searchMode) { // 列表 & 筛选还需要露出老的目的
      Object.entries(filteredOldPurpose).forEach(([value, label]) => {
        purposeOptionData.push({ value, label });
      });
    } else { // 添加下还需要补上其他
      purposeOptionData.push({ value: 'OTHER', label: '其他' });
    }
    return purposeOptionData;
  }).catch(() => {
    return Object.entries(oldPurpose).map(([value, label]) => ({ value, label }));
  });
}
export function queryPurposeMap() {
  return queryPurposeOptionData(true).then(option => {
    const visitPurposeMap = {};
    const doLoop = (options) => {
      options.forEach((row) => {
        if (row.children && row.children.length) doLoop(row.children);
        else visitPurposeMap[row.value] = row.label;
      });
    };
    doLoop(option);
    return visitPurposeMap;
  }).catch(() => oldPurpose);
}

const oldLayingMaterial = {
  BASIC: '基础物料',
  OTHER: '其它物料',
  CODEMATERIAL_TEMP: '码物料-临时',
};

// 返回: [{ label: '活动物料-淮海', value: 'ACTIVITY_HUAIHAI' }, ...]
export function queryLayingMaterialOptionData(searchMode) {
  return queryOriginVisitPurposeData().then(groupData => {
    const layingMaterialOptionData = [];
    const filteredOldLayingMaterial = {...oldLayingMaterial};
    for (const group of groupData) {
      if (group.code === 'LAYING_MATERIAL') {
        layingMaterialOptionData.push(...group.childList.map(child => { // eslint-disable-line
          delete filteredOldLayingMaterial[child.code];
          return { label: child.title, value: child.code };
        }));
      }
    }
    if (searchMode) { // 列表 & 筛选还需要露出老的目的
      Object.entries(filteredOldLayingMaterial).forEach(([value, label]) => {
        layingMaterialOptionData.push({ label, value });
      });
    }
    return layingMaterialOptionData;
  }).catch(() => {
    return Object.entries(oldLayingMaterial).map(([value, label]) => ({ value, label }));
  });
}

export function queryMaterialMap() {
  return queryLayingMaterialOptionData(true).then(option => {
    const visitMaterialMap = {};
    const doLoop = (options) => {
      options.forEach((row) => {
        visitMaterialMap[row.value] = row.label;
        if (row.children) doLoop(row.children);
      });
    };
    doLoop(option);
    return visitMaterialMap;
  }).catch(() => oldLayingMaterial);
}
