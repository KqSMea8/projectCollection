import ajax from '../../../../common/ajax';
import { transformLCV, addAll } from '../treeUtils';

function getCategoryCommon() {
  let loader;

  function getLoader(cityId) {
    if (loader) {
      return loader;
    }
    loader = ajax({
      url: '/home/crm/queryAreaCategory.json',
      useIframeProxy: true,
      data: { cityId },
    });
    return loader;
  }

  function getCategory(cityId) {
    return getLoader(cityId).then((response)=> {
      let categories = {};
      if (response.data &&
          response.data.length > 0) {
        categories = transformLCV(response.data);
      }
      return { categories };
    });
  }

  function getCategoryWithAll(cityId) {
    return getCategory(cityId).then((response)=> {
      return { categories: addAll(response.categories) };
    });
  }

  return {
    getCategoryWithAll,
    getCategory,
  };
}

export default getCategoryCommon();
