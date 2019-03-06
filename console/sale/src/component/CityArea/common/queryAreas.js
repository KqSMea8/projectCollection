import ajax from 'Utility/ajax';

let cacheCityRes;
export default function(option) {
  if (cacheCityRes) {
    if (option.success) option.success(cacheCityRes);
    if (option.complete) option.complete();
    return;
  }
  ajax({
    url: `${window.APP.crmhomeUrl}/shop/koubei/territory/queryAreas.json`,
    method: 'get',
    type: 'json',
    success: (cityRes) => {
      if (cityRes && cityRes.status && cityRes.status === 'succeed') {
        cacheCityRes = cityRes;
      }
      if (option.success) option.success(cityRes);
    },
    error: (res, err) => {
      if (option.error) option.error(res, err);
    },
    complete: () => {
      if (option.complete) option.complete();
    },
  });
}
