export const authTypesList = [
  {key: 'DATA_VIEW', value: '数据查询'},
  {key: 'AGENT_OPERATION', value: '代运营'},
];

export const authTypesMap = {};
authTypesList.forEach((row) => {
  authTypesMap[row.key] = row.value;
});
