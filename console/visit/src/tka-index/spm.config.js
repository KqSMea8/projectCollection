const config = [{
  code: 'c12144', // 我的拜访
  selector: '.visit-list',
  exposure: true,
  children: [{
    code: 'd22209', // 拜访记录的点击
    selector: '.visit-list-item',
  }],
}, {
  code: 'c12145', // 团队拜访
  selector: '.tab-team',
  exposure: true,
  children: [{
    code: 'd22211', // 具体人员的点击
    selector: '.table .table-line',
  }],
}, {
  code: 'c12147', // 底部切换Tab
  selector: '.am-tabs-tab-bar-wrap',
  children: [{
    code: 'd22217', // 切换我的拜访
    selector: '.am-tab-bar-tab:nth-child(1)',
  }, {
    code: 'd22218', // 切换团队拜访
    selector: '.am-tab-bar-tab:nth-child(2)',
  }],
}];

export const spmTabMyNavBarSearch = 'c12144.d22208';
export const spmTabMyNavBarAdd = 'c12144.d22207';
export const spmTabTeamNavBarAdd = 'c12145.d22210';

export default config;
