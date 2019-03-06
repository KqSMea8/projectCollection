import React, {PropTypes} from 'react';

const Card = props => {
  const {label, desc, checked, onClick} = props;
  return (
    <div
      className={`card${checked ? ' checked' : ''}`}
      onClick={onClick}
    >
      <p className="label">{label}</p>
      <p className="desc">{desc}</p>
    </div>
  );
};

Card.propTypes = {
  label: PropTypes.string,
  desc: PropTypes.string,
  checked: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Card;
