import {TaskExecutor, TaskExeContent, TaskFlowRule} from '../../common/enum';

export default class FormDataProcessor {
  // 通过任务表单数据构造接口请求对象
  static composeTaskCreateRequest(data) {
    const {
      bizType,
      name,
      description,
      deadlineTimeTypeDTO,
      tips,
      exeContentValues,
      exeActValues
    } = data;

    let executorSelectStrategy;
    const {exeContent} = exeContentValues;
    switch (exeContent) {
    default:
    case TaskExeContent.MERCHANT:
      executorSelectStrategy = TaskExecutor.MERCHANT_BELONGER;
      break;
    case TaskExeContent.LEADS:
      executorSelectStrategy = TaskExecutor.LEADS_BELONGER;
      break;
    case TaskExeContent.SHOP:
      executorSelectStrategy = TaskExecutor.SHOP_OPERATOR;
    }

    return {
      bizType,
      name,
      description,
      deadlineTimeTypeDTO,
      executorSelectStrategy,
      exeContent,
      exeStrategy: exeActValues.exeStrategy,
      pcUrl: exeActValues.pcUrl,
      wirelessUrl: exeActValues.wirelessUrl,
      tipsFileName: tips ? tips.fileName : '',
      tipsFileUrl: tips ? tips.ossKey : '',
      fileUrl: exeContentValues.file ? exeContentValues.file.ossKey : '',
      fileName: exeContentValues.file ? exeContentValues.file.name : '',
      issueMode: exeContentValues.issueMode,
      dataSourceCode: exeContentValues.dataSourceCode || ''
    };
  }

  // 通过任务流表单数据构造接口请求对象
  static composeTaskFlowCreateRequest(data) {
    const {
      bizType, name, description, taskList
    } = data;
    return {
      bizType,
      flowRule: TaskFlowRule.PARALLEL,
      name,
      description,
      taskDefs: taskList.map(t => FormDataProcessor.composeTaskCreateRequest({...t, bizType}))
    };
  }

  /**
   * 通过服务端返回的任务数据构造表单对象
   * @param {TaskResponse} data
   * @return {{deadlineTimeTypeDTO: *, name: *, description: *, exeContentValues: {exeContent: *, issueMode: *, file: {ossKey: *, name: *}}, exeActValues: {exeStrategy: *, pcUrl: *, wirelessUrl: *}, tips: {fileName: *, ossKey: *}}}
   */
  static composeTaskFormData(data) {
    const {
      deadlineTimeTypeDTO, name, description, issueMode, extInfo, exeContent, exeStrategy, pcUrl, wirelessUrl, status, dataSourceCode,
    } = data;
    const {
      fileName, fileUrl, tipsFileName, tipsFileUrl
    } = extInfo;
    return {
      status,
      deadlineTimeTypeDTO,
      name,
      description,
      exeContentValues: {
        exeContent,
        dataSourceCode,
        issueMode,
        file: fileUrl ? {
          ossKey: fileUrl,
          name: fileName
        } : null
      },
      exeActValues: {
        exeStrategy,
        pcUrl,
        wirelessUrl
      },
      tips: tipsFileUrl ? {
        fileName: tipsFileName,
        ossKey: tipsFileUrl
      } : null
    };
  }

  // 通过服务端返回的任务流数据构造表单对象
  static composeTaskFlowFormData() {
    //
  }
}

/**
 * @typedef {object} TaskResponse
 * @property beginTime
 * @property bizType
 * @property createrId
 * @property createrName
 * @property deadlineTime
 * @property description
 * @property exeContent
 * @property exeStrategy
 * @property executorSelectStrategy
 * @property extInfo
 * @property extInfo.batchNo
 * @property extInfo.fileName
 * @property extInfo.fileUrl
 * @property extInfo.tipsFileName
 * @property extInfo.tipsFileUrl
 * @property finishRate
 * @property id
 * @property issueMode
 * @property name
 * @property pcUrl
 * @property status
 * @property taskFlowId
 * @property totalCount
 * @property waitCount
 * @property wirelessUrl
 */

