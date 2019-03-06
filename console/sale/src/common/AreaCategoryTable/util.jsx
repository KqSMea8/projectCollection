import ajax from 'Utility/ajax';
import {transformLCV} from '../treeUtils';

let loader;
let options;

const Util = {
  /*eslint-disable */
  equalObject(obj1, obj2) {
    for (const o in obj1) {
      if (obj1.hasOwnProperty(o)) {
        if (typeof obj1[o] === 'object') {
          if (!Util.equalObject(obj1[o], obj2[o])) {
            return false;
          }
        } else if (obj1[o] !== obj2[o]) {
          return false;
        }
      }
    }
    return true;
  },
  /*eslint-enable */
  getAreaCategoryData(opts) {
    const {url, params} = opts;
    if (loader && options && Util.equalObject(params, options.params)) {
      return loader;
    }
    options = opts;

    loader = ajax({
      url: url,
      method: 'get',
      data: {...params},
      type: 'json',
    }).then((res) => {
      const data = res.data;
      data.areas = transformLCV(data.areas);
      // data.areas = addAllDistrict(data.areas); // 后端已经把需要全部的地区标记上
      const categoryOrder = data.categoryOrder;
      for (const o in categoryOrder) {
        if (categoryOrder.hasOwnProperty(o)) {
          categoryOrder[o] = transformLCV(categoryOrder[o]);
        }
      }
      return data;
    }).catch((e) => {
      throw e;
    });

    return loader;
  },

  getCategoriesTree(data, areas) {
    if (!data) return [];
    let treeCode;
    // 取不到地区码对应的品类或者全部地区取上一级市级品类
    for (let i = areas.length - 1; i >= 0; i--) {
      treeCode = data.areaOrder[areas[i]];
      if (typeof treeCode !== 'undefined') {
        break;
      }
    }
    return data.categoryOrder[treeCode] || [];
  },

  // 标记节点是否可以选择
  /*eslint-disable */
  tagAreaNode(areas, value, disabled) {
    if (!value || !areas) return areas;

    areas.forEach((province) => {
      if (province.value === value[0]) {
        province.children.forEach((city) => {
          if (city.value === value[1]) {
            city.children.forEach((district) => {
              if (district.value === value[2]) {
                district.disabled = disabled;

                if (value[2] === 'ALL') {
                  // 如果是选择全部，则更改上一级状态
                  city.disabled = disabled;
                } else {
                  // 同步逻辑选择全部地区节点
                  if (disabled) {
                    city.children[0].disabled = true;
                  } else {
                    const disabledDistricts = city.children.filter((d) => {
                      return d.value !== 'ALL' && d.disabled;
                    });

                    if (!disabledDistricts.length) {
                      city.children[0].disabled = false;
                    }
                  }
                }
              }
            });
          }
        });
      }
    });

    return areas;
  },
  /*eslint-enable */
  // 提交前转换服务端需要的服务区域品类数据结构
  /*eslint-disable */
  parseAreaCategoryTableParam(form) {
    const tmp = {};
    for (const o in form) {
      if (form.hasOwnProperty(o)) {
        if (/-/.test(o)) {
          const splited = o.split('-');
          let obj = tmp[splited[1]];
          if (!obj) {
            obj = {};
          }
          obj[splited[0]] = form[o];
          tmp[splited[1]] = obj;
        }
      }
    }

    const data = [];
    for (const i in tmp) {
      if (tmp.hasOwnProperty(i)) {
        const item = tmp[i];
        data.push({
          countryCode: 'CN',
          provinceCode: item.area[0],
          cityCode: item.area[1],
          districtCode: item.area[2],
          categories: item.categories.join(','),
        });
      }
    }

    form.areaJsonStr = JSON.stringify(data);
    return form;
  },
  /*eslint-enable*/
};

export default Util;
