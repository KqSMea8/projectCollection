import React, {PropTypes} from 'react';
import {Input} from 'antd';

const Goods = React.createClass({
  propTypes: {
    placeholder: PropTypes.string,
  },

  getInitialState() {
    return {
      value: this.props.value || [],
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  },

  onChange(e) {
    this.setState({
      value: e.target.value.split('\n'),
    });
  },

  onBlur(e) {
    let goodsArr = (e.target.value || '').split('\n').map(item => item.replace(/\s/g, ''));
    goodsArr = goodsArr.filter(item => {
      return item.length > 0;
    });

    this.props.onChange(goodsArr);
  },

  render() {
    let { value } = this.state;
    if (value) {
      value = value.join('\n');
    }

    return (<Input
      onBlur={this.onBlur}
      onChange={this.onChange}
      type="textarea"
      placeholder="输入商品SKU编码，如 6931487800170，限500个"
      value={value}
      disabled={this.props.disabled}
      />
    );
  },
});

export default Goods;
