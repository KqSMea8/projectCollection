import React, {PropTypes} from 'react';
import {Row, Col, Input} from 'antd';

const maxCount = 6;

const InputAddable = React.createClass({
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
      value: nextProps.value || [],
    });
  },

  onChange(index, e) {
    const { value } = this.state;
    value[index] = e.target.value;
    this.props.onChange(value);
  },

  add() {
    const { value } = this.state;
    value.push('');
    this.setState({
      value,
    });
    this.props.onChange(value);
  },

  remove(index) {
    const { value } = this.state;
    value.splice(index, 1);
    this.setState({
      value,
    });
    this.props.onChange(value);
  },

  render() {
    const { value } = this.state;
    const { disabled } = this.props;

    const rows = value.map((item, index)=> {
      return (<Row key={item + index} style={{marginBottom: 8}}>
        <Col span="18">
          <Input placeholder={this.props.placeholder} disabled={disabled} defaultValue={item} onBlur={(e) => {this.onChange(index, e);}}/>
        </Col>
        {
          !disabled &&
          <Col span="5" style={{marginLeft: 8}}>
            { (index === value.length - 1) && value.length < maxCount ?
              <a href="#" onClick={ (e) => {e.preventDefault(); this.add(''); }}>增加</a>
              :
              <a href="#" onClick={ (e) => {e.preventDefault(); this.remove(index); }}>删除</a>
            }
          </Col>
        }
      </Row>);
    });

    return <div>{rows}</div>;
  },
});

export default InputAddable;
