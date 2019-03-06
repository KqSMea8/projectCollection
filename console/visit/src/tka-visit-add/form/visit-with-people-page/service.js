import fetch from '@alipay/kobe-fetch';
import SystemsHost from '../../../common/systems-host';

export function loadWithPeople(searchKey) {
  return fetch.ajax({
    url: `${SystemsHost.kbsales}/searchUsers.json`,
    data: {
      type: 'BD',
      keyword: searchKey,
    },
  }).then(res => {
    const idMap = {};
    res.data.forEach(item => {
      idMap[item.id] = { id: item.id, name: `${item.realName}(${item.nickName})` };
    });
    return Object.keys(idMap).map(id => idMap[id]);
  });
}
