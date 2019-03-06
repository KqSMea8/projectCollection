import React, { PropTypes } from 'react';
import { pick, omit } from 'lodash';

const containerCSSAttr = ['position', 'width', 'top', 'left'];
const demoTipStyle = {
  backgroundImage: 'url("https://t.alipayobjects.com/images/rmsweb/T1MgXjXjRiXXXXXXXX.png")',
  backgroundRepeat: 'no-repeat',
  width: '56px',
  height: '35px',
  right: '5px',
  position: 'absolute',
  top: '200px',
  backgroundSize: '56px 35px',
};
const simulatorStyleGenerator = (background, backgroundStyle = {}) => {
  return {
    backgroundImage: `url("${background}")`,
    backgroundRepeat: 'no-repeat',
    position: 'absolute',
    backgroundSize: '223px 397px',
    width: '223px',
    height: '397px',
    top: '37px',
    left: '13px',
    ...backgroundStyle,
  };
};

const logoStyleGenerator = (logo) => ({
  background: `url("${logo}") no-repeat`,
  position: 'absolute',
  backgroundSize: '50px 50px',
  top: '120px',
  left: '50%',
  transform: 'translateX(-50%)',
  border: '2px solid #fff',
  boxSizing: 'border-box',
  width: '50px',
  height: '50px',
  borderRadius: '25px',
});
const descStyle = {
  background: 'url("//t.alipayobjects.com/images/rmsweb/T1Y3XjXfliXXXXXXXX.png") no-repeat',
  position: 'absolute',
  bottom: 100,
  left: 25,
  width: 178,
  height: 15,
  backgroundSize: '178px 15px',
};
const pwdStyle = {
  position: 'absolute',
  bottom: '70px',
  width: '100%',
  left: 0,
  textAlign: 'center',
  fontSize: '13px',
  fontWeight: 'bold',
  color: 'yellow',
};
const titleStyle = {
  position: 'absolute',
  bottom: '160px',
  fontSize: '14px',
  color: 'yellow',
  width: '100%',
  textAlign: 'center',
};

const activityTimeStyle = {
  position: 'absolute',
  top: '335px',
  width: '100%',
  textAlign: 'center',
  fontSize: '13px',
  color: '#fff',
};

const CommonSimulator = React.createClass({
  propTypes: {
    caption: PropTypes.any,
    logo: PropTypes.string,
    background: PropTypes.string,
    couponName: PropTypes.string,
    guess: PropTypes.string,
    activeDuration: PropTypes.any,
    backgroundStyle: PropTypes.any,
  },

  render() {
    const { caption, logo, background, couponName, guess, activeDuration, backgroundStyle, withScroll } = this.props;
    const simulatorStyle = simulatorStyleGenerator(background || '//t.alipayobjects.com/images/rmsweb/T1qfJjXmplXXXXXXXX.png', backgroundStyle);
    const logoStyle = logoStyleGenerator(logo);
    return (
      <div style={{ float: 'left', marginLeft: '30px', position: 'relative' }}>
        {withScroll ? (
          <div style={{ ...pick(simulatorStyle, containerCSSAttr), height: '397px', overflow: 'auto' }}>
            <div className="background-size-cover" style={{ ...omit(simulatorStyle, containerCSSAttr) }}></div>
          </div>) : (
            <div style={simulatorStyle}>
              {logo && background && [
                <div key="simulator-block0" style={logoStyle}></div>,
                couponName && <div key="simulator-block1" style={titleStyle}>{couponName}</div>,
                <div key="simulator-block2" style={demoTipStyle}></div>,
                <div key="simulator-block3" style={descStyle}></div>,
                guess && <div key="simulator-block4" style={pwdStyle}>{guess}</div>,
                activeDuration && <div key="simulator-block5" style={activityTimeStyle}>{activeDuration}</div>,
              ]}
            </div>
          )}
        <img src="//t.alipayobjects.com/tfscom/T1lxlfXeRlXXXXXXXX.png" width="250" />
        <p style={{ fontSize: '12px', textAlign: 'center', color: '#666' }}>{caption}</p>
      </div>
    );
  },
});

export default CommonSimulator;
