export function json2params(json) {
  const str = [];
  for (const i in json) {
    if (json.hasOwnProperty(i)) {
      str.push(i + '=' + encodeURIComponent(json[i]));
    }
  }
  return str.join('&');
}
