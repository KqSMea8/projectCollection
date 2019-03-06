import { getParam } from '@alipay/kobe-util';
import { set } from '@alipay/kobe-store';
import { popPage } from '@alipay/kb-m-biz-util';
import { addVisitObject, modifyVisitObject } from './service';
import watchStoreChange from '../../../../common/watchStoreChange';
import { validateTel } from '../../../../common/util';

const store = {
  initial: {
    name: '',
    phone: '',
    job: '运营总监',
  },
  reducers: {
    setName: set('name'),
    setPhone: set('phone'),
    setJob: set('job'),
  },
  asyncs: {
    async doAddOrEdit(dispatch, getState, editId) {
      const isAdd = editId === null || editId === undefined;
      const state = getState();
      const phone = state.phone.trim();
      if (!state.name || state.name.length > 20) {
        kBridge.call('showToast', '请输入"姓名"，最多20个字');
      } else if (phone && !validateTel(phone)) {
        kBridge.call('showToast', '联系电话格式不符合要求');
      } else if (!state.job) {
        kBridge.call('showToast', '请填写职务');
      } else {
        try {
          kBridge.call('showLoading');
          let resId;
          if (isAdd) { // 添加
            const res = await addVisitObject({
              name: state.name,
              phone: state.phone,
              job: state.job,
              merchantId: getParam().merchantId,
            });
            resId = res.data;
          } else { // 修改
            await modifyVisitObject({
              id: editId,
              name: state.name,
              phone: state.phone,
              job: state.job,
              merchantId: getParam().merchantId,
            });
            resId = editId;
          }
          kBridge.call('hideLoading');
          popPage({
            id: resId,
            name: state.name,
            phone: state.phone,
            job: state.job,
          });
        } catch (err) {
          kBridge.call('hideLoading');
          kBridge.call('showToast', err.message);
        }
      }
    },
  },
  async setup(dispatch, getState, { param }) {
    const data = param.data && JSON.parse(param.data);

    const isEdit = !!data;
    if (data) {
      dispatch({ type: 'setName', payload: data.name });
      dispatch({ type: 'setPhone', payload: data.phone });
      dispatch({ type: 'setJob', payload: data.job });
    }
    kBridge.call('setNavigationBar', isEdit ? '编辑对象' : '添加对象');
  },
};

export default watchStoreChange(store);
