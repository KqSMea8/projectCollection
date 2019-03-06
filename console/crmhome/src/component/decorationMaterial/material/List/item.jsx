import React, {PropTypes} from 'react';
import {Button} from 'antd';
import classnames from 'classnames';
const ButtonGroup = Button.Group;

const PicItem = (props) => {
  const {src, name, standard, onCopy, onModify, onDelete, onView, auditMessage, source} = props;

  return (<div className={classnames({'material-list-item': true, 'material-no-standard': !standard})}>
    <ButtonGroup >
      <Button onClick={() => { onCopy(); }}>复制编号</Button>
      <Button onClick={() => { onModify(); }}>修改</Button>
      <Button onClick={() => { onDelete(); }}>删除</Button>
    </ButtonGroup>
    <div onClick={() => { onView(); }}>
      <img src={src} />
      <div className="material-name">{name}</div>
    </div>
    <div className="unstandered-mask"></div>
    <div className="unstandered-container">
      {
        auditMessage && <div>{auditMessage}</div>
      }
      {
        source && <div>{source}</div>
      }
    </div>
  </div>);
};

PicItem.propTypes = {
  id: PropTypes.number,
  ser: PropTypes.string,
  src: PropTypes.string,
  name: PropTypes.string,
  auditMessage: PropTypes.string,
  source: PropTypes.string,
  standard: PropTypes.bool,
  onDelete: PropTypes.func,
  onModify: PropTypes.func,
  onView: PropTypes.func,
  onCopy: PropTypes.func,
};

export default PicItem;
