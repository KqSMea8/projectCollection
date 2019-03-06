import { message } from 'antd';
import { queryDetail } from './service';
import { queryEnvCode } from '../common/api';

export default {
  namespace: 'detail',

  initial: {
    loading: false,
    objectEnvironmental: {
      env: '',
      col: '',
      informationPrompt: '',
    }, // 当前环境颜色，提示文字，环境类型
    detailData: {},
  },

  reducers: {
    getQueryDetail(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  // async action
  asyncs: {
    // 当前环境
    async queryEnvCode(dispatch, getState, payload) {
      try {
        const res = await queryEnvCode();
        const { envCode } = res.data;
        if (res.status === 'succeed') {
          if (envCode === 'TEST') {
            dispatch({ type: 'getQueryDetail', payload: {
              objectEnvironmental: {
                env: '测试环境',
                col: 'purple',
                informationPrompt: '强烈建议从开发环境同步，客官确定直接修改？',
              },
            } });
          } else if (envCode === 'PREPUB') {
            dispatch({ type: 'getQueryDetail', payload: {
              objectEnvironmental: {
                env: '预发环境',
                col: 'yellow',
                informationPrompt: '强烈建议从测试环境同步，客官确定直接修改？',
              },
            } });
          } else if (envCode === 'DEV') {
            dispatch({ type: 'getQueryDetail', payload: {
              objectEnvironmental: {
                env: '开发环境',
                col: 'green',
                informationPrompt: '',
              },
            } });
          } else if (envCode === 'PROD') {
            dispatch({ type: 'getQueryDetail', payload: {
              objectEnvironmental: {
                env: '生产环境',
                col: 'red',
                informationPrompt: '暂不可修改',
              },
            } });
          } else {
            dispatch({ type: 'getQueryDetail', payload: {
              objectEnvironmental: {
                env: '未知环境',
                col: '',
                informationPrompt: '未知环境',
              },
            } });
          }
        }
      } catch (err) {
        message.error('系统错误');
      }
    },
    // 查询详情数据
    async queryDetail(dispatch, getState, payload) {
      try {
        const res = await queryDetail(payload);
        if (res.status === 'succeed') {
          dispatch({ type: 'getQueryDetail', payload: {
            detailData: res.data,
          } });
        }
      } catch (err) {
        message.error('系统错误');
      }
    },
  },

  /**
   * 初始化请求
   * @param dispatch
   * @param getState
   * @param params
   * @param params.param url中的查询参数
   * @param params.extra reload时传递的参数
   */
  // async setup(dispatch, getState, { param }) {
  //   const res = await getData(param);
  //   return res.data;
  // },
};
