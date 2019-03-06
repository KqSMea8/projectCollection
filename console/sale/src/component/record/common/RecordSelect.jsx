import {Select} from 'antd';
import React from 'react';

const Option = Select.Option;

export const visitWayList = [
  {key: 'VISIT_DOOR', value: '上门'},
  {key: 'VISIT_PHONE', value: '电话'},
];

export const visitPurposeResultList = [
  {key: 'SUCCESS', value: '签约成功'},
  {key: 'INTENTION_TO_SIGN_CONTRACT', value: '有意向签约'},
  {key: 'NO_INTENTION_TO_SIGN_CONTRACT', value: '无签约意向'},
  {key: 'BOSS_NO_LONGER_FOLLOW_UP', value: '老板不在后续跟进'},
];

export const positionList = [
  {key: 'MANAGER', value: '老板'},
  {key: 'SHOP_MANAGER', value: '店长'},
  {key: 'FINANCE', value: '财务'},
  {key: 'SHOP_CLERK', value: '店员'},
];

export const visitWayOption = [];
visitWayList.map((row) => {
  visitWayOption.push(<Option key={row.key}>{row.value}</Option>);
});

export const visitWayMap = {};
visitWayList.forEach((row) => {
  visitWayMap[row.key] = row.value;
});

export const ResultOption = [];
visitPurposeResultList.map((row) => {
  ResultOption.push(<Option key={row.key}>{row.value}</Option>);
});

export const positionMap = {};
positionList.forEach((row) => {
  positionMap[row.key] = row.value;
});

export const ResultMap = {};
visitPurposeResultList.forEach((row) => {
  ResultMap[row.key] = row.value;
});

export const stuffTypeList =
  [{
    label: '基础物料',
    value: 'BASIC',
    key: 'BASIC',
  }, {
    label: '其它物料',
    value: 'OTHER',
    key: 'OTHER',
  }, {
    label: '码物料-临时',
    value: 'CODEMATERIAL_TEMP',
    key: 'CODEMATERIAL_TEMP',
  }];

export const stuffTypeMap = {};
stuffTypeList.forEach((row) => {
  stuffTypeMap[row.key] = row.label;
});

export function loop(tree, fn, level) {
  if (tree) {
    return tree.map((t)=> {
      let t2 = {...t};
      t2 = fn(t2, level);
      if (t2.visitContactDTOs && t2.visitContactDTOs.length > 0) {
        t2.children = loop(t2.visitContactDTOs, fn, level + 1);
      }
      return t2;
    });
  }
  return tree;
}

export function transformLCV(tree) {
  return loop(tree, (t) => {
    t.label = t.name ? t.name + '(' + t.tel + ')' : t.positionDesc;
    t.value = t.contactId || t.position;
    return t;
  });
}
