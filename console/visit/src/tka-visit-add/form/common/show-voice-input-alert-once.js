
export default function () {
  const key = 'tka-visit-add-show-voice-input-alert-once';
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, '1');
    kBridge.call('alert', {
      title: '文本输入提示',
      content: '推荐使用有语音输入法的键盘，用语音输入更高效',
      buttonText: '知道了',
    });
  }
}
