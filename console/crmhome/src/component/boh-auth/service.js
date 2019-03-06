import ajax from '../../common/ajax';

const serviceWrapper = (params = {}) => {
  return (opts = {}) => ajax({
    ...params,
    ...opts,
    data: {
      ...(params.data || {}),
      ...(opts.data || {}),
      _t: + new Date(), // 清除缓存
    },
  });
};

// 获取权限列表
const fetchQueryPermissions = serviceWrapper({
  method: 'GET',
});

// 保存权限列表
const savePermission = serviceWrapper({
  url: '/staff/savePermission.json',
  method: 'POST',
});

export {
  fetchQueryPermissions,
  savePermission,
};
