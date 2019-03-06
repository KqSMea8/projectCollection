import { message, Modal } from 'antd';
import history from '@alipay/kobe-history';

import {
  queryMerchantSign, createMerchantSign,
  queryServiceList, modifyService,
  queryPackageList, modifyPackageAttribute,
  queryPriceList, releaseReservationPlan,
  defaultValue,
} from './service';

import { setStorage, getStorage } from '../common/utils';

export default {
  namespace: 'plan',

  initial: {
    loading: true,
    listErr: false, // 获取列表出错
    shopId: '', // 门店ID
    // null：未知 签约协议（onlinepay|在线）（kbktvbooking|行业ktv）
    signed: null, // {kbktvbooking,onlinepay,userType}
    hasPlan: null, // 是否设置过方案， null：未知
    currentStep: 0, // 当前处于第几步操作
    timeModeOn: {
      package: true, // 包段模式开启
      entry: false, // 进场模式开启
    },
    resourceList: [], // 包厢信息
    timeList: [], // 时段信息
    packageTimeList: [], // 时段信息
    entryTimeList: [], // 时段信息
    packageList: [], // 套餐列表
    cyclePriceList: [], // 周期价格列表+特殊日期
    unReservationDayList: [], // 不可预约日历列表
  },

  reducers: {
    setState(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  // async action
  asyncs: {
    async queryMerchantSign(dispatch) {
      let signed = { kbktvbooking: false, onlinepay: false };
      let spiResultCode = null;
      try {
        dispatch({ type: 'setState', payload: { loading: true } });
        const { data, spiResultCode: rawSpiResultCode } = await queryMerchantSign({});
        signed = data;
        spiResultCode = rawSpiResultCode;
      } finally {
        if (spiResultCode === '112001') {
          Modal.error({
            title: '您没有该菜单的权限操作，请联系管理员添加',
            onOk() {
              history.goBack();
            },
          });
        } else if (signed.userType !== 'MERCHANT' && (!signed.kbktvbooking || !signed.onlinepay)) { // !商户操作员/商户主账号 && 没签约
          if (signed.userType === 'MERCHANT_STAFF') { // 如果是操作员则忽略签约信息
            dispatch({ type: 'setState', payload: {
              loading: false,
              signed: null, // 不知道有没有签约
              hasPlan: null,
            } });
            dispatch({ type: 'queryServiceList', payload: {} }); // 调用接口是在判断有没有签约，没有签约则toast提示
          } else {
            Modal.warning({
              title: '该商家未开通口碑KTV在线预订服务',
              content: '请联系商家主账号完成签约确认',
              onOk() {
                history.goBack();
              },
            });
          }
        } else {
          dispatch({ type: 'setState', payload: {
            loading: false,
            signed,
            hasPlan: signed.kbktvbooking && signed.onlinepay ? null : false,
          } });
          dispatch({ type: 'queryServiceList', payload: {} });
          window.scrollTo(0, 0);
        }
      }
    },
    async createMerchantSign(dispatch, getState) {
      try {
        const { signed } = getState();
        const signProtocols = [];
        if (!signed.kbktvbooking) {
          signProtocols.push('kbktvbooking');
        }
        if (!signed.onlinepay) {
          signProtocols.push('onlinepay');
        }
        await createMerchantSign({ signProtocols });
        dispatch({ type: 'setState', payload: {
          loading: false,
          signed: { kbktvbooking: true, onlinepay: true },
        } });
      } catch (err) {
        throw err;
      }
    },
    async queryServiceList(dispatch, getState, { noPlan }) {
      try {
        const { shopId, signed } = getState();
        if (!shopId || !signed || !signed.kbktvbooking || !signed.onlinepay) {
          return;
        }

        if (noPlan === true) { // 在NoPlan组件中点击设置，直接给默认值
          // 清空所有缓存
          setStorage(`plan#${shopId}#resourceList`, null, -1);
          setStorage(`plan#${shopId}#packageTimeList`, null, -1);
          setStorage(`plan#${shopId}#entryTimeList`, null, -1);
          setStorage(`plan#${shopId}#timeModeOn`, null, -1);
          setStorage(`plan#${shopId}#packageList`, null, -1);
          setStorage(`plan#${shopId}#cyclePriceList`, null, -1);
          setStorage(`plan#${shopId}#unReservationDayList`, null, -1);

          const resourceList = defaultValue('resourceList');
          const timeList = defaultValue('timeList'); // 都是PACKAGE_MODE
          dispatch({ type: 'setState', payload: {
            loading: false,
            hasPlan: true,
            resourceList,
            packageTimeList: timeList,
            entryTimeList: [],
          } });
        } else {
          dispatch({ type: 'setState', payload: { loading: true, listErr: false } });
          const { data } = await queryServiceList({ shopId });
          const { resultCode, resourceList, timeList, spiResultCode } = data;
          if (spiResultCode === '112001') {
            Modal.error({
              title: '您没有该菜单的权限操作，请联系管理员添加',
              onOk() {
                history.goBack();
              },
            });
            return;
          }
          if (resultCode === 'RESERVATIONPLAN_ISNOT_EXIST') { // 显示NoPlan引导组件
            dispatch({ type: 'setState', payload: {
              currentStep: 0, // 重置到第一步
              loading: false,
              hasPlan: false,
            } });
          } else {
            const packageTimeList = timeList.filter(({ timeModel }) => timeModel === 'PACKAGE_MODE');
            const entryTimeList = timeList.filter(({ timeModel }) => timeModel === 'ENTRY_MODE');
            dispatch({ type: 'setState', payload: {
              loading: false,
              hasPlan: true,
              resourceList,
              packageTimeList,
              entryTimeList,
              timeModeOn: {
                package: packageTimeList.length > 0,
                entry: entryTimeList.length > 0,
              },
            } });
          }
        }
        window.scrollTo(0, 0);
      } catch (err) {
        dispatch({ type: 'setState', payload: { loading: false, hasPlan: null, listErr: true } });
      }
    },
    async modifyService(dispatch, getState) {
      try {
        // dispatch({ type: 'setState', payload: { loading: true } });
        const { shopId, resourceList, packageTimeList, entryTimeList,
          timeModeOn: { package: packageTimeModelOn, entry: entryTimeModelOn } } = getState();
        let timeList = [];
        if (packageTimeModelOn) {
          timeList = timeList.concat(packageTimeList);
        }
        if (entryTimeModelOn) {
          timeList = timeList.concat(entryTimeList);
        }
        await modifyService({ shopId, resourceList, timeList });
        setStorage(`plan#${shopId}#resourceList`, null, -1);
        setStorage(`plan#${shopId}#packageTimeList`, null, -1);
        setStorage(`plan#${shopId}#entryTimeList`, null, -1);
        setStorage(`plan#${shopId}#timeModeOn`, null, -1);
        dispatch({ type: 'setState', payload: {
          loading: true,
          currentStep: 1,
          resourceList: [],
          packageTimeList: [],
          entryTimeList: [],
        } });
        dispatch({ type: 'queryPackageList', payload: {} });
        window.scrollTo(0, 0);
      } catch (err) {
        throw err;
      }
    },
    async queryPackageList(dispatch, getState) {
      try {
        dispatch({ type: 'setState', payload: { loading: true, listErr: false } });
        const { shopId } = getState();
        const { data } = await queryPackageList({ shopId });
        const { resourceList, timeList, planPackageList } = data;
        let packageList = planPackageList;
        if (!getStorage(`plan#${shopId}#packageList`)) { // 没有缓存过，才设置默认值
          packageList = defaultValue('packageList', packageList);
        }
        dispatch({ type: 'setState', payload: {
          loading: false,
          resourceList,
          timeList,
          packageList,
        } });
        window.scrollTo(0, 0);
      } catch (err) {
        dispatch({ type: 'setState', payload: { loading: false, listErr: true } });
      }
    },
    async modifyPackageAttribute(dispatch, getState) {
      try {
        // dispatch({ type: 'setState', payload: { loading: true } });
        const { shopId, packageList: planPackageList } = getState();
        const packageList = planPackageList.map(pkg => {
          if (pkg.contentType === 'PURE_SING') {
            return Object.assign(pkg, { contentName: '', contentDesc: '' });
          }
          return pkg;
        });
        await modifyPackageAttribute({ shopId, packageList });
        setStorage(`plan#${shopId}#packageList`, null, -1);
        dispatch({ type: 'setState', payload: {
          loading: true,
          currentStep: 2,
          resourceList: [],
          timeList: [],
          packageList: [],
        } });
        dispatch({ type: 'queryPriceList', payload: {} });
        window.scrollTo(0, 0);
      } catch (err) {
        throw err;
      }
    },
    async queryPriceList(dispatch, getState) {
      try {
        dispatch({ type: 'setState', payload: { loading: true, listErr: false } });
        const { shopId } = getState();
        const { data } = await queryPriceList({ shopId });
        const { cyclePriceList, unReservationDayList, resourceList } = data;
        dispatch({ type: 'setState', payload: {
          loading: false,
          cyclePriceList,
          unReservationDayList,
          resourceList,
        } });
        window.scrollTo(0, 0);
      } catch (err) {
        dispatch({ type: 'setState', payload: { loading: false, listErr: true } });
      }
    },
    async modifyPriceList(dispatch, getState) {
      try {
        // dispatch({ type: 'setState', payload: { loading: true } });
        const { shopId, cyclePriceList: cyclePList, unReservationDayList } = getState();
        const cyclePriceList = cyclePList.map(cyclePrice => {
          const { week, specialDate,
            timePackageResourceList: timePkgResList } = cyclePrice;
          const timePackageResourceList = timePkgResList.map(timePackageResource => {
            const { planTimeVO: { timeId }, usableTimeLen, priceModel,
              packageResourceList: pkgResList } = timePackageResource;
            const packageResourceList = pkgResList.map(packageResource => {
              const { contentId, resourcePriceSetList: packagePriceSetList } = packageResource;
              packagePriceSetList.forEach(packagePriceSet => {
                if (priceModel === 'YUAN_PER_ROOM') {
                  Object.assign(packagePriceSet, { minReservationNumbers: '' });
                }
              });
              return { contentId, packagePriceSetList };
            });
            return { timeId, usableTimeLen, priceModel, packageResourceList };
          });
          return { week, specialDate, timePackageResourceList };
        });
        // console.log('modifyPriceList-->', cyclePriceList, unReservationDayList);
        const { data: { resultMsg } } = await releaseReservationPlan({
          shopId, cyclePriceList, unReservationDayList,
        });
        setStorage(`plan#${shopId}#cyclePriceList`, null, -1);
        setStorage(`plan#${shopId}#unReservationDayList`, null, -1);
        message.success(resultMsg || '提交成功', 10);
        history.push('/plan/detail');
        window.scrollTo(0, 0);
      } catch (err) {
        throw err;
      }
    },
  },

  /**
  * 初始化请求
  * @param {object}
  * @property param param from url and startParams
  * @property extra extra arguments when reload
  * @return {any}
  */
  // async setup(dispatch, getState, { param }) {
  // async setup(dispatch) {
  // },
};
