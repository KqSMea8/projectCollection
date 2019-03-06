import React, { PropTypes } from 'react';
import { Modal, Icon, Tag, Tooltip } from 'antd';
import DetailTable from './autoTable';
import {statusEnum} from '../../common/enum';
import moment from 'moment';

function getShop(data) {
  const act = data.activities || [{}];
  const shopIds = act[0].shopIds || [];
  return shopIds;
}

function timeSpan({ gmtStart, gmtEnd }) {
  const start = moment(gmtStart).format('YYYY-MM-DD HH:mm');
  const end = moment(gmtEnd).format('YYYY-MM-DD HH:mm');
  return `${start} ~ ${end}`;
}

const InfoGoods = (props) => {
  const data = props.data || {};
  const modifiedData = props.modifiedData || {};
  const isEndTimeModified = (!!modifiedData.gmtStart && data.gmtStart !== modifiedData.gmtStart) || (!!modifiedData.gmtEnd && data.gmtEnd !== modifiedData.gmtEnd);
  const dataSource = [
    {
      label: '营销方案名称',
      dataIndex: data.planName,
      render() {
        if (data.isDual12 === 'Y') {
          return (<div>{data.planName}<Tag color="red">1212</Tag></div>);
        } else if (data.isAdvertising === 'Y') {
          const node = document.getElementById('J_isFromKbServ');
          const isFromKb = node && node.value === 'true';
          let msg = '请到口碑掌柜中升级双12营销方案';
          if (isFromKb) {
            msg = '请到钉钉中帮商户升级双12营销方案';
          }
          return (<div>
            {data.planName}
            {data.status === 'UPGRADE_WAIT_CONFIRM' ? <Tag color="yellow">1212待升级</Tag> : <Tooltip title={msg}><Tag color="yellow">1212待升级</Tag></Tooltip>}
          </div>);
        }
        return data.planName;
      },
    }, {
      label: '状态',
      dataIndex: data.status,
      render: ()=>{
        return statusEnum[data.status];
      },
    }, {
      label: '适用门店',
      dataIndex: data.shopIds,
      render: () => {
        const shopIds = getShop(data);
        return `${shopIds.length}家`;
      },
    }, {
      label: '方案时间',
      dataIndex: data.gmtStart,
      className: isEndTimeModified ? 'modified' : '',
      render: () => {
        if (isEndTimeModified) {
          return (
            <div>
              <a style={{ float: 'right' }} onClick={() => Modal.info({
                title: '修改前的内容',
                content: timeSpan(data),
              })}>
                <Icon type="edit" />
              </a>
              {timeSpan(modifiedData)}
            </div>
          );
        }
        return timeSpan(data);
      },
    }, {
      label: '方案描述',
      dataIndex: data.shopIds,
      colSpan: 3,
      render: () => {
        const shopIds = getShop(data);
        return `${shopIds.length}家`;
      },
    },
  ];
  return (<DetailTable
  dataSource={dataSource}
  columnCount={6}
  />);
};

InfoGoods.propTypes = {
  data: PropTypes.any,
  autoHidden: PropTypes.bool,
};

export default InfoGoods;
