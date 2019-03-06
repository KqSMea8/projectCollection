import {DOWN_KOUBEI_CODE_URL_URL} from '../common/constants';
import { trimParams, buildQueryString } from '../common/utils';
export const downloadCodeUrl = ({ batchId, shopId, targetId, bindScene, status }) => {
  const params = {
    batchId,
    shopId,
    status,
    targetId,
    bindScene,
  };
  const downloadLink = `${DOWN_KOUBEI_CODE_URL_URL}?${buildQueryString(trimParams(params))}`;
  window.open(downloadLink);
};
