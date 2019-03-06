import { PosLeadsTagObjNoAll } from './PosLeadsTagEnums';

const LeadsTagEnum = {
  UNIVERSAL_A: 'UNIVERSAL_A',
  UNIVERSAL_B: 'UNIVERSAL_B',
  UNIVERSAL_C: 'UNIVERSAL_C',
  HUAIHAI_CAMPAIGN_TOP: 'HUAIHAI_CAMPAIGN_TOP',
  GOLD_MEDAL_MARRIAGE: 'GOLD_MEDAL_MARRIAGE',
};

export const LeadsTagToShow = {
  ...PosLeadsTagObjNoAll,
  [LeadsTagEnum.UNIVERSAL_A]: '泛行业A',
  [LeadsTagEnum.UNIVERSAL_B]: '泛行业B',
  [LeadsTagEnum.UNIVERSAL_C]: '泛行业C',
  [LeadsTagEnum.HUAIHAI_CAMPAIGN_TOP]: '淮海头部',
  [LeadsTagEnum.GOLD_MEDAL_MARRIAGE]: '金牌商家',
};

export const LeadsTagGroupPosSaleForFilter = [{
  label: 'POS',
  children: Object.keys(PosLeadsTagObjNoAll).map(value => ({
    label: PosLeadsTagObjNoAll[value],
    value,
  })),
}];

export const LeadsTagGroupForFilter = [{
  label: '全行业',
  children: [{
    label: LeadsTagToShow[LeadsTagEnum.HUAIHAI_CAMPAIGN_TOP],
    value: LeadsTagEnum.HUAIHAI_CAMPAIGN_TOP,
  }]
}, {
  label: '泛行业',
  children: [{
    label: LeadsTagToShow[LeadsTagEnum.UNIVERSAL_A],
    value: LeadsTagEnum.UNIVERSAL_A,
  }, {
    label: LeadsTagToShow[LeadsTagEnum.UNIVERSAL_B],
    value: LeadsTagEnum.UNIVERSAL_B,
  }, {
    label: LeadsTagToShow[LeadsTagEnum.UNIVERSAL_C],
    value: LeadsTagEnum.UNIVERSAL_C,
  }, {
    label: LeadsTagToShow[LeadsTagEnum.GOLD_MEDAL_MARRIAGE],
    value: LeadsTagEnum.GOLD_MEDAL_MARRIAGE,
  }]
}].concat(LeadsTagGroupPosSaleForFilter);

export default LeadsTagEnum;
