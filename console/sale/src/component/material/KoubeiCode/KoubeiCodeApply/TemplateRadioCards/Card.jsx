import React, { PropTypes } from 'react';

const Card = props => {
  const {onClick, active, industry, width, height, exampleImage, exampleText} = props;
  return (
    <div
      className={`${active ? 'active ' : ''}card`}
      onClick={onClick}
    >
      <header>
        <div className="spec">
          <p className="size">尺寸：{width} x {height}mm</p>
          <p className="industry">适用于{industry}</p>
        </div>
      </header>
      <main style={{backgroundImage: `url(${exampleImage})`}}>
        <div className="example-text"><span className="label">示例：</span><p className="content">{exampleText}</p></div>
      </main>
    </div>
  );
};

Card.propTypes = {
  thumbnail: PropTypes.string,
  label: PropTypes.string,
  exampleImage: PropTypes.string,
  exampleText: PropTypes.string,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  radius: PropTypes.number,
};

export default Card;
