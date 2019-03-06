import React, { Component, PropTypes } from 'react';
import Card from './Card';
import './index.less';

export default class TemplateRadioCards extends Component {
  static propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    selected: PropTypes.string,
    options: PropTypes.array
  };

  onClickCard = id => {
    const { onChange, selected } = this.props;
    if (id === selected) {
      return false;
    }
    onChange(id);
  };

  render() {
    const { data, options, selected } = this.props;
    const cardList = options.map(name => data.find(t => t.nickName === name && t.enable)).filter(c => c);
    return (
      <ul className="kbcode-apply-template-radio-card">
        {cardList.map(card => (
          <li key={card.nickName}>
            <Card
              {...card}
              active={card.nickName === selected}
              onClick={() => this.onClickCard(card.nickName)}
            />
          </li>
        ))}
      </ul>
    );
  }
}

