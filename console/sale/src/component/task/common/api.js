import fetch from '@alipay/kb-fetch';
import { TodoSearchType } from './enum';

/**
 * 分页查询任务列表
 * @param params
 * @param {String} params.beginTimeStart
 * @param {String} params.beginTimeEnd
 * @param {String} params.deadlineTimeStart
 * @param {String} params.deadlineTimeEnd
 * @param {String} params.bizType
 * @param {String} params.id
 * @param {String} params.createrId
 * @param {String} params.taskFlowId
 * @param {String} params.statusList
 * @param {String} params.pageNo
 * @param {String} params.pageSize
 * @param {String} params.cityId
 */
export const getTaskList = params => fetch({
  url: params.bizType === 'CITY' ? 'kbsales.taskDefManager.queryCityTaskDefByPage' : 'kbsales.taskDefManager.queryTaskDefByPage',
  param: { ...params, taskFlowId: '0' }
});

/**
 * 分页查询任务流列表
 * @param params
 * @param {String} params.beginTimeStart
 * @param {String} params.beginTimeEnd
 * @param {String} params.deadlineTimeStart
 * @param {String} params.deadlineTimeEnd
 * @param {String} params.bizType
 * @param {String} params.id
 * @param {String} params.createrId
 * @param {String} params.taskFlowId
 * @param {String} params.statusList
 * @param {String} params.flowStatusList
 * @param {String} params.pageNo
 * @param {String} params.pageSize
 */
export const getTaskFlowList = params => fetch({
  url: params.bizType === 'CITY' ? 'kbsales.taskFlowDefManager.queryCityTaskFlowDefByPage' : 'kbsales.taskFlowDefManager.queryTaskFlowDefAndDefByPage',
  param: { ...params }
});

/**
 * 更新任务
 * @param params
 * @param { Object } params.taskDefCreateRequest
 */
export const updateTask = params => fetch({
  url: 'kbsales.taskDefManager.updateTaskDef',
  param: { ...params }
});

/**
 * 删除任务
 * @param params
 * @param { String } params.id
 */
export const deleteTask = params => fetch({
  url: 'kbsales.taskDefManager.deleteTaskDef',
  param: { ...params }
});

/**
 * 终止任务
 * @param params
 * @param { String } params.id
 */
export const stopTask = params => fetch({
  url: 'kbsales.taskDefManager.stopTaskDef',
  param: { ...params }
});

/**
 * 更新任务流
 * @param params
 * @param { String } params.id
 * @param { Object } params.TaskFlowDefCreateRequest
 */
export const updateTaskFlow = params => fetch({
  url: 'kbsales.taskFlowDefManager.updateTaskFlowDef',
  param: { ...params }
});

/**
 * 删除任务流
 * @param params
 * @param { String } params.id
 */
export const deleteTaskFlow = params => fetch({
  url: 'kbsales.taskFlowDefManager.deleteTaskFlowDef',
  param: { ...params }
});

/**
 * 终止任务流
 * @param params
 * @param { String } params.id
 */
export const stopTaskFlow = params => fetch({
  url: 'kbsales.taskFlowDefManager.stopTaskFlowDef',
  param: { ...params }
});

/**
 * 创建任务
 * @param {TaskDefCreateRequest} params
 */
export const createTask = params => fetch({
  url: 'kbsales.taskDefManager.createTaskDef',
  param: { ...params }
});

/**
 * 创建任务流
 * @param params
 * @param {String} params.name
 * @param {String} params.description
 * @param {String} params.flowRule
 * @param {TaskDefCreateRequest[]} params.taskDefs
 */
export const createTaskFlow = params => fetch({
  url: 'kbsales.taskFlowDefManager.createTaskFlow',
  param: { ...params }
});

/**
 * @typedef {Object} TaskDefCreateRequest
 * @property {String} bizType
 * @property {String} name
 * @property {String} deadlineTime
 * @property {String} executorSelectStrategy 任务执行者策略选择
 * @property {String} exeStrategy 执行动作策略
 * @property {String} pcUrl
 * @property {String} wirelessUrl
 * @property {String} dataSourceCode 对接数据源标识
 * @property {String} exeContent 执行内容。LEADS,SHOP和MERCHANT
 * @property {String} tipsFileName 攻略名称
 * @property {String} tipsFileUrl
 * @property {String} fileName 文件名称
 * @property {String} fileUrl 文件地址
 * @property {String} issueMode
 * @property {String} description
 */

/**
 * 查询所有任务名称
 */
export const getAllTaskName = () => fetch({
  url: 'kbsales.taskDefManager.queryAllTaskDef',
});

/**
 * 查询所有任务流名称
 */
export const getAllTaskFlowName = () => fetch({
  url: 'kbsales.taskFlowDefManager.queryAllTaskFlowDef',
});

/**
 * 待办任务 任务流分页查询
 * @param params
 * @param params.executorId
 * @param params.pageNo
 * @param params.pageSize
 */
export const getTodoFlowList = params => fetch({
  url: 'kbsales.todoTaskSearchManager.queryTaskFlow',
  param: {
    searchType: TodoSearchType.TASK_FLOW_SEARCH,
    ...params
  }
});

/**
 * 待办任务 任务流下的任务查询
 * @param params
 * @param params.executorId
 * @param params.taskFlowId
 * @param params.pageNo
 * @param params.pageSize
 */
export const getTodoFlowTaskList = params => fetch({
  url: 'kbsales.todoTaskSearchManager.queryTask',
  param: {
    searchType: TodoSearchType.FLOW_TASK_SEARCH,
    ...params
  }
});

/**
 * 待办任务 单任务分页查询
 * @param params
 * @param params.executorId
 * @param params.pageNo
 * @param params.pageSize
 */
export const getTodoTaskList = params => fetch({
  url: 'kbsales.todoTaskSearchManager.queryTask',
  param: {
    searchType: TodoSearchType.SINGLE_TASK_SEARCH,
    ...params
  }
});

/**
 * 待办任务 分页查询
 * @param params
 * @param params.executorId
 * @param params.taskId
 * @param params.pageNo
 * @param params.pageSize
 */
export const getTodoList = params => fetch({
  url: 'kbsales.todoTaskSearchManager.queryTodoTask',
  param: {
    searchType: TodoSearchType.TODO_TASK_SEARCH,
    ...params
  }
});

/**
 * 任务流列表 加载任务流下的任务（无分页）
 * @param params
 * @param params.taskFlowId
 */
export const getTaskListByFlowId = params => fetch({
  url: 'kbsales.taskDefManager.queryTaskDefByTaskFlowId',
  param: {
    ...params
  },
});

/**
 * 待办任务处理 获取"出现问题的原因"选项列表
 */
export const getFeedbackReasonList = () => fetch({
  url: 'kbsales.todoTaskManager.queryFeedBackReason'
});

/**
 * 待办任务处理 提交处理
 * @param params
 * @param params.todoTaskId
 * @param params.result
 * @param params.reason
 * @param params.otherReason
 */
export const submitFeedback = (params) => fetch({
  url: 'kbsales.todoTaskManager.feedback',
  param: {
    ...params
  },
});

/**
 * 查询任务完成情况统计数据
 * @param params
 * @param params.taskDefId
 */
export const getTaskExeStat = (params) => fetch({
  url: 'kbsales.taskDefManager.queryTodoTaskCountByTaskDefId',
  param: {
    ...params
  }
});

/**
 * 查询任务执行内容系统数据选项列表
 */
export const getTaskExeContentOnlineOptions = () => fetch({
  url: 'kbsales.taskDefManager.getTaskDataSourceCodeList'
});
