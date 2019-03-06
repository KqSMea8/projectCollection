import React from 'react';

const GroupsViewiIndustry = props => {
  const { cate } = props;
  const value = cate && cate.join('、') || '不限制';
  return (
    <groups-view-industry>
      <div><span>行业标签</span></div>
      <div>
        <div data-last-line>
          <label>行业标签</label>
          <span>{value}</span>
        </div>
      </div>
    </groups-view-industry>
  );
};

GroupsViewiIndustry.propTypes = {
  cate: React.PropTypes.array,
};

export default GroupsViewiIndustry;
