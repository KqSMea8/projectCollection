const filter = values => {
  const values2 = {};
    /*eslint-disable */
  Object.keys(values).
    forEach(key => {
      /*eslint-enable */
      const value = values[key];
      if (value === undefined || value === '' || value === 'all' || value === null ||
        (Array.isArray(value) && value.length === 0)) {
        return;
      }
      if (!values.trade && (key === 'tradeAmountMin' || key === 'tradeAmountMax' ||
        key === 'tradeCountMin' || key === 'tradeCountMax' || key === 'tradePerPriceMin' ||
        key === 'tradePerPriceMax')) {
        return;
      }
      if (!values.location && (key === 'activityTime' || key === 'activityLbs' ||
        key === 'activityScope')) {
        return;
      }
      if (values.ageType !== 'range' && key === 'age') {
        return;
      }
      values2[key] = value;
    });
  return values2;
};

export default filter;
