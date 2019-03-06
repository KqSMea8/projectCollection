import { set } from '@alipay/kobe-store';
import { formatTimeEndmm } from '../common/util';
import { createRecord, getMerchantDigitalFeedback } from './service';
import { VISIT_PURPOSE_TKA_VALUE } from '../common/constants';
import watchStoreChange from '../common/watchStoreChange';
import { spmNavBarSubmit } from './spm.config';

/* eslint-disable */
const store = {
  initial: {
    visitTime: Date.now(), // 拜访时间
    visitWay: 'VISIT_SPEAK', // 拜访方式，默认面谈
    visitMerchant: null, // 拜访商户
    visitSubCompany: null, // 拜访分公司
    visitWithPeople: null, // 陪访人
    visitObject: null, // 拜访对象
    digitalFeedBack: null, // 数字化程度反馈
    visitResult: null, // 拜访结果
    nextPlan: null, // 下一步计划
    otherNote: null, // 其他备注
    submitSucResult: null, // 提交成功后，服务器返回的接口内容
  },

  reducers: {
    setVisitWay: set('visitWay'),
    setVisitMerchant(state, payload) {
      return {
        ...state,
        visitMerchant: payload,
        visitSubCompany: null,
        visitObject: null,
      };
    },
    setVisitSubCompany: set('visitSubCompany'),
    setVisitWithPeople: set('visitWithPeople'),
    setVisitObject: set('visitObject'),
    setDigitalFeedBack: set('digitalFeedBack'), // 数字化程度反馈
    setVisitResult: set('visitResult'),
    setNextPlan: set('nextPlan'),
    setOtherNote: set('otherNote'),
    setSubmitSucResult: set('submitSucResult'),
  },

  asyncs: {
    async doSubmit(dispatch, getState) {
      if (window.Tracert && Tracert.click) Tracert.click(spmNavBarSubmit);
      try {
        const state = getState();
        // 检查输入
        if (!state.visitWay) {
          return kBridge.call('showToast', '请选择拜访方式');
        }
        if (!state.visitMerchant) {
          return kBridge.call('showToast', '请选择拜访商户');
        }
        if (!state.visitObject || state.visitObject.length === 0) {
          return kBridge.call('showToast', '请选择拜访对象');
        }
        if (
          !state.digitalFeedBack ||
          Object.values(state.digitalFeedBack).filter(v => v).length < 22
        ) {
          return kBridge.call('showToast', '请完善数字化程度反馈');
        }
        if (!state.visitResult || state.visitResult.length === 0) {
          return kBridge.call('showToast', '请输入拜访结果');
        }
        if (!state.nextPlan) {
          return kBridge.call('showToast', '请输入下一步计划');
        }
        // 开始提交
        kBridge.call('showLoading');
        /* eslint-disable max-len */
        const res = await createRecord({
          visitTime: formatTimeEndmm(state.visitTime), // 拜访时间
          visitWay: state.visitWay, // 拜访方式
          customerId: state.visitMerchant && state.visitMerchant.id, // 商户id
          visitCompany: state.visitSubCompany && state.visitSubCompany.name, // 拜访分公司，传递名称，不传id
          restVisitUser:
            state.visitWithPeople &&
            state.visitWithPeople.map(item => item.id).join(','), // 陪访人，多个之间逗号隔开，传递id
          visitContacts:
            state.visitObject &&
            state.visitObject.map(item => item.id).join(','), // 拜访对象联系人，多个之间逗号隔开，传递id
          visitPurpose: state.visitResult.map(item => item.id).join('|'), // 拜访目的，多个之间|隔开
          digitalFeedBackInfo: JSON.stringify(state.digitalFeedBack), // 数字化程度反馈
          needTalkResult: (
            state.visitResult.filter(
              item => item.id === VISIT_PURPOSE_TKA_VALUE.NEED_INTENT_TALK
            )[0] || {}
          ).value, // 需求&意向沟通-沟通结果
          signTalkResult: (
            state.visitResult.filter(
              item => item.id === VISIT_PURPOSE_TKA_VALUE.SIGN_PLAN_TALK
            )[0] || {}
          ).value, // 签约计划沟通-沟通结果
          activityTalkResult: (
            state.visitResult.filter(
              item => item.id === VISIT_PURPOSE_TKA_VALUE.ACTIVITY_REPLAY
            )[0] || {}
          ).value, // 活动复盘-沟通结果
          otherTalkResult: (
            state.visitResult.filter(
              item => item.id === VISIT_PURPOSE_TKA_VALUE.OTHER_TKA
            )[0] || {}
          ).value, // 其他-沟通结果
          followPlan: state.nextPlan, // 下一步计划
          visitDesc: state.otherNote, // 其他备注
        });
        dispatch({ type: 'setSubmitSucResult', payload: res });
        kBridge.call('hideLoading');
        kBridge.call('showToast', '提交成功');
      } catch (err) {
        kBridge.call('hideLoading');
        kBridge.call('showToast', err.message);
      }
      return null;
    },
    async getMerchantDigitalFeedback(dispatch, getState, payload) {
      try {
        const res = await getMerchantDigitalFeedback(payload);
        dispatch({
          type: 'setDigitalFeedBack',
          payload: res.data,
        });
      } catch (err) {
        throw err;
      }
    },
  },
  async setup(dispatch, getState, { param }) {},
};

export default watchStoreChange(store);
