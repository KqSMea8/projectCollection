import React from 'react';
import PropTypes from 'prop-types';
import './TodoCards.less';

const Card = (props) => {
  const {title, value} = props;
  let showValueTxt = value;
  let showValueClassName = 'number-active';
  const parsedValue = parseFloat(value);
  if (isNaN(parsedValue)) {
    showValueTxt = '数据获取失败';
    showValueClassName = 'load-failed';
  } else {
    if (parsedValue === 0) {
      showValueClassName = 'number-silence';
    }
  }
  return (
    <div className="card">
      <div className="title">{title}</div>
      <div className="value">
        <span className={showValueClassName}>{showValueTxt}</span>
      </div>
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
      <ul className="tka-dashboard-todocards">
        {items.map(i => {
          if (i.onClick) {
            return (
              <li onClick={i.onClick}><Card title={i.title} value={i.value}/></li>
            );
          }
          if (i.link) {
            return (
              <li>
                <a href={i.link} target="_blank"><Card title={i.title} value={i.value}/></a>
              </li>
            );
          }
          return (
            <li>
              <Card title={i.title} value={i.value}/>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default TodoCards;
