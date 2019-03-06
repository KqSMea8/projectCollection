export default function copyJs(text, callback) {
  const fakeEle = document.createElement('textarea');

    // Place in top-left corner of screen regardless of scroll position.
  fakeEle.style.position = 'fixed';
  fakeEle.style.top = 0;
  fakeEle.style.left = 0;
  fakeEle.style.width = '1px';
  fakeEle.style.height = '1px';

  fakeEle.style.padding = 0;

  fakeEle.style.border = 'none';
  fakeEle.style.outline = 'none';
  fakeEle.style.boxShadow = 'none';

  fakeEle.style.background = 'transparent';

  fakeEle.value = text;

  document.body.appendChild(fakeEle);

  fakeEle.select();

  let error = null;
  try {
    const successful = document.execCommand('copy');
    error = successful ? false : true;
  } catch (err) {
    console.warn('Unable to copy.');
    error = true;
  }

  document.body.removeChild(fakeEle);

  if (callback) callback(error);
  return !!error;
}
