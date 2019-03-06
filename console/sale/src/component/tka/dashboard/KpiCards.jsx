import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'antd';
import './KpiCards.less';

const Card = (props) => {
  const {title, value, status } = props;
  let showValueTxt = value;
  let showValueClassName = 'number-active';
  let percent = 0;
  const parsedValue = parseFloat(value);
  if (!parsedValue || isNaN(parsedValue)) {
    showValueTxt = '暂无数据';
    showValueClassName = 'load-failed';
  } else if (parsedValue === 0) {
    showValueClassName = 'number-silence';
  } else {
    percent = Number(parsedValue * 100).toFixed(1);
    showValueTxt = `${percent}%`;
  }
  const pClass = percent === 0 ? 'progress-value0' : '';
  return (
    <div className="card">
      <div className="left">
        <div className="title">{title}</div>
        <div className="value">
          <span className={showValueClassName}>{showValueTxt}</span>
        </div>
      </div>
      <Progress className={pClass} type="circle" width={58} showInfo={false} percent={percent} status={status} />
    </div>
  );
};

class TodoCards extends React.PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      link: PropTypes.string,
      onClick: PropTypes.func
    }))
  };

  render() {
    const {items} = this.props;
    return (
      <ul className="tka-dashboard-kpicards">
        {items.map(i => {
          return (
            <li>
              <a href={i.link} target="_blank"><Card title={i.title} value={i.value} status={i.status}/></a>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default TodoCards;
