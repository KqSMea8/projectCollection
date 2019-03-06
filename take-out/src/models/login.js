import * as serviceTaken from '../services/login'
export default {
  namespace: 'login',
  state: {},
  reducers: {
    // 同步
  },
  effects: {
    // 异步
    *fetch ({payload: {id}}, {call, put}) {
      yield call(serviceTaken.query)
    }
  },
  subscriptions: {},
};
