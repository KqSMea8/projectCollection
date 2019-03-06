import { blockInvalidLetter } from '../../../OneClickMove/common/commonValidate';
export default [
  {
    key: 'PurchaseInformation',
    component: 'ContentInput',
    field: 'buyTips',
    fieldChild: {
      title: 'key',
      content: 'value',
    },
    label: '购买须知',
    required: false,
    defaultValue: '',
    rules: {
      title: [{
        max: 15,
        message: '限15个字',
      }, blockInvalidLetter],
      content: [blockInvalidLetter],
    },
    placeholder: {
      title: '标题，限15个字',
      content: '',
    },
    maxRow: 1000,
    maxCol: 1000,
    extra: '须知内容总字数2000字以内',
  },
  {
    key: 'Memo',
    component: 'Input',
    field: 'remark',
    label: '备注',
    required: false,
    rules: [{ type: 'string', max: 100, message: '不能超过 100 字' }],
    placeholder: '仅作管理使用，不会展示给用户',
  }, {
    key: 'latestNotices',
    component: 'Input',
    field: 'latestNotices',
    label: '最新通知',
    placeholder: '详细内容最多100字',
    extra: '最新通知100字以内',
    required: false,
    type: 'textarea',
    rules: [{
      max: 100, message: '最多100个字',
    }, blockInvalidLetter],
  },
];
