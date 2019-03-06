import Postmsg from 'kb_postmsg';
import { keepSession } from '../../common/utils';
keepSession(0, 10000);

const posmsg = new Postmsg();
posmsg.addHandleMessage((e) => {
  if (e && e.data) {
    const {type, value} = e.data;
    if (type === 'setHeight' && value) {
      document.querySelector('.isv-iframe').height = value;
    }
  }
});
