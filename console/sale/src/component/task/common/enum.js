export const TaskBizType = {
  CITY: 'CITY',
  HQ: 'HQ',
  TKA: 'TKA'
};
export const TaskBizTypeText = {
  [TaskBizType.CITY]: '城市',
  [TaskBizType.HQ]: '城市总部',
  [TaskBizType.TKA]: 'TKA'
};
export const TaskType = {
  SINGLE: 'SINGLE',
  FLOW: 'FLOW'
};
export const TaskTypeText = {
  [TaskType.SINGLE]: '单任务',
  [TaskType.FLOW]: '任务流'
};
export const TaskExeContent = {
  SHOP: 'SHOP',
  LEADS: 'LEADS',
  MERCHANT: 'MERCHANT'
};
export const TaskExeContentText = {
  [TaskExeContent.SHOP]: '门店',
  [TaskExeContent.LEADS]: 'LEADS',
  [TaskExeContent.MERCHANT]: '商户'
};
export const TaskExecutor = {
  MERCHANT_BELONGER: 'MERCHANT_BELONGER',
  LEADS_BELONGER: 'LEADS_BELONGER',
  SHOP_OPERATOR: 'SHOP_OPERATOR'
};
export const TaskExecutorText = {
  [TaskExecutor.SHOP_OPERATOR]: '有门店代运营权限的人',
  [TaskExecutor.LEADS_BELONGER]: 'LEADS归属人',
  [TaskExecutor.MERCHANT_BELONGER]: '人户关系'
};
export const TaskStatus = {
  INIT: 'INIT',
  INIT_FAIL: 'INIT_FAIL',
  PROCESSING: 'PROCESSING',
  PROCESSING_PART_FAIL: 'PROCESSING_PART_FAIL',
  STOP: 'STOP',
  DEADLINE: 'DEADLINE',
  DELETE: 'DELETE'
};
export const TaskStatusText = {
  [TaskStatus.INIT]: '任务生成中',
  [TaskStatus.INIT_FAIL]: '任务生成失败',
  [TaskStatus.PROCESSING]: '任务执行中',
  [TaskStatus.PROCESSING_PART_FAIL]: '任务执行中(部分失败)',
  [TaskStatus.STOP]: '任务已终止',
  [TaskStatus.DEADLINE]: '任务已截止',
  [TaskStatus.DELETE]: '任务已删除'
};
export const TaskFlowStatus = {
  ONGOING: 'ONGOING',
  STOP: 'STOP',
  DEADLINE: 'DEADLINE',
  DELETE: 'DELETE'
};
export const TaskFlowStatusText = {
  [TaskFlowStatus.ONGOING]: '任务流进行中',
  [TaskFlowStatus.STOP]: '任务流已终止',
  [TaskFlowStatus.DEADLINE]: '任务流已截止',
  [TaskFlowStatus.DELETE]: '任务流已删除'
};
export const TodoTaskStatus = {
  WAITING: 'WAITING',
  COMPLETED: 'COMPLETED',
  OVERTIME: 'OVERTIME'
};
export const TodoTaskStatusText = {
  [TodoTaskStatus.WAITING]: '待处理',
  [TodoTaskStatus.COMPLETED]: '已完成',
  [TodoTaskStatus.OVERTIME]: '超时未处理'
};
// 任务下发方式（执行内容里面的选项）
export const TaskIssueMode = {
  UPLOAD: 'UPLOAD',
  SYSTEM: 'SYSTEM'
};
export const TaskIssueModeText = {
  [TaskIssueMode.UPLOAD]: '自定义上传内容',
  [TaskIssueMode.SYSTEM]: '选择来自系统上数据'
};
// 任务执行动作策略
export const TaskExeStrategy = {
  DEFAULT: 'DEFAULT',
  USER_DEF: 'USER_DEF'
};
export const TaskExeStrategyText = {
  [TaskExeStrategy.DEFAULT]: '默认操作流程',
  [TaskExeStrategy.USER_DEF]: '自定义操作流程'
};
export const TaskFlowRule = {
  SERIAL: 'SERIAL',
  PARALLEL: 'PARALLEL'
};
export const TodoSearchType = {
  TASK_FLOW_SEARCH: 'TASK_FLOW_SEARCH', // 任务流搜索
  SINGLE_TASK_SEARCH: 'SINGLE_TASK_SEARCH', // 单任务搜索
  FLOW_TASK_SEARCH: 'FLOW_TASK_SEARCH', // 任务流任务搜索
  TODO_TASK_SEARCH: 'TODO_TASK_SEARCH' // 待办任务搜索
};
