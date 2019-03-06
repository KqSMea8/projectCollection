import {keyMirror} from '../../../common/TypeUtils';

export const StuffCheckType = keyMirror({
  PASS: null,
  NOT_PASS: null,
  WAIT_CHECK: null,
  OFFLINE_CHECK: null
});

export const RecordChannel = keyMirror({
  PC: null,
  DINGDING: null,
  MERCHANT_APP: null
});

export const RecordChannelText = {
  [RecordChannel.PC]: '销售工作台',
  [RecordChannel.DINGDING]: '集团钉钉客户端',
  [RecordChannel.MERCHANT_APP]: '口碑掌柜'
};
