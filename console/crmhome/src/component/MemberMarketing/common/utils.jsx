export function getCateringPriceChangeStatus(type, changePriceBefore, changePriceAfter) {
  let priceChanged = false;
  let thresholdChanged = false;
  let capAmountChanged = false;
  if (changePriceBefore && changePriceAfter) {
    if (type === 'ITEM' && changePriceBefore.price !== undefined && changePriceAfter.price !== undefined && changePriceBefore.price !== changePriceAfter.price) {
      // 商品
      priceChanged = true;
    } else if (type === 'MANJIAN' && ((changePriceBefore.threshold !== undefined && changePriceAfter.threshold !== undefined && changePriceBefore.threshold !== changePriceAfter.threshold)
      || (changePriceBefore.discountAmount !== undefined && changePriceAfter.discountAmount !== undefined && changePriceBefore.discountAmount !== changePriceAfter.discountAmount))) {
      // 全场每满减
      priceChanged = true;
    } else if (type === 'VOUCHER' && changePriceBefore.discountAmount !== undefined && changePriceAfter.discountAmount !== undefined && changePriceBefore.discountAmount !== changePriceAfter.discountAmount) {
      // 全场代金券
      priceChanged = true;
    } else if (type === 'RATE' && changePriceBefore.rate !== undefined && changePriceAfter.rate !== undefined && changePriceBefore.rate !== changePriceAfter.rate) {
      // 全场折扣
      priceChanged = true;
    }
    if (['VOUCHER', 'RATE'].indexOf(type) >= 0 && changePriceBefore.threshold !== undefined && changePriceAfter.threshold !== undefined && changePriceBefore.threshold !== changePriceAfter.threshold) {
      thresholdChanged = true;
    }
    if (['MANJIAN', 'RATE'].indexOf(type) >= 0 && changePriceBefore.capAmount !== undefined && changePriceAfter.capAmount !== undefined && changePriceBefore.capAmount !== changePriceAfter.capAmount) {
      capAmountChanged = true;
    }
  }
  return {
    priceChanged,
    thresholdChanged,
    capAmountChanged,
  };
}
