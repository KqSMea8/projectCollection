import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';

const Dashbord = React.createClass({
  propTypes: {
    score: PropTypes.number,
    specialRightScore: PropTypes.number,
  },
  getInitialState() {
    return (
      null
    );
  },
  componentDidMount() {
    const {specialRightScore, score} = this.props;
    const mark = 225 * score / 100;
    let color = '#ff5800';
    color = score < specialRightScore ? '#ff5800' : '#8ACF66';
    const data = [
      {score: '0', angle: mark},
      {score: '100', angle: (225 - mark)},
    ];
    this.drawPart1(data, color);
    this.drawPart2(data, color);
  },
  drawPart1(data, color ) {
    const Stat = window.G2.Stat;
    const chart = new window.G2.Chart({
      container: ReactDOM.findDOMNode(this.refs.part1),
      width: 278,
      height: 195,
      plotCfg: {
        margin: [17, 22, 10, 22],
      },
    });
    chart.source(data);
    chart.animate(false);
    chart.tooltip(false);
    chart.legend(false);
    chart.coord('theta', {
      startAngle: -1.125 * Math.PI,
      endAngle: 0.125 * Math.PI,
      radius: 1,
      inner: 0.85,
    });
    // 不同cut（切割工艺）所占的比例
    chart.intervalStack().position(Stat.summary.percent('angle')).color('score', [color, '#e5e5e5']);
    chart.render();
  },
  drawPart2(data, color) {
    const Stat = window.G2.Stat;
    const chart = new window.G2.Chart({
      container: ReactDOM.findDOMNode(this.refs.part2),
      width: 278,
      height: 195,
      plotCfg: {
        margin: [0, 0, 0, 0],
      },
    });
    chart.source(data);
    chart.animate(false);
    chart.tooltip(false);
    chart.legend(false);
    chart.coord('theta', {
      startAngle: -1.125 * Math.PI,
      endAngle: 0.125 * Math.PI,
      radius: 1,
      inner: 0.99,
    });
    // 不同cut（切割工艺）所占的比例
    chart.intervalStack().position(Stat.summary.percent('angle')).color('score', [color, '#e8e8ed']);
    chart.render();
  },

  render() {
    const {specialRightScore, score} = this.props;
    let textColor = '#ff5800';
    textColor = score < specialRightScore ? '#ff5800' : '#7ac056';
    let src = '';
    src = score < specialRightScore ? 'https://zos.alipayobjects.com/rmsportal/kaljAYEwPmsEeMq.png' : 'https://zos.alipayobjects.com/rmsportal/NpUkIJIVxLEPkLW.png';
    let display = '';
    display = score < specialRightScore ? 'block' : 'none';
    const indicatorRotate = 'rotate(' + (225 / 100 * (score - 10)) + 'deg)';
    const specialRightPosition = 225 / 100 * (specialRightScore - 10);
    return (<div ref="part1" style={{width: 278, height: 195, position: 'relative'}}>
      <div ref="part2" style ={{width: '100%', height: '100%'}}></div>
      <div style={{position: 'absolute', top: 126, left: -10, zIndex: 200, width: 298, transform: indicatorRotate, WebkitTransform: indicatorRotate}}>
        <img height="20" src={src} style={{display: 'block', float: 'left', marginTop: 1, paddingTop: 1, paddingBottom: 1, background: '#f8f8fc'}}/>
      </div>
      <div style={{position: 'absolute', top: 136, left: -4, width: 282, display: display, transform: 'rotate(' + specialRightPosition + 'deg)', WebkitTransform: 'rotate(' + specialRightPosition + 'deg)'}}>
        <div style={{position: 'relative', zIndex: 100, width: 3, height: 3, borderRadius: '100%', border: '3px solid #deb98d', transform: 'rotate(' + '-' + specialRightPosition + 'deg)', WebkitTransform: 'rotate(' + '-' + specialRightPosition + 'deg)'}}>
          {
            specialRightScore < 50 ? <div style={{position: 'absolute', right: 10, top: -10, width: 90, height: 14, fontSize: 12, color: '#deb98d'}}>{specialRightScore}分可获得特权</div> :
            <div style={{position: 'absolute', left: 10, top: -10, width: 90, height: 14, fontSize: 12, color: '#deb98d'}}>{specialRightScore}分可获得特权</div>
          }
        </div>
      </div>
      <div style={{position: 'absolute', top: 137, left: -2, zIndex: 100, width: 284, transform: 'rotate(' + '22.5' + 'deg)', WebkitTransform: 'rotate(' + '22.5' + 'deg)'}}>
        <div style={{position: 'absolute', left: 23, top: 0, width: 22, height: 2, backgroundColor: '#f8f8fc'}}></div>
      </div>
      <div style={{position: 'absolute', top: 137, left: -2, zIndex: 100, width: 284, transform: 'rotate(' + '67.5' + 'deg)', WebkitTransform: 'rotate(' + '67.5' + 'deg)'}}>
        <div style={{position: 'absolute', left: 24, top: 0, width: 22, height: 2, backgroundColor: '#f8f8fc'}}></div>
      </div>
      <div style={{position: 'absolute', top: 137, left: -3, zIndex: 100, width: 284, transform: 'rotate(' + '112.5' + 'deg)', WebkitTransform: 'rotate(' + '112.5' + 'deg)'}}>
        <div style={{position: 'absolute', left: 24, top: 0, width: 22, height: 2, backgroundColor: '#f8f8fc'}}></div>
      </div>
      <div style={{position: 'absolute', top: 137, left: -3, zIndex: 100, width: 284, transform: 'rotate(' + '157.5' + 'deg)', WebkitTransform: 'rotate(' + '157.5' + 'deg)'}}>
        <div style={{position: 'absolute', left: 24, top: 0, width: 22, height: 2, backgroundColor: '#f8f8fc'}}></div>
      </div>

      <div style={{position: 'absolute', top: 40, left: 128, height: 198, transform: 'rotate(' + '-110' + 'deg)', WebkitTransform: 'rotate(' + '-110' + 'deg)'}}>
        <div style={{fontSize: 12, color: '#ccc', width: 22, height: 14}}>0</div>
      </div>
      <div style={{position: 'absolute', top: 40, left: 128, height: 198, transform: 'rotate(' + '-67.5' + 'deg)', WebkitTransform: 'rotate(' + '-67.5' + 'deg)'}}>
        <div style={{fontSize: 12, color: '#ccc', width: 22, height: 14}}>20</div>
      </div>
      <div style={{position: 'absolute', top: 40, left: 128, height: 198, transform: 'rotate(' + '-22.5' + 'deg)', WebkitTransform: 'rotate(' + '-22.5' + 'deg)'}}>
        <div style={{fontSize: 12, color: '#ccc', width: 22, height: 14}}>40</div>
      </div>
      <div style={{position: 'absolute', top: 40, left: 128, height: 198, transform: 'rotate(' + '22.5' + 'deg)', WebkitTransform: 'rotate(' + '22.5' + 'deg)'}}>
        <div style={{fontSize: 12, color: '#ccc', width: 22, height: 14}}>60</div>
      </div>
      <div style={{position: 'absolute', top: 40, left: 128, height: 198, transform: 'rotate(' + '67.5' + 'deg)', WebkitTransform: 'rotate(' + '67.5' + 'deg)'}}>
        <div style={{fontSize: 12, color: '#ccc', width: 22, height: 14}}>80</div>
      </div>
      <div style={{position: 'absolute', top: 40, left: 128, height: 198, transform: 'rotate(' + '105' + 'deg)', WebkitTransform: 'rotate(' + '105' + 'deg)'}}>
        <div style={{fontSize: 12, color: '#ccc', width: 22, height: 14}}>100</div>
      </div>
      <div style={{position: 'absolute', left: 87, top: 85, fontSize: 62, color: textColor, width: 125, height: 95, textAlign: 'center'}}>{score}<span style={{fontSize: 20}}>分</span></div>
    </div>);
  },
});

export default Dashbord;
