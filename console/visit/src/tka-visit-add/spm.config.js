const config = [{
  code: 'c12176', // 页面
  selector: '#add-visit',
  children: [{
    code: 'd22262', // 选择拜访方式
    selector: '.visit-way-time',
  }, {
    code: 'd22261', // 选择拜访商户
    selector: '.visit-merchant-item',
  }, {
    code: 'd22267', // 选择拜访分公司
    selector: '.visit-sub-company-item',
  }, {
    code: 'd22268', // 选择陪访人
    selector: '.visit-with-people-item',
  }, {
    code: 'd22269', // 选择拜访对象
    selector: '.visit-object-item',
  }, {
    code: 'd22264', // 进入拜访结果
    selector: '.visit-result-item',
  }, {
    code: 'd22265', // 进入下一步计划
    selector: '.next-plan-item',
  }, {
    code: 'd22266', // 进入其他备注
    selector: '.other-note-item',
  }],
}, {
  code: 'c12183', // 添加成功页
  selector: '.submit-result',
  children: [{
    code: 'd22277', // 按钮-分享
    selector: '.btn-continue',
  }, {
    code: 'd22276', // 按钮-继续记录拜访小记
    selector: '.btn-share',
  }],
}];

export const spmNavBarSubmit = 'c12175.d22260';
export const spmNavBarSubmitSucFinish = 'c12183.d22275';

export default config;
