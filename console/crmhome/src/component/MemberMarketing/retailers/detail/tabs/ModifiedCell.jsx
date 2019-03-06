import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { Modal, Icon } from 'antd';

const ModifiedCell = (props) => {
  const {
    newVal,
    oldVal,
    cellContent,
    modalContent,
    customOnClick,
    customIsEqual,
    ...rest,
  } = props;
  const isModified = (newVal !== undefined && newVal !== null) && !customIsEqual(oldVal, newVal);
  const onClick = customOnClick || (
    () => Modal.info({
      title: '修改前的内容',
      content: modalContent(oldVal),
    })
  );
  return (
    <td {...rest} className={classnames('kb-detail-table-value', {
      modified: isModified,
    })}>
      {isModified ? (
        <div>
          <a style={{ float: 'right' }} onClick={onClick}>
            <Icon type="edit" />
          </a>
          {cellContent(newVal)}
        </div>
      ) : (
          cellContent(oldVal)
        )}
    </td>
  );
};

ModifiedCell.propTypes = {
  newVal: PropTypes.any,
  oldVal: PropTypes.any,
  cellContent: PropTypes.func,
  modalContent: PropTypes.func,
  customOnClick: PropTypes.func,
  customIsEqual: PropTypes.func,
};

ModifiedCell.defaultProps = {
  cellContent: v => v,
  modalContent: v => v,
  customIsEqual: (a, b) => a === b,
};

export default ModifiedCell;
