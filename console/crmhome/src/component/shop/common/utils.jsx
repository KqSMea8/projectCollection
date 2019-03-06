
export function shopStatusMapping() {
  return {
    statusEnum: {
      INIT: '未认领',
      CLAIMED: '已认领',
      CONFIRMING: '待商户确认',
      RELATED: '已关联商户',
      OPENED: '已开店',
      OPENING: '开店中',
    },
  };
}

export function remoteLog(seed) {
  if (window.Tracker && window.Tracker.click) {
    window.Tracker.click(seed);
  }
}
