import ajax from 'Utility/ajax';
import {transformLCV} from '../../../common/treeUtils';

let loader;

function getAreaCategory() {
  if (loader) {
    return loader;
  }
  loader = ajax({
    url: '/kbConfig/queryAreaCategory.json?label=KOUBEI_SALESCRM&method=wireless',
    useIframeProxy: true,
  });
  return loader;
}

export function loadArea() {
  const promise = getAreaCategory().then((d)=> {
    return transformLCV(d.data.areas);
  });
  return promise;
}

export function loadCategory() {
  const promise = getAreaCategory().then((d)=> {
    return transformLCV(d.data.categories);
  });
  return promise;
}
