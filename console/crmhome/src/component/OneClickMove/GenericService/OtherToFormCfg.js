import { blockInvalidLetter } from '../common/commonValidate';

const totalMax = 2600;
export default [
  {
    key: 'DetailedContent',
    component: 'ContentInput',
    field: 'detailInfo',
    fieldChild: {
      title: 'title',
      content: 'details',
    },
    max: totalMax,
    label: '详细内容',
    required: true,
    defaultValue: '',
    rules: {
      title: [{
        max: 15,
        message: '标题最多15字',
      }, blockInvalidLetter],
      content: [{
        max: 100,
        message: '详细内容最多100字',
      }, blockInvalidLetter],
    },
    placeholder: {
      title: '标题最多15字',
      content: '详细内容最多100字',
    },
  },
  {
    key: 'PurchaseInformation',
    component: 'ContentInput',
    field: 'buyerNotes',
    fieldChild: {
      title: 'title',
      content: 'details',
    },
    label: '购买须知',
    required: true,
    defaultValue: '',
    max: totalMax,
    rules: {
      title: [{
        max: 15,
        message: '标题最多15字',
      }, blockInvalidLetter],
      content: [{
        max: 100,
        message: '详细内容最多100字',
      }, blockInvalidLetter],
    },
    placeholder: {
      title: '标题最多15字',
      content: '详细内容最多100字',
    },
  },
];
