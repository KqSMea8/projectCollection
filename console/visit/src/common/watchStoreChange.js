/* eslint-disable no-param-reassign */

/**
 * 观察 kobe 的 store 是否发生变化。
 * 可以用 state.fieldChange / props.fieldChange 来取到是否发生了变化
 * @param store kobe 定义的 store
 * @param [option] 选项
 * @param [option.fieldChangeKey] 写入 state 的 key，默认 'fieldChange'
 * @param [option.watchFields] 要观察是否变化的 fields，默认使用 Object.keys(store.initial)
 * @param [option.isFieldChange] (field, newV, old) => bool; 判断观察到的 field 是否改变了。默认使用 !== 来判断
 * @param [option.beforeSetup] 是否使用初始的 initial 来对比。默认 false，代表在 setup 结束后才开始观察
 * @returns 修改后的 store
 */
export default function (store, option = {}) {
  const fieldChangeKey = option.fieldChangeKey || 'fieldChange';
  const watchFields = option.watchFields || Object.keys(store.initial || {});
  const beforeSetup = option.beforeSetup;
  const isFieldChange = option.isFieldChange || ((field, v1, v2) => v1 !== v2);

  let originState;
  function checkChangeAndModifyNewState(newState) {
    if (!originState) return;
    for (const field of watchFields) {
      if (isFieldChange(field, newState[field], originState[field])) {
        newState[fieldChangeKey] = true;
        return;
      }
    }
    newState[fieldChangeKey] = false;
  }

  Object.keys(store.reducers || {}).forEach(key => {
    const originAction = store.reducers[key];
    if (originAction) {
      store.reducers[key] = function newAction(...args) {
        const newState = originAction.apply(this, args);
        checkChangeAndModifyNewState(newState);
        return newState;
      };
    }
  });

  if (beforeSetup) {
    originState = store.initial || {};
  } else {
    const originSetup = store.setup;
    store.setup = async function setup(...args) {
      let result;
      if (originSetup) {
        result = await originSetup.apply(this, args);
      }
      const getState = args[1];
      originState = getState();
      return result;
    };
  }

  store.initial = store.initial || {};
  store.initial[fieldChangeKey] = false;
  return store;
}
