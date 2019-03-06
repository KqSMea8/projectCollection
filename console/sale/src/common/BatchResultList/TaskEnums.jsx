import { enumFactory } from '../TypeUtils';

export const STATUS = enumFactory({
  INIT: '正在处理',
  PROCESSING: '正在处理',
  FINISHED: '处理完成',
  UNKNOWN_ERROR: '发生未知错误',
});

export const SUB_STATUS = enumFactory({
  INIT: '初始化',
  ALL_SUCCESS: '全部处理成功',
  ALL_FAIL: '全部失败',
  PARTIAL_SUCCESS: '部分成功',
});
