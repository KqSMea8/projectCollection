import { message, Modal } from 'antd';
import history from '@alipay/kobe-history';
import { queryList, delSpiConfig, queryDetail, updateSpiOwner } from './service';
import { queryEnvCode } from '../common/api';

export default {
  namespace: 'list',

  initial: {
    loading: false,
    objectEnvironmental: {
      env: '',
      col: '',
      informationPrompt: '',
    }, // 当前环境颜色，提示文字，环境类型
    gmtModifiedStart: '', // 开始日期
    gmtModifiedEnd: '', // 结束时间
    pageInfo: { // 分页信息
      pageNo: 1, // 当前页数
      pageSize: 15, // 每页大小
      totalPages: 0, // 总页数
      totalItems: 0, // 总记录数
    },
    tableData: [],
    detailData: {},
    owner: '',
    bizType: '',
    appName: '',
    operationType: '',
  },

  reducers: {
    getQueryList(state, payload) {
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
            dispatch({ type: 'getQueryList', payload: {
              objectEnvironmental: {
                env: '测试环境',
                col: 'purple',
                informationPrompt: '强烈建议从开发环境同步，客官确定直接修改？',
              },
            } });
          } else if (envCode === 'PREPUB') {
            dispatch({ type: 'getQueryList', payload: {
              objectEnvironmental: {
                env: '预发环境',
                col: 'yellow',
                informationPrompt: '强烈建议从测试环境同步，客官确定直接修改？',
              },
            } });
          } else if (envCode === 'DEV') {
            dispatch({ type: 'getQueryList', payload: {
              objectEnvironmental: {
                env: '开发环境',
                col: 'green',
                informationPrompt: '',
              },
            } });
          } else if (envCode === 'PROD') {
            dispatch({ type: 'getQueryList', payload: {
              objectEnvironmental: {
                env: '生产环境',
                col: 'red',
                informationPrompt: '暂不可修改',
              },
            } });
          } else {
            dispatch({ type: 'getQueryList', payload: {
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
    // 列表查询
    async queryList(dispatch, getState, payload) {
      try {
        const { gmtModifiedStart, gmtModifiedEnd, pageInfo } = getState();
        const { pageNo, pageSize } = pageInfo;
        const res = await queryList({ pageNo, pageSize, gmtModifiedStart, gmtModifiedEnd, ...payload });
        console.log('列表owner', payload);
        if (res.status === 'succeed') {
          if (res.data) {
            dispatch({ type: 'getQueryList', payload: {
              loading: true,
              tableData: res.data.data,
              pageInfo: {
                pageNo: res.data.pageNo,
                pageSize: res.data.pageSize,
                totalItems: res.data.totalItems,
                totalPages: res.data.totalPages,
              },
              owner: payload.owner,
              bizType: payload.bizType,
              appName: payload.appName,
              operationType: payload.operationType,
              gmtModifiedStart: payload.gmtModifiedStart,
              gmtModifiedEnd: payload.gmtModifiedEnd,
            } });
          } else {
            dispatch({ type: 'getQueryList', payload: {
              loading: true,
              tableData: [],
              pageInfo: {
                pageNo: 1,
                pageSize: 15,
                totalItems: 0,
                totalPages: 0,
              },
            } });
          }
        } else {
          dispatch({ type: 'getQueryList', payload: {
            loading: true, ...payload,
          } });
        }
      } catch (err) {
        message.error('系统错误');
      }
    },
    // 删除
    async delSpiConfig(dispatch, getState, payload) {
      try {
        const { pageNo, pageSize, startDate, endDate, owner, bizType, appName, operationType } = getState();
        const res = await delSpiConfig({ ...payload });
        if (res.status === 'succeed') {
          message.success('删除成功');
          dispatch({ type: 'queryList', payload: { pageNo, pageSize,
            startDate, endDate, owner, bizType, appName, operationType } });
        } else {
          message.error('删除失败');
          Modal.error({
            title: '删除失败',
            content: res.resultMsg,
            okText: '知道了',
          });
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
          dispatch({ type: 'getQueryList', payload: {
            detailData: res.data,
          } });
        }
      } catch (err) {
        message.error('系统错误');
      }
    },
    // 修改SPI归属人
    async updateSpiOwner(dispatch, getState, payload) {
      try {
        const res = await updateSpiOwner(payload);
        if (res.status === 'succeed') {
          message.success('修改成功');
          history.go(0);
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
