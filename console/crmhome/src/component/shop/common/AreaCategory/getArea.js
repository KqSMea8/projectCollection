import ajax from '../../../../common/ajax';
import {transformLCV, addAll, addAllDistrict} from '../treeUtils';

function getAreaCommon() {
  let loader;

  function getLoader() {
    if (loader) {
      return loader;
    }
    loader = ajax({
      url: '/home/district.json',
      useIframeProxy: true,
    });
    return loader;
  }

  function getArea() {
    return getLoader().then((response)=> {
      let areas = {};
      if (response.district) {
        areas = transformLCV(response.district);
      }
      return { areas };
    });
  }

  function getAreaWithAll() {
    return getArea().then((response)=> {
      return { areas: addAll(response.areas) };
    });
  }

  function getAreaWithAllDistrict() {
    return getArea().then((response)=> {
      return { areas: addAllDistrict(response.areas) };
    });
  }

  return {
    getAreaWithAll,
    getAreaWithAllDistrict,
    getArea,
  };
}

export default getAreaCommon();
