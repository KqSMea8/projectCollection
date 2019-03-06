import ajax from '../../../common/ajax';

let loader;
const cache = {};

export function getLoader(mallId) {
  if (loader) {
    return loader;
  }
  loader = ajax({
    url: '/shop/initMallInfo.json',
    data: {
      mallId,
    },
    error: () => {},
  });
  return loader;
}

export default function getMallData(mallId, callback) {
  if (cache[mallId]) {
    callback(cache[mallId]);
    return;
  }
  getLoader(mallId).then((result) => {
    if (result.status === 'succeed') {
      const data = result.data || {};
      cache[mallId] = data;
      callback(data);
    }
  });
}
