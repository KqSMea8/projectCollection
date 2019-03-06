export function moneyCut(number, place) {
  let [num, n] = [0, 0];
  if (place && place > 0) {
    n = place;
  }
  if (!isNaN(Number(number))) {
    num = Number(number).toFixed(n);
    if (n === 0) {
      num = num.replace(/\B(?=(\d{3})+$)/g, ',');
    } else {
      num = num.split('.')[0].replace(/\B(?=(\d{3})+$)/g, ',') + '.' + num.split('.')[1];
      // num = num.replace(/.00$/, '');
      // if (num[num.length - 1] === '0' && num.indexOf('.') !== -1) {
      //   num = num.slice(0, num.length - 1);
      // }
    }
    return num;
  }
}

