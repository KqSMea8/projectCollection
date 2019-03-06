import moment from 'moment';

class ListUtil {
  static composeSearchParams(search) {
    const clonedSearch = {...search};
    if (clonedSearch.beginTime && clonedSearch.beginTime[0]) {
      clonedSearch.beginTimeStart = moment(clonedSearch.beginTime[0]).format('YYYY-MM-DD');
      clonedSearch.beginTimeEnd = moment(clonedSearch.beginTime[1]).format('YYYY-MM-DD');
    }
    if (clonedSearch.deadlineTime && clonedSearch.deadlineTime[0]) {
      clonedSearch.deadlineTimeStart = moment(clonedSearch.deadlineTime[0]).format('YYYY-MM-DD');
      clonedSearch.deadlineTimeEnd = moment(clonedSearch.deadlineTime[1]).format('YYYY-MM-DD');
    }
    if (clonedSearch.executor) {
      clonedSearch.executorId = clonedSearch.executor.user.id;
      clonedSearch.onlySelf = clonedSearch.executor.onlySelf;
    }
    if (clonedSearch.exeContentAndName) {
      clonedSearch.exeContent = clonedSearch.exeContentAndName.exeContent;
      clonedSearch.bizName = clonedSearch.exeContentAndName.bizName;
    }
    delete clonedSearch.executor;
    delete clonedSearch.exeContentAndName;
    delete clonedSearch.beginTime;
    delete clonedSearch.deadlineTime;
    return clonedSearch;
  }
}

export default ListUtil;
