import React, {PropTypes} from 'react';
import {Row, Col, DatePicker} from 'antd';

const RangePicker = DatePicker.RangePicker;

const maxCount = 5;
let uuid = 0;

const RangePickerAddable = React.createClass({
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
    uuid++;
    const {form} = this.props;
    let keys = form.getFieldValue(this.props.prefix + 'Keys');
    if (keys.length >= maxCount) {
      return;
    }
    keys = keys.concat(uuid);
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
        <Col span="18"><RangePicker format="yyyy/MM/dd" {...getFieldProps(this.props.prefix + key)}/></Col>
        <Col span="5" style={{marginLeft: 8}}>
          {keys.indexOf(key) >= keys.length - 1 && keys.length < maxCount ? <a href="#" onClick={this.add}>增加一个</a> : <a href="#" onClick={this.remove.bind(this, key)}>删除</a>}
        </Col>
      </Row>);
    });

    return <div>{rows}</div>;
  },
});

export default RangePickerAddable;
