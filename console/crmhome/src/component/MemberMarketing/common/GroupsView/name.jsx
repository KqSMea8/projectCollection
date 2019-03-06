import React from 'react';
import { mbmberTypeMap } from '../../config/GroupItem';

function valueMap(value) {
  return value.split(',').map(item => {
    return mbmberTypeMap[item];
  });
}

const GroupsViewName = props => {
  const { name, count, mbmberType, showType } = props;
  return (
    <groups-view-name>
      <div>
        <h4>{name}</h4>
      </div>
      {showType && <div>
        <label>人群类型：</label>
        <span>{mbmberType ? valueMap(mbmberType).join(' ') : '支付会员'}</span>
      </div>}
      <div>
        {<span><strong>{count}</strong> 人符合条件</span>}
      </div>
    </groups-view-name>
  );
};

GroupsViewName.propTypes = {
  name: React.PropTypes.string.isRequired,
  mbmberType: React.PropTypes.string,
  type: React.PropTypes.oneOf(['brands', 'retailers', 'cate7']),
  count: React.PropTypes.number,
};

export default GroupsViewName;
