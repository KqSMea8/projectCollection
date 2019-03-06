import React, {PropTypes} from 'react';
import {Row, Col, Input} from 'antd';

const maxCount = 6; // 最多6条

const InputAddable = React.createClass({
  propTypes: {
    prefix: PropTypes.string,
    placeholder: PropTypes.string,
    form: PropTypes.object,
  },

  remove(key, e) {
    e.preventDefault();
    const {form} = this.props;
    let keys = form.getFieldValue(this.props.prefix + 'Keys');
    keys = keys.filter((k) => {
      return k !== key;
    });
    form.setFieldsValue({
      [this.props.prefix + 'Keys']: keys,
    });
  },

  add(e) {
    e.preventDefault();
    const {form} = this.props;
    let keys = form.getFieldValue(this.props.prefix + 'Keys');
    if (keys.length >= maxCount) {
      return;
    }
    keys = keys.concat(keys[keys.length - 1] + 1);
    form.setFieldsValue({
      [this.props.prefix + 'Keys']: keys,
    });
  },

  render() {
    const {getFieldProps, getFieldValue} = this.props.form;
    getFieldProps(this.props.prefix + 'Keys');
    const keys = getFieldValue(this.props.prefix + 'Keys');
    const rows = keys.map((key)=> {
      return (<Row key={key} style={{marginBottom: 8}}>
        <Col span="18"><Input placeholder={this.props.placeholder} {...getFieldProps(this.props.prefix + key)}/></Col>
        <Col span="5" style={{marginLeft: 8}}>
          {keys.indexOf(key) >= keys.length - 1 && keys.length < maxCount ? <a href="#" onClick={this.add}>增加</a> : <a href="#" onClick={this.remove.bind(this, key)}>删除</a>}
        </Col>
      </Row>);
    });

    return <div>{rows}</div>;
  },
});

export default InputAddable;
