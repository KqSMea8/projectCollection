const config = [{
  code: 'c12178', // 我的商户列表
  selector: '.my-merchant-list',
  children: [{
    code: 'd22272', // 商户条目
    selector: '.list .am-list-item',
  }],
}, {
  code: 'c12179', // 下属的商户列表
  selector: '.under-merchant-list',
  children: [{
    code: 'd22273', // 商户条目
    selector: '.list .am-list-item',
  }],
}, {
  code: 'c12177', // TAB选择
  selector: '.am-tabs-tab-bar-wrap',
  children: [{
    code: 'd22271', // 我的商户
    selector: '.am-tabs-default-bar-tab:nth-child(1)',
  }, {
    code: 'd22270', // 下属的商户
    selector: '.am-tabs-default-bar-tab:nth-child(2)',
  }],
}];

export default config;
