export function json2params(json) {
  const str = [];
  for (const i in json) {
    if (json.hasOwnProperty(i)) {
      if (json[i] === null || json[i] === undefined) {
        str.push(i + '=');
      } else {
        str.push(i + '=' + encodeURIComponent(json[i]));
      }
    }
  }
  return str.join('&');
}

export function addQueryParams(url, json) {
  const urlPattern = url.split('#');
  const baseUrl = urlPattern[0];
  const hash = urlPattern[1];
  const paramsStr = json2params(json);
  let newUrl = baseUrl.indexOf('?') >= 0 ? (baseUrl + '&' + paramsStr) : (baseUrl + '?' + paramsStr);
  if (hash) {
    newUrl += '#' + hash;
  }
  return newUrl;
}
