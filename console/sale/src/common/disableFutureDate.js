import GregorianCalendar from 'gregorian-calendar';
import zhCn from 'gregorian-calendar/lib/locale/zh_CN';

const now = new GregorianCalendar(zhCn);
now.setTime(Date.now());

export default function disabledFutureDate(date) {
  return date.compareToDay(now) > 0;
}
