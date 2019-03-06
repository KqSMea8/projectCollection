import { message, Modal } from 'antd';
import history from '@alipay/kobe-history';
import { queryDetail, addSpiConfig, updateSpiConfig, addKbProxyenvGroup,
  updateKbProxyenvGroup, queryProxyenvGroupDetail } from './service';
import { queryEnvCode, queryAppNames } from '../common/api';

export default {
  namespace: 'newAdd',

  initial: {
    loading: false,
    objectEnvironmental: {
      env: '',
      col: '',
      informationPrompt: '',
    }, // 当前环境颜色，提示文字，环境类型
    detailData: {},
    id: '',
    serverHostVal: '',
    serverHostKey: '',
    serverHostData: [], // 应用名数据
    flag: false,
  },

  reducers: {
    // 修改接口
    getUpdateSpiConfig(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
    // 应用名
    getQueryAppNames(state, payload) {
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
            dispatch({ type: 'getUpdateSpiConfig', payload: {
              objectEnvironmental: {
                env: '测试环境',
                col: 'purple',
                informationPrompt: '强烈建议从开发环境同步，客官确定直接修改？',
              },
            } });
          } else if (envCode === 'PREPUB') {
            dispatch({ type: 'getUpdateSpiConfig', payload: {
              objectEnvironmental: {
                env: '预发环境',
                col: 'yellow',
                informationPrompt: '强烈建议从测试环境同步，客官确定直接修改？',
              },
            } });
          } else if (envCode === 'DEV') {
            dispatch({ type: 'getUpdateSpiConfig', payload: {
              objectEnvironmental: {
                env: '开发环境',
                col: 'green',
                informationPrompt: '',
              },
            } });
          } else if (envCode === 'PROD') {
            dispatch({ type: 'getUpdateSpiConfig', payload: {
              objectEnvironmental: {
                env: '生产环境',
                col: 'red',
                informationPrompt: '暂不可修改',
              },
            } });
          } else {
            dispatch({ type: 'getUpdateSpiConfig', payload: {
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
    // 应用组名称
    async queryAppNames(dispatch, getState, payload) {
      try {
        const res = await queryAppNames();
        if (res.status === 'succeed') {
          dispatch({ type: 'getQueryAppNames', payload: {
            serverHostData: res.data,
          } });
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
          dispatch({ type: 'getUpdateSpiConfig', payload: {
            detailData: res.data,
          } });
        }
      } catch (err) {
        message.error('系统错误');
      }
    },
    // 修改接口
    async updateSpiConfig(dispatch, getState, payload) {
      try {
        const { id } = getState();
        const res = await updateSpiConfig({ id, ...payload });
        if (res.status === 'succeed') {
          message.success('修改成功');
          history.push('/spi');
        } else {
          message.error('修改失败');
          Modal.error({
            title: '修改失败',
            content: res.resultMsg,
            okText: '知道了',
          });
        }
      } catch (err) {
        message.error('系统错误');
      }
    },
    // 新增接口
    async addSpiConfig(dispatch, getState, payload) {
      try {
        const res = await addSpiConfig(payload);
        if (res.status === 'succeed') {
          message.success('添加成功');
          history.push('/spi');
        } else {
          message.error('添加失败');
          Modal.error({
            title: '添加失败',
            content: res.resultMsg,
            okText: '知道了',
          });
        }
      } catch (err) {
        message.error('系统错误');
      }
    },
    // SPI应用组添加
    async addKbProxyenvGroup(dispatch, getState, payload) {
      try {
        const res = await addKbProxyenvGroup(payload);
        if (res.status === 'succeed') {
          message.success('添加成功');
          // 调用应用名接口
          // 页面强制刷新
          // history.go(0);
          const appNameData = await queryAppNames();
          if (appNameData.status === 'succeed') {
            dispatch({ type: 'getQueryAppNames', payload: {
              serverHostData: appNameData.data,
              flag: true,
            } });
          }
        } else {
          message.error('添加失败');
          Modal.error({
            title: '添加失败',
            content: res.resultMsg,
            okText: '知道了',
          });
        }
      } catch (err) {
        message.error('系统错误');
      }
    },
    // SPI应用组修改
    async updateKbProxyenvGroup(dispatch, getState, payload) {
      try {
        const res = await updateKbProxyenvGroup(payload);
        if (res.status === 'succeed') {
          message.success('修改成功');
        } else {
          message.error('修改失败');
          Modal.error({
            title: '修改失败',
            content: res.resultMsg,
            okText: '知道了',
          });
        }
      } catch (err) {
        message.error('系统错误');
      }
    },
    // 应用名详情查询
    async queryProxyenvGroupDetail(dispatch, getState, payload) {
      try {
        const res = await queryProxyenvGroupDetail(payload);
        const { id, serverHostKey, serverHostVal } = res.data;
        if (res.status === 'succeed') {
          dispatch({ type: 'getUpdateSpiConfig', payload: {
            id,
            serverHostKey,
            serverHostVal,
          } });
        } else {
          message.error('查询失败');
          Modal.error({
            title: '查询失败',
            content: res.resultMsg,
            okText: '知道了',
          });
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
