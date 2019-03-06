import React from 'react';
const Util = {
  formateCash(price = 0, isCash) {
    if (!parseFloat(price)) {
      return '暂无数据';
    }

    const priceInit = isCash ? parseFloat(price) / 100 : parseFloat(price);
    const priceValue = String(parseInt(priceInit, 10)).split('').reverse();
    let priceLeave = '';
    if (isCash && priceInit) {
      priceLeave += priceInit.toFixed(2).substr(-3);
    }
    return priceValue.map((item, index) => {
      let itemInfo = item;
      if (index && index % 3 === 0 && index !== price.length) {
        itemInfo += ',';
      }
      return itemInfo;
    }).reverse().join('') + priceLeave;
  },

  loop(obj, callback) {
    Object.keys(obj).forEach(item => {
      callback(item, obj[item]);
    });
  },

  formateDate(value) {
    return value && value.replace(/^(\d{4})(\d{2})/, '$1-$2-');
  },

  camelCase(word) {
    const changeWord = word.split('_');
    return changeWord.slice(0, 1) + changeWord.slice(1).map(item => {
      return item.replace(/^\w/, (match) => {
        return match.toUpperCase();
      });
    }).join('');
  },

  highlightClass(amount) {
    if (!parseFloat(amount)) {
      return 'detail-default';
    }
    return amount > 0 ? 'detail-orange' : 'detail-green';
  },

  formatePercent(percent) {
    if (!parseFloat(percent)) {
      return <span style={{paddingLeft: '13px', color: '#999'}}>无</span>;
    }
    const percentInfo = parseFloat(percent) * 100 || 0;
    return (<span className={this.highlightClass(percentInfo)}>{ percentInfo > 0 ? '+' : ''}{percentInfo.toFixed(1)}%</span>);
  },

  loopRequest(request, time) {
    if (this[request.name]) {
      clearTimeout(this[request.name]);
    }
    request();
    this[request.name] = setTimeout(() => {
      this.loopRequest(request, time);
    }, (time || 10000));
  },

  randomColor() {
    return '#' + ('eeeeee' + ((Math.random() * 16777215 + 0.4) >> 0).toString(16)).slice(-6);
  },

  destroyRequest() {
    Object.keys.forEach((item) => {
      clearTimeout(item);
    });
  },
};

export default Util;
