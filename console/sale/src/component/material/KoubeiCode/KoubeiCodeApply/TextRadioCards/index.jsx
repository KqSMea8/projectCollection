import React, { Component, PropTypes } from 'react';
import Card from './card';
import './index.less';

export default class TextRadioCards extends Component {
  static propTypes = {
    options: PropTypes.array,
    onChange: PropTypes.func,
    value: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  onClickCard = cValue => {
    const { value, onChange } = this.props;
    if (cValue !== value) {
      onChange(cValue);
    }
  };

  render() {
    const { options, value } = this.props;
    return (
      <div className="kbcode-apply-text-radio-card">
        {options.map(o => <Card
          key={o.id}
          label={o.name}
          desc={o.desc}
          checked={value === o.id}
          onClick={() => this.onClickCard(o.id)}
        />)}
      </div>
    );
  }
}
