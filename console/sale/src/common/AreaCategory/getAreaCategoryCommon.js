import ajax from 'Utility/ajax';
import {transformLCV, addAll, addAllDistrict} from '../treeUtils';

export default function getAreaCategoryCommon(type, shopType) {
  let loader;

  function getLoader() {
    if (loader) {
      return loader;
    }
    const data = {
      label: 'KOUBEI_SALESCRM',
      method: type,
    };
    if (shopType === 'MALL') {
      data.shopType = 'MALL';
      delete data.label;
      delete data.method;
    } else if (shopType === 'COMMON') {
      data.shopType = 'COMMON';
      delete data.label;
      delete data.method;
    }
    if (shopType === 'COMMON') {
      data.shopType = 'COMMON';
      delete data.label;
      delete data.method;
    }
    loader = ajax({
      url: (shopType === 'MALL' || shopType === 'COMMON') ? '/kbConfig/queryAreaCategoryForCreate.json' : '/kbConfig/queryAreaCategory.json',
      data,
      useIframeProxy: true,
    });
    return loader;
  }

  function getAreaCategory() {
    return getLoader().then((d)=> {
      const data = d.data;
      data.areas = transformLCV(data.areas);
      data.categories = transformLCV(data.categories);
      const categoryOrder = data.categoryOrder;
      if (categoryOrder) {
        for (const o in categoryOrder) {
          if (categoryOrder.hasOwnProperty(o)) {
            categoryOrder[o] = transformLCV(categoryOrder[o]);
          }
        }
      }
      return data;
    });
  }

  function getAreaCategoryWithAll() {
    return getAreaCategory().then((d)=> {
      const data = {...d};
      data.areas = addAll(data.areas);
      data.categories = addAll(data.categories);
      return data;
    });
  }

  function getAreaCategoryWithAllDistrict() {
    return getAreaCategory().then((d)=> {
      const data = {...d};
      data.areas = addAllDistrict(data.areas);
      data.categories = addAll(data.categories);
      return data;
    });
  }

  return {
    getAreaCategoryWithAll,
    getAreaCategoryWithAllDistrict,
    getAreaCategory,
  };
}
