import moment from 'moment';
moment.locale('zh-cn');

import Pagination from 'rc-pagination/lib/locale/zh_CN';
import DatePicker from 'antd/lib/date-picker/locale/zh_CN';
import TimePicker from 'antd/lib/time-picker/locale/zh_CN';
import Calendar from 'antd/lib/calendar/locale/zh_CN';

export default {
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  Table: {
    filterTitle: '过滤器',
    filterConfirm: '确定',
    filterReset: '重置',
    emptyText: '暂无数据',
  },
  Modal: {
    okText: '确 定',
    cancelText: '取 消',
    justOkText: '确 定',
  },
  Popconfirm: {
    okText: '确 定',
    cancelText: '取 消',
  },
  Transfer: {
    notFoundContent: '无数据',
    searchPlaceholder: '输入搜索内容',
    itemUnit: '条',
    itemsUnit: '条',
  },
  Select: {
    notFoundContent: '暂无数据',
  },
};
