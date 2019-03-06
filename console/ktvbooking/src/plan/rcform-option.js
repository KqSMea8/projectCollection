import { setWith as _set, keyBy as _keyBy, cloneDeep as _cloneDeep } from 'lodash';
import moment from 'moment';

import { getStorage, setStorage } from '../common/utils';

let rcform = null;

const propsToFields = function (fieldName, list) {
  return {
    [`${fieldName}Key`]: { value: list.length }, // 自增值，保证唯一
    [`${fieldName}Keys`]: { value: list.map((_, i) => ({ key: i, index: i })) },
  };
};

const fromStorage = function (timePackageResourceList, dataCyclePrice) {
  const dataTimePackageResourceListKeyById = _keyBy(dataCyclePrice.timePackageResourceList || [], 'planTimeVO.timeId');
  (timePackageResourceList || []).forEach(timePackageResource => {
    if (timePackageResource.planTimeVO && timePackageResource.planTimeVO.timeId) {
      const dataTimePackageResource =
      dataTimePackageResourceListKeyById[timePackageResource.planTimeVO.timeId];
      if (dataTimePackageResource) {
        const { usableTimeLen, priceModel,
          packageResourceList: dataPackageResourceList } = dataTimePackageResource;
        const dataPackageResourceListKeyById = _keyBy(dataPackageResourceList || [], 'contentId');
        (timePackageResource.packageResourceList || []).forEach(packageResource => {
          const dataPackageResource =
          dataPackageResourceListKeyById[packageResource.contentId];
          if (dataPackageResource) {
            const dataResourcePriceSetListKeyById = _keyBy(dataPackageResource.resourcePriceSetList || [], 'resourceId');
            (packageResource.resourcePriceSetList || []).forEach(resourcePriceSet => {
              const dataResourcePriceSet =
              dataResourcePriceSetListKeyById[resourcePriceSet.resourceId];
              if (dataResourcePriceSet) {
                const { minReservationNumbers, reserveStock, price } =
                  dataResourcePriceSet;
                Object.assign(resourcePriceSet, {
                  minReservationNumbers,
                  reserveStock,
                  price,
                });
              }
            });
          }
        });
        Object.assign(timePackageResource, {
          usableTimeLen,
          priceModel,
        });
      }
    }
  });
};

export function mapProps(props) {
  const { form } = props;
  rcform = form;
  return props;
}

export function mapPropsToFields(props) {
  const { hasPlan, shopId, loading, listErr, currentStep,
    resourceList, packageTimeList, entryTimeList, timeModeOn,
    packageList, timeList, cyclePriceList, unReservationDayList } = props;
  if (!hasPlan || !shopId || loading || listErr) {
    return {};
  }
  /* eslint-disable no-case-declarations */
  switch (currentStep) {
    case 0:
      const dataResourceList = getStorage(`plan#${shopId}#resourceList`) || [];
      const dataResourceListKeyById = _keyBy(dataResourceList, 'resourceId');
      const resourceList2 = resourceList.map(resource => {
        const dataResource = dataResourceListKeyById[resource.resourceId];
        if (dataResource) {
          const { resourceName, minUserNumbers, maxUserNumbers } = dataResource;
          return Object.assign(resource, { resourceName, minUserNumbers, maxUserNumbers });
        }
        return resource;
      }).concat(dataResourceList.filter(resource => !resource.resourceId));
      resourceList.splice(0, resourceList.length, ...resourceList2);
      setStorage(`plan#${shopId}#resourceList`, resourceList2);
      // ///////////////////////
      const dataPackageTimeList = getStorage(`plan#${shopId}#packageTimeList`) || [];
      const dataPackageTimeListKeyById = _keyBy(dataPackageTimeList, 'timeId');
      const packageTimeList2 = packageTimeList.map(packageTime => {
        const dataPackageTime = dataPackageTimeListKeyById[packageTime.timeId];
        if (dataPackageTime) {
          const { startTimeType, startTime, endTimeType, endTime } = dataPackageTime;
          return Object.assign(packageTime, { startTimeType, startTime, endTimeType, endTime });
        }
        return packageTime;
      }).concat(dataPackageTimeList.filter(packageTime => !packageTime.timeId));
      packageTimeList.splice(0, packageTimeList.length, ...packageTimeList2);
      setStorage(`plan#${shopId}#packageTimeList`, packageTimeList2);
      // ///////////////////////
      const dataEntryTimeList = getStorage(`plan#${shopId}#entryTimeList`) || [];
      const dataEntryTimeListKeyById = _keyBy(dataEntryTimeList, 'timeId');
      const entryTimeList2 = entryTimeList.map(entryTime => {
        const dataEntryTime = dataEntryTimeListKeyById[entryTime.timeId];
        if (dataEntryTime) {
          const { startTimeType, startTime, endTimeType, endTime } = dataEntryTime;
          return Object.assign(entryTime, { startTimeType, startTime, endTimeType, endTime });
        }
        return entryTime;
      }).concat(dataEntryTimeList.filter(entryTime => !entryTime.timeId));
      entryTimeList.splice(0, entryTimeList.length, ...entryTimeList2);
      setStorage(`plan#${shopId}#entryTimeList`, entryTimeList2);
      // ///////////////////////
      const dataTimeModeOn = getStorage(`plan#${shopId}#timeModeOn`);
      const timeModeOn2 = dataTimeModeOn || timeModeOn;
      Object.assign(timeModeOn, timeModeOn2);
      setStorage(`plan#${shopId}#timeModeOn`, timeModeOn2);
      return {
        ...propsToFields('resourceList', resourceList2),
        ...propsToFields('packageTimeList', packageTimeList2),
        ...propsToFields('entryTimeList', entryTimeList2),
      };
    case 1:
      const dataPackageList = getStorage(`plan#${shopId}#packageList`) || [];
      const dataPackageListKeyById = _keyBy(dataPackageList, 'contentId');
      const timeListKeyById = _keyBy(timeList, 'timeId');
      const resourceListKeyById = _keyBy(resourceList, 'resourceId');
      let packageList2 = packageList.map(pkg => {
        const dataPackage = dataPackageListKeyById[pkg.contentId];
        if (dataPackage) {
          const { contentType, contentName, contentDesc, timeIds, resourceIds } = dataPackage;
          return Object.assign(pkg, {
            contentType, contentName, contentDesc,
            timeIds: (timeIds || []).filter(id => !!timeListKeyById[id]),
            resourceIds: (resourceIds || []).filter(id => !!resourceListKeyById[id]),
          });
        }
        return pkg;
      });
      const newPackageList = dataPackageList.filter(pkg => !pkg.contentId).map(pkg => {
        const { timeIds, resourceIds } = pkg;
        return Object.assign(pkg, {
          timeIds: (timeIds || []).filter(id => !!timeListKeyById[id]),
          resourceIds: (resourceIds || []).filter(id => !!resourceListKeyById[id]),
        });
      });
      packageList2 = packageList2.concat(newPackageList);
      packageList.splice(0, packageList.length, ...packageList2);
      setStorage(`plan#${shopId}#packageList`, packageList2);
      return {
        ...propsToFields('packageList', packageList2),
      };
    case 2:
      const dataCyclePriceList = getStorage(`plan#${shopId}#cyclePriceList`) || [];
      const dataCyclePriceListKeyById = _keyBy(dataCyclePriceList, (dataCyclePrice) =>
        dataCyclePrice.week || dataCyclePrice.specialDate);
      let cyclePriceList2 = cyclePriceList.map(cyclePrice => {
        const dataCyclePrice = dataCyclePriceListKeyById[cyclePrice.week || cyclePrice.specialDate];
        if (dataCyclePrice) {
          fromStorage(cyclePrice.timePackageResourceList, dataCyclePrice);
          delete dataCyclePriceListKeyById[cyclePrice.week || cyclePrice.specialDate];
        }
        return cyclePrice;
      });
      const cyclePrice0 = cyclePriceList2[0]; // 以第一个元素(周一)作为模板创建
      const today = moment();
      const dataNewCyclePriceList = Object.keys(dataCyclePriceListKeyById)
        .map(id => dataCyclePriceListKeyById[id]) // 其余的都是新添加的未保存的日期
        .filter(({ week, specialDate }) => !week && specialDate && !today.isAfter(specialDate, 'day'))// 特殊日期是在今天和今天之后的日期
        .map(dataCyclePrice => {
          if (dataCyclePrice.timePackageResourceList
            && dataCyclePrice.timePackageResourceList.length && cyclePrice0) { // 数据不为空
            const timePackageResourceList = _cloneDeep(cyclePrice0.timePackageResourceList); // 深克隆
            fromStorage(timePackageResourceList, dataCyclePrice);
            Object.assign(dataCyclePrice, {
              timePackageResourceList,
            });
          }
          return dataCyclePrice;
        }); // 新增的未保存的列表
      cyclePriceList2 = cyclePriceList2.concat(dataNewCyclePriceList);
      cyclePriceList.splice(0, cyclePriceList.length, ...cyclePriceList2);
      setStorage(`plan#${shopId}#cyclePriceList`, cyclePriceList2);

      const dataUnReservationDayList = (getStorage(`plan#${shopId}#unReservationDayList`) || [])
        .filter(date => !today.isAfter(date, 'day')); // 不可预约日期在今天和今天之后的日期
      const unReservationDayList2 =
        [...new Set(unReservationDayList.concat(dataUnReservationDayList))]; // 去重
      unReservationDayList.splice(0, unReservationDayList.length, ...unReservationDayList2);
      setStorage(`plan#${shopId}#unReservationDayList`, unReservationDayList2);
      return {
        ...propsToFields('cyclePriceList', cyclePriceList2),
        ...propsToFields('unReservationDayList', unReservationDayList2),
      };
    default:
      return {};
  }
  /* eslint-enable no-case-declarations */
}

export function onFieldsChange(props, fields) {
  // 将表单值同步到store中，
  // 如果触发了store值变化，将导致rcform重新生成，然后校验信息显示不出来，需要再次手动validateFields，这样性能也不好
  // 所以这里直接修改store中的值的内容，也不会触发mapPropsToFields
  const propNameSet = new Set(); // 过滤重复的propName
  Object.keys(fields).forEach(fName => {
    const { value, validating } = fields[fName];
    if (!validating) {
      // console.log('onFieldsChange: ', fName, value);
      const matches = fName.match(/^(\w+)\[(\d+)\](\.|$)/);
      if (matches) {
        const [eleName, propName, key, dot] = matches;
        const keyIndex = (rcform.getFieldValue(`${propName}Keys`) || []).find(({ key: k }) => k === +key);
        if (keyIndex) {
          const { index } = keyIndex;
          const path = `[${index}]${dot}${fName.substr(eleName.length)}`;
          // console.log('_set', propName, path, value || '');
          _set(props[propName], path, value || ''); // 增加或修改
          propNameSet.add(propName);
        }
      } else if (fName.startsWith('timeModeOn')) {
        const propName = 'timeModeOn';
        _set(props.timeModeOn, fName.replace(propName, ''), value);
        propNameSet.add(propName);
      } else if (fName.endsWith('Keys')) { // for删除
        const propName = fName.replace('Keys', '');
        propNameSet.add(propName);
      }
    }
  });
  propNameSet.forEach(propName => {
    setStorage(`plan#${props.shopId}#${propName}`, props[propName]); // 实时保存
  });
}
