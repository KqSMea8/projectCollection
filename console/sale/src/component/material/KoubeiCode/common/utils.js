import classnames from 'classnames';
/**
 * @function trimParams
 * @param params
 * @desc trim ajax param whose value is empty string or undefined
 */
export const trimParams = params => Object.keys(params)
  .filter(p => params[p] !== '' && params[p] !== undefined)
  .reduce((acc, p) => ({...acc, [p]: params[p]}), {});

/**
 * @function buildQueryString
 * @param params
 * @desc build query string from plain object
 * @example {a:1, b:2} => 'a=1&b=2'
 */
export const buildQueryString = params => Object.keys(params).map(q => `${q}=${params[q]}`).join('&');

export const fieldPropsWithHelp = (form, fieldName, helpMessage) => {
  const { getFieldError } = form;
  const errorMessage = getFieldError(fieldName);
  return {
    validateStatus: classnames({
      error: !!errorMessage,
    }),
    help: errorMessage || helpMessage,
  };
};
