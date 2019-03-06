import { BIND_SCENE, BIND_SOURCE } from '../../common/enums';

const options = {
  [BIND_SOURCE.EXCEL]: {
    name: 'Excel表格导入',
    value: BIND_SOURCE.EXCEL,
    popoverConfig: {
      [BIND_SCENE.BIND_SHOP]: '下载模板表格，填写门店id、桌号等信息，生成口碑码。',
      [BIND_SCENE.BIND_TABLE]: '下载模板表格，填写门店id、桌号等信息，生成口碑码。',
      [BIND_SCENE.BIND_MALL]: '下载模板表格，按模板说明填写填写综合体ID号（shopID）导入即可生成口碑码。',
      [BIND_SCENE.BIND_SHELVES]: '下载模板表格，按模板说明填写商户PID、商品编号等信息并导入即可生成口碑码。',
      [BIND_SCENE.BIND_KAMERCHANT]: '下载模板表格，按模板说明填写商户PID并导入即可生成口碑码。',
    },
  },
  [BIND_SOURCE.ISV]: {
    name: '服务应用导入',
    value: BIND_SOURCE.ISV,
    popoverConfig: {
      [BIND_SCENE.BIND_TABLE]: '商家已订购的服务应用如有门店id、桌号等信息，可以直接导入。',
    },
  },
  [BIND_SOURCE.SHOP_PICKER]: {
    name: '在线选择门店',
    value: BIND_SOURCE.SHOP_PICKER,
    popoverConfig: {
      [BIND_SCENE.BIND_SHOP]: '选择你名下管理的门店，提交后可生成口碑码。',
    },
  },
};

const getOption = (source, scene) => ({
  ...options[source],
  popover: options[source].popoverConfig[scene],
});

export default {
  [BIND_SCENE.BIND_SHOP]: [
    getOption(BIND_SOURCE.EXCEL, BIND_SCENE.BIND_SHOP)
  ],
  [BIND_SCENE.BIND_TABLE]: [
    getOption(BIND_SOURCE.EXCEL, BIND_SCENE.BIND_TABLE),
    getOption(BIND_SOURCE.ISV, BIND_SCENE.BIND_TABLE),
  ],
  [BIND_SCENE.BIND_SHELVES]: [
    getOption(BIND_SOURCE.EXCEL, BIND_SCENE.BIND_SHELVES)
  ],
  [BIND_SCENE.BIND_MALL]: [
    getOption(BIND_SOURCE.EXCEL, BIND_SCENE.BIND_MALL)
  ],
  [BIND_SCENE.BIND_KAMERCHANT]: [
    getOption(BIND_SOURCE.EXCEL, BIND_SCENE.BIND_KAMERCHANT)
  ]
};
