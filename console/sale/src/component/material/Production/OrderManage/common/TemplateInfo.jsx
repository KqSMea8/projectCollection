import React from 'react';
import { DetailTable } from 'hermes-react';
import { StuffTypeText } from '../../../common/enum';

const TemplateInfo = props => {
  const {
    templateName, templateId, stuffType, stuffAttrName, sizeName, materialName
  } = props.data;
  const dataSource = [
    {label: '模板名称/ID', value: <a href={`#/material/templatemanage/tempinfo/${templateId}`} target="_blank">{templateName}<br/>{templateId}</a>},
    {label: '物料类型', value: stuffAttrName},
    {label: '物料属性', value: StuffTypeText[stuffType]},
    {label: '规格尺寸', value: sizeName},
    {label: '材质', value: materialName},
  ];
  return (
    <DetailTable
      dataSource={dataSource}
      columnCount={4}
    />
  );
};

export default TemplateInfo;
