import isArray from 'lodash/isArray';
import moment from 'moment';
export default class ListUtil {
  static processFormData(data) {
    const {
      beginTime, deadlineTime, creator, flowStatusList, statusList, taskFlowId, taskId, city
    } = data;
    let originBeginTimeStart;
    let originBeginTimeEnd;
    let originDeadlineTimeStart;
    let originDeadlineTimeEnd;
    if (isArray(beginTime)) {
      [originBeginTimeStart, originBeginTimeEnd] = beginTime;
    } else {
      originBeginTimeStart = originBeginTimeEnd = undefined;
    }
    if (isArray(deadlineTime)) {
      [originDeadlineTimeStart, originDeadlineTimeEnd] = deadlineTime;
    } else {
      originDeadlineTimeStart = originDeadlineTimeEnd = undefined;
    }
    return {
      beginTimeStart: originBeginTimeStart ? moment(originBeginTimeStart).format('YYYY-MM-DD') : '',
      beginTimeEnd: originBeginTimeEnd ? moment(originBeginTimeEnd).format('YYYY-MM-DD') : '',
      deadlineTimeStart: originDeadlineTimeStart ? moment(originDeadlineTimeStart).format('YYYY-MM-DD') : '',
      deadlineTimeEnd: originDeadlineTimeEnd ? moment(originDeadlineTimeEnd).format('YYYY-MM-DD') : '',
      id: taskId,
      taskFlowId,
      statusList,
      flowStatusList,
      createrId: creator && creator.id,
      cityId: city && city[city.length - 1],
    };
  }
}
